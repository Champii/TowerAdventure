(function() {

  DbManager.DbManager = (function() {

    DbManager.prototype.mapSchema = null;

    DbManager.prototype.chunkSchema = null;

    DbManager.prototype.playerSchema = null;

    DbManager.prototype.citySchema = null;

    DbManager.prototype.buildingSchema = null;

    DbManager.prototype.gameSchema = null;

    DbManager.prototype.Player = null;

    DbManager.prototype.City = null;

    DbManager.prototype.Building = null;

    DbManager.prototype.Game = null;

    DbManager.prototype.Map = null;

    DbManager.prototype.Chunk = null;

    DbManager.prototype.mongoose = null;

    DbManager.prototype.ready = false;

    DbManager.prototype.gameInstance = null;

    function DbManager() {
      var _this = this;
      this.mongoose = require('mongoose');
      this.mongoose.connect('mongodb://localhost:27017', function(err) {
        var ObjectId, Schema;
        if (err) {
          return handleError(err);
        }
        Log.log("Connected to database");
        ObjectId = _this.mongoose.Schema.ObjectId;
        Schema = _this.mongoose.Schema;
        _this.gameSchema = new Schema({
          players: [
            {
              type: ObjectId,
              ref: 'Player'
            }
          ],
          map: {
            type: ObjectId,
            ref: 'Map'
          }
        });
        _this.mapSchema = new Schema({
          _owner: {
            type: ObjectId,
            ref: 'Game'
          },
          chunks: [
            {
              type: ObjectId,
              ref: 'Chunk'
            }
          ]
        });
        _this.chunkSchema = new Schema({
          _owner: {
            type: ObjectId,
            ref: 'Map'
          },
          pos: {
            type: [Number],
            index: '2d'
          },
          resources: [Number]
        });
        _this.playerSchema = new Schema({
          _owner: {
            type: ObjectId,
            ref: 'Game'
          },
          login: String,
          pass: String,
          citys: [
            {
              type: ObjectId,
              ref: 'City'
            }
          ]
        });
        _this.citySchema = new Schema({
          _owner: {
            type: ObjectId,
            ref: 'Player'
          },
          pos: {
            type: [Number],
            index: '2d'
          },
          name: String,
          buildings: [
            {
              type: ObjectId,
              ref: 'Building'
            }
          ]
        });
        _this.buildingSchema = new Schema({
          _owner: {
            type: ObjectId,
            ref: 'City'
          },
          pos: {
            type: [Number],
            index: '2d'
          },
          name: String,
          level: Number
        });
        _this.Game = _this.mongoose.model('Game', _this.gameSchema);
        _this.Map = _this.mongoose.model('Map', _this.mapSchema);
        _this.Chunk = _this.mongoose.model('Chunk', _this.chunkSchema);
        _this.Player = _this.mongoose.model('Player', _this.playerSchema);
        _this.City = _this.mongoose.model('City', _this.citySchema);
        _this.Building = _this.mongoose.model('Building', _this.buildingSchema);
        _this.resetDB();
        return _this.ready = true;
      });
    }

    DbManager.prototype.resetDB = function() {
      var build1city1tata, build1city1tonton, build1city2tata, build1city2tonton, build2city1tata, build2city1tonton, build2city2tata, build2city2tonton, chunk, city1tata, city1tonton, city2tata, city2tonton, game, makeChunk, map, tata, tonton,
        _this = this;
      this.Game.remove({}, function(err) {
        if (err) {
          return handleError(err);
        }
      });
      this.Player.remove({}, function(err) {
        if (err) {
          return handleError(err);
        }
      });
      this.Map.remove({}, function(err) {
        if (err) {
          return handleError(err);
        }
      });
      this.Chunk.remove({}, function(err) {
        if (err) {
          return handleError(err);
        }
      });
      makeChunk = function() {
        var arr, i, j, _i, _j, _ref, _ref1;
        arr = [];
        for (i = _i = 0, _ref = Map.Chunk.ChunkBase.size; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          for (j = _j = 0, _ref1 = Map.Chunk.ChunkBase.size; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            arr.push(0);
          }
        }
        return arr;
      };
      game = new this.Game;
      map = new this.Map({
        _owner: game
      });
      chunk = new this.Chunk({
        _owner: map,
        pos: [0, 0],
        resources: makeChunk()
      });
      tonton = new this.Player({
        _owner: game,
        login: "tonton",
        pass: "tonton"
      });
      city1tonton = new this.City({
        _owner: tonton,
        name: 'city1tonton'
      });
      build1city1tonton = new this.Building({
        _owner: city1tonton,
        name: 'build1city1tonton',
        level: 0
      });
      build2city1tonton = new this.Building({
        _owner: city1tonton,
        name: 'build2city1tonton',
        level: 0
      });
      city2tonton = new this.City({
        _owner: tonton,
        name: 'city2tonton'
      });
      build1city2tonton = new this.Building({
        _owner: city2tonton,
        name: 'build1city2tonton',
        level: 0
      });
      build2city2tonton = new this.Building({
        _owner: city2tonton,
        name: 'build2city2tonton',
        level: 0
      });
      tata = new this.Player({
        _owner: game,
        login: "tata",
        pass: "tata"
      });
      city1tata = new this.City({
        _owner: tata,
        name: 'city1tata'
      });
      build1city1tata = new this.Building({
        _owner: city1tata,
        name: 'build1city1tata',
        level: 0
      });
      build2city1tata = new this.Building({
        _owner: city1tata,
        name: 'build2city1tata',
        level: 0
      });
      city2tata = new this.City({
        _owner: tata,
        name: 'city2tata'
      });
      build1city2tata = new this.Building({
        _owner: city2tata,
        name: 'build1city2tata',
        level: 0
      });
      build2city2tata = new this.Building({
        _owner: city2tata,
        name: 'build2city2tata',
        level: 0
      });
      city1tonton.buildings.push(build1city1tonton);
      city1tonton.buildings.push(build2city1tonton);
      city2tonton.buildings.push(build1city2tonton);
      city2tonton.buildings.push(build2city2tonton);
      tonton.citys.push(city1tonton);
      tonton.citys.push(city2tonton);
      game.players.push(tonton);
      city1tata.buildings.push(build1city1tata);
      city1tata.buildings.push(build2city1tata);
      city2tata.buildings.push(build1city2tata);
      city2tata.buildings.push(build2city2tata);
      tata.citys.push(city1tata);
      tata.citys.push(city2tata);
      game.players.push(tata);
      map.chunks.push(chunk);
      game.map = map;
      build1city1tonton.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      build2city1tonton.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      build1city2tonton.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      build2city2tonton.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      build1city1tata.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      build2city1tata.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      build1city2tata.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      build2city2tata.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      city1tonton.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      city2tonton.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      city1tata.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      city2tata.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      tonton.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      tata.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      chunk.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      map.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      game.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      return this.gameInstance = game;
    };

    DbManager.prototype.getAllChunksModels = function(callback) {
      var _this = this;
      if (!this.ready) {
        return setTimeout(function() {
          return _this.getAllChunksModels(callback);
        }, 1);
      } else {
        return this.Chunk.find({}).exec(function(err, chunks) {
          if (err) {
            return handleError(err);
          }
          return callback(chunks);
        });
      }
    };

    DbManager.prototype.getAllPlayersModels = function(callback) {
      var _this = this;
      if (!this.ready) {
        return setTimeout(function() {
          return _this.getAllPlayersModels(callback);
        }, 1);
      } else {
        return this.Player.find({}).populate('citys').exec(function(err, players) {
          if (err) {
            return handleError(err);
          }
          return callback(players);
        });
      }
    };

    DbManager.prototype.getAllCitysModels = function(player, callback) {
      var _this = this;
      if (!this.ready) {
        return setTimeout(function() {
          return _this.getAllCitysModels(player, callback);
        }, 1);
      } else {
        return this.City.find({
          _owner: player._id
        }).populate('buildings').exec(function(err, citys) {
          if (err) {
            return handleError(err);
          }
          return callback(citys);
        });
      }
    };

    DbManager.prototype.getAllBuildingModels = function(city, callback) {
      var _this = this;
      if (!this.ready) {
        return setTimeout(function() {
          return _this.getAllBuildingModels(city, callback);
        }, 1);
      } else {
        return this.Building.find({
          _owner: city._id
        }).exec(function(err, buildings) {
          if (err) {
            return handleError(err);
          }
          return callback(buildings);
        });
      }
    };

    DbManager.prototype.getCityModel = function(name, callback, args) {
      return this.City.find({
        name: name
      }).populate('buildings').exec(function(err, city) {
        return handleError(err)(err ? callback(city(args)) : void 0);
      });
    };

    DbManager.prototype.getPlayerModel = function(data, callback) {
      return this.Player.findOne({
        login: data.login
      }).populate('citys').exec(function(err, player) {
        if (err) {
          return handleError(err);
        }
        return callback(player);
      });
    };

    DbManager.prototype.addPlayerModel = function(data, callback) {
      var _this = this;
      return this.getPlayerModel(data, function(player) {
        var newBase, newPlayer;
        if (!player) {
          newPlayer = new _this.Player({
            _owner: _this.gameInstance._id,
            login: data.login,
            pass: data.pass
          });
          newBase = _this.addCityModel(newPlayer);
          newPlayer.citys.push(newBase);
          return newPlayer.save(function(err) {
            if (err) {
              return handleError(err);
            }
            return _this.Player.findOne({
              login: data.login
            }).populate('citys').exec(function(err, gettedPlayer) {
              if (err) {
                return handleError(err);
              }
              Log.log("DB : Player " + gettedPlayer.login + " is added to the database");
              if (callback) {
                return callback(null, gettedPlayer);
              }
            });
          });
        } else {
          return callback('Player exists');
        }
      });
    };

    DbManager.prototype.addCityModel = function(owner, data, callback) {
      var name, newBuilding, newCity;
      name = "";
      if (data) {
        name = data.name;
      } else {
        name = "Main City";
      }
      newCity = new this.City({
        _owner: owner,
        name: name
      });
      newBuilding = this.addBuildingModel(newCity);
      newCity.buildings.push(newBuilding);
      newCity.save(function(err) {
        if (err) {
          return handleError(err);
        }
        Log.log("DB : New city " + newCity.name + " is added to the database");
        if (callback) {
          return callback(newCity);
        }
      });
      return newCity;
    };

    DbManager.prototype.addBuildingModel = function(owner, data, callback) {
      var name, newBuilding;
      name = "";
      if (data) {
        name = data.name;
      } else {
        name = "Main Building";
      }
      newBuilding = new this.Building({
        _owner: owner,
        name: name,
        level: 1
      });
      newBuilding.save(function(err) {
        if (err) {
          return handleError(err);
        }
        if (callback) {
          callback(newBuilding);
        }
        return Log.log("DB : New Building " + newBuilding.name + " is added to the database");
      });
      return newBuilding;
    };

    return DbManager;

  })();

}).call(this);
