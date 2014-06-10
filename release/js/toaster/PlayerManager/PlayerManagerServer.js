(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PlayerManager.PlayerManagerServer = (function(_super) {

    __extends(PlayerManagerServer, _super);

    PlayerManagerServer.prototype.dbManager = null;

    PlayerManagerServer.prototype.chat = null;

    function PlayerManagerServer(sockets) {
      var _this = this;
      this.chat = new Social.Chat.ChatServer(sockets);
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
          player = _this.GetPlayer(player.login);
          player.SignIn(socket);
          _this.chat.JoinChannel(player, {
            name: 'general'
          });
          socket.on('askJoinChannel', function(channel) {
            return _this.chat.JoinChannel(newPlayer, channel);
          });
          socket.on('messageChannel', function(message) {
            return _this.chat.AddMessage(message);
          });
          if (callback) {
            return callback();
          }
        }
      });
    };

    PlayerManagerServer.prototype.SignUp = function(data, socket, pos, callback) {
      var _this = this;
      return this.dbManager.addPlayerModel(data, pos, function(err, player) {
        var newPlayer;
        if (!err && player) {
          Log.log("PlayerManager: Player " + player.login + " just SignedUp");
          return newPlayer = new Player.PlayerServer(player, socket, function() {
            socket.emit('signedUp');
            _this.AddPlayer(newPlayer);
            newPlayer.SignIn(socket);
            _this.chat.JoinChannel(newPlayer, {
              name: 'general'
            });
            socket.on('askJoinChannel', function(channel) {
              return _this.chat.JoinChannel(newPlayer, data);
            });
            socket.on('askMessageChannel', function(message) {
              return _this.chat.AddMessage(message);
            });
            if (callback != null) {
              return callback();
            }
          });
        } else {
          return socket.emit('error', {
            error: err
          });
        }
      });
    };

    PlayerManagerServer.prototype.GetChunk = function(pos, socket) {
      var _this = this;
      return this.dbManager.getChunk(pos, function(buildings) {
        var building, city, player, realBuilding, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = buildings.length; _i < _len; _i++) {
          building = buildings[_i];
          if ((player = _this.GetPlayer(building._owner.login)) != null) {
            if (player !== _this.GetPlayerSocket(socket)) {
              if ((city = player.cityManager.GetCity(building._city.name))) {
                if ((realBuilding = city.buildingManager.GetBuilding(building.name))) {
                  _results.push(realBuilding.SendTo(socket, false));
                } else {
                  _results.push(void 0);
                }
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    };

    PlayerManagerServer.prototype.GetPlayerSocket = function(socket) {
      var player, _i, _len, _ref;
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.socket === socket) {
          return player;
        }
      }
      return null;
    };

    return PlayerManagerServer;

  })(PlayerManager.PlayerManagerBase);

}).call(this);
