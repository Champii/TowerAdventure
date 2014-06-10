(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  City.CityServer = (function(_super) {

    __extends(CityServer, _super);

    CityServer.prototype.dbManager = null;

    function CityServer(city, callback) {
      CityServer.__super__.constructor.call(this, city);
      this.pos = {
        x: city.pos[0],
        y: city.pos[1]
      };
      this.resources = new Resources.ResourcesServer(city.resources, this);
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.buildingManager = new BuildingManager.BuildingManagerServer(city, this, callback);
    }

    CityServer.prototype.BuyBuilding = function(building, socket) {
      this.resources.UpdateResources(socket);
      if (this.buildingManager.CanBuy(building.name, building.level)) {
        this.resources.Buy(this.buildingManager.GetPriceOf(building.name, building.level), socket);
        return this.buildingManager.NewBuilding(building, socket);
      } else {
        return socket.emit('error', {
          error: "Lol"
        });
      }
    };

    return CityServer;

  })(City.CityBase);

}).call(this);
