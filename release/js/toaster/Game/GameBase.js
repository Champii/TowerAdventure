(function() {

  Game.GameBase = (function() {

    GameBase.prototype.playerManager = null;

    function GameBase(playerManager) {
      this.playerManager = playerManager;
    }

    return GameBase;

  })();

}).call(this);
