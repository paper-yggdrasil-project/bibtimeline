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
    var author = bib.entryTags["author"];
    var title = bib.entryTags["title"];
    var journal = bib.entryTags["journal"];
    var volume = bib.entryTags["volume"];
    var year = bib.entryTags["year"];
    var url = bib.entryTags["url"];

    var event = {
      "start_date": {
        "year": year
      },
      "text": {
        "headline": title,
        "text": author + "<br>" + journal + "<br>" + volume + "<br>" + url
      },
    };

    switch (type) {
      case ".pdf":
        event["media"] = {
          "url": "/attachments/" + attachment
        };
        break;
      case ".md":
        event["media"] = {
          "url": "<iframe src='/attachments/" + path.basename(attachment, type) + ".html' frameborder='0'>"
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
        data.events.push(bib2event(bib, type, attachment));
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
