(function() {

  BuildingManager.BuildingManagerBase = (function() {

    BuildingManagerBase.prototype.buildings = null;

    BuildingManagerBase.prototype.city = null;

    BuildingManagerBase.prototype.buildingsConstruct = null;

    function BuildingManagerBase(city) {
      this.buildings = [];
      this.buildingsConstruct = [];
      this.city = city;
    }

    BuildingManagerBase.prototype.GetBuilding = function(name) {
      var build, _i, _len, _ref;
      _ref = this.buildings;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        build = _ref[_i];
        if (build.name === name) {
          return build;
        }
      }
      return null;
    };

    BuildingManagerBase.prototype.AddBuilding = function(building) {
      if (building.underConstruct) {
        this.buildingsConstruct.push(building);
      }
      return this.buildings.push(building);
    };

    BuildingManagerBase.prototype.SendAllTo = function(socket, isOwner, isRec) {
      var building, _i, _len, _ref, _results;
      _ref = this.buildings;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        building = _ref[_i];
        _results.push(building.SendTo(socket, isOwner, isRec));
      }
      return _results;
    };

    BuildingManagerBase.prototype.GetPriceOf = function(building, level) {
      var price;
      price = (function() {
        switch (building) {
          case 'ironMine':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'goldMine':
            return {
              iron: 48 * Math.pow(1.6, level - 1),
              gold: 24 * Math.pow(1.6, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'cristalMine':
            return {
              iron: 225 * Math.pow(1.5, level - 1),
              gold: 75 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'uraniumMine':
            return {
              iron: 527 * Math.pow(1.8, level - 1),
              gold: 480 * Math.pow(1.8, level - 1),
              cristal: 240 * Math.pow(1.8, level - 1),
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'petrolMine':
            return {
              iron: 0,
              gold: 0,
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'solarMine':
            return {
              iron: 75 * Math.pow(1.5, level - 1),
              gold: 30 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'architectOffice':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
        }
      })();
      price.time = Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000;
      return price;
    };

    BuildingManagerBase.prototype.CanBuy = function(building, level) {
      var price;
      price = this.GetPriceOf(building, level);
      if (price.iron > this.city.resources.iron || price.gold > this.city.resources.gold || price.cristal > this.city.resources.cristal || price.uranium > this.city.resources.uranium || price.petrol > this.city.resources.petrol || price.energy > this.city.resources.energy || price.pop > this.city.resources.pop) {
        return false;
      } else {
        return true;
      }
    };

    return BuildingManagerBase;

  })();

}).call(this);
