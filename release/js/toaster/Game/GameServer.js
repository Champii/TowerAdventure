(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Game.GameServer = (function(_super) {

    __extends(GameServer, _super);

    GameServer.prototype.dbManager = null;

    GameServer.prototype.io = null;

    GameServer.prototype.map = null;

    function GameServer(playerManager, io) {
      var _this = this;
      GameServer.__super__.constructor.call(this, playerManager);
      this.io = io;
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.map = new Map.MapServer;
      this.playerManager = new PlayerManager.PlayerManagerServer(this.io.sockets);
      this.io.sockets.on('connection', function(socket) {
        socket.on('signIn', function(data) {
          return _this.playerManager.SignIn(data, socket, function() {
            return _this.SetCallbacks(socket);
          });
        });
        return socket.on('signUp', function(data) {
          return _this.playerManager.SignUp(data, socket, _this.map.GetNextNewPlayerPos(_this.playerManager.players.length), function() {
            return _this.SetCallbacks(socket);
          });
        });
      });
    }

    GameServer.prototype.SetCallbacks = function(socket) {
      var _this = this;
      return socket.on('getChunk', function(data) {
        _this.playerManager.GetChunk(data, socket);
        return (_this.map.GetChunk(data)).SendTo(socket);
      });
    };

    return GameServer;

  })(Game.GameBase);

}).call(this);
