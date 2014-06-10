(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Player.PlayerServer = (function(_super) {

    __extends(PlayerServer, _super);

    PlayerServer.prototype.loggedIn = false;

    function PlayerServer(player, socket) {
      PlayerServer.__super__.constructor.call(this, player, socket);
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.cityManager = new CityManager.CityManagerServer(player);
    }

    PlayerServer.prototype.SignIn = function(socket) {
      this.loggedIn = true;
      this.socket = socket;
      Log.log("Player: Player " + this.login + " just SignedIn");
      this.SendTo(socket);
      return this.cityManager.SendAllTo(socket);
    };

    return PlayerServer;

  })(Player.PlayerBase);

}).call(this);
