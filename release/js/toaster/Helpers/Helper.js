(function() {

  Helpers.Helper = (function() {

    function Helper() {}

    Helper.IfBrowserContext = function(fn) {
      if (typeof window !== 'undefined') {
        return fn();
      }
    };

    Helper.IfNodeContext = function(fn) {
      if (typeof process !== 'undefined') {
        return fn();
      }
    };

    return Helper;

  })();

}).call(this);
