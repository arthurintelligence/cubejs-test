const path = require("path");
const fs = require("fs-extra");
const Handlebars = require("handlebars");

function getCallerFile() {
  var originalFunc = Error.prepareStackTrace;

  var callerfile;
  try {
    var err = new Error();
    var currentfile;

    Error.prepareStackTrace = function(err, stack) {
      return stack;
    };

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) break;
    }
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  return callerfile;
}

module.exports = function handlebars(filename) {
  const absoluteFilename = filename.match(/^\.\//)
    ? path.resolve(path.dirname(getCallerFile()), filename)
    : filename;
  const content = fs.readFileSync(absoluteFilename, "utf8");
  return Handlebars.compile(content);
};
