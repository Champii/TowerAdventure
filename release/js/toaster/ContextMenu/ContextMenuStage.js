(function() {

  ContextMenu.ContextMenuStage = (function() {

    function ContextMenuStage() {}

    ContextMenuStage.prototype.Show = function(attachedObject, pos) {
      var callback, city,
        _this = this;
      city = attachedObject.player.cityManager.currentCity;
      callback = function(key, options) {
        city.buildingManager.PlaceNewBuilding(key, pos);
        return _this.Hide();
      };
      return $.contextMenu({
        selector: '#game',
        events: {
          show: function() {
            return stage.setDraggable(false);
          },
          hide: function() {
            return stage.setDraggable(true);
          }
        },
        items: {
          "actions": {
            "name": "<p>Actions Menu</p>",
            "disabled": true
          },
          "separator": "--------",
          "buildings": {
            "name": "Buildings ->",
            "items": {
              "offices": {
                "name": "Offices ->",
                "items": {
                  "architectOffice": {
                    "name": this.ColorizePrice(attachedObject, 'architectOffice', 'Architect Office'),
                    "disabled": !city.buildingManager.CanBuy('architectOffice', 1),
                    "callback": callback
                  }
                }
              },
              "mines": {
                "name": "Mines ->",
                "items": {
                  "solarMine": {
                    "name": this.ColorizePrice(attachedObject, 'solarMine', 'Solar Mine'),
                    "disabled": !city.buildingManager.CanBuy('solarMine', 1),
                    "callback": callback
                  },
                  "ironMine": {
                    "name": this.ColorizePrice(attachedObject, 'ironMine', 'Iron Mine'),
                    "disabled": !city.buildingManager.CanBuy('ironMine', 1),
                    "callback": callback
                  },
                  "goldMine": {
                    "name": this.ColorizePrice(attachedObject, 'goldMine', 'Gold Mine'),
                    "disabled": !city.buildingManager.CanBuy('goldMine', 1),
                    "callback": callback
                  },
                  "cristalMine": {
                    "name": this.ColorizePrice(attachedObject, 'cristalMine', 'Cristal Mine'),
                    "disabled": !city.buildingManager.CanBuy('cristalMine', 1),
                    "callback": callback
                  },
                  "uraniumMine": {
                    "name": this.ColorizePrice(attachedObject, 'uraniumMine', 'Uranium Mine'),
                    "disabled": !city.buildingManager.CanBuy('uraniumMine', 1),
                    "callback": callback
                  },
                  "petrolMine": {
                    "name": this.ColorizePrice(attachedObject, 'petrolMine', 'Petrol Mine'),
                    "disabled": !city.buildingManager.CanBuy('petrolMine', 1),
                    "callback": callback
                  }
                }
              }
            }
          },
          "towers": {
            "name": "Towers ->",
            "items": {
              "notImplem": {
                "name": "<p>Not Implemented</p>",
                "disabled": true
              }
            }
          }
        }
      });
    };

    ContextMenuStage.prototype.Hide = function() {
      return $.contextMenu('destroy');
    };

    ContextMenuStage.prototype.ColorizePrice = function(attachedObject, building, name) {
      var city, color, left, price, res, time;
      res = '';
      city = attachedObject.player.cityManager.currentCity;
      price = city.buildingManager.GetPriceOf(building, 1);
      color = (city.buildingManager.CanBuy(building, 1) ? '#080' : '#800');
      res += "<p><font color='" + color + "'>" + name + "</font> (";
      color = (city.resources.iron < price.iron ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.iron + "</font> ";
      color = (city.resources.gold < price.gold ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.gold + "</font> ";
      color = (city.resources.cristal < price.cristal ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.cristal + "</font> ";
      color = (city.resources.uranium < price.uranium ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.uranium + "</font> ";
      color = (city.resources.petrol < price.petrol ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.petrol + "</font> ";
      color = (city.resources.energy < price.energy ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.energy + "</font> ";
      color = (city.resources.pop < price.pop ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.pop + "</font>) ";
      left = new Date(price.time);
      time = '';
      if (left.getDate() - 1) {
        time += left.getDate() - 1 + 'd ';
      }
      if (left.getHours - 1) {
        time += left.getHours() - 1 + 'h ';
      }
      if (left.getMinutes()) {
        time += left.getMinutes() + 'm';
      }
      time += left.getSeconds() + 's';
      res += time + "</p>";
      return res;
    };

    return ContextMenuStage;

  })();

}).call(this);
