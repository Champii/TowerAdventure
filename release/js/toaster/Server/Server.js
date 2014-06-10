(function() {

  Server.Server = (function() {

    Server.prototype.io = null;

    Server.prototype.game = null;

    function Server() {
      this.io = require('socket.io').listen(8080);
      this.io.set('log level', 1);
      this.game = new Game.GameServer(null, this.io);
    }

    return Server;

  })();

}).call(this);
