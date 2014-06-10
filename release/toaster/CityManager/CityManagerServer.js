(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CityManager.CityManagerServer = (function(_super) {

    __extends(CityManagerServer, _super);

    CityManagerServer.prototype.dbManager = null;

    function CityManagerServer(player) {
      var _this = this;
      this.citys = [];
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.dbManager.getAllCitysModels(player, function(citys) {
        return _this.FillCitys(citys);
      });
    }

    CityManagerServer.prototype.FillCitys = function(citys) {
      var city, i, _i, _len, _results;
      i = 1;
      _results = [];
      for (_i = 0, _len = citys.length; _i < _len; _i++) {
        city = citys[_i];
        Log.log("Load |-- City" + " (" + i++ + ") " + city.name + " id: " + city._id);
        _results.push(this.AddCity(new City.CityServer(city)));
      }
      return _results;
    };

    CityManagerServer.prototype.SendAllTo = function(socket) {
      var city, _i, _len, _ref, _results;
      _ref = this.citys;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        _results.push(city.SendTo(socket));
      }
      return _results;
    };

    return CityManagerServer;

  })(CityManager.CityManagerBase);

}).call(this);
