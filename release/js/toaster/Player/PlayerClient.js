(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Player.PlayerClient = (function(_super) {

    __extends(PlayerClient, _super);

    function PlayerClient(player, socket, scope) {
      PlayerClient.__super__.constructor.call(this, player, socket);
      this.cityManager = new CityManager.CityManagerClient(player, this.socket, scope);
    }

    return PlayerClient;

  })(Player.PlayerBase);

}).call(this);
