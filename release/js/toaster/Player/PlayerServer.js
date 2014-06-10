(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Player.PlayerServer = (function(_super) {

    __extends(PlayerServer, _super);

    PlayerServer.prototype.loggedIn = false;

    function PlayerServer(player, socket, callback) {
      PlayerServer.__super__.constructor.call(this, player, socket);
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.cityManager = new CityManager.CityManagerServer(player, this.socket, callback);
    }

    PlayerServer.prototype.SignIn = function(socket) {
      var _this = this;
      this.loggedIn = true;
      this.socket = socket;
      Log.log("Player: Player " + this.login + " just SignedIn");
      this.socket.on('getResources', function(city) {
        var cityGot;
        if ((cityGot = _this.cityManager.GetCity(city.name))) {
          return cityGot.resources.UpdateResources(_this.socket);
        }
      });
      this.socket.on('buyBuilding', function(data) {
        var city;
        if ((city = _this.cityManager.GetCity(data.cityName))) {
          return city.BuyBuilding(data, _this.socket);
        }
      });
      this.SendTo(this.socket);
      return this.cityManager.SendAllTo(this.socket, true);
    };

    return PlayerServer;

  })(Player.PlayerBase);

}).call(this);
