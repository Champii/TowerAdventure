(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CityManager.CityManagerClient = (function(_super) {

    __extends(CityManagerClient, _super);

    CityManagerClient.prototype.socket = null;

    CityManagerClient.prototype.scope = null;

    CityManagerClient.prototype.currentCity = null;

    function CityManagerClient(player, socket, scope) {
      var _this = this;
      CityManagerClient.__super__.constructor.call(this);
      this.socket = socket;
      this.scope = scope;
      this.socket.on('ownCityObject', function(city) {
        var newCity;
        newCity = new City.CityClient(city, socket, _this.scope);
        _this.scope.updateLoadMessages('city');
        _this.AddCity(newCity);
        if (city.isMain) {
          return _this.scope.centerOnCity(newCity);
        }
      });
      this.socket.on('ownBuildingObject', function(building) {
        var city;
        if ((city = _this.GetCity(building.city.name))) {
          _this.scope.updateLoadMessages('building');
          return _this.scope.$apply(function() {
            return city.buildingManager.AddBuilding(new Building.BuildingClient(building, city));
          });
        }
      });
      this.socket.on('resources', function(resources) {
        var city;
        if ((city = _this.GetCity(resources.city)) != null) {
          city.resources.UpdateResources(resources);
          return _this.scope.$apply(function() {
            return _this.scope.currentCity = city;
          });
        }
      });
      setInterval(function() {
        return _this.socket.emit('getResources', {
          name: _this.currentCity.name
        });
      }, 30000);
      setInterval(function() {
        return _this.scope.$apply(function() {
          return _this.UpdateAllConstruct();
        });
      }, 1000);
    }

    CityManagerClient.prototype.UpdateAllConstruct = function() {
      var city, _i, _len, _ref, _results;
      _ref = this.citys;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        _results.push(city.buildingManager.UpdateAllConstruct());
      }
      return _results;
    };

    return CityManagerClient;

  })(CityManager.CityManagerBase);

}).call(this);
