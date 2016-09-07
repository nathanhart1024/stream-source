module.exports = function(stream) {
  return new StreamSource(stream);
};

function StreamSource(stream) {
  var that = this;
  that._readable = promise(that);
  that._stream = stream.on("readable", read).on("close", end).on("error", error);

  function read() {
    var resolve = that._resolve;
    that._readable = promise(that);
    resolve(false);
  }

  function end() {
    var resolve = that._resolve;
    that._readable = Promise.resolve(true);
    resolve(true);
  }

  function error(error) {
    var reject = that._reject;
    that._readable = Promise.reject(error);
    reject(error);
  }
}

StreamSource.prototype.read = require("./read");
StreamSource.prototype.slice = require("./slice");
StreamSource.prototype.cancel = require("./cancel");

function promise(source) {
  return new Promise(function(resolve, reject) {
    source._resolve = resolve;
    source._reject = reject;
  });
}
