(function() {

  Player.PlayerBase = (function() {

    PlayerBase.prototype.socket = null;

    PlayerBase.prototype.login = null;

    PlayerBase.prototype.cityManager = null;

    function PlayerBase(player, socket) {
      this.socket = socket;
      this.login = player.login;
    }

    PlayerBase.prototype.SendTo = function(socket) {
      var player;
      player = {
        login: this.login
      };
      return socket.emit('playerObject', player);
    };

    return PlayerBase;

  })();

}).call(this);
