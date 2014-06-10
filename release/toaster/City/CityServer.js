(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  City.CityServer = (function(_super) {

    __extends(CityServer, _super);

    CityServer.prototype.dbManager = null;

    function CityServer(city) {
      this.name = city.name;
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.buildingManager = new BuildingManager.BuildingManagerServer(city);
    }

    return CityServer;

  })(City.CityBase);

}).call(this);
