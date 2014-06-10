(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Game.GameClient = (function(_super) {

    __extends(GameClient, _super);

    GameClient.prototype.socket = null;

    GameClient.prototype.player = null;

    GameClient.prototype.map = null;

    function GameClient(socket) {
      this.socket = socket;
    }

    GameClient.prototype.SignIn = function(login, pass) {
      var _this = this;
      this.socket.emit('signIn', {
        login: login,
        pass: pass
      });
      return this.socket.on('loggedIn', function(data) {
        return _this.InitAfterSignIn();
      });
    };

    GameClient.prototype.SignUp = function(login, pass) {
      var _this = this;
      this.socket.emit('signUp', {
        login: login,
        pass: pass
      });
      return this.socket.on('signedUp', function(data) {
        return _this.InitAfterSignIn();
      });
    };

    GameClient.prototype.InitAfterSignIn = function() {
      var _this = this;
      $('#loginScreen').slideUp();
      this.map = new Map.MapClient(this.socket);
      return this.socket.on('playerObject', function(data) {
        console.log(data);
        return _this.player = new Player.PlayerClient(data, _this.socket);
      });
    };

    return GameClient;

  })(Game.GameBase);

}).call(this);
