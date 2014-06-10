(function() {
  var Log;

  Log = (function() {

    function Log() {}

    Log.debug = 1;

    Log.log = function(message) {
      if (this.debug === 1) {
        return console.log(message);
      }
    };

    Log.error = function(message) {
      if (this.debug !== -1) {
        return console.log("ERROR: " + message);
      }
    };

    return Log;

  })();

}).call(this);
