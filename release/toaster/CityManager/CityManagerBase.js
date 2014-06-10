(function() {

  CityManager.CityManagerBase = (function() {

    CityManagerBase.prototype.citys = null;

    function CityManagerBase() {
      this.citys = [];
    }

    CityManagerBase.prototype.AddCity = function(city) {
      return this.citys.push(city);
    };

    return CityManagerBase;

  })();

}).call(this);
