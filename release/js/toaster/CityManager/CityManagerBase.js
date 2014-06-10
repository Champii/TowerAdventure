(function() {

  CityManager.CityManagerBase = (function() {

    CityManagerBase.prototype.citys = null;

    function CityManagerBase() {
      this.citys = [];
    }

    CityManagerBase.prototype.AddCity = function(city) {
      this.citys.push(city);
      return city;
    };

    CityManagerBase.prototype.GetCity = function(name) {
      var city, _i, _len, _ref;
      _ref = this.citys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        if (city.name === name) {
          return city;
        }
      }
      return null;
    };

    CityManagerBase.prototype.GetMainCity = function() {
      var city, _i, _len, _ref;
      _ref = this.citys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        if (city.isMain) {
          return city;
        }
      }
      return null;
    };

    return CityManagerBase;

  })();

}).call(this);
