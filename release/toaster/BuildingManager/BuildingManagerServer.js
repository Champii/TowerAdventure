(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BuildingManager.BuildingManagerServer = (function(_super) {

    __extends(BuildingManagerServer, _super);

    BuildingManagerServer.prototype.dbManager = null;

    function BuildingManagerServer(city) {
      var _this = this;
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.dbManager.getAllBuildingModels(city, function(buildings) {
        return _this.FillBuildings(buildings);
      });
    }

    BuildingManagerServer.prototype.FillBuildings = function(buildings) {
      var building, i, _i, _len, _results;
      i = 0;
      _results = [];
      for (_i = 0, _len = buildings.length; _i < _len; _i++) {
        building = buildings[_i];
        Log.log("Load |---- Building" + " (" + i++ + ") " + building.name + " ownerid: " + building._owner);
        _results.push(this.buildings.push(new Building.BuildingServer(building)));
      }
      return _results;
    };

    return BuildingManagerServer;

  })(BuildingManager.BuildingManagerBase);

}).call(this);
