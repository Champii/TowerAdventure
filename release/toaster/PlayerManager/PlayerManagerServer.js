(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PlayerManager.PlayerManagerServer = (function(_super) {

    __extends(PlayerManagerServer, _super);

    PlayerManagerServer.prototype.dbManager = null;

    function PlayerManagerServer() {
      var _this = this;
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.dbManager.getAllPlayersModels(function(players) {
        return _this.FillPlayers(players);
      });
    }

    PlayerManagerServer.prototype.FillPlayers = function(players) {
      var i, player, _i, _len, _results;
      i = 1;
      Log.log('');
      Log.log("**** Loading Players ****");
      _results = [];
      for (_i = 0, _len = players.length; _i < _len; _i++) {
        player = players[_i];
        Log.log("Load Player" + " (" + i++ + ") " + player.login);
        _results.push(this.AddPlayer(new Player.PlayerServer(player)));
      }
      return _results;
    };

    PlayerManagerServer.prototype.SignIn = function(data, socket, callback) {
      var _this = this;
      return this.dbManager.getPlayerModel(data, function(player) {
        if (!(player != null) || data.pass !== player.pass) {
          return socket.emit('error', {
            error: 'Bad login or pass'
          });
        } else {
          socket.emit('loggedIn');
          (_this.GetPlayer(player.login)).SignIn(socket);
          return callback();
        }
      });
    };

    PlayerManagerServer.prototype.SignUp = function(data, socket, callback) {
      var _this = this;
      return this.dbManager.addPlayerModel(data, function(err, player) {
        var newPlayer;
        if (!err && player) {
          newPlayer = new Player.PlayerServer(player, socket);
          socket.emit('signedUp');
          Log.log("PlayerManager: Player " + player.login + " just SignedUp");
          _this.AddPlayer(newPlayer);
          newPlayer.SignIn(socket);
          return callback();
        } else {
          return socket.emit('error', {
            error: err
          });
        }
      });
    };

    return PlayerManagerServer;

  })(PlayerManager.PlayerManagerBase);

}).call(this);
