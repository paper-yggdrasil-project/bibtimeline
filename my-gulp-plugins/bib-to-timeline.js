var gutil = require('gulp-util');
var through = require('through2');
var bibtexParse = require('bibtex-parse-js');
var _ = require('underscore-plus');

module.exports = function () {

  var outputfile;
  var citationKeys = [];

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

  function transform(file, encoding, callback) {
    outputfile = file;

    if (!check(file, encoding, callback)) {
      return callback();
    }

    var bibJson = bibtexParse.toJSON(file.contents.toString())
    var keys = _.pluck(bibJson, "citationKey")
    Array.prototype.push.apply(citationKeys, keys);

    callback();
  }

  function flush(callback) {

    var output = new gutil.File({
      cwd:  outputfile.cwd,
      base: outputfile.base,
      path: outputfile.base + "timeline.json",
    });

    var data = {
      "title": {
        "text": {
          "headline": "Please Input Headline",
          "text": "made by timeline:generate"
        }
      },
      "events": []
    };
    for (var i = 0; i < citationKeys.length; i++) {
      data.events.push({"citationKey": citationKeys[i]});
    }
    output.contents = new Buffer(JSON.stringify(data, null, 2));
    this.push(output);

    callback();
  }

  return through.obj(transform, flush);

};
