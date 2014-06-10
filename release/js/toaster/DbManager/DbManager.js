(function() {

  DbManager.DbManager = (function() {

    DbManager.prototype.mapSchema = null;

    DbManager.prototype.chunkSchema = null;

    DbManager.prototype.playerSchema = null;

    DbManager.prototype.citySchema = null;

    DbManager.prototype.buildingSchema = null;

    DbManager.prototype.gameSchema = null;

    DbManager.prototype.buildingManagerSchema = null;

    DbManager.prototype.Player = null;

    DbManager.prototype.City = null;

    DbManager.prototype.Building = null;

    DbManager.prototype.Game = null;

    DbManager.prototype.Map = null;

    DbManager.prototype.Chunk = null;

    DbManager.prototype.BuildingManager = null;

    DbManager.prototype.mongoose = null;

    DbManager.prototype.ready = false;

    DbManager.prototype.gameInstance = null;

    function DbManager() {
      var con,
        _this = this;
      this.mongoose = require('mongoose');
      con = this.mongoose.connect('mongodb://localhost:27017/tdadv', function(err) {
        var ObjectId, Schema;
        if (err) {
          return handleError(err);
        }
        Log.log("Connected to database");
        _this.mongoose.connection.on('error', function(err) {
          return console.error('MongoDB error: %s', err);
        });
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
        _this.buildingManagerSchema = new Schema({
          buildings: [
            {
              type: ObjectId,
              ref: 'Building'
            }
          ]
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
          resources: {
            type: [Number]
          }
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
          isMain: Boolean,
          pos: {
            type: [Number],
            index: '2d'
          },
          range: Number,
          name: String,
          resources: {
            type: ObjectId,
            ref: 'Resources'
          },
          buildings: [
            {
              type: ObjectId,
              ref: 'Building'
            }
          ]
        });
        _this.resourcesSchema = new Schema({
          _owner: {
            type: ObjectId,
            ref: 'City'
          },
          iron: Number,
          gold: Number,
          cristal: Number,
          uranium: Number,
          petrol: Number,
          energy: Number,
          lastUpdate: {
            type: Date,
            "default": Date.now
          }
        });
        _this.buildingSchema = new Schema({
          _owner: {
            type: ObjectId,
            ref: 'Player'
          },
          _city: {
            type: ObjectId,
            ref: 'City'
          },
          name: String,
          level: Number,
          pos: {
            type: [Number],
            index: '2d'
          },
          posEnd: [Number],
          underConstruct: Boolean,
          startTime: {
            type: Date
          },
          finishTime: {
            type: Date
          }
        });
        _this.Game = _this.mongoose.model('Game', _this.gameSchema);
        _this.BuildingManager = _this.mongoose.model('BuildingManager', _this.buildingManagerSchema);
        _this.Map = _this.mongoose.model('Map', _this.mapSchema);
        _this.Chunk = _this.mongoose.model('Chunk', _this.chunkSchema);
        _this.Resources = _this.mongoose.model('Resources', _this.resourcesSchema);
        _this.Player = _this.mongoose.model('Player', _this.playerSchema);
        _this.City = _this.mongoose.model('City', _this.citySchema);
        _this.Building = _this.mongoose.model('Building', _this.buildingSchema);
        _this.mongoose.connection.collections['games'].drop(function(err) {
          return _this.mongoose.connection.collections['buildingmanagers'].drop(function(err) {
            return _this.mongoose.connection.collections['maps'].drop(function(err) {
              return _this.mongoose.connection.collections['chunks'].drop(function(err) {
                return _this.mongoose.connection.collections['resources'].drop(function(err) {
                  return _this.mongoose.connection.collections['players'].drop(function(err) {
                    return _this.mongoose.connection.collections['cities'].drop(function(err) {
                      return _this.mongoose.connection.collections['buildings'].drop(function(err) {
                        return _this.resetDB();
                      });
                    });
                  });
                });
              });
            });
          });
        });
        _this.Game.find({}).populate('players').exec(function(err, game) {
          if (err || !game) {
            return handleError(err);
          }
          return _this.gameInstance = game;
        });
        return _this.ready = true;
      });
    }

    DbManager.prototype.resetDB = function() {
      var build1city1tata, build1city1tonton, build1city2tata, build1city2tonton, build2city1tata, build2city1tonton, build2city2tata, build2city2tonton, buildingManager, city1tata, city1tataRes, city1tonton, city1tontonRes, city2tata, city2tataRes, city2tonton, city2tontonRes, cityHallBuilding, cristalMineBuilding, game, goldMineBuilding, ironMineBuilding, map, petrolMineBuilding, solarCenterBuilding, tata, tonton, uraniumMineBuilding;
      game = new this.Game();
      buildingManager = new this.BuildingManager();
      cityHallBuilding = new this.Building({
        _city: null,
        pos: [0, 0],
        posEnd: [3, 3],
        name: 'cityHall',
        level: 1,
        underConstruct: true,
        startTime: 0,
        finishTime: 0
      });
      ironMineBuilding = new this.Building({
        _city: null,
        pos: [0, 0],
        posEnd: [1, 1],
        name: 'ironMine',
        level: 1,
        underConstruct: true,
        startTime: 0,
        finishTime: 0
      });
      goldMineBuilding = new this.Building({
        _city: null,
        pos: [0, 0],
        posEnd: [1, 1],
        name: 'goldMine',
        level: 1,
        underConstruct: true,
        startTime: 0,
        finishTime: 0
      });
      cristalMineBuilding = new this.Building({
        _city: null,
        pos: [0, 0],
        posEnd: [1, 1],
        name: 'cristalMine',
        level: 1,
        underConstruct: true,
        startTime: 0,
        finishTime: 0
      });
      uraniumMineBuilding = new this.Building({
        _city: null,
        pos: [0, 0],
        posEnd: [1, 1],
        name: 'uraniumMine',
        level: 1,
        underConstruct: true,
        startTime: 0,
        finishTime: 0
      });
      petrolMineBuilding = new this.Building({
        _city: null,
        pos: [0, 0],
        posEnd: [1, 1],
        name: 'petrolMine',
        level: 1,
        underConstruct: true,
        startTime: 0,
        finishTime: 0
      });
      solarCenterBuilding = new this.Building({
        _city: null,
        pos: [0, 0],
        posEnd: [2, 2],
        name: 'solarCenter',
        level: 1,
        underConstruct: true,
        startTime: 0,
        finishTime: 0
      });
      buildingManager.buildings.push(cityHallBuilding);
      buildingManager.buildings.push(ironMineBuilding);
      buildingManager.buildings.push(goldMineBuilding);
      buildingManager.buildings.push(cristalMineBuilding);
      buildingManager.buildings.push(uraniumMineBuilding);
      buildingManager.buildings.push(petrolMineBuilding);
      buildingManager.buildings.push(solarCenterBuilding);
      cityHallBuilding.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      ironMineBuilding.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      goldMineBuilding.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      cristalMineBuilding.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      uraniumMineBuilding.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      petrolMineBuilding.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      solarCenterBuilding.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      buildingManager.save(function(err) {
        if (err) {
          return handleError(err);
        }
      });
      map = new this.Map({
        _owner: game
      });
      tonton = new this.Player({
        _owner: game,
        login: "tonton",
        pass: "tonton"
      });
      city1tonton = new this.City({
        _owner: tonton,
        isMain: true,
        pos: [0, 0],
        range: 3,
        name: 'city1tonton'
      });
      city1tontonRes = new this.Resources({
        _owner: city1tonton,
        iron: 0,
        gold: 0,
        cristal: 0,
        uranium: 0,
        petrol: 0,
        energy: 0
      });
      build1city1tonton = new this.Building({
        _owner: tonton,
        _city: city1tonton,
        pos: [0, 0],
        posEnd: [3, 3],
        name: 'cityHall',
        level: 1,
        underConstruct: true
      });
      build2city1tonton = new this.Building({
        _owner: tonton,
        _city: city1tonton,
        pos: [4, 4],
        posEnd: [5, 5],
        name: 'ironMine',
        level: 1,
        underConstruct: false
      });
      city2tonton = new this.City({
        _owner: tonton,
        isMain: false,
        pos: [0, 5],
        range: 3,
        name: 'city2tonton'
      });
      city2tontonRes = new this.Resources({
        _owner: city2tonton,
        iron: 0,
        gold: 0,
        cristal: 0,
        uranium: 0,
        petrol: 0,
        energy: 0
      });
      build1city2tonton = new this.Building({
        _owner: tonton,
        _city: city2tonton,
        name: 'cityHall',
        pos: [0, 5],
        posEnd: [3, 8],
        level: 0,
        underConstruct: true
      });
      build2city2tonton = new this.Building({
        _owner: tonton,
        _city: city2tonton,
        name: 'ironMine',
        pos: [4, 9],
        posEnd: [5, 10],
        level: 0,
        underConstruct: true
      });
      tata = new this.Player({
        _owner: game,
        login: "tata",
        pass: "tata"
      });
      city1tata = new this.City({
        _owner: tata,
        isMain: true,
        pos: [10, 10],
        range: 3,
        name: 'city1tata'
      });
      city1tataRes = new this.Resources({
        _owner: city1tata,
        iron: 10000,
        gold: 10000,
        cristal: 10000,
        uranium: 10000,
        petrol: 10000,
        energy: 10000
      });
      build1city1tata = new this.Building({
        _owner: tata,
        _city: city1tata,
        pos: [10, 10],
        posEnd: [13, 13],
        name: 'cityHall',
        level: 1,
        underConstruct: true
      });
      build2city1tata = new this.Building({
        _owner: tata,
        _city: city1tata,
        pos: [14, 11],
        posEnd: [15, 12],
        name: 'ironMine',
        level: 1,
        underConstruct: true
      });
      city2tata = new this.City({
        _owner: tata,
        isMain: false,
        pos: [17, 17],
        range: 3,
        name: 'city2tata'
      });
      city2tataRes = new this.Resources({
        _owner: city2tata,
        iron: 0,
        gold: 0,
        cristal: 0,
        uranium: 0,
        petrol: 0,
        energy: 0
      });
      build1city2tata = new this.Building({
        _owner: tata,
        _city: city2tata,
        pos: [17, 17],
        posEnd: [20, 20],
        name: 'cityHall',
        level: 1,
        underConstruct: true
      });
      build2city2tata = new this.Building({
        _owner: tata,
        _city: city2tata,
        pos: [21, 21],
        posEnd: [22, 22],
        name: 'ironMine',
        level: 1,
        underConstruct: true
      });
      city1tonton.buildings.push(build1city1tonton);
      city1tonton.buildings.push(build2city1tonton);
      city2tonton.buildings.push(build1city2tonton);
      city2tonton.buildings.push(build2city2tonton);
      city1tonton.resources = city1tontonRes;
      city2tonton.resources = city2tontonRes;
      tonton.citys.push(city1tonton);
      tonton.citys.push(city2tonton);
      game.players.push(tonton);
      city1tata.buildings.push(build1city1tata);
      city1tata.buildings.push(build2city1tata);
      city2tata.buildings.push(build1city2tata);
      city2tata.buildings.push(build2city2tata);
      city1tata.resources = city1tataRes;
      city2tata.resources = city2tataRes;
      tata.citys.push(city1tata);
      tata.citys.push(city2tata);
      game.players.push(tata);
      return game.map = map;
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
        }).populate('buildings').populate('resources').exec(function(err, citys) {
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
          _city: city._id
        }).populate('_owner').populate('_city').exec(function(err, buildings) {
          if (err) {
            return handleError(err);
          }
          return callback(buildings);
        });
      }
    };

    DbManager.prototype.getCityModel = function(name, callback) {
      return this.City.find({
        name: name
      }).populate('buildings').exec(function(err, city) {
        if (err) {
          return handleError(err);
        }
        return callback(city);
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

    DbManager.prototype.addPlayerModel = function(data, pos, callback) {
      var _this = this;
      return this.getPlayerModel(data, function(player) {
        var newPlayer;
        if (!player) {
          newPlayer = new _this.Player({
            _owner: _this.gameInstance._id,
            login: data.login,
            pass: data.pass
          });
          return _this.addCityModel(newPlayer, null, pos, function(newBase) {
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
          });
        } else {
          return callback('Player exists');
        }
      });
    };

    DbManager.prototype.addCityModel = function(owner, data, pos, callback) {
      var isMain, name, newCity,
        _this = this;
      isMain = (data ? false : true);
      name = (data ? data.name : "MainCity");
      newCity = new this.City({
        _owner: owner,
        pos: pos,
        range: 8,
        isMain: isMain,
        name: name
      });
      this.addResourcesModel(newCity, function(newResources) {
        newCity.resources = newResources;
        newResources.save(function(err) {
          if (err) {
            return handleError(err);
          }
        });
        return _this.addBuildingModel(owner, newCity, null, function(newBuilding) {
          newCity.buildings.push(newBuilding);
          newBuilding.save(function(err) {
            if (err) {
              return handleError(err);
            }
          });
          return newCity.save(function(err) {
            if (err) {
              return handleError(err);
            }
            Log.log("DB : New city " + newCity.name + " is added to the database");
            if (callback) {
              return callback(newCity);
            }
          });
        });
      });
      return newCity;
    };

    DbManager.prototype.addResourcesModel = function(city, callback) {
      var newResources,
        _this = this;
      newResources = new this.Resources({
        _owner: city,
        iron: 500,
        gold: 200,
        cristal: 50,
        uranium: 0,
        petrol: 0,
        energy: 0,
        lastUpdate: new Date()
      });
      return newResources.save(function(err) {
        if (err) {
          return handleError(err);
        }
        return callback(newResources);
      });
    };

    DbManager.prototype.addBuildingModel = function(owner, city, data, callback) {
      var name, newBuilding, pos, posEnd;
      name = (data ? data.name : "cityHall");
      pos = (data ? data.pos : city.pos);
      posEnd = (data ? data.posEnd : [city.pos[0] + 3, city.pos[1] + 3]);
      newBuilding = new this.Building({
        _owner: owner,
        _city: city,
        name: name,
        pos: pos,
        posEnd: posEnd,
        level: 1,
        underConstruct: true,
        startTime: 0,
        finishTime: 0
      });
      if (callback) {
        callback(newBuilding);
      }
      Log.log("DB : New Building " + newBuilding.name + " is added to the database");
      return newBuilding;
    };

    DbManager.prototype.NewBuilding = function(building, time, callback) {
      var _this = this;
      return this.BuildingManager.find().populate('buildings').exec(function(err, buildings) {
        var build, tmp, _i, _len, _ref, _results;
        if (err) {
          return handleError(err);
        }
        _ref = buildings[0].buildings;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          build = _ref[_i];
          if (build.name === building.name) {
            tmp = function(build) {
              return _this.City.findOne({
                name: building.cityName
              }).populate('_owner').populate('buildings').exec(function(err, city) {
                var buildObject, newBuild;
                if (err) {
                  return handleError(err);
                }
                buildObject = build.toObject();
                delete buildObject._id;
                buildObject._owner = city._owner;
                buildObject._city = city;
                buildObject.pos = [Math.floor(building.pos.x), Math.floor(building.pos.y)];
                buildObject.posEnd = [Math.floor(building.pos.x + buildObject.posEnd[0]), Math.floor(building.pos.y + buildObject.posEnd[1])];
                buildObject.startTime = new Date();
                buildObject.finishTime = new Date(buildObject.startTime.getTime() + time);
                newBuild = new _this.Building(buildObject);
                city.buildings.push(newBuild);
                city.save(function(err) {});
                return newBuild.save(function(err) {
                  return _this.Building.findOne({
                    _id: newBuild._id
                  }).populate('_city').exec(function(err, buildGet) {
                    if (err) {
                      return handleError(err);
                    }
                    if ((callback != null) && (buildGet != null)) {
                      return callback(buildGet);
                    }
                  });
                });
              });
            };
            _results.push(tmp(build));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    };

    DbManager.prototype.getChunk = function(pos, callback) {
      return this.Building.find({
        _owner: {
          $ne: null
        }
      }).populate('_owner').populate('_city').exec(function(err, buildings) {
        if (callback != null) {
          return callback(buildings);
        }
      });
    };

    return DbManager;

  })();

}).call(this);
