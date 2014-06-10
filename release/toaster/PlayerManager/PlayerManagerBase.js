(function() {

  PlayerManager.PlayerManagerBase = (function() {

    PlayerManagerBase.prototype.players = [];

    function PlayerManagerBase() {}

    PlayerManagerBase.prototype.AddPlayer = function(player) {
      return this.players.push(player);
    };

    PlayerManagerBase.prototype.GetPlayer = function(login) {
      var player, _i, _len, _ref;
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.login === login) {
          return player;
        }
      }
      return null;
    };

    return PlayerManagerBase;

  })();

}).call(this);
