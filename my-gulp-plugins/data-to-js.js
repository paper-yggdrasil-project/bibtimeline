var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');

module.exports = function () {

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
    var filename = path.basename(file.path.toString());

    if (!check(file, encoding, callback)) {
      return callback();
    }

    if (!(filename == "data.json")) {
      return  callback();
    }
    var jsonString = file.contents.toString();
    var jsString = "var data = " + jsonString + ";\n" + "var timeline = new TL.Timeline('timeline-embed', data, {'initial_zoom': 0, 'zoom_sequence':[0.5]});\n";
    jsString = jsString + "timeline.setZoom(0);";

    var output = new gutil.File({
      cwd:  file.cwd,
      base: file.base,
      path: file.base + "bibtimeline.js",
    });
    output.contents = new Buffer(jsString);
    this.push(output);

    callback();
  }

  function flush(callback) {
    callback();
  }

  return through.obj(transform, flush);

};
