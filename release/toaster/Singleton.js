(function() {
  var Singleton;

  Singleton = (function() {
    var _instance;

    function Singleton() {}

    _instance = void 0;

    Singleton.get = function(classType, args) {
      return _instance != null ? _instance : _instance = new classType(args);
    };

    return Singleton;

  })();

}).call(this);
