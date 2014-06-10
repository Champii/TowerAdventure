(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Resources.ResourcesServer = (function(_super) {

    __extends(ResourcesServer, _super);

    ResourcesServer.prototype.lastUpdate = null;

    function ResourcesServer(resources, city) {
      ResourcesServer.__super__.constructor.call(this, resources, city);
      this.lastUpdate = new Date(resources.lastUpdate);
    }

    ResourcesServer.prototype.UpdateResources = function(socket) {
      var cristalMineLevel, goldMineLevel, ironMineLevel, now, petrolMineLevel, time, uraniumMineLevel, _ref, _ref1, _ref2, _ref3, _ref4;
      now = new Date;
      time = now.getTime() - this.lastUpdate.getTime();
      this.lastUpdate = now;
      if (!(ironMineLevel = ((_ref = this.city.buildingManager.GetBuilding('ironMine')) != null ? _ref.level : void 0) != null)) {
        ironMineLevel = 0;
      }
      this.iron = this.iron + (((30 + 30 * ironMineLevel * (Math.pow(1.1, ironMineLevel))) / 3600) * (time / 1000));
      if (!(goldMineLevel = ((_ref1 = this.city.buildingManager.GetBuilding('goldMine')) != null ? _ref1.level : void 0) != null)) {
        goldMineLevel = 0;
      }
      this.gold = this.gold + (((20 + 20 * goldMineLevel * (Math.pow(1.1, goldMineLevel))) / 3600) * (time / 1000));
      if (!(cristalMineLevel = ((_ref2 = this.city.buildingManager.GetBuilding('cristalMine')) != null ? _ref2.level : void 0) != null)) {
        cristalMineLevel = 0;
      }
      this.cristal = this.cristal + (((10 + 10 * cristalMineLevel * (Math.pow(1.1, cristalMineLevel))) / 3600) * (time / 1000));
      if (!(uraniumMineLevel = ((_ref3 = this.city.buildingManager.GetBuilding('uraniumMine')) != null ? _ref3.level : void 0) != null)) {
        uraniumMineLevel = 0;
      }
      this.uranium = this.uranium + (((5 * uraniumMineLevel * (Math.pow(1.1, uraniumMineLevel))) / 3600) * (time / 1000));
      if (!(petrolMineLevel = ((_ref4 = this.city.buildingManager.GetBuilding('petrolMine')) != null ? _ref4.level : void 0) != null)) {
        petrolMineLevel = 0;
      }
      this.petrol = this.petrol + (((3 * petrolMineLevel * (Math.pow(1.1, petrolMineLevel))) / 3600) * (time / 1000));
      return this.SendTo(socket);
    };

    ResourcesServer.prototype.Buy = function(price, socket) {
      this.iron -= price.iron;
      this.gold -= price.gold;
      this.cristal -= price.cristal;
      this.uranium -= price.uranium;
      this.petrol -= price.petrol;
      this.energy -= price.energy;
      this.pop -= price.pop;
      return this.UpdateResources(socket);
    };

    return ResourcesServer;

  })(Resources.ResourcesBase);

}).call(this);
