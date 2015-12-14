var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var bibtexParse = require('bibtex-parse-js');
var _ = require('underscore-plus');

module.exports = function () {

  var outputfile;
  var timeline;
  var attachments = [];
  var content = {};
  var bibliographies = [];

  function check(file, encoding, callback) {
    if (file.isNull()) {
      return false;
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('timeline-to-data', 'Streaming not supported'));
      return false;
    }
    return true;
  }

  function bib2event(bib, type, attachment) {
    if (!bib["entryTags"]) {return false;}

    var requiredKeys = ["author", "title", "year"];
    var keys = Object.keys(bib.entryTags);
    if (_.intersection(requiredKeys, keys).length < requiredKeys.length) {return false;}

    keys = _.difference(keys, requiredKeys);
    var text = bib.entryTags["author"];
    for(var i = 0; i < keys.length; i++) {
      text = text + "<br>" + bib.entryTags[keys[i]];
    }

    var event = {
      "start_date": {
        "year": bib.entryTags["year"]
      },
      "text": {
        "headline": bib.entryTags["title"],
        "text": text
      },
    };

    switch (type) {
      case ".pdf":
        event["media"] = {
          "url": "./attachments/" + attachment
        };
        break;
      case ".md":
        event["media"] = {
          "url": "<iframe src='./attachments/" + path.basename(attachment, type) + ".html' frameborder='0'>"
        };
        break;
    }
    return event;
  }

  function transform(file, encoding, callback) {
    var filename = path.basename(file.path.toString());

    if (!check(file, encoding, callback)) {
      return callback();
    }

    if (filename == "timeline.json") {
      outputfile = file;
      timeline = JSON.parse(file.contents.toString());
    } else {
      switch (path.extname(filename)) {
        case ".bib":
          var bibJson = bibtexParse.toJSON(file.contents.toString())
          Array.prototype.push.apply(bibliographies, bibJson);
          break;
        case ".pdf":
          Array.prototype.push.apply(attachments, [filename]);
          break;
        case ".md":
          Array.prototype.push.apply(attachments, [filename]);
          content[filename] = file.contents.toString();
          break;
        default:
          gutil.log(gutil.colors.red("Warning"), gutil.colors.yellow(filename), "not match any attachment type");
      }
    }

    callback();
  }

  function flush(callback) {
    if (timeline == null) {
      this.emit('error', new gutil.PluginError('timeline-to-data', 'timeline.json not found'));
      return callback();
    }

    var keys = _.pluck(bibliographies, "citationKey");

    var data = {
      "title": timeline.title,
      "events": []
    };

    for (var i = 0; i < timeline.events.length; i++) {
      var event = timeline.events[i];
      var idx = _.indexOf(keys, event.citationKey);
      if (idx != -1) {
        var bib = bibliographies[idx];
        var type = "text";
        var attachment;
        if (event["attachment"]) {
          attachment = event["attachment"];
          if ( _.contains(attachments, attachment)) {
            type = path.extname(attachment);
          } else {
            gutil.log(gutil.colors.red("Warning"), gutil.colors.yellow(attachment), "not found in attachments folder");
          }
        }
        var timelineEvent = bib2event(bib, type, attachment);
        if (!timelineEvent) {
          var errMsg = "the bib which have " +  event.citationKey + " do not have attributes required at least"
          this.emit('error', new gutil.PluginError('timeline-to-data', errMsg));
        }
        data.events.push(timelineEvent);
      }
    }

    var output = new gutil.File({
      cwd:  outputfile.cwd,
      base: outputfile.base,
      path: outputfile.base + "data.json",
    });
    output.contents = new Buffer(JSON.stringify(data, null, 2));
    this.push(output);

    callback();
  }

  return through.obj(transform, flush);

};
