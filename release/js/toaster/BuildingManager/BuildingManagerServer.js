(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BuildingManager.BuildingManagerServer = (function(_super) {

    __extends(BuildingManagerServer, _super);

    BuildingManagerServer.prototype.dbManager = null;

    function BuildingManagerServer(cityBase, city, callback) {
      var _this = this;
      BuildingManagerServer.__super__.constructor.call(this, city);
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.dbManager.getAllBuildingModels(cityBase, function(buildings) {
        return _this.FillBuildings(buildings, callback);
      });
    }

    BuildingManagerServer.prototype.FillBuildings = function(buildings, callback) {
      var building, i, _i, _len;
      i = 1;
      for (_i = 0, _len = buildings.length; _i < _len; _i++) {
        building = buildings[_i];
        this.AddBuilding(new Building.BuildingServer(building, building._city));
        Log.log("Load |---- Building" + " (" + i++ + ") " + building.name);
      }
      if (callback != null) {
        return callback();
      }
    };

    BuildingManagerServer.prototype.NewBuilding = function(building, socket) {
      var _this = this;
      return this.dbManager.NewBuilding(building, this.GetPriceOf(building.name, 1).time, function(build) {
        var newBuild;
        newBuild = new Building.BuildingServer(build, build._city);
        _this.AddBuilding(newBuild);
        return newBuild.SendTo(socket, true, false);
      });
    };

    return BuildingManagerServer;

  })(BuildingManager.BuildingManagerBase);

}).call(this);
