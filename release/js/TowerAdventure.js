var AliveObject = {};
var City = {};
var CityManager = {};
var Client = {};
var ContextMenu = {};
var DbManager = {};
var DesignPattern = {};
var Entity = {'BaseEntity':{},'Soldier':{}};
var EntityManager = {};
var Game = {};
var Helpers = {};
var Map = {'Chunk':{}};
var Notification = {};
var Player = {};
var PlayerManager = {};
var ProgressBar = {};
var Resources = {};
var Server = {};
var Social = {'Channel':{},'Chat':{},'Friends':{}};
var Stack = {};
var Technology = {};
var TechnologyManager = {};
var Territory = {};
var Tower = {'BaseTower':{},'Building':{'ArchitectOffice':{},'CityHall':{},'CristalMine':{},'GoldMine':{},'IronMine':{},'Laboratory':{},'PetrolMine':{},'SolarCentral':{},'UraniumMine':{}},'DefenseTower':{'BaseDefenseTower':{}},'SpawnTower':{'BaseSpawnTower':{}}};
var TowerManager = {'BuildingManager':{},'DefTowerManager':{},'SpawnTowerManager':{}};

(function() {
  var Browser, Log, Main, Module, Node, Singleton, baseDefenseTowerImage, baseEntityImage, baseSpawnTowerImage, baseTowerImage, buildings, buildingsContainer, buildingsSprite, chunkSizeX, chunkSizeY, cityHallImage, cityRangeEnemyImage, cityRangeImage, cristalImage, entityContainer, floor, floorSprite, globalServerDelay, goldImage, grassImage, grassShape, handleError, hudContainer, ironImage, laboratoryImage, mainContainer, mapContainer, moduleKeywords, peopleContainer, petrolImage, rangeContainer, stage, tileSizeX, tileSizeY, uraniumImage,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  moduleKeywords = ['inc', 'extended', 'constructor'];

  Module = (function() {

    Module.prototype.currentConstruct = null;

    function Module() {
      var arg, args, argsArr, i, obj, _i, _j, _len, _len1, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      argsArr = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        argsArr.push(arg);
      }
      if (this.currentConstruct === null) {
        this.currentConstruct = this.inc;
      }
      i = 0;
      if (this.currentConstruct != null) {
        _ref = this.currentConstruct;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          obj = _ref[_j];
          this.currentConstruct = obj.prototype.inc;
          if (argsArr[i] != null) {
            obj.apply(this, argsArr[i++]);
          } else {
            obj.apply(this);
          }
          this.currentConstruct = obj.prototype.inc;
        }
      }
    }

    Module.include = function(obj) {
      var key, value, _ref;
      if (!obj) {
        throw 'include(obj) requires obj';
      }
      _ref = obj.prototype;
      for (key in _ref) {
        value = _ref[key];
        if (__indexOf.call(moduleKeywords, key) < 0) {
          this.prototype[key] = value;
        }
      }
      if (!(this.prototype['inc'] != null)) {
        this.prototype['inc'] = [];
      }
      this.prototype['inc'].push(obj);
      return this;
    };

    Module.prototype._super = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.__super(args, this.inc, this.GetCaller(), arguments.callee.caller);
    };

    Module.prototype.__super = function(args, incRec, caller, func) {
      var key, obj, value, _i, _len, _ref;
      for (_i = 0, _len = incRec.length; _i < _len; _i++) {
        obj = incRec[_i];
        _ref = obj.prototype;
        for (key in _ref) {
          value = _ref[key];
          if (key === caller && value !== func) {
            return value.apply(this, args);
          }
        }
        if (obj.prototype.inc != null) {
          return this.__super(args, obj.prototype.inc, caller, func);
        }
      }
    };

    Module.prototype.GetCaller = function() {
      var err, name, orig, _ref;
      orig = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack) {
        return stack;
      };
      err = new Error;
      Error.captureStackTrace(err, arguments.callee);
      name = (_ref = err.stack[1].getFunctionName()) != null ? _ref.split('.') : void 0;
      Error.prepareStackTrace = orig;
      return name[name.length - 1];
    };

    return Module;

  })();

  EntityManager.EntityManagerBase = (function() {

    EntityManagerBase.prototype.entities = null;

    function EntityManagerBase() {
      this.entities = [];
    }

    EntityManagerBase.prototype.AddEntity = function(entity) {
      this.entities.push(entity);
      return entity;
    };

    EntityManagerBase.prototype.DeleteEntity = function(entity) {
      var ent, i, _ref, _results;
      _ref = this.entities;
      _results = [];
      for (i in _ref) {
        ent = _ref[i];
        if (ent === entity) {
          delete this.entities[i];
          _results.push(this.entities.splice(i, 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return EntityManagerBase;

  })();

  DbManager.DbCollection = (function() {

    DbCollection.Models = [];

    DbCollection.prototype.dbName = null;

    DbCollection.prototype.dbManager = null;

    DbCollection.prototype.schema = null;

    DbCollection.prototype.Model = null;

    function DbCollection(schema) {
      if (schema) {
        this.InitDb(schema);
      }
    }

    DbCollection.prototype.InitDb = function(schema) {
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.dbName = schema.__name__;
      this.schema = schema;
      if (!(this.dbManager.models[this.dbName] != null)) {
        return this.Model = this.dbManager.InitModel(schema);
      } else {
        return this.Model = this.dbManager.models[this.dbName];
      }
    };

    DbCollection.prototype.NewDb = function(obj, cb) {
      var item,
        _this = this;
      item = new this.Model(obj);
      return item.save(function(err) {
        if (err) {
          return handleError(err);
        }
        if (cb != null) {
          return cb(item);
        }
      });
    };

    DbCollection.prototype.GetAllDb = function(field, value, cb) {
      var query;
      query = {};
      if ((field != null) && (value != null)) {
        query[field] = value;
      }
      return this.Model.find(query, function(err, obj) {
        if (err) {
          return handleError(err);
        }
        if (cb != null) {
          return cb(obj);
        }
      });
    };

    DbCollection.prototype.GetOneDb = function(field, value, cb) {
      var query;
      query = {};
      if ((field != null) && (value != null)) {
        query[field] = value;
      }
      return this.Model.findOne(query, function(err, obj) {
        if (err) {
          return handleError(err);
        }
        if (cb != null) {
          return cb(obj);
        }
      });
    };

    return DbCollection;

  })();

  AliveObject.AliveObjectBase = (function() {

    AliveObjectBase.prototype.name = null;

    AliveObjectBase.prototype.type = null;

    AliveObjectBase.prototype.pos = null;

    AliveObjectBase.prototype.life = null;

    function AliveObjectBase(object) {
      this.life = {
        amount: 50,
        total: 50
      };
      if (object != null) {
        if (object.name != null) {
          this.name = object.name;
        }
        if (object.type != null) {
          this.type = object.type;
        }
        if (object.pos != null) {
          this.pos = object.pos;
        }
      }
    }

    return AliveObjectBase;

  })();

  DesignPattern.Observable = (function() {

    Observable.prototype.observators = null;

    function Observable() {
      this.observators = [];
    }

    Observable.prototype.Attach = function(observator) {
      return this.observators.push(observator);
    };

    Observable.prototype.Detach = function(observator) {
      var i, obs, _ref, _results;
      _ref = this.observators;
      _results = [];
      for (i in _ref) {
        obs = _ref[i];
        if (obs === observator) {
          delete this.observators[i];
          _results.push(this.observators.splice(i, 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Observable.prototype.Notify = function(owner, cb) {
      var obs, _i, _len, _ref, _results;
      _ref = this.observators;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        _results.push(obs.Update(owner, cb));
      }
      return _results;
    };

    Observable.prototype.IsObservator = function(obs) {
      var observator, _i, _len, _ref;
      _ref = this.observators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        observator = _ref[_i];
        if (obs === observator) {
          return true;
        }
      }
      return false;
    };

    return Observable;

  })();

  EntityManager.EntityManagerServer = (function(_super) {

    __extends(EntityManagerServer, _super);

    EntityManagerServer.include(EntityManager.EntityManagerBase);

    EntityManagerServer.include(DbManager.DbCollection);

    EntityManagerServer.prototype.parent = null;

    function EntityManagerServer(parent) {
      this.parent = parent;
      EntityManagerServer.__super__.constructor.call(this, [], [Entity.schema]);
    }

    EntityManagerServer.prototype.NewEntity = function(entity, type) {
      var name,
        _this = this;
      name = (function() {
        switch (type) {
          case Entity.BaseEntity.BaseEntityServer:
            return 'baseEntity';
        }
      })();
      entity.name = name;
      entity.pos = {
        x: entity.pos.x,
        y: entity.pos.y
      };
      return this.NewDb(entity, function(ent) {
        return _this.AddEntity(new type(_this, ent.id));
      });
    };

    EntityManagerServer.prototype.PropagDisconnect = function() {
      var entity, _i, _len, _ref, _results;
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        _results.push(entity.PropagDisconnect());
      }
      return _results;
    };

    EntityManagerServer.prototype.DeadEntity = function(entity) {
      entity.destructor();
      return this.DeleteEntity(entity);
    };

    return EntityManagerServer;

  })(Module);

  DbManager.DbItem = (function() {

    DbItem.prototype.dbName = null;

    DbItem.prototype.dbManager = null;

    DbItem.prototype.schema = null;

    DbItem.prototype.Model = null;

    DbItem.prototype.item = null;

    function DbItem(schema, id, cb) {
      if (schema) {
        this.InitDb(schema, id, cb);
      }
    }

    DbItem.prototype.InitDb = function(schema, id, cb) {
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.dbName = schema.__name__;
      this.schema = schema;
      if (!(this.dbManager.models[this.dbName] != null)) {
        this.Model = this.dbManager.InitModel(schema);
      } else {
        this.Model = this.dbManager.models[this.dbName];
      }
      if (id != null) {
        return this.LoadDb(id, cb);
      }
    };

    DbItem.prototype.SaveDb = function(cb) {
      var k, v, x, y, _ref,
        _this = this;
      _ref = this.schema;
      for (k in _ref) {
        v = _ref[k];
        for (x in this) {
          y = this[x];
          if (k === x) {
            this.item[k] = y;
          }
        }
      }
      return this.item.save(function(err) {
        if (err) {
          return handleError(err);
        }
        if (cb != null) {
          return cb();
        }
      });
    };

    DbItem.prototype.LoadDb = function(id, cb) {
      var _this = this;
      if ((this.Model != null) && this.schema) {
        return this.Model.findOne({
          _id: id
        }, function(err, obj) {
          var k, v, x, y, _ref;
          if (err) {
            return handleError(err);
          }
          if (obj) {
            _this.item = obj;
            _this.id = _this.item.id;
            _ref = _this.schema;
            for (k in _ref) {
              v = _ref[k];
              for (x in _this) {
                y = _this[x];
                if (k === x) {
                  _this[x] = _this.item[x];
                }
              }
            }
            if (cb != null) {
              return cb(obj);
            }
          }
        });
      }
    };

    return DbItem;

  })();

  Tower.TowerBase = (function() {

    TowerBase.prototype.id = null;

    TowerBase.prototype.posEnd = null;

    TowerBase.prototype.type = null;

    TowerBase.prototype.city = null;

    TowerBase.prototype.owner = null;

    TowerBase.prototype.underConstruct = null;

    TowerBase.prototype.finishTime = null;

    TowerBase.prototype.evolvList = null;

    TowerBase.prototype.level = null;

    TowerBase.prototype.fireRange = 8;

    TowerBase.prototype.fireRate = null;

    TowerBase.prototype.socket = null;

    TowerBase.prototype.costForm = null;

    TowerBase.prototype.prodForm = null;

    function TowerBase(city, tower) {
      this.type = 'Tower';
      if (tower != null) {
        this.Deserialize(tower);
      }
      if (city != null) {
        this.city = city;
      }
    }

    TowerBase.prototype.LevelUp = function() {
      this.underConstruct = true;
      this.level++;
      this.startTime = new Date().getTime();
      return this.finishTime = this.startTime + this.GetPrice().time;
    };

    TowerBase.prototype.Evolve = function(className) {
      var evol;
      evol = this.GetEvol(className);
      this.underConstruct = true;
      this.startTime = new Date().getTime();
      return this.finishTime = this.startTime + this.GetPrice(evol).time;
    };

    TowerBase.prototype.Serialize = function() {
      return {
        _id: this.id,
        name: this.name,
        pos: this.pos,
        posEnd: this.posEnd,
        level: this.level,
        fireRange: this.fireRange,
        fireRate: this.fireRate,
        underConstruct: this.underConstruct,
        startTime: this.startTime,
        finishTime: this.finishTime,
        life: this.life
      };
    };

    TowerBase.prototype.Deserialize = function(tower) {
      if (tower != null) {
        if (tower._id != null) {
          this.id = tower._id;
        }
        if (tower.pos != null) {
          this.pos = tower.pos;
        }
        if (tower.posEnd != null) {
          this.posEnd = tower.posEnd;
        }
        if (tower.underConstruct != null) {
          this.underConstruct = tower.underConstruct;
        }
        if (tower.startTime != null) {
          this.startTime = new Date(tower.startTime);
        }
        if (tower.finishTime != null) {
          this.finishTime = new Date(tower.finishTime);
        }
        if (tower.level != null) {
          this.level = tower.level;
        }
        if (tower.range != null) {
          this.range = tower.range;
        }
        if (tower.own != null) {
          this.own = tower.own;
        }
        if (tower.life != null) {
          return this.life = tower.life;
        }
      }
    };

    TowerBase.prototype.GetPrice = function(other) {
      var price;
      if (other != null) {
        price = other.costForm(this.level);
        price.time = Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000;
        return price;
      } else if (this.costForm != null) {
        price = this.costForm(this.level + 1);
        price.time = Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000;
        return price;
      }
      return null;
    };

    TowerBase.prototype.CanLevelUp = function() {
      var price;
      price = this.GetPrice();
      this.city.resources.UpdateResources();
      if ((price != null) && this.underConstruct || price.iron > this.city.resources.iron || price.gold > this.city.resources.gold || price.cristal > this.city.resources.cristal || price.uranium > this.city.resources.uranium || price.petrol > this.city.resources.petrol || price.energy > this.city.resources.energy || price.pop > this.city.resources.pop) {
        return false;
      } else {
        return true;
      }
    };

    TowerBase.prototype.CanEvolve = function(className) {
      var evol, price;
      evol = this.GetEvol(className);
      price = this.GetPrice(evol);
      this.city.resources.UpdateResources();
      if ((price != null) && this.underConstruct || price.iron > this.city.resources.iron || price.gold > this.city.resources.gold || price.cristal > this.city.resources.cristal || price.uranium > this.city.resources.uranium || price.petrol > this.city.resources.petrol || price.energy > this.city.resources.energy || price.pop > this.city.resources.pop) {
        return false;
      } else {
        return true;
      }
    };

    TowerBase.prototype.ForEachEvol = function(cb) {
      var evol, name, _ref, _results;
      _ref = this.evolveList;
      _results = [];
      for (name in _ref) {
        evol = _ref[name];
        _results.push(cb(name, evol));
      }
      return _results;
    };

    TowerBase.prototype.GetEvol = function(name) {
      var evol, evolName, _ref;
      _ref = this.evolveList;
      for (evolName in _ref) {
        evol = _ref[evolName];
        if (name === evolName) {
          return evol;
        }
      }
      return null;
    };

    return TowerBase;

  })();

  AliveObject.AliveObjectServer = (function(_super) {

    __extends(AliveObjectServer, _super);

    AliveObjectServer.include(AliveObject.AliveObjectBase);

    AliveObjectServer.include(DesignPattern.Observable);

    function AliveObjectServer(object) {
      AliveObjectServer.__super__.constructor.call(this, [object]);
    }

    return AliveObjectServer;

  })(Module);

  Tower.SpawnTower.SpawnTowerBase = (function() {

    SpawnTowerBase.prototype.entityManager = null;

    SpawnTowerBase.prototype.spawnType = null;

    SpawnTowerBase.prototype.rateSpawnForm = null;

    SpawnTowerBase.prototype.spawnTarget = null;

    function SpawnTowerBase() {}

    SpawnTowerBase.prototype.ChangeTarget = function(target) {
      this.target = target;
    };

    SpawnTowerBase.prototype.Spawn = function() {};

    SpawnTowerBase.prototype.StartSpawn = function() {};

    SpawnTowerBase.prototype.StopSpawn = function() {};

    return SpawnTowerBase;

  })();

  Tower.schema = {
    __name__: 'Tower',
    _owner: {
      type: 'ObjectId',
      ref: 'Player'
    },
    _city: {
      type: 'ObjectId',
      ref: 'City'
    },
    name: String,
    level: Number,
    range: Number,
    pos: {
      x: Number,
      y: Number
    },
    posEnd: {
      x: Number,
      y: Number
    },
    underConstruct: Boolean,
    startTime: {
      type: Date
    },
    finishTime: {
      type: Date
    }
  };

  Tower.TowerServer = (function(_super) {

    __extends(TowerServer, _super);

    TowerServer.include(Tower.TowerBase);

    TowerServer.include(AliveObject.AliveObjectServer);

    TowerServer.include(DbManager.DbItem);

    TowerServer.prototype.state = null;

    TowerServer.prototype.attackTimer = null;

    TowerServer.prototype.getTargetTimer = null;

    function TowerServer() {
      var chunk,
        _this = this;
      TowerServer.__super__.constructor.call(this, [], [], []);
      this.owner = this.city.owner;
      chunk = this.owner.parent.map.GetChunk(this.pos);
      this.Attach(chunk);
      console.log("Attachement of " + this.name + ", chunk obs length = ", chunk.observators.length);
      chunk.Attach(this);
      console.log("Attached " + this.name + ", chunk obs length = ", chunk.observators.length);
      this.Notify(this.owner, function(socket, isOwner) {
        return _this.SendTo(socket, isOwner);
      });
      this.state = 'GetTarget';
      this.GetTarget();
    }

    TowerServer.prototype.destructor = function() {
      var obs, _i, _len, _ref,
        _this = this;
      this.Notify(this.owner, function(socket, isOwner) {
        return socket.emit('destroyedObject' + _this.id);
      });
      _ref = this.observators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        obs.Detach(this);
      }
      this.observators = [];
      this.socket.removeAllListeners('askLevelUp' + this.id);
      this.socket.removeAllListeners('askEvolve' + this.id);
      this.socket.removeAllListeners('updateTower' + this.id);
      this.socket.removeAllListeners('destroyedObject' + this.id);
      clearInterval(this.attackTimer);
      return clearInterval(this.getTargetTimer);
    };

    TowerServer.prototype.LevelUp = function() {
      var _this = this;
      if (!this.CanLevelUp()) {
        this.socket.emit('notification', {
          title: "Can't level up",
          message: "The building " + this.name + " can't be leveled up to " + (this.level + 1),
          persistance: false
        });
        return;
      }
      this.city.resources.Buy(this.GetPrice());
      this._super();
      this.socket.emit('levelUp' + this.id, this.Serialize());
      this.socket.emit('notification', {
        title: "Starting level up",
        message: "The building " + this.name + " has begun to level up to " + this.level,
        persistance: false
      });
      return setTimeout(function() {
        if (_this.socket != null) {
          _this.socket.emit('notification', {
            title: "Level up !",
            message: "The building " + _this.name + " has level up to " + _this.level + "!",
            persistance: false
          });
        }
        _this.underConstruct = false;
        _this.startTime = 0;
        _this.finishTime = 0;
        return _this.Notify(_this.owner, function(socket) {
          return _this.SendUpdateTo(socket);
        });
      }, this.GetPrice().time);
    };

    TowerServer.prototype.Evolve = function(className) {
      var evol,
        _this = this;
      console.log("Evolution");
      evol = this.GetEvol(className);
      if (evol != null) {
        if (this.CanEvolve(className)) {
          this.city.resources.Buy(evol.costForm(this.level));
          this._super(className);
          this.socket.emit('evolve' + this.id, this.Serialize());
          this.socket.emit('notification', {
            title: "Evolution",
            message: "The Tower \'" + this.name + "\' has started to evolve into \'" + className + "\' !",
            persistance: false
          });
          return setTimeout(function() {
            _this.underConstruct = false;
            _this.startTime = 0;
            _this.finishTime = 0;
            _this.name = className;
            return _this.SaveDb(function() {
              if (_this.socket != null) {
                _this.socket.emit('notification', {
                  title: "Evolution !",
                  message: "The Tower \'" + _this.name + "\' has finished to evolve into \'" + className + "\' !",
                  persistance: false
                });
              }
              return _this.city.buildingManager.Evolve(_this, {
                name: className,
                id: _this.id
              });
            });
          }, this.GetPrice(evol).time);
        } else {
          return this.socket.emit('notification', {
            title: 'Can\'t evolve',
            message: 'You cannot evolve \'' + this.name + '\' to \'' + className + '\'',
            persistance: false
          });
        }
      }
    };

    TowerServer.prototype.PropagSocket = function(socket) {
      var _this = this;
      this.socket = socket;
      this.socket.on('askLevelUp' + this.id, function() {
        return _this.LevelUp();
      });
      return this.socket.on('askEvolve' + this.id, function(className) {
        console.log("AskEvole received");
        return _this.Evolve(className.className);
      });
    };

    TowerServer.prototype.SendTo = function(socket, isOwner, isRec) {
      var command, serie;
      serie = this.Serialize();
      serie.own = isOwner;
      command = isOwner ? 'ownBuildingObject' + this.city.id : 'buildingObject' + this.city.id;
      socket.emit(command, serie);
      return console.log("Tower Send " + this.name + " own = " + isOwner + " id = " + this.id + " cityId = " + this.city.id);
    };

    TowerServer.prototype.SendUpdateTo = function(socket) {
      return socket.emit('updateTower' + this.id, this.Serialize());
    };

    TowerServer.prototype.PropagDisconnect = function() {
      this.socket.removeAllListeners('askLevelUp' + this.id);
      this.socket.removeAllListeners('askEvolve' + this.id);
      return this.socket = null;
    };

    TowerServer.prototype.ChangeState = function(state) {
      if (this.state !== state) {
        console.log('Changing state : ', state);
        this.state = state;
        if (this.target != null) {
          clearInterval(this.getTargetTimer);
          return this.Attack();
        } else {
          clearInterval(this.attackTimer);
          return this.GetTarget();
        }
      }
    };

    TowerServer.prototype.Attack = function() {
      var _this = this;
      return this.attackTimer = setInterval(function() {
        var bulletTimer, length;
        if (_this.target != null) {
          length = {
            x: Math.abs(_this.pos.x - _this.target.pos.x),
            y: Math.abs(_this.pos.y - _this.target.pos.y)
          };
        }
        console.log(length, _this.target.name, _this.fireRange);
        if (!(_this.target != null) || length.x > _this.fireRange || length.y > _this.fireRange || _this.target.life.amount <= 0) {
          _this.target = null;
          return _this.ChangeState('GetTarget');
        } else {
          return bulletTimer = setTimeout(function() {
            _this.target.HitBy(_this);
            return console.log("Attacking ", _this.target.name);
          }, 5);
        }
      }, 1);
    };

    TowerServer.prototype.GetTarget = function() {
      var _this = this;
      return this.getTargetTimer = setInterval(function() {
        var chunk, i, j, _i, _j, _ref, _ref1, _ref2, _ref3;
        chunk = _this.observators[0];
        for (i = _i = _ref = _this.pos.x - _this.fireRange, _ref1 = _this.posEnd.x + _this.fireRange; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
          for (j = _j = _ref2 = _this.pos.y - _this.fireRange, _ref3 = _this.posEnd.y + _this.fireRange; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; j = _ref2 <= _ref3 ? ++_j : --_j) {
            if (i === _this.pos.x - _this.fireRange || i === _this.posEnd.x + _this.fireRange || j === _this.pos.y - _this.fireRange || j === _this.posEnd.y + _this.fireRange) {
              _this.target = chunk.GetTakenPlace({
                x: i,
                y: j
              });
              if ((_this.target != null) && _this.target.id !== _this.id && _this.owner.id !== _this.target.owner.id) {
                console.log("Target = ", _this.target.name);
                _this.ChangeState('Attack');
                return;
              }
            }
          }
        }
      }, 1000);
    };

    return TowerServer;

  })(Module);

  ContextMenu.ContextLabel = (function() {

    ContextLabel.prototype.label = null;

    function ContextLabel() {
      this.label = null;
    }

    ContextLabel.prototype.Show = function(attachedObject, x, y) {
      var back;
      this.label = new Kinetic.Container();
      return back = new Kinetic.Rect({
        x: x,
        y: y,
        width: 250,
        height: 40,
        fill: '#777777',
        stroke: 'black',
        strokeWidth: 1
      });
    };

    ContextLabel.prototype.Hide = function() {};

    return ContextLabel;

  })();

  ContextMenu.ContextMenuBase = (function() {

    ContextMenuBase.prototype.menu = null;

    ContextMenuBase.prototype.label = null;

    ContextMenuBase.prototype.back = null;

    function ContextMenuBase() {}

    ContextMenuBase.prototype.Show = function(attachedObject, x, y) {
      this.Hide();
      this.menu = new Kinetic.Container();
      this.back = new Kinetic.Rect({
        x: x,
        y: y,
        width: 100,
        height: 100,
        fill: '#777777',
        stroke: 'black',
        strokeWidth: 1
      });
      this.menu.add(this.back);
      return hudContainer.add(this.menu);
    };

    ContextMenuBase.prototype.Hide = function() {
      hudContainer.removeChildren();
      return hudContainer.draw();
    };

    ContextMenuBase.prototype.DevelopMenu = function() {};

    return ContextMenuBase;

  })();

  Tower.SpawnTower.SpawnTowerServer = (function(_super) {

    __extends(SpawnTowerServer, _super);

    SpawnTowerServer.include(Tower.SpawnTower.SpawnTowerBase);

    SpawnTowerServer.include(Tower.TowerServer);

    SpawnTowerServer.prototype.path = null;

    SpawnTowerServer.prototype.spawnTimer = null;

    function SpawnTowerServer(spawnType) {
      this.spawnType = spawnType;
      SpawnTowerServer.__super__.constructor.call(this, [], []);
      this.entityManager = new EntityManager.EntityManagerServer(this);
    }

    SpawnTowerServer.prototype.ChangeTarget = function(target) {
      var city, player, tower;
      if (target != null) {
        if ((player = this.owner.parent.GetPlayerById(target.owner)) != null) {
          if ((city = player.cityManager.GetCityById(target.city)) != null) {
            if ((tower = city.buildingManager.GetTowerById(target.id)) != null) {
              if (this.spawnTarget !== tower) {
                this.spawnTarget = tower;
                this.CalcPath();
                this.socket.emit('changeTarget' + this.id, {
                  name: this.spawnTarget.name,
                  pos: this.spawnTarget.pos
                });
                return this.StartSpawn();
              }
            }
          }
        }
      }
    };

    SpawnTowerServer.prototype.CalcPath = function() {
      var currentPos, dir, path;
      path = [];
      currentPos = this.pos;
      while (!(currentPos.x === this.spawnTarget.pos.x && currentPos.y === this.spawnTarget.pos.y)) {
        dir = this.ChooseDirection(currentPos);
        if (!path.length || dir.dir !== path[path.length - 1].dir) {
          path.push(dir);
        } else if (path.length && path[path.length - 1].dir === dir.dir) {
          path[path.length - 1].pos = dir.pos;
        }
        currentPos = dir.pos;
      }
      return this.path = path;
    };

    SpawnTowerServer.prototype.ChooseDirection = function(currentPos) {
      var allDir, calcVector, chunk, len, shortest, tmpPos, _i, _len,
        _this = this;
      calcVector = function(pos) {
        return {
          xLength: Math.abs(_this.spawnTarget.pos.x - pos.x),
          yLength: Math.abs(_this.spawnTarget.pos.y - pos.y)
        };
      };
      chunk = this.city.owner.parent.map.GetChunk(currentPos);
      tmpPos = currentPos;
      allDir = [];
      allDir.push({
        dir: 'N',
        length: calcVector({
          x: tmpPos.x,
          y: tmpPos.y + 1
        }),
        pos: {
          x: tmpPos.x,
          y: tmpPos.y + 1
        }
      });
      allDir.push({
        dir: 'NE',
        length: calcVector({
          x: tmpPos.x + 1,
          y: tmpPos.y + 1
        }),
        pos: {
          x: tmpPos.x + 1,
          y: tmpPos.y + 1
        }
      });
      allDir.push({
        dir: 'E',
        length: calcVector({
          x: tmpPos.x + 1,
          y: tmpPos.y
        }),
        pos: {
          x: tmpPos.x + 1,
          y: tmpPos.y
        }
      });
      allDir.push({
        dir: 'SE',
        length: calcVector({
          x: tmpPos.x + 1,
          y: tmpPos.y - 1
        }),
        pos: {
          x: tmpPos.x + 1,
          y: tmpPos.y - 1
        }
      });
      allDir.push({
        dir: 'S',
        length: calcVector({
          x: tmpPos.x,
          y: tmpPos.y - 1
        }),
        pos: {
          x: tmpPos.x,
          y: tmpPos.y - 1
        }
      });
      allDir.push({
        dir: 'SO',
        length: calcVector({
          x: tmpPos.x - 1,
          y: tmpPos.y - 1
        }),
        pos: {
          x: tmpPos.x - 1,
          y: tmpPos.y - 1
        }
      });
      allDir.push({
        dir: 'O',
        length: calcVector({
          x: tmpPos.x - 1,
          y: tmpPos.y
        }),
        pos: {
          x: tmpPos.x - 1,
          y: tmpPos.y
        }
      });
      allDir.push({
        dir: 'NO',
        length: calcVector({
          x: tmpPos.x - 1,
          y: tmpPos.y + 1
        }),
        pos: {
          x: tmpPos.x - 1,
          y: tmpPos.y + 1
        }
      });
      shortest = allDir[0];
      for (_i = 0, _len = allDir.length; _i < _len; _i++) {
        len = allDir[_i];
        if (len.length.xLength <= shortest.length.xLength && len.length.yLength <= shortest.length.yLength) {
          shortest = len;
        }
      }
      return shortest;
    };

    SpawnTowerServer.prototype.Spawn = function() {
      return this.entityManager.NewEntity({
        pos: this.pos
      }, this.spawnType);
    };

    SpawnTowerServer.prototype.StartSpawn = function() {
      var _this = this;
      if (!(this.spawnTimer != null) && (this.spawnTarget != null)) {
        return this.spawnTimer = setInterval(function() {
          return _this.Spawn();
        }, this.rateSpawnForm(this.level));
      }
    };

    SpawnTowerServer.prototype.StopSpawn = function() {
      if (this.spawnTimer != null) {
        clearInterval(this.spawnTimer);
        return this.spawnTimer = null;
      }
    };

    SpawnTowerServer.prototype.PropagSocket = function(socket) {
      var _this = this;
      this._super(socket);
      this.socket.on('askChangeTarget' + this.id, function(target) {
        return _this.ChangeTarget(target);
      });
      this.socket.on('askStartSpawn' + this.id, function(target) {
        return _this.StartSpawn();
      });
      return this.socket.on('askStopSpawn' + this.id, function(target) {
        return _this.StopSpawn();
      });
    };

    SpawnTowerServer.prototype.PropagDisconnect = function() {
      this.entityManager.PropagDisconnect();
      return this._super();
    };

    return SpawnTowerServer;

  })(Module);

  ProgressBar.ProgressBar = (function() {

    ProgressBar.prototype.amountBar = null;

    ProgressBar.prototype.totalBar = null;

    ProgressBar.prototype.text = null;

    ProgressBar.prototype.pair = null;

    ProgressBar.prototype.image = null;

    ProgressBar.prototype.parent = null;

    ProgressBar.prototype.percent = null;

    ProgressBar.prototype.height = null;

    ProgressBar.prototype.width = null;

    ProgressBar.prototype.border = null;

    function ProgressBar(pair, parent, offset, color) {
      var group, pos;
      this.height = 15;
      this.width = 100;
      this.border = 3;
      this.pair = pair;
      this.percent = this.pair.amount / this.pair.total;
      pos = Map.MapClient.PosToIsoScreen(parent.pos);
      group = new Kinetic.Group();
      this.totalBar = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        fill: 'black'
      });
      this.amountBar = new Kinetic.Rect({
        x: 0 + this.border,
        y: 0 + this.border,
        width: (this.width - this.border * 2) * this.percent,
        height: this.height - this.border * 2,
        fill: color
      });
      this.text = new Kinetic.Text({
        x: 0 + this.border,
        y: 0 + this.border,
        fill: 'blue',
        text: '' + this.pair.amount + '/' + this.pair.total,
        width: this.width,
        fontSize: this.height - this.border * 2,
        fontFamily: 'Calibri',
        align: 'center'
      });
      group.add(this.totalBar);
      group.add(this.amountBar);
      group.add(this.text);
      this.image = group;
      this.image.setPosition(pos);
      this.image.setHeight(this.height);
      this.image.setWidth(this.width);
      hudContainer.add(this.image);
    }

    ProgressBar.prototype.Update = function(progress) {
      this.pair = progress;
      this.percent = this.pair.amount / this.pair.total;
      this.amountBar.setWidth(this.width * this.percent - this.border * 2);
      this.text.setText('' + this.pair.amount + '/' + this.pair.total);
      return hudContainer.draw();
    };

    ProgressBar.prototype.Hide = function() {
      this.image.hide();
      return hudContainer.draw();
    };

    ProgressBar.prototype.Show = function() {
      this.image.show();
      return hudContainer.draw();
    };

    return ProgressBar;

  })();

  ContextMenu.ContextMenuTower = (function() {
    var _instance;

    _instance = void 0;

    ContextMenuTower.prototype.menuContent = null;

    function ContextMenuTower() {
      var _this = this;
      this.menuContent = {
        selector: '#game',
        events: {
          show: function() {
            return stage.setDraggable(false);
          },
          hide: function() {
            return stage.setDraggable(true);
          }
        },
        items: {}
      };
    }

    ContextMenuTower.prototype.Show = function(content) {
      this.Hide();
      this.menuContent.items = content;
      return $.contextMenu(this.menuContent);
    };

    ContextMenuTower.prototype.Hide = function() {
      return $.contextMenu('destroy');
    };

    ContextMenuTower.prototype.ColorizePrice = function(name, price, city, colorName) {
      var color, left, res, time;
      res = '';
      color = colorName;
      res += "<p><font color='" + color + "'>" + name + "</font> (";
      color = (city.resources.iron < price.iron ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.iron + "</font> ";
      color = (city.resources.gold < price.gold ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.gold + "</font> ";
      color = (city.resources.cristal < price.cristal ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.cristal + "</font> ";
      color = (city.resources.uranium < price.uranium ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.uranium + "</font> ";
      color = (city.resources.petrol < price.petrol ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.petrol + "</font> ";
      color = (city.resources.energy < price.energy ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.energy + "</font> ";
      color = (city.resources.pop < price.pop ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.pop + "</font>) ";
      left = new Date(price.time);
      time = '';
      if (left.getDate() - 1) {
        time += left.getDate() - 1 + 'd ';
      }
      if (left.getHours - 1) {
        time += left.getHours() - 1 + 'h ';
      }
      if (left.getMinutes()) {
        time += left.getMinutes() + 'm';
      }
      time += left.getSeconds() + 's';
      res += time + " </p>";
      return res;
    };

    ContextMenuTower.get = function() {
      return _instance != null ? _instance : _instance = new this();
    };

    return ContextMenuTower;

  })();

  Stack.StackClient = (function(_super) {

    __extends(StackClient, _super);

    StackClient.prototype.stack = null;

    StackClient.prototype.height = null;

    StackClient.prototype.width = null;

    StackClient.prototype.border = null;

    StackClient.prototype.container = null;

    StackClient.prototype.background = null;

    StackClient.prototype.visibleNb = null;

    function StackClient(pos) {
      this.stack = [];
      this.border = 5;
      this.height = 0;
      this.width = 0;
      this.visibleNb = 0;
      this.container = new Kinetic.Container({
        x: pos.x,
        y: pos.y,
        height: this.height + 2 * this.border,
        width: this.width + 2 * this.border
      });
      this.background = new Kinetic.Rect({
        x: -this.border,
        y: -this.border,
        height: this.height + 2 * this.border,
        width: this.width + 2 * this.border,
        fill: 'black'
      });
      hudContainer.add(this.container);
      this.container.add(this.background);
      this.Hide();
    }

    StackClient.prototype.AddNode = function(node) {
      node.setX(0);
      node.setY(this.height);
      if (node.getWidth() > this.width) {
        this.width = node.getWidth();
      }
      this.height += node.getHeight();
      this.UpdateSize();
      this.stack.push({
        node: node,
        persistant: false,
        hidden: false
      });
      return this.container.add(node);
    };

    StackClient.prototype.UpdateSize = function() {
      this.container.setHeight(this.height + 2 * this.border);
      this.container.setWidth(this.width + 2 * this.border);
      this.background.setHeight(this.height + 2 * this.border);
      return this.background.setWidth(this.width + 2 * this.border);
    };

    StackClient.prototype.Reorganise = function() {
      var n, _i, _len, _ref;
      this.width = 0;
      this.height = 0;
      _ref = this.stack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (!n.hidden && n.node.isVisible()) {
          n.node.setPosition({
            x: 0,
            y: this.height
          });
          if (n.node.getWidth() > this.width) {
            this.width = n.node.getWidth();
          }
          this.height += n.node.getHeight();
        }
      }
      return this.UpdateSize();
    };

    StackClient.prototype.Hide = function() {
      var n, _i, _len, _ref;
      _ref = this.stack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (!n.persistant && !n.hidden) {
          this.HideNode(n.node);
          console.log("Hide :", n);
        }
      }
      console.log("end", this.visibleNb, this.stack);
      if (!this.visibleNb) {
        this.container.hide();
      }
      this.Reorganise();
      return hudContainer.draw();
    };

    StackClient.prototype.Show = function() {
      var n, _i, _len, _ref;
      _ref = this.stack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (!n.persistant && !n.hidden) {
          this.ShowNode(n.node);
        }
      }
      console.log("end", this.visibleNb, this.stack);
      this.Reorganise();
      this.container.show();
      return hudContainer.draw();
    };

    StackClient.prototype.HideNode = function(node) {
      var n;
      if (node != null) {
        n = this.GetNode(node);
        if (n != null) {
          node.hide();
          this.visibleNb--;
          this.Reorganise();
          if (!this.visibleNb) {
            this.container.hide();
            return hudContainer.draw();
          }
        }
      }
    };

    StackClient.prototype.ShowNode = function(node, persist) {
      var n;
      if (node != null) {
        n = this.GetNode(node);
        if (n != null) {
          node.show();
          this.visibleNb++;
          if (persist != null) {
            n.persistant = persist;
          }
          console.log("Show  ", n, persist);
          this.Reorganise();
          if (!this.container.isVisible()) {
            this.container.show();
            return hudContainer.draw();
          }
        }
      }
    };

    StackClient.prototype.GetNode = function(node) {
      var n, _i, _len, _ref;
      _ref = this.stack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (n.node === node) {
          return n;
        }
      }
      return null;
    };

    StackClient.prototype.SetPersistant = function(node, persist) {
      var n;
      n = this.GetNode(node);
      return n.persistant = persist;
    };

    StackClient.prototype.SetHidden = function(node, hidden) {
      var n;
      n = this.GetNode(node);
      return n.hidden = hidden;
    };

    return StackClient;

  })(Module);

  AliveObject.AliveObjectClient = (function(_super) {

    __extends(AliveObjectClient, _super);

    AliveObjectClient.include(AliveObject.AliveObjectBase);

    AliveObjectClient.prototype.image = null;

    AliveObjectClient.prototype.lifeBar = null;

    AliveObjectClient.prototype.nameText = null;

    function AliveObjectClient(object, image) {
      var pos,
        _this = this;
      AliveObjectClient.__super__.constructor.call(this, [object]);
      this.life.amount = 50;
      this.life.total = 50;
      this.lifeBar = new ProgressBar.ProgressBar(this.life, this, 0, 'red');
      pos = Map.MapClient.PosToIsoScreen(this.pos);
      this.image = new Kinetic.Image({
        image: image,
        x: pos.x,
        y: pos.y
      });
      if (this.type === 'Entity') {
        entityContainer.add(this.image);
        entityContainer.draw();
      } else {
        buildingsContainer.add(this.image);
        buildingsContainer.draw();
      }
      this.nameText = new Kinetic.Text({
        x: 0,
        y: 0,
        fill: 'blue',
        text: this.name,
        fontSize: 15,
        fontFamily: 'Calibri'
      });
      pos = {
        x: pos.x,
        y: pos.y - 50
      };
      this.huds = new Stack.StackClient(pos);
      this.huds.AddNode(this.nameText);
      this.huds.AddNode(this.lifeBar.image);
      this.image.on('mouseenter', function(e) {
        return _this.huds.Show();
      });
      this.image.on('mouseout', function(e) {
        return _this.huds.Hide();
      });
    }

    AliveObjectClient.prototype.UpdateLife = function() {
      var _this = this;
      this.lifeBar.Update(this.life);
      if (this.life.amount < this.life.total) {
        this.huds.Show();
        this.image.off('mouseenter');
        return this.image.off('mouseout');
      } else {
        this.image.on('mouseenter', function(e) {
          return _this.huds.Show();
        });
        return this.image.on('mouseout', function(e) {
          return _this.huds.Hide();
        });
      }
    };

    return AliveObjectClient;

  })(Module);

  Tower.TowerClient = (function(_super) {

    __extends(TowerClient, _super);

    TowerClient.include(Tower.TowerBase);

    TowerClient.include(AliveObject.AliveObjectClient);

    TowerClient.prototype.percent = 0;

    TowerClient.prototype.timeLeft = 0;

    TowerClient.prototype.progressBar = null;

    TowerClient.prototype.own = true;

    TowerClient.prototype.owner = null;

    TowerClient.prototype.menu = null;

    TowerClient.prototype.menuContent = null;

    TowerClient.prototype.huds = null;

    function TowerClient(city, tower, socket, image) {
      var update,
        _this = this;
      TowerClient.__super__.constructor.call(this, [city, tower], [tower, image]);
      if (socket != null) {
        this.socket = socket;
      }
      this.owner = this.city.parent.parent;
      if (this.own) {
        this.progressBar = new ProgressBar.ProgressBar({
          amount: this.percent,
          total: 100
        }, this, 1, 'yellow');
        this.huds.AddNode(this.progressBar.image);
        this.huds.SetHidden(this.progressBar.image, true);
        if (this.underConstruct) {
          this.huds.SetHidden(this.progressBar.image, false);
          this.huds.SetPersistant(this.progressBar.image, true);
          update = setInterval(function() {
            _this.UpdateConstruct();
            if (_this.finishTime < new Date()) {
              return clearInterval(update);
            }
          }, 1000);
        }
      }
      this.socket.on('levelUp' + this.id, function(tower) {
        return _this.LevelUp(tower);
      });
      this.socket.on('evolve' + this.id, function(tower) {
        return _this.Evolve(tower);
      });
      this.socket.on('updateTower' + this.id, function(tower) {
        return _this.Deserialize(tower);
      });
      this.socket.on('destroyedObject' + this.id, function() {
        return _this.city.buildingManager.DestroyTower(_this);
      });
      this.image.on('mousedown', function(e) {
        if (e.button === 2) {
          e.cancelBubble = true;
          return _this.ShowContextMenu();
        }
      });
    }

    TowerClient.prototype.destructor = function() {
      this.image.remove();
      return this.socket.removeListener('levelUp' + this.id);
    };

    TowerClient.prototype.ShowContextMenu = function() {
      var attackTowerMenu, callbackAttack, callbackEvol, callbackLevelUp, evol, evolveMenu, name, tower, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4,
        _this = this;
      this.menu = ContextMenu.ContextMenuTower.get();
      this.menuContent = {
        "actions": {
          "name": "<p>Actions Menu " + this.name + "</p>",
          "disabled": true
        },
        "separator": "--------"
      };
      if (this.own) {
        callbackLevelUp = function(key, options) {
          _this.AskLevelUp();
          stage.setDraggable(true);
          return _this.menu.Hide();
        };
        callbackEvol = function(key, options) {
          _this.AskEvolve(key);
          stage.setDraggable(true);
          return _this.menu.Hide();
        };
        if (this.MakeTechnoMenu != null) {
          this.MakeTechnoMenu();
        }
        this.menuContent["levelUp"] = {
          "name": this.ColorizePriceLevelUp("Level Up (" + (this.level + 1) + ")"),
          "disabled": !this.CanLevelUp(),
          "callback": callbackLevelUp
        };
        if (this.evolveList != null) {
          evolveMenu = {};
          _ref = this.evolveList;
          for (name in _ref) {
            evol = _ref[name];
            evolveMenu[name.toString()] = {
              "name": this.ColorizePriceEvolve(name),
              "disabled": !this.CanEvolve(),
              "callback": callbackEvol
            };
          }
          this.menuContent["evolve"] = {
            "name": "Evolve ->",
            "items": evolveMenu
          };
        }
      } else if (this.city.scope.currentCity != null) {
        callbackAttack = function(key, options) {
          var spawnTower;
          spawnTower = _this.city.scope.currentCity.buildingManager.GetTowerById(key);
          spawnTower.AskChangeTarget(_this);
          stage.setDraggable(true);
          return _this.menu.Hide();
        };
        attackTowerMenu = {};
        _ref1 = this.city.scope.currentCity.buildingManager.GetAllSpawnTowers();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          tower = _ref1[_i];
          attackTowerMenu[tower.id] = {
            "name": tower.name + " (Target: " + ((_ref2 = tower.target) != null ? _ref2.name : void 0) + " from city " + ((_ref3 = tower.target) != null ? (_ref4 = _ref3.city) != null ? _ref4.name : void 0 : void 0) + ")",
            "callback": callbackAttack
          };
        }
        if (this.city.scope.currentCity.buildingManager.GotSpawnTower()) {
          this.menuContent["attack"] = {
            "name": "Attack ->",
            "items": attackTowerMenu
          };
        }
      }
      return this.menu.Show(this.menuContent);
    };

    TowerClient.prototype.AskLevelUp = function() {
      return this.socket.emit('askLevelUp' + this.id);
    };

    TowerClient.prototype.AskEvolve = function(className) {
      return this.socket.emit('askEvolve' + this.id, {
        className: className
      });
    };

    TowerClient.prototype.LevelUp = function(tower) {
      this.Deserialize(tower);
      return this.Construct();
    };

    TowerClient.prototype.Evolve = function(tower) {
      this.Deserialize(tower);
      return this.Construct();
    };

    TowerClient.prototype.Construct = function() {
      var update,
        _this = this;
      this.startTime = new Date(this.startTime.getTime() - globalServerDelay);
      this.finishTime = new Date(this.finishTime.getTime() - globalServerDelay);
      this.huds.SetHidden(this.progressBar.image, false);
      this.huds.SetPersistant(this.progressBar.image, true);
      if (this.own) {
        return this.city.scope.$apply(function() {
          return _this.city.buildingManager.towersConstruct.push(_this);
        });
      } else {
        return update = setInterval(function() {
          _this.UpdateConstruct();
          if (_this.finishTime < new Date()) {
            return clearInterval(update);
          }
        }, 1000);
      }
    };

    TowerClient.prototype.UpdateConstruct = function() {
      var left, now, passed, total;
      now = new Date().getTime();
      total = this.finishTime.getTime() - this.startTime.getTime();
      passed = now - this.startTime.getTime();
      left = new Date(this.finishTime.getTime() - now);
      this.timeLeft = '';
      if (left.getDate() - 1) {
        this.timeLeft += left.getDate() - 1 + 'd ';
      }
      if (left.getHours - 1) {
        this.timeLeft += left.getHours() - 1 + 'h ';
      }
      if (left.getMinutes()) {
        this.timeLeft += left.getMinutes() + 'm';
      }
      this.timeLeft += left.getSeconds() + 's';
      this.percent = Math.floor((passed / total) * 100);
      return this.progressBar.Update({
        amount: this.percent,
        total: 100
      });
    };

    TowerClient.prototype.ColorizePriceEvolve = function(name) {
      var color, price;
      price = this.GetPrice(this.GetEvol(name));
      color = this.CanEvolve() ? '#080' : '#800';
      return this.menu.ColorizePrice(name, price, this.city, color);
    };

    TowerClient.prototype.ColorizePriceLevelUp = function(name) {
      var color, price;
      price = this.GetPrice();
      color = this.CanLevelUp() ? '#080' : '#800';
      return this.menu.ColorizePrice(name, price, this.city, color);
    };

    return TowerClient;

  })(Module);

  Tower.SpawnTower.SpawnTowerClient = (function(_super) {

    __extends(SpawnTowerClient, _super);

    SpawnTowerClient.include(Tower.SpawnTower.SpawnTowerBase);

    SpawnTowerClient.include(Tower.TowerClient);

    function SpawnTowerClient(city, soldierSpawner, socket, image) {
      SpawnTowerClient.__super__.constructor.call(this, [], [city, soldierSpawner, socket, image]);
    }

    return SpawnTowerClient;

  })(Module);

  Tower.DefenseTower.DefenseTowerBase = (function() {

    function DefenseTowerBase() {}

    return DefenseTowerBase;

  })();

  Tower.DefenseTower.DefenseTowerServer = (function(_super) {

    __extends(DefenseTowerServer, _super);

    DefenseTowerServer.include(Tower.DefenseTower.DefenseTowerBase);

    DefenseTowerServer.include(Tower.TowerServer);

    function DefenseTowerServer() {
      DefenseTowerServer.__super__.constructor.call(this, [], []);
    }

    return DefenseTowerServer;

  })(Module);

  Tower.DefenseTower.DefenseTowerClient = (function(_super) {

    __extends(DefenseTowerClient, _super);

    DefenseTowerClient.include(Tower.DefenseTower.DefenseTowerBase);

    DefenseTowerClient.include(Tower.TowerClient);

    function DefenseTowerClient(city, defenseTower, socket, image) {
      DefenseTowerClient.__super__.constructor.call(this, [], [city, defenseTower, socket, image]);
    }

    return DefenseTowerClient;

  })(Module);

  Tower.Building.BuildingBase = (function() {

    function BuildingBase() {}

    return BuildingBase;

  })();

  Tower.Building.BuildingServer = (function(_super) {

    __extends(BuildingServer, _super);

    BuildingServer.include(Tower.Building.BuildingBase);

    BuildingServer.include(Tower.TowerServer);

    function BuildingServer() {
      BuildingServer.__super__.constructor.call(this, [], []);
    }

    return BuildingServer;

  })(Module);

  Tower.Building.BuildingClient = (function(_super) {

    __extends(BuildingClient, _super);

    BuildingClient.include(Tower.TowerClient);

    BuildingClient.include(Tower.Building.BuildingBase);

    function BuildingClient(city, building, socket, image) {
      BuildingClient.__super__.constructor.call(this, [city, building, socket, image]);
    }

    return BuildingClient;

  })(Module);

  Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerBase = (function() {

    BaseDefenseTowerBase.costForm = function(level) {
      return {
        iron: 1 * Math.pow(1.5, level - 1),
        gold: 1 * Math.pow(1.5, level - 1),
        cristal: 0,
        uranium: 0,
        petrol: 0,
        energy: 0,
        pop: 0
      };
    };

    function BaseDefenseTowerBase() {
      var _this = this;
      this.costForm = function(level) {
        return Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerBase.costForm(level);
      };
    }

    return BaseDefenseTowerBase;

  }).call(this);

  Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase = (function() {
    var _this = this;

    BaseSpawnTowerBase.costForm = function(level) {
      return {
        iron: 1 * Math.pow(1.5, level - 1),
        gold: 1 * Math.pow(1.5, level - 1),
        cristal: 0,
        uranium: 0,
        petrol: 0,
        energy: 0,
        pop: 0
      };
    };

    BaseSpawnTowerBase.rateSpawnForm = function(level) {
      return 5000 - 100 * level;
    };

    function BaseSpawnTowerBase() {
      this.costForm = function(level) {
        return Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase.costForm(level);
      };
      this.rateSpawnForm = function(level) {
        return Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase.rateSpawnForm(level);
      };
    }

    return BaseSpawnTowerBase;

  }).call(this);

  Map.LevelGenerator = (function() {

    function LevelGenerator(table) {
      this._table = table || this.makeTable(255);
      this.octaves = 20;
      this.frequency = 0.01;
      this.persistence = 0.45;
    }

    LevelGenerator.prototype.random = function() {
      return Math.random();
    };

    LevelGenerator.prototype.makeTable = function(size) {
      var n, result, _i, _ref;
      result = [];
      for (n = _i = 0, _ref = size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; n = 0 <= _ref ? ++_i : --_i) {
        result[n] = this.random();
      }
      return result;
    };

    LevelGenerator.prototype.cosineInterpolate = function(a, b, t) {
      var c;
      c = (1 - Math.cos(t * Math.PI)) * 0.5;
      return (1 - c) * a + c * b;
    };

    LevelGenerator.prototype._randify = function(n) {
      return this._table[Math.floor(Math.abs(n) % this._table.length)];
    };

    LevelGenerator.prototype._noise = function(point) {
      var dimension, dimensions, value, _i, _ref;
      value = 0;
      dimensions = point.length;
      for (dimension = _i = 0, _ref = dimensions - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; dimension = 0 <= _ref ? ++_i : --_i) {
        value = this._randify(Math.floor(value * 85000) + point[dimension]);
      }
      return value;
    };

    LevelGenerator.prototype._smooth = function(point, dimension) {
      var a, b, fractional, integer, value;
      if (dimension < 0) {
        return this._noise(point);
      }
      value = point[dimension];
      integer = Math.floor(value);
      fractional = value - integer;
      point[dimension] = integer;
      a = this._smooth(point, dimension - 1);
      point[dimension] = integer + 1;
      b = this._smooth(point, dimension - 1);
      point[dimension] = value;
      return this.cosineInterpolate(a, b, fractional);
    };

    LevelGenerator.prototype._perlin = function(point) {
      var amplitude, copy, dimension, dimensions, frequency, i, limiter, octaves, persistence, t, value, _i, _j, _ref, _ref1;
      value = 0;
      amplitude = 1;
      octaves = this.octaves;
      frequency = this.frequency;
      persistence = this.persistence;
      copy = point.slice();
      dimensions = copy.length;
      for (i = _i = 0, _ref = octaves - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        t = i * 4096;
        for (dimension = _j = 0, _ref1 = dimensions - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; dimension = 0 <= _ref1 ? ++_j : --_j) {
          copy[dimension] = point[dimension] * frequency + t;
        }
        value += this._smooth(copy, dimensions - 1) * amplitude;
        amplitude *= persistence;
        frequency *= 2;
      }
      limiter = (1 - persistence) / (1 - amplitude);
      return value * limiter;
    };

    LevelGenerator.prototype._generate = function(start, size, callback, dimension) {
      var end, i, _i, _ref, _ref1;
      if (dimension < 0) {
        return callback(start, this._perlin(start));
      }
      end = start[dimension] + size[dimension];
      for (i = _i = _ref = start[dimension], _ref1 = end - 1; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
        this._generate(start, size, callback, dimension - 1);
        start[dimension]++;
      }
      start[dimension] -= size[dimension];
      return null;
    };

    LevelGenerator.prototype.generate = function(start, size, callback) {
      return this._generate(start, size, callback, start.length - 1);
    };

    return LevelGenerator;

  })();

  Log = (function() {

    function Log() {}

    Log.debug = 1;

    Log.log = function(message) {
      if (this.debug === 1) {
        return console.log(message);
      }
    };

    Log.error = function(message) {
      if (this.debug !== -1) {
        return console.log("ERROR: " + message);
      }
    };

    return Log;

  })();

  Map.Chunk.ChunkBase = (function() {

    ChunkBase.size = 16;

    ChunkBase.prototype.pos = null;

    ChunkBase.prototype.resources = null;

    function ChunkBase(chunk) {
      this.pos = {
        x: chunk.pos[0],
        y: chunk.pos[1]
      };
      this.resources = chunk.resources;
      this.size = 16;
    }

    ChunkBase.prototype.SendTo = function(socket) {
      return socket.emit('chunkObject', {
        size: this.size,
        pos: this.pos,
        resources: this.resources
      });
    };

    return ChunkBase;

  })();

  DbManager.DbManager = (function() {

    DbManager.prototype.mongoose = null;

    DbManager.prototype.ready = false;

    DbManager.prototype.ObjectId = null;

    DbManager.prototype.models = null;

    DbManager.prototype.schemas = null;

    DbManager.prototype.technoSchema = null;

    function DbManager() {
      var con,
        _this = this;
      this.models = [];
      this.schemas = [];
      this.mongoose = require('mongoose');
      con = this.mongoose.connect('mongodb://localhost:27017/tdadv', function(err) {
        if (err) {
          return handleError(err);
        }
        _this.mongoose.set('debug', true);
        Log.log("Connected to database");
        _this.mongoose.connection.on('error', function(err) {
          return console.error('MongoDB error: %s', err);
        });
        return _this.mongoose.connection.db.dropDatabase(function(err) {
          if (err) {
            return handleError(err);
          }
          _this.ObjectId = _this.mongoose.Schema.ObjectId;
          return _this.ready = true;
        });
      });
    }

    DbManager.prototype.InitModel = function(schema) {
      var k, mSchema, model, name, v;
      name = schema.__name__;
      if (!(this.models[name] != null)) {
        for (k in schema) {
          v = schema[k];
          if (k === '__name__') {
            delete schema[k];
          } else if ((k.type != null) && k.type === 'ObjectId' || k.type === ['ObjectId']) {
            if (k.type === 'ObjectId') {
              k.type = this.mongoose.Schema.ObjectId;
            }
            if (k.type === ['ObjectId']) {
              k.type = [this.mongoose.Schema.ObjectId];
            }
          }
        }
        mSchema = new this.mongoose.Schema(schema);
        model = this.mongoose.model(name, mSchema);
        this.models[name] = model;
        this.schemas[name] = mSchema;
        schema.__name__ = name;
        return model;
      }
      return null;
    };

    DbManager.prototype.addPlayerModel = function(data, pos, callback) {
      var newPlayer,
        _this = this;
      if (!(this.models['Player'] != null)) {
        this.InitModel(Player.schema);
      }
      newPlayer = new this.models['Player']({
        login: data.login,
        pass: data.pass,
        technos: []
      });
      return this.addCityModel(newPlayer, null, pos, function(newBase) {
        newPlayer.citys.push(newBase);
        return newPlayer.save(function(err) {
          if (err) {
            return handleError(err);
          }
          Log.log("DB : Player " + newPlayer.login + " is added to the database");
          return _this.addAllTechnos(newPlayer, null, function(techno, end) {
            newPlayer.technos.push(techno);
            return newPlayer.save(function(err) {
              console.log("TECHNO : ", techno);
              if (end != null) {
                if (callback != null) {
                  return callback(newPlayer);
                }
              }
            });
          });
        });
      });
    };

    DbManager.prototype.addCityModel = function(owner, data, pos, callback) {
      var isMain, name, newCity,
        _this = this;
      isMain = (data ? false : true);
      name = (data ? data.name : "MainCity");
      if (!(this.models['City'] != null)) {
        this.InitModel(City.schema);
      }
      newCity = new this.models['City']({
        _owner: owner,
        pos: pos,
        range: 8,
        isMain: isMain,
        name: name
      });
      this.addResourcesModel(newCity, function(newResources) {
        newCity.resources = newResources;
        return _this.addTerritoryModel(newCity, function(territory) {
          newCity.territory = territory;
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
      });
      return newCity;
    };

    DbManager.prototype.addResourcesModel = function(city, callback) {
      var newResources,
        _this = this;
      if (!(this.models['Resources'] != null)) {
        this.InitModel(Resources.schema);
      }
      newResources = new this.models['Resources']({
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

    DbManager.prototype.addTerritoryModel = function(city, callback) {
      var i, j, newTerritory, range, territory, _i, _j, _ref, _ref1, _ref2, _ref3,
        _this = this;
      if (!(this.models['Territory'] != null)) {
        this.InitModel(Territory.schema);
      }
      territory = [];
      range = 6;
      for (i = _i = _ref = city.pos.x - range, _ref1 = city.pos.x + range + 2; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
        for (j = _j = _ref2 = city.pos.y - range - 2, _ref3 = city.pos.y + range; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; j = _ref2 <= _ref3 ? ++_j : --_j) {
          territory.push({
            x: i,
            y: j
          });
        }
      }
      newTerritory = new this.models['Territory']({
        _owner: city._owner,
        _city: city,
        territory: territory
      });
      return newTerritory.save(function() {
        return callback(newTerritory);
      });
    };

    DbManager.prototype.addBuildingModel = function(owner, city, data, callback) {
      var name, newBuilding, pos, posEnd, underConstruct;
      name = (data ? data.name : "cityHall");
      underConstruct = (data ? data.underConstruct : false);
      pos = (data ? data.pos : city.pos);
      posEnd = (data ? data.posEnd : {
        x: city.pos.x + 3,
        y: city.pos.y + 3
      });
      if (!(this.models['Tower'] != null)) {
        this.InitModel(Tower.schema);
      }
      newBuilding = new this.models['Tower']({
        _owner: owner,
        _city: city,
        name: name,
        pos: {
          x: pos.x,
          y: pos.y
        },
        posEnd: posEnd,
        level: 1,
        fireRange: 1,
        fireRate: 1,
        underConstruct: underConstruct,
        startTime: 0,
        finishTime: 0
      });
      if (callback) {
        callback(newBuilding);
      }
      Log.log("DB : New Building " + newBuilding.name + " is added to the database");
      return newBuilding;
    };

    DbManager.prototype.addAllTechnos = function(owner, data, callback) {
      var name, obj, technos, _results,
        _this = this;
      technos = {
        defenseScience: {
          cost: [60, 15, 12, 0, 0],
          requiredBuilds: [
            {
              name: "laboratory",
              level: 1
            }
          ],
          requiredTechnos: []
        },
        spawnScience: {
          cost: [60, 15, 12, 0, 0],
          requiredBuilds: [
            {
              name: "laboratory",
              level: 5
            }
          ],
          requiredTechnos: []
        }
      };
      if (!(this.models['Techno'] != null)) {
        this.InitModel(Technology.schema);
      }
      _results = [];
      for (name in technos) {
        obj = technos[name];
        _results.push((function(name, obj) {
          var newTech;
          console.log("AAAAAAAAAAAAAAAAAA");
          console.log("AAAAAAAAAAAAAAAAAA");
          console.log("AAAAAAAAAAAAAAAAAA");
          console.log("AAAAAAAAAAAAAAAAAA");
          console.log("AAAAAAAAAAAAAAAAAA");
          console.log("AAAAAAAAAAAAAAAAAA");
          console.log(name, obj);
          newTech = new _this.models['Techno']({
            _owner: owner,
            name: name,
            level: 0,
            cost: obj.cost,
            requiredBuilds: obj.requiredBuilds,
            requiredTechnos: obj.requiredTechnos
          });
          return newTech.save(function() {
            var end;
            end = (name === 'spawnScience' ? true : null);
            return callback(newTech, end);
          });
        })(name, obj));
      }
      return _results;
    };

    DbManager.prototype.getTechnos = function(player) {};

    return DbManager;

  })();

  Map.Generator = (function() {

    Generator.prototype.level = null;

    function Generator() {
      this.level = new Map.LevelGenerator();
    }

    Generator.prototype.newChunk = function(pos) {
      var arr, funct;
      arr = [[]];
      funct = function(point, value) {
        var x, y;
        x = Math.abs(pos.x - point[0]);
        y = Math.abs(pos.y - point[1]);
        if (!(arr[x] != null)) {
          arr[x] = [];
        }
        return arr[x][y] = Math.floor(value * 100);
      };
      this.level.generate([pos.x, pos.y], [Map.Chunk.ChunkBase.size, Map.Chunk.ChunkBase.size], funct);
      return new Map.Chunk.ChunkServer({
        pos: [pos.x, pos.y],
        resources: arr
      });
    };

    return Generator;

  })();

  Social.Chat.ChatBase = (function() {

    ChatBase.prototype.channels = null;

    ChatBase.prototype["private"] = null;

    function ChatBase() {
      this.channels = [];
      this["private"] = [];
    }

    ChatBase.prototype.AddChannel = function(channel) {
      if (!this.ChannelExists(channel)) {
        return this.channels[channel.name] = channel;
      }
    };

    ChatBase.prototype.JoinChannel = function(channel) {
      if (!this.ChannelExists(channel)) {
        return this.AddChannel(channel);
      }
    };

    ChatBase.prototype.ChannelExists = function(channel) {
      if (this.channels[channel.name] != null) {
        return true;
      }
      return false;
    };

    return ChatBase;

  })();

  Map.MapBase = (function() {

    MapBase.prototype.chunks = null;

    function MapBase() {
      this.chunks = [[]];
    }

    MapBase.prototype.GetChunk = function(pos) {
      var realPos;
      realPos = {
        x: pos.x,
        y: pos.y
      };
      realPos.x = (pos.x - pos.x % Map.Chunk.ChunkBase.size).toString();
      realPos.y = (pos.y - pos.y % Map.Chunk.ChunkBase.size).toString();
      if (!(this.chunks[realPos.x] != null)) {
        this.chunks[realPos.x] = [];
      }
      return this.chunks[realPos.x][realPos.y];
    };

    MapBase.prototype.GetChunkNear = function(pos, range, callback) {
      var i, j, makeTablePos, _i, _len, _ref, _results;
      pos.x = pos.x - pos.x % Map.Chunk.ChunkBase.size;
      pos.y = pos.y - pos.y % Map.Chunk.ChunkBase.size;
      makeTablePos = function(range, pos) {
        var arr, i, _i;
        arr = [];
        for (i = _i = -range; -range <= range ? _i <= range : _i >= range; i = -range <= range ? ++_i : --_i) {
          arr.push(pos + Map.Chunk.ChunkBase.size * i);
        }
        return arr;
      };
      _ref = makeTablePos(range.x, pos.x);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = makeTablePos(range.y, pos.y);
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            j = _ref1[_j];
            _results1.push(callback(this.GetChunk({
              x: i,
              y: j
            }), {
              x: i,
              y: j
            }));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    MapBase.prototype.AddChunk = function(chunk) {
      if (!(this.chunks[chunk.pos.x.toString()] != null)) {
        this.chunks[chunk.pos.x.toString()] = [];
      }
      return this.chunks[chunk.pos.x.toString()][chunk.pos.y.toString()] = chunk;
    };

    MapBase.prototype.SendTo = function(socket) {
      return socket.emit('mapObject', {});
    };

    return MapBase;

  })();

  Map.Chunk.schema = {
    __name__: 'Chunk',
    pos: {
      type: [Number],
      index: '2d'
    },
    resources: [Number]
  };

  Map.Chunk.ChunkServer = (function(_super) {

    __extends(ChunkServer, _super);

    ChunkServer.include(Map.Chunk.ChunkBase);

    ChunkServer.include(DesignPattern.Observable);

    ChunkServer.include(DbManager.DbItem);

    ChunkServer.prototype.staticTakenPlaces = null;

    ChunkServer.prototype.mobileTakenPlaces = null;

    ChunkServer.prototype.parent = null;

    function ChunkServer(chunk, id) {
      ChunkServer.__super__.constructor.call(this, [chunk], [], [Map.Chunk.schema, id]);
      this.staticTakenPlaces = [];
      this.mobileTakenPlaces = [];
    }

    ChunkServer.prototype.GetObservatorByPos = function(pos) {
      var obs, _i, _len, _ref;
      _ref = this.observators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        if (obs.type !== 'Player' && obs.type !== 'City') {
          if (pos.x === obs.pos.x && pos.y === obs.pos.y) {
            return obs;
          }
        }
      }
      return null;
    };

    ChunkServer.prototype.GetTakenPlace = function(pos) {
      var mobile, stat, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.staticTakenPlaces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stat = _ref[_i];
        if (stat.pos.x === pos.x && stat.pos.y === pos.y) {
          return this.GetObservatorByPos(pos);
        }
      }
      _ref1 = this.mobileTakenPlaces;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        mobile = _ref1[_j];
        if (mobile.pos.x === pos.x && mobile.pos.y === pos.y) {
          return this.GetObservatorByPos(pos);
        }
      }
      return null;
    };

    ChunkServer.prototype.IsObservatorBySocket = function(socket) {
      var obs, _i, _len, _ref;
      _ref = this.observators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        if (obs.type === 'Player' && obs.socket === socket) {
          return true;
        }
      }
      return false;
    };

    ChunkServer.prototype.Attach = function(obs) {
      this._super(obs);
      if (obs.type === 'Tower') {
        return this.staticTakenPlaces.push({
          pos: obs.pos,
          posEnd: obs.posEnd
        });
      } else if (obs.type === 'Entity') {
        return this.mobileTakenPlaces.push(obs);
      }
    };

    ChunkServer.prototype.Detach = function(obs) {
      var i, pos, _ref, _ref1, _results, _results1;
      this._super(obs);
      if (obs.type === 'Tower') {
        _ref = this.staticTakenPlaces;
        _results = [];
        for (i in _ref) {
          pos = _ref[i];
          if (pos.pos === obs.pos) {
            delete this.staticTakenPlaces[i];
            _results.push(this.staticTakenPlaces.splice(i, 1));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else if (obs.type === 'Entity') {
        _ref1 = this.mobileTakenPlaces;
        _results1 = [];
        for (i in _ref1) {
          pos = _ref1[i];
          if (pos.pos === obs.pos) {
            delete this.mobileTakenPlaces[i];
            _results1.push(this.mobileTakenPlaces.splice(i, 1));
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }
    };

    ChunkServer.prototype.SendTo = function(socket, player) {
      var cityChunk, isOwner, obs, _i, _j, _len, _len1, _ref, _ref1, _results;
      this._super(socket);
      _ref = this.observators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        if (obs.type === 'City') {
          isOwner = false;
          if (obs.owner === player) {
            isOwner = true;
          }
          obs.SendTo(socket, isOwner);
        }
      }
      _ref1 = this.observators;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        obs = _ref1[_j];
        if (obs.type !== 'City' && obs.type !== 'Player') {
          if (obs.type === 'Tower') {
            cityChunk = this.parent.GetChunk(obs.city.pos);
            if (cityChunk !== this && !cityChunk.IsObservator(player)) {
              this.Attach(player);
              player.Attach(this);
              cityChunk.SendTo(socket, player);
            }
          }
          isOwner = false;
          if (obs.owner === player) {
            isOwner = true;
          }
          _results.push(obs.SendTo(socket, isOwner));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ChunkServer.prototype.Update = function(owner, cb) {
      var isOwner, obs, _i, _len, _ref, _results;
      _ref = this.observators;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        if (obs.type === 'Player') {
          isOwner = false;
          if ((owner != null) && obs === owner) {
            isOwner = true;
          }
          _results.push(cb(obs.socket, isOwner));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return ChunkServer;

  })(Module);

  Game.GameBase = (function() {

    GameBase.prototype.playerManager = null;

    function GameBase() {}

    return GameBase;

  })();

  Map.MapServer = (function(_super) {

    __extends(MapServer, _super);

    MapServer.include(Map.MapBase);

    MapServer.include(DbManager.DbCollection);

    MapServer.prototype.generator = null;

    function MapServer() {
      var _this = this;
      MapServer.__super__.constructor.call(this, [], [Map.Chunk.schema]);
      this.generator = new Map.Generator();
      this.GetAllDb(null, null, function(chunks) {
        return _this.FillChunks(chunks);
      });
    }

    MapServer.prototype.FillChunks = function(chunks) {
      var chunk, _i, _len, _results;
      Log.log("**** Loading Map ****");
      _results = [];
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        chunk = chunks[_i];
        Log.log("Load Chunk" + " (" + chunk.pos[0] + "x " + chunk.pos[1] + "y" + ") ");
        _results.push(this.AddChunk(new Map.Chunk.ChunkServer(chunk)));
      }
      return _results;
    };

    MapServer.prototype.GetChunk = function(pos) {
      var chunk, newChunk;
      if ((chunk = this._super(pos))) {
        return chunk;
      } else {
        newChunk = this.generator.newChunk({
          x: parseInt(pos.x),
          y: parseInt(pos.y)
        });
        this.AddChunk(newChunk);
        newChunk.parent = this;
        return newChunk;
      }
    };

    MapServer.prototype.GetNextNewPlayerPos = function(length) {
      var space;
      space = 2 * Map.Chunk.ChunkBase.size;
      return {
        x: space * length,
        y: 0
      };
    };

    return MapServer;

  })(Module);

  Technology.TechnologyBase = (function() {

    TechnologyBase.prototype.parent = null;

    TechnologyBase.prototype.name = null;

    TechnologyBase.prototype.level = null;

    TechnologyBase.prototype.requiredBuilds = null;

    TechnologyBase.prototype.requiredTechnos = null;

    TechnologyBase.prototype.cost = null;

    TechnologyBase.prototype.underConstruct = null;

    TechnologyBase.prototype.startTime = null;

    TechnologyBase.prototype.finishTime = null;

    function TechnologyBase(techno) {
      if (techno != null) {
        this.Deserialize(techno);
      }
    }

    TechnologyBase.prototype.Deserialize = function(techno) {
      var _this = this;
      if (techno.id != null) {
        this.id = techno.id;
      }
      if (techno.name != null) {
        this.name = techno.name;
      }
      if (techno.level != null) {
        this.level = techno.level;
      }
      if (techno.cost != null) {
        this.costForm = function(level) {
          return {
            iron: techno.cost[0] * Math.pow(1.5, level - 1),
            gold: techno.cost[1] * Math.pow(1.5, level - 1),
            cristal: techno.cost[2],
            uranium: techno.cost[3],
            petrol: techno.cost[4],
            energy: 0,
            pop: 0
          };
        };
      }
      if (techno.underConstruct != null) {
        this.underConstruct = techno.underConstruct;
      }
      if (techno.startTime != null) {
        this.startTime = new Date(techno.startTime);
      }
      if (techno.finishTime != null) {
        return this.finishTime = new Date(techno.finishTime);
      }
    };

    TechnologyBase.prototype.Serialize = function() {
      return {
        id: this.id,
        name: this.name,
        level: this.level,
        cost: this.cost,
        requiredBuilds: this.requiredBuilds,
        requiredTechnos: this.requiredTechnos,
        underConstruct: this.underConstruct,
        startTime: this.startTime,
        finishTime: this.finishTime
      };
    };

    TechnologyBase.prototype.GetPrice = function() {
      var price;
      if (this.costForm != null) {
        price = this.costForm(this.level + 1);
        price.time = Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000;
        return price;
      }
      return null;
    };

    TechnologyBase.prototype.CanLevelUp = function(city) {
      var price;
      price = this.GetPrice();
      city.resources.UpdateResources();
      if ((price != null) && this.underConstruct || price.iron > city.resources.iron || price.gold > city.resources.gold || price.cristal > city.resources.cristal || price.uranium > city.resources.uranium || price.petrol > city.resources.petrol || price.energy > city.resources.energy || price.pop > city.resources.pop) {
        return false;
      } else {
        return true;
      }
    };

    TechnologyBase.prototype.LevelUp = function() {
      this.underConstruct = true;
      this.level++;
      this.startTime = new Date().getTime();
      return this.finishTime = this.startTime + this.GetPrice().time;
    };

    return TechnologyBase;

  })();

  Singleton = (function() {
    var _instance;

    function Singleton() {}

    _instance = void 0;

    Singleton.get = function(classType, args) {
      return _instance != null ? _instance : _instance = new classType(args);
    };

    return Singleton;

  })();

  Social.Chat.ChatServer = (function(_super) {

    __extends(ChatServer, _super);

    ChatServer.prototype.sockets = null;

    function ChatServer(sockets) {
      ChatServer.__super__.constructor.call(this);
      this.sockets = sockets;
    }

    ChatServer.prototype.JoinChannel = function(player, channel) {
      var _ref;
      if (!this.ChannelExists(channel)) {
        this.AddChannel(channel);
      }
      return (_ref = this.channels[channel.name]) != null ? _ref.AddPeople(player) : void 0;
    };

    ChatServer.prototype.AddChannel = function(channel) {
      return ChatServer.__super__.AddChannel.call(this, new Social.Channel.ChannelServer(channel, this.sockets));
    };

    ChatServer.prototype.AddMessage = function(message) {
      return this.channels[message.channel].AddMessage(message);
    };

    return ChatServer;

  })(Social.Chat.ChatBase);

  TechnologyManager.TechnologyManagerBase = (function() {

    TechnologyManagerBase.prototype.technos = null;

    TechnologyManagerBase.prototype.socket = null;

    TechnologyManagerBase.prototype.owner = null;

    function TechnologyManagerBase() {
      this.technos = {};
    }

    TechnologyManagerBase.prototype.AddTechno = function(techno) {
      return this.technos[techno.name] = techno;
    };

    TechnologyManagerBase.prototype.GetTechno = function(name) {
      return this.technos[name];
    };

    return TechnologyManagerBase;

  })();

  Technology.schema = {
    __name__: 'Techno',
    _owner: {
      type: 'ObjectId',
      ref: 'Player'
    },
    name: String,
    level: Number,
    cost: [Number],
    requiredBuilds: [
      {
        name: String,
        level: Number
      }
    ],
    requiredTechnos: [
      {
        name: String,
        level: Number
      }
    ],
    underConstruct: Boolean,
    startTime: {
      type: Date
    },
    finishTime: {
      type: Date
    }
  };

  Technology.TechnologyServer = (function(_super) {

    __extends(TechnologyServer, _super);

    TechnologyServer.include(Technology.TechnologyBase);

    TechnologyServer.include(DbManager.DbItem);

    function TechnologyServer(parent, id, callback) {
      var _this = this;
      this.parent = parent;
      this.id = id;
      TechnologyServer.__super__.constructor.call(this, [], [
        Technology.schema, this.id, function() {
          _this.Deserialize(_this);
          if (callback != null) {
            return callback();
          }
        }
      ]);
    }

    TechnologyServer.prototype.PropagSocket = function(socket) {
      var _this = this;
      this.socket = socket;
      this.SendTo(this.socket);
      this.socket.on('updateTechno' + this.id, function(techno) {
        return _this.Deserialize(techno);
      });
      return this.socket.on('askLevelUpTechno' + this.id, function() {
        return _this.LevelUp();
      });
    };

    TechnologyServer.prototype.LevelUp = function() {
      var city,
        _this = this;
      city = this.parent.parent.currentCity;
      if (!this.CanLevelUp(city)) {
        this.socket.emit('notification', {
          title: "Can't level up",
          message: "The techno " + this.name + " can't be leveled up to " + (this.level + 1),
          persistance: false
        });
        return;
      }
      city.resources.Buy(this.GetPrice());
      this._super();
      this.socket.emit('levelUpTechno' + this.id, this.Serialize());
      this.socket.emit('notification', {
        title: "Starting level up techno",
        message: "The techno " + this.name + " has begun to level up to " + this.level,
        persistance: false
      });
      return setTimeout(function() {
        if (_this.socket != null) {
          _this.socket.emit('notification', {
            title: "Level up !",
            message: "The techno " + _this.name + " has level up to " + _this.level + "!",
            persistance: false
          });
        }
        _this.underConstruct = false;
        _this.startTime = 0;
        _this.finishTime = 0;
        return _this.SendUpdateTo(_this.socket);
      }, this.GetPrice().time);
    };

    TechnologyServer.prototype.SendTo = function(socket) {
      return socket.emit('technology' + this.parent.parent.owner.id, this.Serialize());
    };

    TechnologyServer.prototype.SendUpdateTo = function(socket) {
      return socket.emit('updateTechnology' + this.id, this.Serialize());
    };

    return TechnologyServer;

  })(Module);

  Territory.TerritoryBase = (function() {

    TerritoryBase.prototype.id = null;

    TerritoryBase.prototype.city = null;

    TerritoryBase.prototype.owner = null;

    TerritoryBase.prototype.territory = null;

    TerritoryBase.prototype.socket = null;

    function TerritoryBase(territory) {
      this.territory = [];
      if (this.city != null) {
        this.owner = this.city.parent.parent;
      }
      if (territory != null) {
        this.Deserialize(territory);
      }
    }

    TerritoryBase.prototype.Serialize = function() {
      return {
        territory: this.territory
      };
    };

    TerritoryBase.prototype.Deserialize = function(territory) {
      this.id = territory.id;
      return this.territory = territory.territory;
    };

    TerritoryBase.prototype.IsInTerritory = function(pos) {
      var ter, _i, _len, _ref;
      _ref = this.territory;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ter = _ref[_i];
        if (ter.x === pos.x && ter.y === pos.y) {
          return true;
        }
      }
      return false;
    };

    return TerritoryBase;

  })();

  TowerManager.TowerManagerBase = (function() {

    TowerManagerBase.prototype.towers = null;

    TowerManagerBase.prototype.city = null;

    TowerManagerBase.prototype.towersConstruct = null;

    function TowerManagerBase(city) {
      this.towers = [];
      this.towersConstruct = [];
      if (city != null) {
        this.city = city;
      }
    }

    TowerManagerBase.prototype.GetTower = function(name) {
      var tower, _i, _len, _ref;
      _ref = this.towers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tower = _ref[_i];
        if (tower.name === name) {
          return tower;
        }
      }
      return null;
    };

    TowerManagerBase.prototype.GetTowerById = function(id) {
      var tower, _i, _len, _ref;
      _ref = this.towers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tower = _ref[_i];
        if (tower.id === id) {
          return tower;
        }
      }
      return null;
    };

    TowerManagerBase.prototype.GetAllTowerByName = function(name) {
      var res, tower, _i, _len, _ref;
      res = [];
      _ref = this.towers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tower = _ref[_i];
        if (tower.name === name) {
          res.push(tower);
        }
      }
      return res;
    };

    TowerManagerBase.prototype.AddTower = function(tower) {
      if (tower != null) {
        if (tower.underConstruct) {
          this.towersConstruct.push(tower);
        }
        this.towers.push(tower);
      }
      return tower;
    };

    TowerManagerBase.prototype.DeleteTower = function(tower) {
      var i, tow, _i, _len, _ref, _results;
      if (tower != null) {
        _ref = this.towers;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          tow = _ref[i];
          if (tower === tow) {
            _results.push(this.towers.splice(i, 1));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    return TowerManagerBase;

  })();

  TechnologyManager.TechnologyManagerServer = (function(_super) {

    __extends(TechnologyManagerServer, _super);

    TechnologyManagerServer.include(TechnologyManager.TechnologyManagerBase);

    TechnologyManagerServer.include(DbManager.DbCollection);

    function TechnologyManagerServer(parent, callback) {
      var _this = this;
      this.parent = parent;
      TechnologyManagerServer.__super__.constructor.call(this, [], [Technology.schema]);
      this.GetAllDb('_owner', this.parent.parent.id, function(technos) {
        var techno, _fn, _i, _len;
        _fn = function(techno) {
          var t;
          return t = new Technology.TechnologyServer(_this, techno.id, function() {
            return _this.AddTechno(t);
          });
        };
        for (_i = 0, _len = technos.length; _i < _len; _i++) {
          techno = technos[_i];
          _fn(techno);
        }
        if (callback != null) {
          return callback();
        }
      });
    }

    TechnologyManagerServer.prototype.PropagSocket = function(socket) {
      var name, techno, _ref, _results;
      this.socket = socket;
      console.log(this.technos);
      _ref = this.technos;
      _results = [];
      for (name in _ref) {
        techno = _ref[name];
        console.log(techno);
        _results.push(techno.PropagSocket(this.socket));
      }
      return _results;
    };

    return TechnologyManagerServer;

  })(Module);

  TowerManager.BuildingManager.BuildingManagerBase = (function() {

    function BuildingManagerBase() {}

    BuildingManagerBase.prototype.GetPriceOf = function(building, level) {
      var price;
      price = (function() {
        switch (building) {
          case 'ironMine':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'goldMine':
            return {
              iron: 48 * Math.pow(1.6, level - 1),
              gold: 24 * Math.pow(1.6, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'cristalMine':
            return {
              iron: 225 * Math.pow(1.5, level - 1),
              gold: 75 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'uraniumMine':
            return {
              iron: 527 * Math.pow(1.8, level - 1),
              gold: 480 * Math.pow(1.8, level - 1),
              cristal: 240 * Math.pow(1.8, level - 1),
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'petrolMine':
            return {
              iron: 0,
              gold: 0,
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'solarMine':
            return {
              iron: 75 * Math.pow(1.5, level - 1),
              gold: 30 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'architectOffice':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'baseTower':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'baseDefenseTower':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'soldierSpawnerTower':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'laboratory':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          default:
            return {
              iron: 1,
              gold: 1,
              cristal: 1,
              uranium: 1,
              petrol: 1,
              energy: 1,
              pop: 1
            };
        }
      })();
      price.time = Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000;
      return price;
    };

    BuildingManagerBase.prototype.CanBuy = function(building, level) {
      var price;
      price = this.GetPriceOf(building, level);
      if (price.iron > this.city.resources.iron || price.gold > this.city.resources.gold || price.cristal > this.city.resources.cristal || price.uranium > this.city.resources.uranium || price.petrol > this.city.resources.petrol || price.energy > this.city.resources.energy || price.pop > this.city.resources.pop) {
        return false;
      } else {
        return true;
      }
    };

    BuildingManagerBase.prototype.GetAllSpawnTowers = function() {
      var res, tow, _i, _len, _ref;
      res = [];
      _ref = this.towers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tow = _ref[_i];
        if (this.IsSpawnTower(tow.name)) {
          res.push(tow);
        }
      }
      return res;
    };

    BuildingManagerBase.prototype.GotSpawnTower = function() {
      var tow, _i, _len, _ref;
      _ref = this.towers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tow = _ref[_i];
        if (this.IsSpawnTower(tow.name)) {
          return true;
        }
      }
      return false;
    };

    BuildingManagerBase.prototype.IsSpawnTower = function(name) {
      switch (name) {
        case 'baseSpawnTower':
          return true;
        default:
          return false;
      }
    };

    return BuildingManagerBase;

  })();

  TowerManager.TowerManagerServer = (function(_super) {

    __extends(TowerManagerServer, _super);

    TowerManagerServer.include(TowerManager.TowerManagerBase);

    function TowerManagerServer(city) {
      TowerManagerServer.__super__.constructor.call(this, [city]);
    }

    return TowerManagerServer;

  })(Module);

  Territory.schema = {
    __name__: 'Territory',
    _owner: {
      type: 'ObjectId',
      ref: 'Player'
    },
    _city: {
      type: 'ObjectId',
      ref: 'City'
    },
    territory: [
      {
        x: Number,
        y: Number
      }
    ]
  };

  Territory.TerritoryServer = (function(_super) {

    __extends(TerritoryServer, _super);

    TerritoryServer.include(Territory.TerritoryBase);

    TerritoryServer.include(DbManager.DbItem);

    function TerritoryServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      TerritoryServer.__super__.constructor.call(this, [], [
        Territory.schema, this.id, function() {
          var i, newTer, ter, _i, _len, _ref;
          newTer = [];
          _ref = _this.territory;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            ter = _ref[i];
            newTer.push({
              x: ter.x,
              y: ter.y
            });
          }
          _this.territory = newTer;
          return cb();
        }
      ]);
    }

    TerritoryServer.prototype.AddTerritory = function(tower) {
      var i, j, xLength, yLength, _i, _j, _ref, _ref1, _ref2, _ref3;
      xLength = tower.posEnd.x - tower.pos.x;
      yLength = tower.posEnd.y - tower.pos.y;
      for (i = _i = _ref = tower.pos.x - 4, _ref1 = tower.posEnd.x + 5; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
        for (j = _j = _ref2 = tower.pos.y - 4 - (yLength - 1), _ref3 = tower.posEnd.y + 5 - (yLength - 1); _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; j = _ref2 <= _ref3 ? ++_j : --_j) {
          if (!this.IsInTerritory({
            x: i,
            y: j
          })) {
            this.territory.push({
              x: i,
              y: j
            });
          }
        }
      }
      return this.SendTo(this.socket);
    };

    TerritoryServer.prototype.SendTo = function(socket) {
      return socket.emit('territory' + this.city.id, this.Serialize());
    };

    TerritoryServer.prototype.PropagSocket = function(socket) {
      var _this = this;
      if (!(this.socket != null)) {
        this.socket = socket;
        this.socket.on('territory' + this.city.id, function() {
          return _this.SendTo(_this.socket);
        });
        return this.SendTo(this.socket);
      }
    };

    return TerritoryServer;

  })(Module);

  Resources.ResourcesBase = (function() {

    ResourcesBase.prototype.id = null;

    ResourcesBase.prototype.city = null;

    ResourcesBase.prototype.iron = null;

    ResourcesBase.prototype.gold = null;

    ResourcesBase.prototype.cristal = null;

    ResourcesBase.prototype.uranium = null;

    ResourcesBase.prototype.petrol = null;

    ResourcesBase.prototype.energy = null;

    ResourcesBase.prototype.socket = null;

    function ResourcesBase() {}

    ResourcesBase.prototype.Serialize = function() {
      return {
        _id: this.id,
        iron: Math.floor(this.iron),
        gold: Math.floor(this.gold),
        cristal: Math.floor(this.cristal),
        uranium: Math.floor(this.uranium),
        petrol: Math.floor(this.petrol),
        energy: this.energy,
        pop: this.pop
      };
    };

    ResourcesBase.prototype.Deserialize = function(resources) {
      if ((resources != null)) {
        this.id = this.city.id;
        this.iron = resources.iron;
        this.gold = resources.gold;
        this.cristal = resources.cristal;
        this.uranium = resources.uranium;
        this.petrol = resources.petrol;
        this.energy = resources.energy;
        return this.pop = resources.pop;
      }
    };

    return ResourcesBase;

  })();

  TowerManager.BuildingManager.BuildingManagerServer = (function(_super) {

    __extends(BuildingManagerServer, _super);

    BuildingManagerServer.include(TowerManager.BuildingManager.BuildingManagerBase);

    BuildingManagerServer.include(TowerManager.TowerManagerServer);

    BuildingManagerServer.include(DbManager.DbCollection);

    BuildingManagerServer.prototype.socket = null;

    function BuildingManagerServer(city, callback) {
      var loaded,
        _this = this;
      BuildingManagerServer.__super__.constructor.call(this, [], [city], [Tower.schema]);
      this.dbManager = Singleton.get(DbManager.DbManager);
      loaded = 0;
      this.GetAllDb('_city', this.city.id, function(buildings) {
        return _this.FillBuildings(buildings, function() {
          if (++loaded === buildings.length) {
            if (callback != null) {
              return callback();
            }
          }
        });
      });
    }

    BuildingManagerServer.prototype.FillBuildings = function(buildings, callback) {
      var building, i, _i, _len, _results;
      i = 1;
      _results = [];
      for (_i = 0, _len = buildings.length; _i < _len; _i++) {
        building = buildings[_i];
        this.AddTower(building, callback);
        _results.push(Log.log("Load |---- Building" + " (" + i++ + ") " + building.name));
      }
      return _results;
    };

    BuildingManagerServer.prototype.NewBuilding = function(building, socket, cb) {
      var build, now, posEnd,
        _this = this;
      if (this.CanBuy(building.name, building.level)) {
        posEnd = {
          x: 1,
          y: 1
        };
        if (building.name === 'cityHall') {
          posEnd = {
            x: 3,
            y: 3
          };
        }
        if (building.name === 'laboratory') {
          posEnd = {
            x: 2,
            y: 2
          };
        }
        now = new Date();
        build = {
          _owner: this.city.item._owner,
          _city: this.city.id,
          name: building.name,
          level: 0,
          fireRange: 3,
          fireRate: 1,
          pos: {
            x: Math.floor(building.pos.x),
            y: Math.floor(building.pos.y)
          },
          posEnd: {
            x: Math.floor(building.pos.x) + posEnd.x,
            y: Math.floor(building.pos.y) + posEnd.y
          },
          startTime: now,
          finishTime: new Date(now.getTime() + this.GetPriceOf(building.name, 1).time),
          underConstruct: false
        };
        return this.NewDb(build, function(building) {
          var newBuild;
          return newBuild = _this.AddTower(building, function() {
            newBuild.LevelUp();
            if (cb != null) {
              return cb(building);
            }
          });
        });
      } else {
        return socket.emit('error', {
          error: "Lol"
        });
      }
    };

    BuildingManagerServer.prototype.AddTower = function(build, cb) {
      var tower;
      tower = null;
      switch (build.name) {
        case 'cityHall':
          tower = new Tower.Building.CityHall.CityHallServer(this.city, build.id, cb);
          break;
        case 'architectOffice':
          tower = new Tower.Building.ArchitectOffice.ArchitectOfficeServer(this.city, build.id, cb);
          break;
        case 'laboratory':
          tower = new Tower.Building.Laboratory.LaboratoryServer(this.city, build.id, cb);
          break;
        case 'ironMine':
          tower = new Tower.Building.IronMine.IronMineServer(this.city, build.id, cb);
          break;
        case 'goldMine':
          tower = new Tower.Building.GoldMine.GoldMineServer(this.city, build.id, cb);
          break;
        case 'cristalMine':
          tower = new Tower.Building.CristalMine.CristalMineServer(this.city, build.id, cb);
          break;
        case 'uraniumMine':
          tower = new Tower.Building.UraniumMine.UraniumMineServer(this.city, build.id, cb);
          break;
        case 'petrolMine':
          tower = new Tower.Building.PetrolMine.PetrolMineServer(this.city, build.id, cb);
          break;
        case 'solarCentral':
          tower = new Tower.Building.SolarCentral.SolarCentralServer(this.city, build.id, cb);
          break;
        case 'baseTower':
          tower = new Tower.BaseTower.BaseTowerServer(this.city, build.id, cb);
          break;
        case 'baseSpawnTower':
          tower = new Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerServer(this.city, build.id, cb);
          break;
        case 'baseDefenseTower':
          tower = new Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerServer(this.city, build.id, cb);
      }
      if (this.city.socket != null) {
        tower.PropagSocket(this.city.socket);
      }
      return this._super(tower);
    };

    BuildingManagerServer.prototype.Evolve = function(actual, next) {
      var evoluatedTower;
      this.DeleteTower(actual);
      actual.destructor();
      return evoluatedTower = this.AddTower(next);
    };

    BuildingManagerServer.prototype.PropagDisconnect = function() {
      var tower, _i, _len, _ref, _results;
      _ref = this.towers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tower = _ref[_i];
        _results.push(tower.PropagDisconnect());
      }
      return _results;
    };

    return BuildingManagerServer;

  })(Module);

  City.CityBase = (function() {

    CityBase.prototype.parent = null;

    CityBase.prototype.id = null;

    CityBase.prototype.name = null;

    CityBase.prototype.type = null;

    CityBase.prototype.pos = null;

    CityBase.prototype.range = null;

    CityBase.prototype.isMain = null;

    CityBase.prototype.buildingManager = null;

    CityBase.prototype.defTowerManager = null;

    CityBase.prototype.spawnTowerManager = null;

    CityBase.prototype.resources = null;

    CityBase.prototype.territory = null;

    function CityBase(city, resources) {
      this.Deserialize(city);
      this.type = 'City';
    }

    CityBase.prototype.Serialize = function() {
      return {
        id: this.id,
        name: this.name,
        pos: this.pos,
        range: this.range,
        isMain: this.isMain
      };
    };

    CityBase.prototype.Deserialize = function(city) {
      if (city != null) {
        this.id = city.id;
        this.name = city.name;
        this.pos = city.pos;
        this.range = city.range;
        return this.isMain = city.isMain;
      }
    };

    return CityBase;

  })();

  Resources.schema = {
    __name__: 'Resources',
    _owner: {
      type: 'ObjectId',
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
  };

  Resources.ResourcesServer = (function(_super) {

    __extends(ResourcesServer, _super);

    ResourcesServer.include(Resources.ResourcesBase);

    ResourcesServer.include(DbManager.DbItem);

    ResourcesServer.prototype.lastUpdate = null;

    function ResourcesServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      ResourcesServer.__super__.constructor.call(this, [], [
        Resources.schema, this.id, function() {
          _this.lastUpdate = new Date(_this.item.lastUpdate);
          if (cb != null) {
            return cb();
          }
        }
      ]);
    }

    ResourcesServer.prototype.Send = function() {
      this.UpdateResources();
      return this.socket.emit('updateResources' + this.city.id, this.Serialize());
    };

    ResourcesServer.prototype.UpdateResources = function() {
      var cristalMine, cristalMineLevel, cristalMines, goldMine, goldMineLevel, goldMines, ironMine, ironMineLevel, ironMines, now, petrolMine, petrolMineLevel, petrolMines, time, uraniumMine, uraniumMineLevel, uraniumMines, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _results;
      now = new Date;
      time = now.getTime() - this.lastUpdate.getTime();
      this.lastUpdate = now;
      ironMines = this.city.buildingManager.GetAllTowerByName('ironMine');
      goldMines = this.city.buildingManager.GetAllTowerByName('goldMine');
      cristalMines = this.city.buildingManager.GetAllTowerByName('cristalMine');
      uraniumMines = this.city.buildingManager.GetAllTowerByName('uraniumMine');
      petrolMines = this.city.buildingManager.GetAllTowerByName('petrolMine');
      for (_i = 0, _len = ironMines.length; _i < _len; _i++) {
        ironMine = ironMines[_i];
        if (!(ironMineLevel = ironMine.level)) {
          ironMineLevel = 0;
        }
        this.iron = this.iron + (((30 + 30 * ironMineLevel * (Math.pow(1.1, ironMineLevel))) / 3600) * (time / 1000));
      }
      for (_j = 0, _len1 = goldMines.length; _j < _len1; _j++) {
        goldMine = goldMines[_j];
        if (!(goldMineLevel = goldMine.level)) {
          goldMineLevel = 0;
        }
        this.gold = this.gold + (((20 + 20 * goldMineLevel * (Math.pow(1.1, goldMineLevel))) / 3600) * (time / 1000));
      }
      for (_k = 0, _len2 = cristalMines.length; _k < _len2; _k++) {
        cristalMine = cristalMines[_k];
        if (!(cristalMineLevel = cristalMine.level)) {
          cristalMineLevel = 0;
        }
        this.cristal = this.cristal + (((10 + 10 * cristalMineLevel * (Math.pow(1.1, cristalMineLevel))) / 3600) * (time / 1000));
      }
      for (_l = 0, _len3 = uraniumMines.length; _l < _len3; _l++) {
        uraniumMine = uraniumMines[_l];
        if (!(uraniumMineLevel = uraniumMine.level)) {
          uraniumMineLevel = 0;
        }
        this.uranium = this.uranium + (((5 * uraniumMineLevel * (Math.pow(1.1, uraniumMineLevel))) / 3600) * (time / 1000));
      }
      _results = [];
      for (_m = 0, _len4 = petrolMines.length; _m < _len4; _m++) {
        petrolMine = petrolMines[_m];
        if (!(petrolMineLevel = petrolMine.level)) {
          petrolMineLevel = 0;
        }
        _results.push(this.petrol = this.petrol + (((3 * petrolMineLevel * (Math.pow(1.1, petrolMineLevel))) / 3600) * (time / 1000)));
      }
      return _results;
    };

    ResourcesServer.prototype.Buy = function(price) {
      this.iron -= price.iron;
      this.gold -= price.gold;
      this.cristal -= price.cristal;
      this.uranium -= price.uranium;
      this.petrol -= price.petrol;
      this.energy -= price.energy;
      this.pop -= price.pop;
      return this.Send();
    };

    ResourcesServer.prototype.PropagSocket = function(socket) {
      var _this = this;
      this.socket = socket;
      return this.socket.on('updateResources' + this.city.id, function() {
        return _this.Send();
      });
    };

    return ResourcesServer;

  })(Module);

  CityManager.CityManagerBase = (function() {

    CityManagerBase.prototype.parent = null;

    CityManagerBase.prototype.citys = null;

    function CityManagerBase() {
      this.citys = [];
    }

    CityManagerBase.prototype.AddCity = function(city) {
      this.citys.push(city);
      return city;
    };

    CityManagerBase.prototype.GetCity = function(name) {
      var city, _i, _len, _ref;
      _ref = this.citys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        if (city.name === name) {
          return city;
        }
      }
      return null;
    };

    CityManagerBase.prototype.GetCityById = function(id) {
      var city, _i, _len, _ref;
      _ref = this.citys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        if (city.id === id) {
          return city;
        }
      }
      return null;
    };

    CityManagerBase.prototype.GetMainCity = function() {
      var city, _i, _len, _ref;
      _ref = this.citys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        if (city.isMain) {
          return city;
        }
      }
      return null;
    };

    CityManagerBase.prototype.GetAllCityPos = function() {};

    return CityManagerBase;

  })();

  City.schema = {
    __name__: 'City',
    _owner: {
      type: 'ObjectId',
      ref: 'Player'
    },
    isMain: Boolean,
    pos: {
      x: Number,
      y: Number
    },
    range: Number,
    name: String,
    resources: {
      type: 'ObjectId',
      ref: 'Resources'
    },
    buildings: {
      type: ['ObjectId'],
      ref: 'Building'
    },
    territory: {
      type: 'ObjectId',
      ref: 'Territory'
    }
  };

  City.CityServer = (function(_super) {

    __extends(CityServer, _super);

    CityServer.include(City.CityBase);

    CityServer.include(DesignPattern.Observable);

    CityServer.include(DbManager.DbItem);

    CityServer.prototype.socket = null;

    CityServer.prototype.owner = null;

    function CityServer(parent, id, callback) {
      var onLoad,
        _this = this;
      this.parent = parent;
      this.id = id;
      onLoad = function() {
        var chunk;
        _this.owner = _this.parent.owner;
        chunk = _this.owner.parent.map.GetChunk(_this.pos);
        chunk.Attach(_this);
        _this.Attach(chunk);
        return _this.resources = new Resources.ResourcesServer(_this, _this.item.resources, function() {
          return _this.territory = new Territory.TerritoryServer(_this, _this.item.territory, function() {
            _this.buildingManager = new TowerManager.BuildingManager.BuildingManagerServer(_this, callback);
            return _this.Notify(_this.owner, function(socket, isOwner) {
              return _this.SendTo(socket, isOwner);
            });
          });
        });
      };
      CityServer.__super__.constructor.call(this, [], [], [City.schema, this.id, onLoad]);
    }

    CityServer.prototype.BuyBuilding = function(building, socket) {
      var _this = this;
      this.resources.UpdateResources();
      return this.buildingManager.NewBuilding(building, socket, function(build) {
        _this.territory.AddTerritory(build);
        _this.item.buildings.push(build);
        return _this.Notify(_this.owner, function(socket) {
          return _this.SendUpdateTo(socket);
        });
      });
    };

    CityServer.prototype.PropagSocket = function(socket) {
      var build, _i, _len, _ref,
        _this = this;
      this.socket = socket;
      this.resources.PropagSocket(this.socket);
      this.territory.PropagSocket(this.socket);
      _ref = this.buildingManager.towers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        build = _ref[_i];
        build.PropagSocket(this.socket);
      }
      return this.socket.on('updateCity' + this.id, function(city) {
        _this.SendUpdateTo(_this.socket);
        return _this.resources.Send();
      });
    };

    CityServer.prototype.SendTo = function(socket, isOwner, isRec) {
      var command, serie;
      command = isOwner ? 'ownCityObject' : 'cityObject' + this.owner.id;
      serie = this.Serialize();
      socket.emit(command, serie);
      this.territory.SendTo(socket);
      if (isOwner && (this.socket != null)) {
        return this.resources.Send();
      }
    };

    CityServer.prototype.SendUpdateTo = function(socket) {
      socket.emit('updateCity' + this.id, this.Serialize());
      return this.territory.SendTo(socket);
    };

    CityServer.prototype.PropagDisconnect = function() {
      this.buildingManager.PropagDisconnect();
      return this.socket = null;
    };

    return CityServer;

  })(Module);

  Player.PlayerBase = (function() {

    PlayerBase.prototype.id = null;

    PlayerBase.prototype.socket = null;

    PlayerBase.prototype.type = null;

    PlayerBase.prototype.login = null;

    PlayerBase.prototype.cityManager = null;

    PlayerBase.prototype.parent = null;

    PlayerBase.prototype.technologyManager = null;

    function PlayerBase(player, socket) {
      this.socket = socket;
      this.type = 'Player';
      if (player != null) {
        this.Deserialize(player);
      }
    }

    PlayerBase.prototype.Serialize = function() {
      return {
        login: this.login
      };
    };

    PlayerBase.prototype.Deserialize = function(player) {
      if (player.login != null) {
        return this.login = player.login;
      }
    };

    return PlayerBase;

  })();

  CityManager.CityManagerServer = (function(_super) {

    __extends(CityManagerServer, _super);

    CityManagerServer.include(CityManager.CityManagerBase);

    CityManagerServer.include(DbManager.DbCollection);

    CityManagerServer.prototype.owner = null;

    CityManagerServer.prototype.currentCity = null;

    function CityManagerServer(parent, callback) {
      var loaded,
        _this = this;
      this.parent = parent;
      CityManagerServer.__super__.constructor.call(this, [], [City.schema]);
      loaded = 0;
      this.owner = this.parent;
      this.technologyManager = new TechnologyManager.TechnologyManagerServer(this, function() {
        return _this.GetAllDb('_owner', _this.parent.id, function(citys) {
          return _this.FillCitys(citys, function() {
            if (++loaded === citys.length) {
              _this.currentCity = _this.GetMainCity();
              if (callback != null) {
                return callback();
              }
            }
          });
        });
      });
    }

    CityManagerServer.prototype.FillCitys = function(citys, callback) {
      var city, i, _i, _len, _results;
      i = 1;
      _results = [];
      for (_i = 0, _len = citys.length; _i < _len; _i++) {
        city = citys[_i];
        this.AddCity(new City.CityServer(this, city.id, callback));
        _results.push(Log.log("Load |-- City" + " (" + i++ + ") " + city.name + " id: " + city.id));
      }
      return _results;
    };

    CityManagerServer.prototype.PropagDisconnect = function() {
      var city, _i, _len, _ref, _results;
      _ref = this.citys;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        _results.push(city.PropagDisconnect());
      }
      return _results;
    };

    return CityManagerServer;

  })(Module);

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

    PlayerManagerBase.prototype.GetPlayerById = function(id) {
      var player, _i, _len, _ref;
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.id === id) {
          return player;
        }
      }
      return null;
    };

    return PlayerManagerBase;

  })();

  Player.schema = {
    __name__: 'Player',
    login: String,
    pass: String,
    citys: {
      type: ['ObjectId'],
      ref: 'City'
    },
    technos: {
      type: ['ObjectId'],
      ref: 'Techno'
    }
  };

  Player.PlayerServer = (function(_super) {

    __extends(PlayerServer, _super);

    PlayerServer.include(Player.PlayerBase);

    PlayerServer.include(DesignPattern.Observable);

    PlayerServer.include(DbManager.DbItem);

    PlayerServer.prototype.loggedIn = false;

    function PlayerServer(parent, id, callback) {
      var _this = this;
      this.parent = parent;
      this.id = id;
      PlayerServer.__super__.constructor.call(this, [], [], [
        Player.schema, this.id, function() {
          return _this.cityManager = new CityManager.CityManagerServer(_this, callback);
        }
      ]);
    }

    PlayerServer.prototype.SignIn = function(socket) {
      var _this = this;
      this.socket = socket;
      this.loggedIn = true;
      this.SendTo(this.socket);
      this.PropagSocket();
      Log.log("Player: Player " + this.login + " just SignedIn");
      this.socket.emit('syncTime', {
        time: new Date().getTime()
      });
      this.socket.on('buyBuilding', function(data) {
        var city;
        if ((city = _this.cityManager.GetCity(data.cityName))) {
          return city.BuyBuilding(data, _this.socket);
        }
      });
      return this.socket.on('ready', function(data) {
        return _this.socket.emit('notification', {
          title: "Welcome back",
          message: "Welcome back to the new Tower Adventure",
          persistent: false
        });
      });
    };

    PlayerServer.prototype.LogOut = function() {
      var obs, _i, _len, _ref;
      _ref = this.observators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        obs.Detach(this);
      }
      this.observators = [];
      this.cityManager.PropagDisconnect();
      this.socket = null;
      this.loggedIn = false;
      return console.log("Player " + this.login + " has LogOut");
    };

    PlayerServer.prototype.PropagSocket = function() {
      var city, _i, _len, _ref, _results;
      this.cityManager.socket = this.socket;
      this.cityManager.technologyManager.PropagSocket(this.socket);
      _ref = this.cityManager.citys;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        _results.push(city.PropagSocket(this.socket));
      }
      return _results;
    };

    PlayerServer.prototype.SendTo = function(socket) {
      var allCityPos, mainCityPos, player;
      mainCityPos = this.cityManager.GetMainCity().pos;
      allCityPos = [];
      player = {
        id: this.id,
        login: this.login,
        mainCityPos: mainCityPos,
        allCityPos: allCityPos,
        own: true
      };
      return socket.emit('ownPlayerObject', player);
    };

    return PlayerServer;

  })(Module);

  PlayerManager.PlayerManagerServer = (function(_super) {

    __extends(PlayerManagerServer, _super);

    PlayerManagerServer.include(PlayerManager.PlayerManagerBase);

    PlayerManagerServer.include(DbManager.DbCollection);

    PlayerManagerServer.prototype.chat = null;

    PlayerManagerServer.prototype.map = null;

    function PlayerManagerServer(sockets) {
      var _this = this;
      PlayerManagerServer.__super__.constructor.call(this, [], [Player.schema]);
      this.map = new Map.MapServer;
      this.chat = new Social.Chat.ChatServer(sockets);
      this.GetAllDb(null, null, function(players) {
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
        _results.push(this.AddPlayer(new Player.PlayerServer(this, player.id)));
      }
      return _results;
    };

    PlayerManagerServer.prototype.SignIn = function(data, socket, callback) {
      var _this = this;
      return this.GetOneDb('login', data.login, function(player) {
        var playerDb;
        if (player != null) {
          playerDb = player;
          player = _this.GetPlayer(playerDb.login);
          if (!(player != null) || data.pass !== playerDb.pass) {
            return socket.emit('error', {
              error: 'Bad login or pass1'
            });
          } else if (player.loggedIn) {
            return socket.emit('error', {
              error: 'Already LoggedIn. Please disconnect previous session first.'
            });
          } else {
            socket.emit('loggedIn');
            _this.SetGeneralCallback(player, socket);
            if (callback) {
              return callback();
            }
          }
        } else {
          return socket.emit('error', {
            error: 'Bad login or pass2'
          });
        }
      });
    };

    PlayerManagerServer.prototype.SignUp = function(data, socket, pos, callback) {
      var _this = this;
      return this.GetOneDb('login', data.login, function(playerGet) {
        if (!(playerGet != null)) {
          return _this.dbManager.addPlayerModel(data, pos, function(player) {
            var newPlayer;
            if (player != null) {
              Log.log("PlayerManager: Player " + player.login + " just SignedUp");
              _this.SendNewPlayer(player);
              return newPlayer = new Player.PlayerServer(_this, player.id, function() {
                socket.emit('signedUp');
                _this.AddPlayer(newPlayer);
                _this.SetGeneralCallback(newPlayer, socket);
                if (callback != null) {
                  return callback();
                }
              });
            }
          });
        } else {
          return socket.emit('error', {
            error: "Player already exists"
          });
        }
      });
    };

    PlayerManagerServer.prototype.SetGeneralCallback = function(player, socket) {
      var _this = this;
      player.SignIn(socket);
      this.SendPlayerList(player);
      this.chat.JoinChannel(player, {
        name: 'general'
      });
      socket.on('askJoinChannel', function(channel) {
        return _this.chat.JoinChannel(player, data);
      });
      socket.on('askMessageChannel', function(message) {
        return _this.chat.AddMessage(message);
      });
      socket.on('getChunk', function(data) {
        var chunk;
        chunk = _this.map.GetChunk(data);
        if (!chunk.IsObservator(player)) {
          player.Attach(chunk);
          chunk.Attach(player);
          return chunk.SendTo(socket, player);
        }
      });
      this.NotifyToAllPlayers('Player Connected', 'Player \'' + player.login + '\' is connected');
      return socket.on('disconnect', function() {
        console.log("Disconnect event received");
        _this.NotifyToAllPlayers('Player Disconnect', 'Player \'' + player.login + '\' has leave');
        return player.LogOut();
      });
    };

    PlayerManagerServer.prototype.NotifyToAllPlayers = function(title, message) {
      var player, _i, _len, _ref, _results;
      _ref = this.players;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.loggedIn) {
          _results.push(player.socket.emit('notification', {
            title: title,
            message: message,
            persistant: false
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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

    PlayerManagerServer.prototype.SendNewPlayer = function(play) {
      var player, _i, _len, _ref, _results;
      _ref = this.players;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player !== play && (player.socket != null)) {
          _results.push(player.socket.emit('playerList', [
            {
              id: play.id,
              login: play.login,
              own: false
            }
          ]));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    PlayerManagerServer.prototype.SendPlayerList = function(play) {
      var list, player, _i, _len, _ref;
      list = [];
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player !== play) {
          list.push({
            id: player.id,
            login: player.login,
            own: false
          });
        }
      }
      return play.socket.emit('playerList', list);
    };

    return PlayerManagerServer;

  })(Module);

  Game.GameServer = (function(_super) {

    __extends(GameServer, _super);

    GameServer.include(Game.GameBase);

    GameServer.prototype.dbManager = null;

    GameServer.prototype.io = null;

    function GameServer(io) {
      var dbWaiter,
        _this = this;
      GameServer.__super__.constructor.call(this);
      this.io = io;
      this.dbManager = Singleton.get(DbManager.DbManager);
      dbWaiter = setInterval(function() {
        if (_this.dbManager.ready) {
          clearInterval(dbWaiter);
          _this.playerManager = new PlayerManager.PlayerManagerServer(_this.io.sockets);
          return _this.io.sockets.on('connection', function(socket) {
            socket.on('signIn', function(data) {
              return _this.playerManager.SignIn(data, socket, function() {
                return _this.SetCallbacks(socket);
              });
            });
            return socket.on('signUp', function(data) {
              return _this.playerManager.SignUp(data, socket, _this.playerManager.map.GetNextNewPlayerPos(_this.playerManager.players.length), function() {
                return _this.SetCallbacks(socket);
              });
            });
          });
        }
      }, 1000);
    }

    GameServer.prototype.SetCallbacks = function(socket) {};

    return GameServer;

  })(Module);

  Server.Server = (function() {

    Server.prototype.io = null;

    Server.prototype.game = null;

    function Server() {
      this.io = require('socket.io').listen(8080);
      this.io.set('log level', 1);
      this.game = new Game.GameServer(this.io);
    }

    return Server;

  })();

  Node = (function() {

    function Node() {
      Log.log("Node Side");
      new Server.Server;
    }

    return Node;

  })();

  Entity.EntityBase = (function() {

    EntityBase.prototype.id = null;

    EntityBase.prototype.name = null;

    EntityBase.prototype.type = null;

    EntityBase.prototype.parent = null;

    EntityBase.prototype.target = null;

    EntityBase.prototype.path = null;

    EntityBase.prototype.pathIdx = null;

    EntityBase.prototype.speed = null;

    EntityBase.prototype.moveTimer = null;

    function EntityBase(entity) {
      this.type = 'Entity';
      this.Deserialize(entity);
    }

    EntityBase.prototype.Serialize = function() {
      return {
        id: this.id,
        name: this.name,
        pos: this.pos,
        speed: this.speed,
        path: this.path,
        life: this.life,
        pathIdx: this.pathIdx
      };
    };

    EntityBase.prototype.Deserialize = function(entity) {
      if (entity != null) {
        if (entity.id != null) {
          this.id = entity.id;
        }
        if (entity.name != null) {
          this.name = entity.name;
        }
        if (entity.pos != null) {
          this.pos = entity.pos;
        }
        if (entity.speed != null) {
          this.speed = entity.speed;
        }
        if (entity.path != null) {
          this.path = entity.path;
        }
        if (entity.life != null) {
          this.life = entity.life;
        }
        if (entity.pathIdx != null) {
          return this.pathIdx = entity.pathIdx;
        }
      }
    };

    return EntityBase;

  })();

  Entity.schema = {
    __name__: "Entity",
    name: String,
    pos: {
      x: Number,
      y: Number
    },
    speed: Number
  };

  Entity.EntityServer = (function(_super) {

    __extends(EntityServer, _super);

    EntityServer.include(Entity.EntityBase);

    EntityServer.include(AliveObject.AliveObjectServer);

    EntityServer.include(DesignPattern.Observable);

    EntityServer.include(DbManager.DbItem);

    EntityServer.prototype.playersObs = null;

    EntityServer.prototype.currentDir = null;

    EntityServer.prototype.owner = null;

    function EntityServer() {
      var _this = this;
      EntityServer.__super__.constructor.call(this, [], [
        {
          pos: this.parent.parent.pos
        }
      ], [], [
        Entity.schema, this.id, function() {
          _this.target = _this.parent.parent.spawnTarget;
          _this.owner = _this.parent.parent.owner;
          _this.speed = 1;
          _this.pathIdx = 0;
          _this.path = _this.parent.parent.path;
          _this.currentDir = _this.path[0];
          _this.pos = _this.GetNextPos();
          _this.playersObs = [];
          _this.Start();
          return _this.NotifyNewPlayers();
        }
      ]);
    }

    EntityServer.prototype.destructor = function() {
      this.playersObs = null;
      this.path = null;
      this.owner = null;
      this.target = null;
      this.parent = null;
      this.observators[0].Detach(this);
      return this.Detach(this.observators[0]);
    };

    EntityServer.prototype.UpdateReferentChunk = function() {
      var chunk;
      chunk = this.owner.parent.map.GetChunk(this.pos);
      if (chunk !== this.observators[0]) {
        if (this.observators.length) {
          this.observators[0].Detach(this);
        }
        if (this.observators.length) {
          this.Detach(this.observators[0]);
        }
        chunk.Attach(this);
        return this.Attach(chunk);
      }
    };

    EntityServer.prototype.NotifyNewPlayers = function() {
      var obs, _i, _len, _ref, _results;
      this.UpdateReferentChunk();
      _ref = this.observators[0].observators;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        if ((obs != null) && obs.type === 'Player') {
          if (!this.IsPlayerObs(obs)) {
            this.playersObs.push(obs);
            _results.push(this.SendTo(obs.socket));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    EntityServer.prototype.NotifyPlayers = function() {
      var obs, _i, _len, _ref, _results;
      _ref = this.playersObs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        _results.push(this.SendUpdateTo(obs.socket));
      }
      return _results;
    };

    EntityServer.prototype.IsPlayerObs = function(player) {
      var play, _i, _len, _ref;
      _ref = this.playersObs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        play = _ref[_i];
        if (play === player) {
          return true;
        }
      }
      return false;
    };

    EntityServer.prototype.FindAlternatePath = function(takenPlace) {
      var currentPos, dir, path;
      path = [];
      currentPos = this.pos;
      console.log("Prealternate : ", this.ChooseDirection(currentPos, this.currentDir), this.currentDir);
      dir = this.ChooseDirection(currentPos, this.currentDir);
      while (!(currentPos.x === this.target.pos.x && currentPos.y === this.target.pos.y) && !(dir.length.xLength <= 1 && dir.length.yLength <= 1)) {
        dir = this.ChooseDirection(currentPos, this.currentDir);
        console.log("alternate", currentPos, dir);
        if (!path.length || dir.dir !== path[path.length - 1].dir) {
          path.push(dir);
        } else if (path.length && path[path.length - 1].dir === dir.dir) {
          path[path.length - 1].pos = dir.pos;
        }
        currentPos = dir.pos;
      }
      this.path = path;
      console.log("new path : ", this.path);
      this.pathIdx = 0;
      return this.currentDir = this.path[this.pathIdx];
    };

    EntityServer.prototype.ChooseDirection = function(currentPos, currentDir) {
      var allDir, calcVector, chunk, len, shortest, tmpPos, _i, _len,
        _this = this;
      console.log("Find alternate path : Choose Direction");
      calcVector = function(pos) {
        return {
          xLength: Math.abs(_this.target.pos.x - pos.x),
          yLength: Math.abs(_this.target.pos.y - pos.y)
        };
      };
      chunk = this.owner.parent.map.GetChunk(currentPos);
      tmpPos = currentPos;
      allDir = [];
      if (!(this.observators[0].GetTakenPlace({
        x: tmpPos.x,
        y: tmpPos.y + 1
      }) != null)) {
        allDir.push({
          dir: 'N',
          length: calcVector({
            x: tmpPos.x,
            y: tmpPos.y + 1
          }),
          pos: {
            x: tmpPos.x,
            y: tmpPos.y + 1
          }
        });
      }
      if (!(this.observators[0].GetTakenPlace({
        x: tmpPos.x + 1,
        y: tmpPos.y + 1
      }) != null)) {
        allDir.push({
          dir: 'NE',
          length: calcVector({
            x: tmpPos.x + 1,
            y: tmpPos.y + 1
          }),
          pos: {
            x: tmpPos.x + 1,
            y: tmpPos.y + 1
          }
        });
      }
      if (!(this.observators[0].GetTakenPlace({
        x: tmpPos.x + 1,
        y: tmpPos.y
      }) != null)) {
        allDir.push({
          dir: 'E',
          length: calcVector({
            x: tmpPos.x + 1,
            y: tmpPos.y
          }),
          pos: {
            x: tmpPos.x + 1,
            y: tmpPos.y
          }
        });
      }
      if (!(this.observators[0].GetTakenPlace({
        x: tmpPos.x + 1,
        y: tmpPos.y - 1
      }) != null)) {
        allDir.push({
          dir: 'SE',
          length: calcVector({
            x: tmpPos.x + 1,
            y: tmpPos.y - 1
          }),
          pos: {
            x: tmpPos.x + 1,
            y: tmpPos.y - 1
          }
        });
      }
      if (!(this.observators[0].GetTakenPlace({
        x: tmpPos.x,
        y: tmpPos.y - 1
      }) != null)) {
        allDir.push({
          dir: 'S',
          length: calcVector({
            x: tmpPos.x,
            y: tmpPos.y - 1
          }),
          pos: {
            x: tmpPos.x,
            y: tmpPos.y - 1
          }
        });
      }
      if (!(this.observators[0].GetTakenPlace({
        x: tmpPos.x - 1,
        y: tmpPos.y - 1
      }) != null)) {
        allDir.push({
          dir: 'SO',
          length: calcVector({
            x: tmpPos.x - 1,
            y: tmpPos.y - 1
          }),
          pos: {
            x: tmpPos.x - 1,
            y: tmpPos.y - 1
          }
        });
      }
      if (!(this.observators[0].GetTakenPlace({
        x: tmpPos.x - 1,
        y: tmpPos.y
      }) != null)) {
        allDir.push({
          dir: 'O',
          length: calcVector({
            x: tmpPos.x - 1,
            y: tmpPos.y
          }),
          pos: {
            x: tmpPos.x - 1,
            y: tmpPos.y
          }
        });
      }
      if (!(this.observators[0].GetTakenPlace({
        x: tmpPos.x - 1,
        y: tmpPos.y + 1
      }) != null)) {
        allDir.push({
          dir: 'NO',
          length: calcVector({
            x: tmpPos.x - 1,
            y: tmpPos.y + 1
          }),
          pos: {
            x: tmpPos.x - 1,
            y: tmpPos.y + 1
          }
        });
      }
      shortest = allDir[0];
      for (_i = 0, _len = allDir.length; _i < _len; _i++) {
        len = allDir[_i];
        if (len.dir !== currentDir.dir) {
          if (len.length.xLength <= shortest.length.xLength && len.length.yLength <= shortest.length.yLength) {
            shortest = len;
          }
        }
      }
      return shortest;
    };

    EntityServer.prototype.GetNextPos = function() {
      var dir, tmpPos;
      dir = this.currentDir;
      tmpPos = {
        x: this.pos.x,
        y: this.pos.y
      };
      if (dir != null) {
        switch (dir.dir) {
          case 'N':
            tmpPos.y++;
            break;
          case 'NE':
            tmpPos.x++;
            tmpPos.y++;
            break;
          case 'E':
            tmpPos.x++;
            break;
          case 'SE':
            tmpPos.x++;
            tmpPos.y--;
            break;
          case 'S':
            tmpPos.y--;
            break;
          case 'SO':
            tmpPos.x--;
            tmpPos.y--;
            break;
          case 'O':
            tmpPos.x--;
            break;
          case 'NO':
            tmpPos.x--;
            tmpPos.y++;
        }
      }
      return tmpPos;
    };

    EntityServer.prototype.UpdatePos = function() {
      var tmpPos;
      if ((this.currentDir != null) && this.pos.x === this.currentDir.pos.x && this.pos.y === this.currentDir.pos.y) {
        this.currentDir = this.path[++this.pathIdx];
        this.NotifyPlayers();
      }
      if (this.currentDir != null) {
        tmpPos = this.GetNextPos();
        if (tmpPos.x === this.target.pos.x && tmpPos.y === this.target.pos.y) {
          this.Stop();
          this.pathIdx = this.path.length;
          this.NotifyPlayers();
          return;
        }
        if ((this.observators[0].GetTakenPlace(tmpPos)) != null) {
          1;

          console.log("Find alternate path");
          if (this.FindAlternatePath(tmpPos)) {
            this.pos = this.GetNextPos();
          }
        } else {
          this.pos = tmpPos;
        }
        return this.NotifyNewPlayers();
      } else {
        this.Stop();
        return this.NotifyPlayers();
      }
    };

    EntityServer.prototype.SendTo = function(socket) {
      if (socket != null) {
        return socket.emit('newEntity', this.Serialize());
      }
    };

    EntityServer.prototype.SendUpdateTo = function(socket) {
      if (socket != null) {
        return socket.emit('updateEntity' + this.id, this.Serialize());
      }
    };

    EntityServer.prototype.PropagDisconnect = function() {
      var i, obs, _ref;
      _ref = this.playersObs;
      for (i in _ref) {
        obs = _ref[i];
        console.log(i, obs.login, this.owner.login, "Length : ", this.playersObs.length);
        if (obs.login === this.owner.login) {
          delete this.playersObs[i];
          this.playersObs.splice(i, 1);
        }
      }
      return console.log("End PropagDisconnect", this.playersObs.length);
    };

    EntityServer.prototype.Start = function() {
      var _this = this;
      if (!(this.moveTimer != null)) {
        this.currentDir = this.path[0];
        return this.moveTimer = setInterval(function() {
          return _this.UpdatePos();
        }, this.speed * 1000);
      }
    };

    EntityServer.prototype.Stop = function() {
      if (this.moveTimer != null) {
        clearInterval(this.moveTimer);
        this.moveTimer = null;
        return console.log("Stop");
      }
    };

    EntityServer.prototype.HitBy = function(attacker) {
      this.life.amount -= 5;
      this.NotifyPlayers();
      if (this.life.amount <= 0) {
        return this.Dead();
      }
    };

    EntityServer.prototype.Dead = function() {
      var _this = this;
      this.Notify(null, function(socket) {
        return socket.emit('destroyEntity' + _this.id);
      });
      return this.parent.DeadEntity(this);
    };

    return EntityServer;

  })(Module);

  Entity.EntityClient = (function(_super) {

    __extends(EntityClient, _super);

    EntityClient.include(Entity.EntityBase);

    EntityClient.include(AliveObject.AliveObjectClient);

    EntityClient.prototype.socket = null;

    EntityClient.prototype.pathIdx = null;

    EntityClient.prototype.anim = null;

    function EntityClient(entity, entityImage) {
      var isoPos,
        _this = this;
      EntityClient.__super__.constructor.call(this, [entity], [entity, entityImage]);
      this.image.setOffset(0, 10);
      isoPos = Map.MapClient.PosToIsoScreen(this.pos);
      this.lifeBar.image.setX(isoPos.x);
      this.lifeBar.image.setY(isoPos.y - 15);
      this.nameText.setX(isoPos.x);
      this.nameText.setY(isoPos.y - 30);
      setTimeout(function() {
        return _this.UpdateAnim();
      }, 1000);
      this.socket.on('updateEntity' + this.id, function(ent) {
        _this.Deserialize(ent);
        isoPos = Map.MapClient.PosToIsoScreen(_this.pos);
        _this.lifeBar.image.setX(isoPos.x);
        _this.lifeBar.image.setY(isoPos.y - 15);
        _this.nameText.setX(isoPos.x);
        _this.nameText.setY(isoPos.y - 30);
        _this.UpdateLife();
        _this.image.setPosition(isoPos);
        if (_this.pathIdx === _this.path.length) {
          _this.anim.stop();
        } else {
          _this.UpdateAnim();
        }
        return hudContainer.draw();
      });
      this.socket.on('destroyEntity' + this.id, function() {
        if (_this.anim != null) {
          _this.anim.stop();
        }
        _this.image.remove();
        _this.lifeBar.Hide();
        return _this.nameText.hide();
      });
      console.log(this);
    }

    EntityClient.prototype.GetNextDir = function() {
      var x, y;
      x = 0;
      y = 0;
      if (this.path[this.pathIdx].dir === 'N') {
        y++;
      }
      if (this.path[this.pathIdx].dir === 'NE') {
        x++;
        y++;
      }
      if (this.path[this.pathIdx].dir === 'E') {
        x++;
      }
      if (this.path[this.pathIdx].dir === 'SE') {
        x++;
        y--;
      }
      if (this.path[this.pathIdx].dir === 'S') {
        y--;
      }
      if (this.path[this.pathIdx].dir === 'SO') {
        x--;
        y--;
      }
      if (this.path[this.pathIdx].dir === 'O') {
        x--;
      }
      if (this.path[this.pathIdx].dir === 'NO') {
        x--;
        y++;
      }
      return Map.MapClient.PosToIsoScreen({
        x: x,
        y: y
      });
    };

    EntityClient.prototype.UpdateAnim = function() {
      var _this = this;
      if (this.anim != null) {
        this.anim.stop();
      }
      this.anim = new Kinetic.Animation(function(frame) {
        var dir;
        dir = _this.GetNextDir();
        return _this.image.setPosition({
          x: _this.image.attrs.x + (dir.x * (frame.timeDiff / 1000)),
          y: _this.image.attrs.y + (dir.y * (frame.timeDiff / 1000))
        });
      }, entityContainer);
      return this.anim.start();
    };

    return EntityClient;

  })(Module);

  Notification.Notification = (function() {

    Notification.prototype.timer = null;

    Notification.prototype.attached = null;

    function Notification() {
      var _this = this;
      this.attached = '#summaryPanelToggle';
      $('#summaryToggle').click(function() {
        if (_this.attached !== '#panelResources') {
          _this.attached = '#panelResources';
        } else {
          _this.attached = '#summaryPanelToggle';
        }
        return _this.UpdateGrowls();
      });
      this.timer = function(event) {
        var api, lifespan;
        api = $(this).data('qtip');
        lifespan = 10000;
        if (api.get('show.persistent') === true) {
          return;
        }
        clearTimeout(api.timer);
        if (event.type !== 'mouseover') {
          return api.timer = setTimeout(api.hide, lifespan);
        }
      };
      $(document).delegate('.qtip.jgrowl', 'mouseover mouseout', this.timer);
    }

    Notification.prototype.AddNotification = function(notification) {
      var target,
        _this = this;
      target = $('.qtip.jgrowl:visible:last');
      return $(document.body).qtip({
        content: {
          text: notification.message,
          title: {
            text: notification.title,
            button: true
          }
        },
        position: {
          my: 'top left',
          at: 'bottom left',
          target: target.length ? target : $(this.attached),
          adjust: $('.qtip.jgrowl').length ? {
            y: 5
          } : {
            x: 5,
            y: 5
          },
          effect: function(api, newPos) {
            $(this).animate(newPos, {
              duration: 200,
              queue: false
            });
            return api.cache.finalPos = newPos;
          }
        },
        show: {
          event: false,
          ready: true,
          effect: function() {
            return $(this).stop(0, 1).fadeIn(400);
          },
          delay: 0,
          persistent: notification.persistent
        },
        hide: {
          event: false,
          effect: function(api) {
            return $(_this).stop(0, 1).fadeOut(400).queue(function() {
              api.destroy();
              return _this.UpdateGrowls();
            });
          }
        },
        style: {
          classes: 'jgrowl qtip-dark qtip-rounded',
          tip: false
        },
        events: {
          render: function(event, api) {
            return _this.timer.call(api.elements.tooltip, event);
          }
        }
      }).removeData('qtip');
    };

    Notification.prototype.UpdateGrowls = function() {
      var each, gap, height, pos, width,
        _this = this;
      each = $('.qtip.jgrowl');
      width = each.outerWidth();
      height = each.outerHeight();
      gap = each.eq(0).qtip('option', 'position.adjust.y');
      pos = 0;
      return each.each(function(i, value) {
        var api;
        api = $(value).data('qtip');
        api.options.position.target = !i ? $(_this.attached) : [pos.left, pos.top + (height * i) + Math.abs(gap * (i - 1))];
        api.set('position.my', 'top left');
        api.set('position.at', 'bottom left');
        if (!i) {
          return pos = api.cache.finalPos;
        }
      });
    };

    return Notification;

  })();

  ContextMenu.ContextMenuStage = (function() {

    function ContextMenuStage() {}

    ContextMenuStage.prototype.Show = function(attachedObject, pos) {
      var callback, city,
        _this = this;
      $.contextMenu('destroy');
      city = attachedObject.player.cityManager.currentCity;
      callback = function(key, options) {
        city.buildingManager.PlaceNewBuilding(key, pos);
        return _this.Hide();
      };
      return $.contextMenu({
        selector: '#game',
        events: {
          show: function() {
            return stage.setDraggable(false);
          },
          hide: function() {
            return stage.setDraggable(true);
          }
        },
        items: {
          "actions": {
            "name": "<p>Actions Menu</p>",
            "disabled": true
          },
          "separator": "--------",
          "buildings": {
            "name": "Buildings ->",
            "items": {
              "offices": {
                "name": "Offices ->",
                "items": {
                  "architectOffice": {
                    "name": this.ColorizePrice(attachedObject, 'architectOffice', 'Architect Office'),
                    "disabled": !city.buildingManager.CanBuy('architectOffice', 1),
                    "callback": callback
                  },
                  "laboratory": {
                    "name": this.ColorizePrice(attachedObject, 'laboratory', 'Laboratory'),
                    "disabled": !city.buildingManager.CanBuy('laboratory', 1),
                    "callback": callback
                  }
                }
              },
              "mines": {
                "name": "Mines ->",
                "items": {
                  "solarMine": {
                    "name": this.ColorizePrice(attachedObject, 'solarMine', 'Solar Mine'),
                    "disabled": !city.buildingManager.CanBuy('solarMine', 1),
                    "callback": callback
                  },
                  "ironMine": {
                    "name": this.ColorizePrice(attachedObject, 'ironMine', 'Iron Mine'),
                    "disabled": !city.buildingManager.CanBuy('ironMine', 1),
                    "callback": callback
                  },
                  "goldMine": {
                    "name": this.ColorizePrice(attachedObject, 'goldMine', 'Gold Mine'),
                    "disabled": !city.buildingManager.CanBuy('goldMine', 1),
                    "callback": callback
                  },
                  "cristalMine": {
                    "name": this.ColorizePrice(attachedObject, 'cristalMine', 'Cristal Mine'),
                    "disabled": !city.buildingManager.CanBuy('cristalMine', 1),
                    "callback": callback
                  },
                  "uraniumMine": {
                    "name": this.ColorizePrice(attachedObject, 'uraniumMine', 'Uranium Mine'),
                    "disabled": !city.buildingManager.CanBuy('uraniumMine', 1),
                    "callback": callback
                  },
                  "petrolMine": {
                    "name": this.ColorizePrice(attachedObject, 'petrolMine', 'Petrol Mine'),
                    "disabled": !city.buildingManager.CanBuy('petrolMine', 1),
                    "callback": callback
                  }
                }
              }
            }
          },
          "tower": {
            "name": "Tower ->",
            "items": {
              "baseTower": {
                "name": this.ColorizePrice(attachedObject, 'baseTower', 'Base Tower'),
                "disabled": !city.buildingManager.CanBuy('baseTower', 1),
                "callback": callback
              }
            }
          }
        }
      });
    };

    ContextMenuStage.prototype.Hide = function() {
      return $.contextMenu('destroy');
    };

    ContextMenuStage.prototype.ColorizePrice = function(attachedObject, building, name) {
      var city, color, left, price, res, time;
      res = '';
      city = attachedObject.player.cityManager.currentCity;
      price = city.buildingManager.GetPriceOf(building, 1);
      color = (city.buildingManager.CanBuy(building, 1) ? '#080' : '#800');
      res += "<p><font color='" + color + "'>" + name + "</font> (";
      color = (city.resources.iron < price.iron ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.iron + "</font> ";
      color = (city.resources.gold < price.gold ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.gold + "</font> ";
      color = (city.resources.cristal < price.cristal ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.cristal + "</font> ";
      color = (city.resources.uranium < price.uranium ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.uranium + "</font> ";
      color = (city.resources.petrol < price.petrol ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.petrol + "</font> ";
      color = (city.resources.energy < price.energy ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.energy + "</font> ";
      color = (city.resources.pop < price.pop ? '#A00' : '#AAA');
      res += "<font color='" + color + "'>" + price.pop + "</font>) ";
      left = new Date(price.time);
      time = '';
      if (left.getDate() - 1) {
        time += left.getDate() - 1 + 'd ';
      }
      if (left.getHours - 1) {
        time += left.getHours() - 1 + 'h ';
      }
      if (left.getMinutes()) {
        time += left.getMinutes() + 'm';
      }
      time += left.getSeconds() + 's';
      res += time + "</p>";
      return res;
    };

    return ContextMenuStage;

  })();

  TechnologyManager.TechnologyManagerClient = (function(_super) {

    __extends(TechnologyManagerClient, _super);

    TechnologyManagerClient.include(TechnologyManager.TechnologyManagerBase);

    function TechnologyManagerClient(parent, socket, scope) {
      var _this = this;
      this.parent = parent;
      this.socket = socket;
      this.scope = scope;
      TechnologyManagerClient.__super__.constructor.call(this, []);
      this.socket.on('technology' + this.parent.parent.id, function(techno) {
        _this.AddTechno(new Technology.TechnologyClient(_this, techno, _this.socket, scope));
        return console.log("New Techno : ", techno);
      });
    }

    return TechnologyManagerClient;

  })(Module);

  TowerManager.TowerManagerClient = (function(_super) {

    __extends(TowerManagerClient, _super);

    TowerManagerClient.include(TowerManager.TowerManagerBase);

    function TowerManagerClient(city) {
      TowerManagerClient.__super__.constructor.call(this, [city]);
    }

    return TowerManagerClient;

  })(Module);

  TowerManager.BuildingManager.BuildingManagerClient = (function(_super) {

    __extends(BuildingManagerClient, _super);

    BuildingManagerClient.include(TowerManager.BuildingManager.BuildingManagerBase);

    BuildingManagerClient.include(TowerManager.TowerManagerClient);

    BuildingManagerClient.prototype.socket = null;

    BuildingManagerClient.prototype.scope = null;

    function BuildingManagerClient(city, socket, scope) {
      var _this = this;
      BuildingManagerClient.__super__.constructor.call(this, [], [city]);
      this.socket = socket;
      this.scope = scope;
      if (this.city.own) {
        this.socket.on('ownBuildingObject' + this.city.id, function(building) {
          console.log("Building received", building);
          _this.scope.updateLoadMessages('building');
          return _this.scope.$apply(function() {
            return _this.AddTower(_this.city, building);
          });
        });
      } else {
        this.socket.on('buildingObject' + this.city.id, function(building) {
          console.log("Building received", building);
          return _this.AddTower(_this.city, building);
        });
      }
    }

    BuildingManagerClient.prototype.PlaceNewBuilding = function(name, pos) {
      var build, trueIso, type,
        _this = this;
      this.city.ShowRange();
      type = cityHallImage;
      switch (name) {
        case 'cityHall':
          type = cityHallImage;
          break;
        case 'baseDefenseTower':
          type = baseDefenseTowerImage;
          break;
        case 'soldierSpawnerTower':
          type = soldierSpawnerTowerImage;
          break;
        default:
          type = baseTowerImage;
      }
      trueIso = function(posI) {
        var m, n, x, y;
        n = Math.floor(posI.y / tileSizeY + posI.x / tileSizeX);
        m = Math.floor(posI.y / tileSizeY - posI.x / tileSizeX);
        x = (n - m) / 2 * tileSizeX;
        y = (n + m) / 2 * tileSizeY;
        return {
          x: x,
          y: y
        };
      };
      build = new Kinetic.Image({
        image: type,
        x: pos.x * tileSizeX,
        y: pos.y * tileSizeY,
        opacity: 0.5,
        draggable: true,
        dragBoundFunc: function(posB) {
          var buildIso, buildPos, posRes;
          posRes = trueIso(posB);
          buildIso = {
            x: posRes.x + -stage.attrs.x,
            y: posRes.y + -stage.attrs.y
          };
          buildPos = Map.MapClient.IsoScreenToPos(buildIso);
          if (_this.city.territory.IsInTerritory({
            x: buildPos.x + 1,
            y: buildPos.y + 1
          })) {
            posRes = Map.MapClient.PosToIsoScreen(buildPos);
            posRes = {
              x: posRes.x + stage.attrs.x,
              y: posRes.y + stage.attrs.y
            };
          } else {
            posRes = build.getAbsolutePosition();
          }
          return posRes;
        }
      });
      build.on('dragstart', function(e) {
        return e.cancelBubble = true;
      });
      build.on('mouseUp', function(e) {
        return stage.setDraggable(true);
      });
      build.on('dragend', function(e) {
        var posReal;
        stage.setDraggable(true);
        posReal = Map.MapClient.IsoScreenToPos(build.attrs);
        build.remove();
        _this.city.HideRange();
        _this.socket.emit('buyBuilding', {
          cityName: _this.city.name,
          name: name,
          level: 1,
          pos: posReal
        });
        return mainContainer.draw();
      });
      buildingsContainer.add(build);
      return mainContainer.draw();
    };

    BuildingManagerClient.prototype.UpdateAllConstruct = function() {
      var build, i, _i, _len, _ref, _results;
      i = 0;
      _ref = this.towersConstruct;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        build = _ref[_i];
        if (build != null) {
          if (build != null) {
            build.UpdateConstruct();
          }
          if ((build != null) && build.finishTime < new Date()) {
            if (build) {
              build.underConstruct = false;
            }
            if (build) {
              build.timeLeft = 0;
            }
            build.huds.SetHidden(build.progressBar.image, true);
            build.huds.SetPersistant(build.progressBar.image, false);
            if (build) {
              this.towersConstruct.splice(i, 1);
            }
          }
        }
        _results.push(i++);
      }
      return _results;
    };

    BuildingManagerClient.prototype.AddTower = function(city, tower) {
      var build;
      build = null;
      switch (tower.name) {
        case 'cityHall':
          build = new Tower.Building.CityHall.CityHallClient(city, tower, this.socket);
          break;
        case 'architectOffice':
          build = new Tower.Building.ArchitectOffice.ArchitectOfficeClient(city, tower, this.socket);
          break;
        case 'laboratory':
          build = new Tower.Building.Laboratory.LaboratoryClient(city, tower, this.socket);
          break;
        case 'ironMine':
          build = new Tower.Building.IronMine.IronMineClient(city, tower, this.socket);
          break;
        case 'goldMine':
          build = new Tower.Building.GoldMine.GoldMineClient(city, tower, this.socket);
          break;
        case 'cristalMine':
          build = new Tower.Building.CristalMine.CristalMineClient(city, tower, this.socket);
          break;
        case 'uraniumMine':
          build = new Tower.Building.UraniumMine.UraniumMineClient(tower, city, this.socket);
          break;
        case 'petrolMine':
          build = new Tower.Building.PetrolMine.PetrolMineClient(city, tower, this.socket);
          break;
        case 'solarCentral':
          build = new Tower.Building.SolarCentral.SolarCentralClient(city, tower, this.socket);
          break;
        case 'baseTower':
          build = new Tower.BaseTower.BaseTowerClient(city, tower, this.socket);
          break;
        case 'baseSpawnTower':
          build = new Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerClient(city, tower, this.socket);
          break;
        case 'baseDefenseTower':
          build = new Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerClient(city, tower, this.socket);
      }
      return this._super(build);
    };

    BuildingManagerClient.prototype.DestroyTower = function(tower) {
      this.DeleteTower(tower);
      return tower.destructor();
    };

    return BuildingManagerClient;

  })(Module);

  Territory.TerritoryClient = (function(_super) {

    __extends(TerritoryClient, _super);

    TerritoryClient.include(Territory.TerritoryBase);

    TerritoryClient.prototype.rangeGroup = null;

    function TerritoryClient(city, socket) {
      var _this = this;
      this.socket = socket;
      this.city = city;
      TerritoryClient.__super__.constructor.call(this, []);
      this.socket.on('territory' + this.city.id, function(territory) {
        _this.Deserialize(territory);
        return _this.MakeTerritoryImage();
      });
      this.socket.emit('territory' + this.city.id);
    }

    TerritoryClient.prototype.MakeTerritoryImage = function(callback) {
      var image, pos, ter, tile, _i, _len, _ref;
      if (this.rangeGroup != null) {
        this.rangeGroup.remove();
      }
      this.rangeGroup = new Kinetic.Group();
      image = (this.city.own ? cityRangeImage : cityRangeEnemyImage);
      _ref = this.territory;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ter = _ref[_i];
        pos = Map.MapClient.PosToIsoScreen(ter);
        tile = new Kinetic.Image({
          image: image,
          x: pos.x,
          y: pos.y,
          opacity: 0.2
        });
        this.rangeGroup.add(tile);
      }
      rangeContainer.add(this.rangeGroup);
      return mainContainer.draw();
    };

    TerritoryClient.prototype.Show = function() {
      var _this = this;
      if (!(this.rangeGroup != null)) {
        return this.MakeTerritoryImage(function() {});
      } else {

      }
    };

    TerritoryClient.prototype.Hide = function() {
      var _this = this;
      if (!(this.rangeGroup != null)) {
        return this.MakeTerritoryImage(function() {});
      } else {

      }
    };

    return TerritoryClient;

  })(Module);

  City.CityClient = (function(_super) {

    __extends(CityClient, _super);

    CityClient.include(City.CityBase);

    CityClient.prototype.socket = null;

    CityClient.prototype.scope = null;

    CityClient.prototype.rangeImage = null;

    CityClient.prototype.parent = null;

    CityClient.prototype.own = false;

    CityClient.prototype.owner = null;

    function CityClient(parent, city, socket, scope) {
      var _this = this;
      this.parent = parent;
      CityClient.__super__.constructor.call(this, [city]);
      this.scope = scope;
      this.socket = socket;
      this.owner = this.parent.parent;
      this.own = this.parent.own;
      this.territory = new Territory.TerritoryClient(this, socket);
      this.resources = new Resources.ResourcesClient(this, socket, scope);
      this.buildingManager = new TowerManager.BuildingManager.BuildingManagerClient(this, this.socket, scope);
      this.socket.on('updateCity' + this.id, function(city) {
        return _this.Deserialize(city);
      });
    }

    CityClient.prototype.ShowRange = function() {
      return this.territory.Show();
    };

    CityClient.prototype.HideRange = function() {
      return this.territory.Hide();
    };

    return CityClient;

  })(Module);

  CityManager.CityManagerClient = (function(_super) {

    __extends(CityManagerClient, _super);

    CityManagerClient.include(CityManager.CityManagerBase);

    CityManagerClient.prototype.socket = null;

    CityManagerClient.prototype.scope = null;

    CityManagerClient.prototype.currentCity = null;

    CityManagerClient.prototype.parent = null;

    CityManagerClient.prototype.own = false;

    function CityManagerClient(parent, socket, scope) {
      var _this = this;
      this.parent = parent;
      this.socket = socket;
      this.scope = scope;
      CityManagerClient.__super__.constructor.call(this, []);
      this.own = this.parent.own;
      if (this.own) {
        this.socket.on('ownCityObject', function(city) {
          var newCity;
          newCity = new City.CityClient(_this, city, _this.socket, _this.scope);
          _this.scope.updateLoadMessages('city');
          _this.AddCity(newCity);
          if (city.isMain) {
            _this.scope.centerOnCity(newCity);
          }
          return setInterval(function() {
            return _this.scope.$apply(function() {
              return _this.UpdateAllConstruct();
            });
          }, 1000);
        });
        this.technologyManager = new TechnologyManager.TechnologyManagerClient(this, this.socket);
      } else {
        this.socket.on('cityObject' + this.parent.id, function(city) {
          var newCity;
          newCity = new City.CityClient(_this, city, _this.socket, _this.scope);
          return _this.AddCity(newCity);
        });
      }
    }

    CityManagerClient.prototype.UpdateAllConstruct = function() {
      var city, _i, _len, _ref, _results;
      _ref = this.citys;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        _results.push(city.buildingManager.UpdateAllConstruct());
      }
      return _results;
    };

    return CityManagerClient;

  })(Module);

  Player.PlayerClient = (function(_super) {

    __extends(PlayerClient, _super);

    PlayerClient.include(Player.PlayerBase);

    PlayerClient.prototype.own = false;

    function PlayerClient(player, socket, scope) {
      PlayerClient.__super__.constructor.call(this, [player, socket]);
      this.own = player.own;
      this.id = player.id;
      this.cityManager = new CityManager.CityManagerClient(this, this.socket, scope);
      if (this.own) {
        scope.centerInit(player.mainCityPos);
      }
    }

    return PlayerClient;

  })(Module);

  PlayerManager.PlayerManagerClient = (function(_super) {

    __extends(PlayerManagerClient, _super);

    PlayerManagerClient.include(PlayerManager.PlayerManagerBase);

    PlayerManagerClient.include(DbManager.DbCollection);

    PlayerManagerClient.prototype.scope = null;

    PlayerManagerClient.prototype.socket = null;

    PlayerManagerClient.prototype.parent = null;

    function PlayerManagerClient(parent, socket, scope) {
      var _this = this;
      this.parent = parent;
      this.socket = socket;
      this.scope = scope;
      PlayerManagerClient.__super__.constructor.call(this, [], []);
      this.entityManager = new EntityManager.EntityManagerClient(this.socket);
      this.socket.on('playerList', function(list) {
        var player, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          player = list[_i];
          player.own = false;
          if (player.login !== _this.parent.player.login) {
            _results.push(_this.AddPlayer(new Player.PlayerClient(player, _this.socket, _this.scope)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    }

    return PlayerManagerClient;

  })(Module);

  globalServerDelay = null;

  stage = null;

  mainContainer = null;

  hudContainer = null;

  entityContainer = null;

  mapContainer = null;

  rangeContainer = null;

  buildingsContainer = null;

  peopleContainer = null;

  grassImage = null;

  ironImage = null;

  goldImage = null;

  cristalImage = null;

  uraniumImage = null;

  petrolImage = null;

  cityHallImage = null;

  laboratoryImage = null;

  baseTowerImage = null;

  baseDefenseTowerImage = null;

  baseSpawnTowerImage = null;

  cityRangeImage = null;

  cityRangeEnemyImage = null;

  floor = null;

  floorSprite = null;

  buildings = null;

  buildingsSprite = null;

  grassShape = null;

  baseEntityImage = null;

  Game.GameClient = (function(_super) {

    __extends(GameClient, _super);

    GameClient.include(Game.GameBase);

    GameClient.prototype.socket = null;

    GameClient.prototype.player = null;

    GameClient.prototype.map = null;

    GameClient.prototype.playerManager = null;

    GameClient.prototype.scopeLogin = null;

    GameClient.prototype.scopePanel = null;

    GameClient.prototype.menu = null;

    GameClient.prototype.ready = false;

    GameClient.prototype.chat = null;

    GameClient.prototype.notification = null;

    function GameClient(socket) {
      GameClient.__super__.constructor.call(this);
      this.socket = socket;
      this.notification = new Notification.Notification;
    }

    GameClient.prototype.InitGraph = function(callback) {
      var cityRangeShape, cristalShape, floorShape, goldShape, ironShape, petrolShape, uraniumShape,
        _this = this;
      stage = new Kinetic.Stage({
        container: 'game',
        width: document.body.scrollWidth,
        height: document.body.scrollHeight,
        draggable: true
      });
      mainContainer = new Kinetic.Layer();
      hudContainer = new Kinetic.Layer();
      entityContainer = new Kinetic.Layer();
      mapContainer = new Kinetic.Container();
      rangeContainer = new Kinetic.Container();
      buildingsContainer = new Kinetic.Container();
      mainContainer.add(mapContainer);
      mainContainer.add(rangeContainer);
      mainContainer.add(buildingsContainer);
      stage.add(mainContainer);
      stage.add(entityContainer);
      stage.add(hudContainer);
      floorSprite = {
        grass: [
          {
            x: 0,
            y: 0,
            width: 128,
            height: 64
          }
        ]
      };
      buildingsSprite = {
        main: [
          {
            x: 0,
            y: 0,
            width: 128,
            height: 128
          }
        ]
      };
      floorShape = new Kinetic.Polygon({
        points: [0, tileSizeY / 2, tileSizeY, tileSizeY, tileSizeX, tileSizeY / 2, tileSizeY, 0]
      });
      grassShape = floorShape.clone();
      grassShape.setFill('green');
      grassShape.setStroke('green');
      grassShape.setStrokeWidth(1);
      ironShape = floorShape.clone();
      ironShape.setFill('grey');
      ironShape.setStroke('grey');
      ironShape.setStrokeWidth(1);
      goldShape = floorShape.clone();
      goldShape.setFill('yellow');
      goldShape.setStroke('yellow');
      goldShape.setStrokeWidth(1);
      cristalShape = floorShape.clone();
      cristalShape.setFill('blue');
      cristalShape.setStroke('blue');
      cristalShape.setStrokeWidth(1);
      uraniumShape = floorShape.clone();
      uraniumShape.setFill('purple');
      uraniumShape.setStroke('purple');
      uraniumShape.setStrokeWidth(1);
      petrolShape = floorShape.clone();
      petrolShape.setFill('black');
      petrolShape.setStroke('black');
      petrolShape.setStrokeWidth(1);
      cityRangeShape = floorShape.clone();
      cityRangeShape.setFill('white');
      cityRangeShape.setStroke('black');
      cityRangeShape.setStrokeWidth(1);
      grassImage = new Image();
      grassImage.src = 'assets/img/grass_tile.png';
      ironImage = new Image();
      ironImage.src = 'assets/img/iron_tile.png';
      goldImage = new Image();
      goldImage.src = 'assets/img/gold_tile.png';
      cristalImage = new Image();
      cristalImage.src = 'assets/img/cristal_tile.png';
      console.log(tileSizeX, tileSizeY);
      uraniumShape.toImage({
        height: tileSizeY,
        width: tileSizeX,
        callback: function(img) {
          return uraniumImage = img;
        }
      });
      petrolShape.toImage({
        height: tileSizeY,
        width: tileSizeX,
        callback: function(img) {
          return petrolImage = img;
        }
      });
      cityRangeShape.toImage({
        width: 40,
        height: 20,
        callback: function(img) {
          return cityRangeImage = img;
        }
      });
      cityRangeShape.setFill('red');
      cityRangeShape.toImage({
        height: tileSizeY,
        width: tileSizeX,
        callback: function(img) {
          return cityRangeEnemyImage = img;
        }
      });
      cityHallImage = new Image();
      cityHallImage.src = 'assets/img/Towers/cityhall3x3.png';
      cityHallImage.onload = function() {
        if (callback != null) {
          return callback();
        }
      };
      laboratoryImage = new Image();
      laboratoryImage.src = 'assets/img/Towers/laboratory2x2.png';
      buildings = new Image();
      buildings.src = 'assets/img/buildings.png';
      buildings.onload = function() {};
      baseTowerImage = new Image();
      baseTowerImage.src = 'assets/img/Towers/basetower1x1.png';
      baseDefenseTowerImage = new Image();
      baseDefenseTowerImage.src = 'assets/img/Towers/basedefense1x1.png';
      baseSpawnTowerImage = new Image();
      baseSpawnTowerImage.src = 'assets/img/Towers/basespawn1x1.png';
      baseEntityImage = new Image();
      baseEntityImage.src = 'assets/img/baseEntity.png';
      this.menu = new ContextMenu.ContextMenuStage();
      return mainContainer.on('mousedown', function(e) {
        if (e.button === 2) {
          return _this.menu.Show(_this, {
            x: Math.floor((-stage.attrs.x + e.x) / tileSizeX),
            y: Math.floor((-stage.attrs.y + e.y) / tileSizeY)
          });
        }
      });
    };

    GameClient.prototype.SignIn = function(login, pass, rootScope, scope) {
      var _this = this;
      this.rootScope = rootScope;
      this.scopeLogin = scope;
      this.InitGraph(function() {
        return _this.socket.emit('signIn', {
          login: login,
          pass: pass
        });
      });
      return this.socket.on('loggedIn', function() {
        return _this.InitAfterSignIn();
      });
    };

    GameClient.prototype.SignUp = function(login, pass, rootScope, scope) {
      var _this = this;
      this.rootScope = rootScope;
      this.scopeLogin = scope;
      this.InitGraph(function() {
        return _this.socket.emit('signUp', {
          login: login,
          pass: pass
        });
      });
      return this.socket.on('signedUp', function() {
        return _this.InitAfterSignIn();
      });
    };

    GameClient.prototype.InitAfterSignIn = function() {
      var _this = this;
      this.rootScope.$broadcast('loggedIn', {});
      this.socket.on('notification', function(notif) {
        return _this.notification.AddNotification(notif);
      });
      this.socket.on('syncTime', function(time) {
        var now;
        now = new Date().getTime();
        return globalServerDelay = time.time - now;
      });
      this.socket.on('ownPlayerObject', function(data) {
        data.own = true;
        _this.map = new Map.MapClient(_this.socket, _this.scopePanel);
        _this.player = new Player.PlayerClient(data, _this.socket, _this.scopePanel);
        return _this.playerManager = new PlayerManager.PlayerManagerClient(_this, _this.socket, _this.scopePanel);
      });
      $('#loginScreen').hide();
      return $('#game').show();
    };

    GameClient.prototype.CommandPanelInit = function($scope) {
      var _this = this;
      this.scopePanel = $scope;
      this.scopePanel.loadChunkAskMessages = {
        count: 0
      };
      this.scopePanel.loadChunkRecvMessages = {
        count: 0,
        total: 0
      };
      this.scopePanel.loadCityMessages = {
        count: 0
      };
      this.scopePanel.loadBuildingMessages = {
        count: 0
      };
      this.scopePanel.loaddingPercent = 0;
      this.chat = new Social.Chat.ChatClient(this.socket, this.scopePanel);
      this.scopePanel.channels = this.chat.channels;
      this.scopePanel.visibleChunks = 0;
      $('#panelCommandTab a').click(function(e) {
        e.preventDefault();
        return $(this).tab('show');
      });
      this.scopePanel.updateLoadMessages = function(key, image) {
        return _this.scopePanel.$apply(function() {
          switch (key) {
            case 'chunk':
              _this.scopePanel.loadChunkAskMessages.count++;
              return _this.scopePanel.loadChunkRecvMessages.total++;
            case 'map':
              if (!_this.ready) {
                _this.scopePanel.loadingPercent = Math.floor(_this.scopePanel.loadChunkRecvMessages.count / _this.scopePanel.loadChunkRecvMessages.total * 100);
              } else {

              }
              if (++_this.scopePanel.loadChunkRecvMessages.count === _this.scopePanel.loadChunkRecvMessages.total && _this.ready) {
                return _this.map.GetChunkNear({
                  x: Math.floor((-stage.attrs.x + document.body.scrollWidth / 2) / tileSizeX),
                  y: Math.floor((-stage.attrs.y + document.body.scrollHeight / 2) / tileSizeY)
                }, {
                  x: Math.floor(document.body.scrollWidth / (tileSizeX * _this.map.scale * 2) / Map.Chunk.ChunkBase.size) + 2,
                  y: Math.floor(document.body.scrollHeight / (tileSizeY * _this.map.scale * 2) / Map.Chunk.ChunkBase.size) + 2
                }, function(chunk, pos) {
                  if ((chunk != null) && (chunk.image != null) && !(_this.map.IsVisible(chunk))) {
                    _this.map.visibles.push(chunk);
                    _this.scopePanel.visibleChunks = _this.map.visibles.length;
                    if (chunk.image != null) {
                      return chunk.image.show();
                    }
                  }
                });
              } else if (_this.scopePanel.loadChunkRecvMessages.count === _this.scopePanel.loadChunkRecvMessages.total && !_this.ready) {
                return _this.scopePanel.loadFinished();
              }
              break;
            case 'city':
              return _this.scopePanel.loadCityMessages.count++;
            case 'building':
              return _this.scopePanel.loadBuildingMessages.count++;
          }
        });
      };
      this.scopePanel.loadFinished = function() {
        _this.scopePanel.citys = _this.player.cityManager.citys;
        _this.socket.emit('ready');
        _this.ready = true;
        _this.map.chunkQueue.ChangeTime(Map.Chunk.ChunkBase.size * 2);
        $('#loading').slideUp('slow');
        return stage.draw();
      };
      this.scopePanel.centerOnCity = function(city) {
        var center;
        _this.scopePanel.currentCity = _this.player.cityManager.currentCity = _this.player.cityManager.GetCity(city.name);
        city.resources.UpdateResources();
        center = Map.MapClient.PosToIsoScreen({
          x: city.pos.x,
          y: city.pos.y
        });
        stage.setX(-center.x + document.body.scrollWidth / 2);
        stage.setY(-center.y + document.body.scrollHeight / 2);
        _this.map.UpdateVisibleChunk();
        return _this.menu.Hide();
      };
      return this.scopePanel.centerInit = function(mainCityPos) {
        var center;
        center = Map.MapClient.PosToIsoScreen({
          x: mainCityPos.x,
          y: mainCityPos.y
        });
        stage.setX(-center.x + document.body.scrollWidth / 2);
        stage.setY(-center.y + document.body.scrollHeight / 2);
        return _this.map.UpdateVisibleChunk();
      };
    };

    return GameClient;

  })(Module);

  Client.Client = (function() {

    Client.prototype.scope = null;

    Client.prototype.rootScope = null;

    Client.prototype.game = null;

    Client.prototype.socket = null;

    function Client() {
      var _this = this;
      this.socket = io.connect('http://127.0.0.1:8080');
      this.socket.on('error', function(data) {
        _this.scope.errorMessage = data.error;
        $("#errorContainer").css('opacity', '0.8');
        return _this.scope.$digest();
      });
      this.game = new Game.GameClient(this.socket);
    }

    Client.prototype.InitAngular = function($scope, $rootScope) {
      var _this = this;
      this.rootScope = $rootScope;
      this.scope = $scope;
      this.scope.insc = false;
      this.scope.errorMessage = "";
      this.scope.login = "";
      this.scope.pass = "";
      this.scope.passconf = "";
      this.scope.go = function() {
        _this.scope.errorMessage = "";
        $("#errorContainer").css('opacity', '0.0');
        return _this.game.SignIn(_this.scope.login, _this.scope.pass, _this.rootScope, _this.scope);
      };
      this.scope.toggleSignUp = function() {
        _this.scope.errorMessage = "";
        $("#errorContainer").css('opacity', '0.0');
        return _this.scope.insc = !_this.scope.insc;
      };
      return this.scope.signUp = function() {
        _this.scope.errorMessage = "";
        $("#errorContainer").css('opacity', '0.0');
        if (_this.scope.pass === _this.scope.passconf) {
          return _this.game.SignUp(_this.scope.login, _this.scope.pass, _this.rootScope, _this.scope);
        } else {
          _this.scope.errorMessage = "Passwords Doesn't match";
          return $("#errorContainer").css('opacity', '0.8');
        }
      };
    };

    return Client;

  })();

  Browser = (function() {

    Browser.prototype.client = null;

    function Browser() {
      var _this = this;
      Log.log("Browser Side");
      this.client = new Client.Client;
      angular.module('TowerAdventure', []).controller('LoginController', [
        '$scope', '$rootScope', function($scope, $location) {
          return _this.client.InitAngular($scope, $location);
        }
      ]).controller('CommandPanelController', [
        '$scope', '$rootScope', function($scope, $rootScope) {
          return $rootScope.$on('loggedIn', function(data) {
            return _this.client.game.CommandPanelInit($scope);
          });
        }
      ]);
    }

    return Browser;

  })();

  ContextMenu.ContextMenuBuilding = (function(_super) {
    var _instance;

    __extends(ContextMenuBuilding, _super);

    _instance = void 0;

    function ContextMenuBuilding() {
      var _this = this;
      stage.on('mousedown', function(e) {
        if (e.button !== 2) {
          return _this.Hide();
        }
      });
    }

    ContextMenuBuilding.prototype.Show = function(attachedObject, x, y) {
      var levelText, nameText,
        _this = this;
      ContextMenuBuilding.__super__.Show.call(this, attachedObject, x, y);
      levelText = new Kinetic.Text({
        x: x + 5,
        y: y + 30,
        text: "Buy level " + (attachedObject.level + 1),
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: 'white',
        drawHitFunc: function(canvas) {
          var context;
          context = canvas.getContext();
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(100, 0);
          context.lineTo(100, 15);
          context.lineTo(0, 15);
          context.closePath();
          return canvas.fillStroke(this);
        }
      });
      nameText = new Kinetic.Text({
        x: x + 5,
        y: y + 5,
        text: attachedObject.name + " (" + attachedObject.level + ")",
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: 'white'
      });
      this.menu.add(levelText);
      this.menu.add(nameText);
      hudContainer.draw();
      levelText.on('mousedown', function(e) {
        return attachedObject.LevelUp();
      });
      return levelText.on('mouseover', function(e) {
        return _this.label.Show(attachedObject.city, e.x, e.y);
      });
    };

    ContextMenuBuilding.prototype.Hide = function() {
      return ContextMenuBuilding.__super__.Hide.call(this);
    };

    ContextMenuBuilding.get = function() {
      return _instance != null ? _instance : _instance = new this();
    };

    return ContextMenuBuilding;

  })(ContextMenu.ContextMenuBase);

  Entity.BaseEntity.BaseEntityBase = (function() {

    function BaseEntityBase() {
      this.speed = 1;
    }

    return BaseEntityBase;

  })();

  Entity.BaseEntity.BaseEntityClient = (function(_super) {

    __extends(BaseEntityClient, _super);

    BaseEntityClient.include(Entity.BaseEntity.BaseEntityBase);

    BaseEntityClient.include(Entity.EntityClient);

    function BaseEntityClient(parent, entity, socket) {
      this.parent = parent;
      this.socket = socket;
      BaseEntityClient.__super__.constructor.call(this, [], [entity, baseEntityImage]);
      console.log(this.path);
    }

    return BaseEntityClient;

  })(Module);

  Entity.BaseEntity.BaseEntityServer = (function(_super) {

    __extends(BaseEntityServer, _super);

    BaseEntityServer.include(Entity.BaseEntity.BaseEntityBase);

    BaseEntityServer.include(Entity.EntityServer);

    function BaseEntityServer(parent, id) {
      this.parent = parent;
      this.id = id;
      BaseEntityServer.__super__.constructor.call(this, [], []);
    }

    return BaseEntityServer;

  })(Module);

  Entity.Soldier.SoldierBase = (function() {

    function SoldierBase() {
      SoldierBase.__super__.constructor.call(this);
    }

    return SoldierBase;

  })();

  Entity.Soldier.SoldierClient = (function(_super) {

    __extends(SoldierClient, _super);

    SoldierClient.include(Entity.Soldier.SoldierBase);

    SoldierClient.include(Entity.EntityClient);

    function SoldierClient() {
      SoldierClient.__super__.constructor.call(this);
    }

    return SoldierClient;

  })(Module);

  Entity.Soldier.SoldierServer = (function(_super) {

    __extends(SoldierServer, _super);

    SoldierServer.include(Entity.Soldier.SoldierBase);

    SoldierServer.include(Entity.EntityServer);

    function SoldierServer() {
      SoldierServer.__super__.constructor.call(this);
    }

    return SoldierServer;

  })(Module);

  EntityManager.EntityManagerClient = (function(_super) {

    __extends(EntityManagerClient, _super);

    EntityManagerClient.include(EntityManager.EntityManagerBase);

    EntityManagerClient.prototype.socket = null;

    function EntityManagerClient(socket) {
      var _this = this;
      this.socket = socket;
      EntityManagerClient.__super__.constructor.call(this, []);
      this.socket.on('newEntity', function(entity) {
        return _this.AddEntity(entity);
      });
      setInterval(function() {
        return entityContainer.draw();
      }, 500);
    }

    EntityManagerClient.prototype.AddEntity = function(entity) {
      var ent;
      ent = (function() {
        switch (entity.name) {
          case 'baseEntity':
            return new Entity.BaseEntity.BaseEntityClient(this, entity, this.socket);
        }
      }).call(this);
      return this._super(ent);
    };

    return EntityManagerClient;

  })(Module);

  Helpers.Helper = (function() {

    function Helper() {}

    Helper.IfBrowserContext = function(fn) {
      if (typeof window !== 'undefined') {
        return fn();
      }
    };

    Helper.IfNodeContext = function(fn) {
      if (typeof process !== 'undefined') {
        return fn();
      }
    };

    return Helper;

  })();

  Helpers.Queue = (function() {

    Queue.prototype.timer = null;

    Queue.prototype.time = null;

    Queue.prototype.objects = null;

    Queue.prototype.callback = null;

    function Queue(time, callback) {
      this.time = time;
      this.callback = callback;
      this.objects = [];
    }

    Queue.prototype.Start = function() {
      var _this = this;
      if (!(this.timer != null) && (this.time != null) && (this.callback != null)) {
        return this.timer = setInterval(function() {
          if (_this.objects.length) {
            _this.callback(_this.objects[0]);
            return _this.Pop();
          }
        }, this.time);
      }
    };

    Queue.prototype.Stop = function() {
      if (this.timer != null) {
        clearInterval(this.timer);
        return this.timer = null;
      }
    };

    Queue.prototype.ChangeTime = function(ms) {
      this.time = ms;
      this.Stop();
      return this.Start();
    };

    Queue.prototype.ChangeCallback = function(cb) {
      return this.callback = cb;
    };

    Queue.prototype.Push = function(object) {
      this.objects.push(object);
      if (this.objects.length === 1) {
        return this.Start();
      }
    };

    Queue.prototype.Pop = function(object) {
      this.objects.splice(0, 1);
      if (this.objects.length === 0) {
        return this.Stop();
      }
    };

    Queue.prototype.SortNearest = function(point) {
      var i, j, nearest, _i, _ref, _results,
        _this = this;
      nearest = function(first, second, point) {
        var fd, sd;
        if ((first != null) && (second != null) && (point != null)) {
          fd = Math.sqrt(Math.pow(Math.abs(point.pos.x - first.pos.x), 2) + Math.pow(Math.abs(point.pos.y - first.pos.y), 2));
          sd = Math.sqrt(Math.pow(Math.abs(point.pos.x - second.pos.x), 2) + Math.pow(Math.abs(point.pos.y - second.pos.y), 2));
          return fd > sd;
        }
        return false;
      };
      _results = [];
      for (i = _i = 0, _ref = this.objects.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref1, _ref2, _results1;
          _results1 = [];
          for (j = _j = 0, _ref1 = this.objects.length - i; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            if (nearest(this.objects[j], this.objects[j + 1], {
              pos: point
            })) {
              _results1.push((_ref2 = [this.objects[j + 1], this.objects[j]], this.objects[j] = _ref2[0], this.objects[j + 1] = _ref2[1], _ref2));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    return Queue;

  })();

  handleError = function(err) {
    return console.log("Error Mongo: ", err);
  };

  Main = (function() {

    function Main() {
      Helpers.Helper.IfBrowserContext(function() {
        return new Browser;
      });
      Helpers.Helper.IfNodeContext(function() {
        return new Node;
      });
    }

    return Main;

  })();

  new Main;

  tileSizeX = 40;

  tileSizeY = 20;

  chunkSizeX = Map.Chunk.ChunkBase.size * tileSizeX;

  chunkSizeY = Map.Chunk.ChunkBase.size * tileSizeY;

  Map.Chunk.ChunkClient = (function(_super) {

    __extends(ChunkClient, _super);

    ChunkClient.include(Map.Chunk.ChunkBase);

    ChunkClient.prototype.layer = null;

    ChunkClient.prototype.image = null;

    ChunkClient.prototype.tileQueue = null;

    function ChunkClient(chunk, scope) {
      var arr, i, j, res, tmp, _i, _j, _len, _len1, _ref,
        _this = this;
      ChunkClient.__super__.constructor.call(this, [chunk]);
      this.pos = chunk.pos;
      j = 0;
      this.layer = new Kinetic.Group();
      this.tileQueue = new Helpers.Queue(1, function(object) {
        var pos, tile;
        pos = Map.MapClient.PosToIsoScreen({
          x: object.x,
          y: object.y
        });
        tile = new Kinetic.Image({
          image: object.type,
          x: -pos.x + chunkSizeX / 2,
          y: pos.y
        });
        _this.layer.add(tile);
        if (object.x === Map.Chunk.ChunkBase.size - 1 && object.y === Map.Chunk.ChunkBase.size - 1) {
          _this.layer.toImage({
            width: chunkSizeX + tileSizeX / 2,
            height: chunkSizeY,
            callback: function(img) {
              pos = Map.MapClient.PosToIsoScreen(_this.pos);
              _this.image = new Kinetic.Image({
                image: img,
                x: pos.x,
                y: pos.y
              });
              mapContainer.add(_this.image);
              mainContainer.draw();
              return scope.updateLoadMessages('map', _this.image);
            }
          });
          return _this.tileQueue.Stop();
        }
      });
      this.tileQueue.Start();
      _ref = this.resources;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        arr = _ref[_i];
        i = 0;
        for (_j = 0, _len1 = arr.length; _j < _len1; _j++) {
          res = arr[_j];
          tmp = function(res) {
            var type;
            type = grassImage;
            if ((0 <= res && res < 5)) {
              type = uraniumImage;
            }
            if ((5 <= res && res < 10)) {
              type = petrolImage;
            }
            if ((10 <= res && res < 20)) {
              type = cristalImage;
            }
            if ((20 <= res && res < 35)) {
              type = goldImage;
            }
            if ((35 <= res && res < 55)) {
              type = ironImage;
            }
            if (55 <= res) {
              type = grassImage;
            }
            return _this.tileQueue.Push({
              x: i,
              y: j,
              type: type
            });
          };
          tmp(res);
          i++;
        }
        j++;
      }
    }

    return ChunkClient;

  })(Module);

  Map.MapClient = (function(_super) {

    __extends(MapClient, _super);

    MapClient.include(Map.MapBase);

    MapClient.prototype.socket = null;

    MapClient.prototype.objects = null;

    MapClient.prototype.visibles = null;

    MapClient.prototype.rangeX = null;

    MapClient.prototype.rangeY = null;

    MapClient.prototype.scale = null;

    MapClient.prototype.scope = null;

    MapClient.prototype.chunkQueue = null;

    MapClient.prototype.viewPos = null;

    function MapClient(socket, scope) {
      var iso, pos, ui,
        _this = this;
      MapClient.__super__.constructor.call(this);
      this.socket = socket;
      this.objects = [];
      this.visibles = [];
      this.scale = 1;
      this.scope = scope;
      this.chunkQueue = new Helpers.Queue(1, function(object) {
        return _this.AddChunk(new Map.Chunk.ChunkClient(object, _this.scope));
      });
      this.chunkQueue.Start();
      this.rangeX = Math.floor(document.body.scrollWidth / (tileSizeX * this.scale * 2 * Map.Chunk.ChunkBase.size)) + 3;
      this.rangeY = Math.floor(document.body.scrollHeight / (tileSizeY * this.scale * 2 * Map.Chunk.ChunkBase.size)) + 3;
      pos = {
        x: Math.floor(-stage.attrs.x + document.body.scrollWidth / 2),
        y: Math.floor(-stage.attrs.y + document.body.scrollHeight / 2)
      };
      iso = Map.MapClient.IsoScreenToPos(pos);
      iso.x = iso.x - Map.Chunk.ChunkBase.size / 2;
      iso.y = iso.y - Map.Chunk.ChunkBase.size / 2;
      this.viewPos = iso;
      stage.on('dragstart', function(e) {
        return _this.chunkQueue.Stop();
      });
      stage.on('dragend', function(e) {
        pos = {
          x: Math.floor(-stage.attrs.x + document.body.scrollWidth / 2),
          y: Math.floor(-stage.attrs.y + document.body.scrollHeight / 2)
        };
        iso = Map.MapClient.IsoScreenToPos(pos);
        iso.x = iso.x - Map.Chunk.ChunkBase.size;
        iso.y = iso.y - Map.Chunk.ChunkBase.size;
        _this.viewPos = iso;
        _this.chunkQueue.SortNearest(_this.viewPos);
        _this.chunkQueue.Start();
        return _this.socket.emit('viewPos', {
          viewPos: _this.viewPos,
          range: 5
        });
      });
      stage.on('dragmove', function(e) {
        return _this.UpdateVisibleChunk();
      });
      ui = {
        zoomFactor: 1.1,
        origin: {
          x: 0,
          y: 0
        },
        zoom: function(event) {
          var evt, mx, my, newscale, wheel, zoom2;
          event.preventDefault();
          evt = event.originalEvent;
          mx = document.body.scrollWidth / 2;
          my = document.body.scrollHeight / 2;
          wheel = (evt.wheelDelta / 120 < 0 ? 0.2 : 0);
          if (wheel > 0 && _this.scale < 0.4) {
            return;
          }
          if (wheel === 0 && _this.scale > 3) {
            return;
          }
          zoom2 = ui.zoomFactor - wheel;
          newscale = _this.scale * zoom2;
          stage.setOffset(ui.origin.x, ui.origin.y);
          _this.scale *= zoom2;
          stage.setScale(_this.scale);
          stage.draw();
          _this.rangeX = Math.floor(document.body.scrollWidth / (tileSizeX * _this.scale * 2 * Map.Chunk.ChunkBase.size)) + 3;
          return _this.rangeY = Math.floor(document.body.scrollHeight / (tileSizeY * _this.scale * 2 * Map.Chunk.ChunkBase.size)) + 3;
        }
      };
      $(stage.content).on("mousewheel", ui.zoom);
      this.socket.on('chunkObject', function(chunk) {
        _this.chunkQueue.Push(chunk);
        return _this.chunkQueue.SortNearest(_this.viewPos);
      });
    }

    MapClient.prototype.IsVisible = function(chunk) {
      var visible, _i, _len, _ref;
      _ref = this.visibles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        visible = _ref[_i];
        if (chunk === visible) {
          return true;
        }
      }
      return false;
    };

    MapClient.prototype.AddToMap = function(object, type) {
      var build;
      switch (type) {
        case 'building':
          build = null;
          object.own = false;
          switch (object.name) {
            case 'cityHall':
              build = new Tower.Building.CityHall.CityHallClient(null, object, this.socket);
              break;
            case 'ironMine':
              build = new Tower.Building.IronMine.IronMineClient(null, object, this.socket);
              break;
            case 'goldMine':
              build = new Tower.Building.GoldMine.GoldMineClient(null, object, this.socket);
              break;
            case 'cristalMine':
              build = new Tower.Building.CristalMine.CristalMineClient(null, object, this.socket);
              break;
            case 'uraniumMine':
              build = new Tower.Building.UraniumMine.UraniumMineClient(null, object, this.socket);
              break;
            case 'petrolMine':
              build = new Tower.Building.PetrolMine.PetrolMineClient(null, object, this.socket);
              break;
            case 'solarCentral':
              build = new Tower.Building.SolarCentral.SolarCentralClient(null, object, this.socket);
              break;
            case 'soldierSpawnerTower':
              build = new Tower.SpawnTower.SoldierSpawner.SoldierSpawnerClient(null, object, this.socket);
              break;
            case 'baseDefenseTower':
              build = new Tower.DefTower.BaseDefense.BaseDefenseClient(null, object, this.socket);
          }
          build.own = false;
          return this.objects.push(build);
      }
    };

    MapClient.prototype.UpdateVisibleChunk = function() {
      var pos, realIso,
        _this = this;
      pos = {
        x: Math.floor(-stage.attrs.x + document.body.scrollWidth / 2) - Map.Chunk.ChunkBase.size * tileSizeX / 2,
        y: Math.floor(-stage.attrs.y + document.body.scrollHeight / 2) - Map.Chunk.ChunkBase.size * tileSizeY / 2
      };
      realIso = Map.MapClient.IsoScreenToPos(pos);
      this.UpdateChunkHide();
      return this.GetChunkNear(realIso, {
        x: this.rangeX,
        y: this.rangeY
      }, function(chunk, pos) {
        if (!(chunk != null)) {
          _this.AddChunk({
            pos: pos
          });
          _this.socket.emit('getChunk', pos);
          return _this.scope.updateLoadMessages('chunk');
        } else {
          if ((chunk.image != null) && !(_this.IsVisible(chunk))) {
            _this.visibles.push(chunk);
            _this.scope.visibleChunks = _this.visibles.length;
            return chunk.image.show();
          }
        }
      });
    };

    MapClient.prototype.UpdateChunkHide = function() {
      var i, p, visible, _i, _len, _ref;
      p = {
        x: Math.floor(-stage.attrs.x + document.body.scrollWidth / 2) - Map.Chunk.ChunkBase.size * tileSizeX / 2,
        y: Math.floor(-stage.attrs.y + document.body.scrollHeight / 2) - Map.Chunk.ChunkBase.size * tileSizeY / 2
      };
      i = 0;
      _ref = this.visibles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        visible = _ref[_i];
        if ((visible != null) && (p != null)) {
          if ((visible.image.attrs.x > p.x + this.rangeX * Map.Chunk.ChunkBase.size * tileSizeX) || (visible.image.attrs.x < p.x - this.rangeX * Map.Chunk.ChunkBase.size * tileSizeX) || (visible.image.attrs.y > p.y + this.rangeY * Map.Chunk.ChunkBase.size * tileSizeY) || (visible.image.attrs.y < p.y - this.rangeY * Map.Chunk.ChunkBase.size * tileSizeY)) {
            if (visible.image != null) {
              visible.image.hide();
            }
            this.visibles.splice(i, 1);
          }
        }
        i++;
      }
      return this.scope.visibleChunks = this.visibles.length;
    };

    MapClient.PosToIsoScreen = function(pos) {
      var res;
      res = {};
      res.x = (pos.x - pos.y) * (tileSizeX / 2);
      res.y = (pos.x + pos.y) * (tileSizeY / 2);
      return res;
    };

    MapClient.PosToIso = function(pos) {
      var res;
      res = {};
      res.x = (pos.x - pos.y) / 2;
      res.y = (pos.x + pos.y) / 2;
      return res;
    };

    MapClient.IsoScreenToPos = function(pos) {
      var res;
      res = {};
      res.x = Math.floor((pos.x / (tileSizeX / 2) + pos.y / (tileSizeY / 2)) / 2);
      res.y = Math.floor((pos.y / (tileSizeY / 2) - pos.x / (tileSizeX / 2)) / 2);
      return res;
    };

    MapClient.IsoToPos = function(pos) {
      var res;
      res = {};
      res.x = (pos.x / 2 + pos.y / 2) * 2;
      res.y = (pos.y / 2 - pos.x / 2) * 2;
      return res;
    };

    return MapClient;

  })(Module);

  Resources.ResourcesClient = (function(_super) {

    __extends(ResourcesClient, _super);

    ResourcesClient.include(Resources.ResourcesBase);

    ResourcesClient.prototype.scope = null;

    function ResourcesClient(city, socket, scope) {
      var _this = this;
      this.city = city;
      this.socket = socket;
      this.scope = scope;
      ResourcesClient.__super__.constructor.call(this, []);
      this.id = this.city.id;
      this.socket.on('updateResources' + this.id, function(resources) {
        return _this.Deserialize(resources);
      });
      setInterval(function() {
        return _this.UpdateResources();
      }, 30000);
      this.UpdateResources();
    }

    ResourcesClient.prototype.UpdateResources = function() {
      return this.socket.emit('updateResources' + this.id);
    };

    return ResourcesClient;

  })(Module);

  Social.Channel.ChannelBase = (function() {

    ChannelBase.prototype.name = null;

    ChannelBase.prototype.people = null;

    function ChannelBase(data) {
      this.name = data.name;
      this.people = [];
    }

    ChannelBase.prototype.AddPeople = function(player) {
      return this.people.push(player);
    };

    return ChannelBase;

  })();

  Social.Channel.ChannelClient = (function(_super) {

    __extends(ChannelClient, _super);

    ChannelClient.prototype.messages = null;

    ChannelClient.prototype.socket = null;

    ChannelClient.prototype.scope = null;

    function ChannelClient(channel, socket, scope) {
      ChannelClient.__super__.constructor.call(this, channel);
      this.messages = [];
      this.socket = socket;
      this.scope = scope;
    }

    ChannelClient.prototype.AddMessage = function(message) {
      return this.messages.push(message);
    };

    ChannelClient.prototype.AskAddMessage = function(message) {
      return this.socket.emit('askMessageChannel', message);
    };

    ChannelClient.prototype.AddPeople = function(people) {
      return ChannelClient.__super__.AddPeople.call(this, people);
    };

    return ChannelClient;

  })(Social.Channel.ChannelBase);

  Social.Channel.ChannelServer = (function(_super) {

    __extends(ChannelServer, _super);

    ChannelServer.prototype.sockets = null;

    function ChannelServer(channel, sockets) {
      ChannelServer.__super__.constructor.call(this, channel);
      this.sockets = sockets;
    }

    ChannelServer.prototype.AddPeople = function(player) {
      ChannelServer.__super__.AddPeople.call(this, player);
      player.socket.join(this.name);
      player.socket.emit('iJoinedChannel', {
        name: this.name
      });
      return this.sockets["in"](this.name).emit('joinedChannel', {
        name: this.name,
        player: player.login
      });
    };

    ChannelServer.prototype.AddMessage = function(message) {
      return this.sockets["in"](this.name).emit('messageChannel', message);
    };

    return ChannelServer;

  })(Social.Channel.ChannelBase);

  Social.Chat.ChatClient = (function(_super) {

    __extends(ChatClient, _super);

    ChatClient.prototype.socket = null;

    ChatClient.prototype.scope = null;

    function ChatClient(socket, scope) {
      var _this = this;
      ChatClient.__super__.constructor.call(this);
      this.channels = [];
      this.socket = socket;
      this.scope = scope;
      this.socket.on('iJoinedChannel', function(channel) {
        return _this.IJoinChannel(channel);
      });
      this.socket.on('joinedChannel', function(channel) {
        var _ref;
        return (_ref = _this.channels[channel.name]) != null ? _ref.AddPeople(channel.player) : void 0;
      });
      this.socket.on('messageChannel', function(message) {
        return _this.channels[message.channel].AddMessage(message);
      });
    }

    ChatClient.prototype.AskJoinChannel = function(name) {
      return this.socket.emit('askJoinChannel', {
        name: name
      });
    };

    ChatClient.prototype.IJoinChannel = function(channel) {
      var _this = this;
      if (!this.ChannelExists(channel)) {
        this.AddChannel(new Social.Channel.ChannelClient(channel, this.socket, this.scope));
        return this.scope.$apply(function() {
          return _this.scope.channels = _this.channels;
        });
      }
    };

    ChatClient.prototype.AddChannel = function(channel) {
      var i, j, _ref, _results;
      if (!this.ChannelExists(channel)) {
        this.channels[channel.name] = channel;
        _ref = this.channels;
        _results = [];
        for (i in _ref) {
          j = _ref[i];
          _results.push(1);
        }
        return _results;
      }
    };

    return ChatClient;

  })(Social.Chat.ChatBase);

  Technology.TechnologyClient = (function(_super) {

    __extends(TechnologyClient, _super);

    TechnologyClient.include(Technology.TechnologyBase);

    function TechnologyClient(parent, techno, socket, scope) {
      var _this = this;
      this.parent = parent;
      this.socket = socket;
      this.scope = scope;
      TechnologyClient.__super__.constructor.call(this, [techno]);
      this.socket.on('updateTechno' + this.id, function(techno) {
        return _this.Deserialize(techno);
      });
      this.socket.on('levelUpTechno' + this.id, function(techno) {
        return _this.LevelUp(techno);
      });
    }

    TechnologyClient.prototype.AskLevelUp = function() {
      return this.socket.emit('askLevelUpTechno' + this.id);
    };

    TechnologyClient.prototype.LevelUp = function(techno) {
      this.Deserialize(techno);
      return this.Construct();
    };

    TechnologyClient.prototype.Construct = function() {
      var labo, update,
        _this = this;
      this.startTime = new Date(this.startTime.getTime() - globalServerDelay);
      this.finishTime = new Date(this.finishTime.getTime() - globalServerDelay);
      if ((labo = this.parent.parent.currentCity.buildingManager.GetTower('laboratory')) != null) {
        labo.technoProgress.Show();
        return update = setInterval(function() {
          _this.UpdateConstruct(labo);
          if (_this.finishTime < new Date()) {
            clearInterval(update);
            return labo.technoProgress.Hide();
          }
        }, 1000);
      }
    };

    TechnologyClient.prototype.ColorizePriceLevelUp = function(name, menu, city) {
      var color, price;
      price = this.GetPrice();
      color = this.CanLevelUp(city) ? '#080' : '#800';
      return menu.ColorizePrice(name, price, city, color);
    };

    TechnologyClient.prototype.GetContextContent = function(menu, city) {
      var _this = this;
      return {
        "name": this.ColorizePriceLevelUp(this.name + " (" + (this.level + 1) + ")", menu, city),
        "disabled": !this.CanLevelUp(city),
        "callback": function() {
          return _this.AskLevelUp();
        }
      };
    };

    TechnologyClient.prototype.UpdateConstruct = function(labo) {
      var left, now, passed, total;
      now = new Date().getTime();
      total = this.finishTime.getTime() - this.startTime.getTime();
      passed = now - this.startTime.getTime();
      left = new Date(this.finishTime.getTime() - now);
      this.timeLeft = '';
      if (left.getDate() - 1) {
        this.timeLeft += left.getDate() - 1 + 'd ';
      }
      if (left.getHours - 1) {
        this.timeLeft += left.getHours() - 1 + 'h ';
      }
      if (left.getMinutes()) {
        this.timeLeft += left.getMinutes() + 'm';
      }
      this.timeLeft += left.getSeconds() + 's';
      this.percent = Math.floor((passed / total) * 100);
      return labo.technoProgress.Update({
        amount: this.percent,
        total: 100
      });
    };

    return TechnologyClient;

  })(Module);

  Tower.BaseTower.BaseTowerBase = (function() {

    BaseTowerBase.costForm = function(level) {
      return {
        iron: 1 * Math.pow(1.5, level - 1),
        gold: 1 * Math.pow(1.5, level - 1),
        cristal: 0,
        uranium: 0,
        petrol: 0,
        energy: 0,
        pop: 0
      };
    };

    function BaseTowerBase() {
      this.costForm = function(level) {
        return Tower.BaseTower.BaseTowerBase.costForm(level);
      };
      this.evolveList = {
        'baseSpawnTower': Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase,
        'baseDefenseTower': Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerBase
      };
    }

    return BaseTowerBase;

  }).call(this);

  Tower.BaseTower.BaseTowerClient = (function(_super) {

    __extends(BaseTowerClient, _super);

    BaseTowerClient.include(Tower.BaseTower.BaseTowerBase);

    BaseTowerClient.include(Tower.TowerClient);

    function BaseTowerClient(city, baseTower, socket) {
      BaseTowerClient.__super__.constructor.call(this, [], [city, baseTower, socket, baseTowerImage]);
    }

    return BaseTowerClient;

  })(Module);

  Tower.BaseTower.BaseTowerServer = (function(_super) {

    __extends(BaseTowerServer, _super);

    BaseTowerServer.include(Tower.BaseTower.BaseTowerBase);

    BaseTowerServer.include(Tower.TowerServer);

    function BaseTowerServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        BaseTowerServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return BaseTowerServer;

  })(Module);

  Tower.Building.ArchitectOffice.ArchitectOfficeBase = (function() {

    function ArchitectOfficeBase() {
      var _this = this;
      this.costForm = function(level) {
        return {
          iron: 60 * Math.pow(1.5, level - 1),
          gold: 15 * Math.pow(1.5, level - 1),
          cristal: 0,
          uranium: 0,
          petrol: 0,
          energy: 0,
          pop: 0
        };
      };
    }

    return ArchitectOfficeBase;

  })();

  Tower.Building.ArchitectOffice.ArchitectOfficeClient = (function(_super) {

    __extends(ArchitectOfficeClient, _super);

    ArchitectOfficeClient.include(Tower.Building.ArchitectOffice.ArchitectOfficeBase);

    ArchitectOfficeClient.include(Tower.Building.BuildingClient);

    function ArchitectOfficeClient(city, cityHall, socket) {
      ArchitectOfficeClient.__super__.constructor.call(this, [], [city, cityHall, socket, baseDefenseTowerImage]);
    }

    return ArchitectOfficeClient;

  })(Module);

  Tower.Building.ArchitectOffice.ArchitectOfficeServer = (function(_super) {

    __extends(ArchitectOfficeServer, _super);

    ArchitectOfficeServer.include(Tower.Building.ArchitectOffice.ArchitectOfficeBase);

    ArchitectOfficeServer.include(Tower.Building.BuildingServer);

    function ArchitectOfficeServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        ArchitectOfficeServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return ArchitectOfficeServer;

  })(Module);

  Tower.Building.CityHall.CityHallBase = (function() {

    function CityHallBase() {
      var _this = this;
      this.costForm = function(level) {
        return {
          iron: 60 * Math.pow(1.5, level - 1),
          gold: 15 * Math.pow(1.5, level - 1),
          cristal: 0,
          uranium: 0,
          petrol: 0,
          energy: 0,
          pop: 0
        };
      };
    }

    return CityHallBase;

  })();

  Tower.Building.CityHall.CityHallClient = (function(_super) {

    __extends(CityHallClient, _super);

    CityHallClient.include(Tower.Building.CityHall.CityHallBase);

    CityHallClient.include(Tower.Building.BuildingClient);

    function CityHallClient(city, cityHall, socket) {
      var _this = this;
      CityHallClient.__super__.constructor.call(this, [], [city, cityHall, socket, cityHallImage]);
      this.image.setOffset(0, 40);
      if (this.own) {
        this.image.on('mouseenter', function(e) {
          return _this.city.ShowRange();
        });
        this.image.on('mouseout', function(e) {
          return _this.city.HideRange();
        });
      }
    }

    return CityHallClient;

  })(Module);

  Tower.Building.CityHall.CityHallServer = (function(_super) {

    __extends(CityHallServer, _super);

    CityHallServer.include(Tower.Building.CityHall.CityHallBase);

    CityHallServer.include(Tower.Building.BuildingServer);

    function CityHallServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        CityHallServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return CityHallServer;

  })(Module);

  Tower.Building.CristalMine.CristalMineBase = (function() {

    function CristalMineBase() {
      var _this = this;
      this.costForm = function(level) {
        return {
          iron: 60 * Math.pow(1.5, level - 1),
          gold: 15 * Math.pow(1.5, level - 1),
          cristal: 0,
          uranium: 0,
          petrol: 0,
          energy: 0,
          pop: 0
        };
      };
    }

    return CristalMineBase;

  })();

  Tower.Building.CristalMine.CristalMineClient = (function(_super) {

    __extends(CristalMineClient, _super);

    CristalMineClient.include(Tower.Building.CristalMine.CristalMineBase);

    CristalMineClient.include(Tower.Building.BuildingClient);

    function CristalMineClient(city, cityHall, socket) {
      CristalMineClient.__super__.constructor.call(this, [], [city, cityHall, socket, baseDefenseTowerImage]);
    }

    return CristalMineClient;

  })(Module);

  Tower.Building.CristalMine.CristalMineServer = (function(_super) {

    __extends(CristalMineServer, _super);

    CristalMineServer.include(Tower.Building.CristalMine.CristalMineBase);

    CristalMineServer.include(Tower.Building.BuildingServer);

    function CristalMineServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        CristalMineServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return CristalMineServer;

  })(Module);

  Tower.Building.GoldMine.GoldMineBase = (function() {

    function GoldMineBase() {
      var _this = this;
      this.costForm = function(level) {
        return {
          iron: 60 * Math.pow(1.5, level - 1),
          gold: 15 * Math.pow(1.5, level - 1),
          cristal: 0,
          uranium: 0,
          petrol: 0,
          energy: 0,
          pop: 0
        };
      };
    }

    return GoldMineBase;

  })();

  Tower.Building.GoldMine.GoldMineClient = (function(_super) {

    __extends(GoldMineClient, _super);

    GoldMineClient.include(Tower.Building.GoldMine.GoldMineBase);

    GoldMineClient.include(Tower.Building.BuildingClient);

    function GoldMineClient(city, cityHall, socket) {
      GoldMineClient.__super__.constructor.call(this, [], [city, cityHall, socket, baseDefenseTowerImage]);
    }

    return GoldMineClient;

  })(Module);

  Tower.Building.GoldMine.GoldMineServer = (function(_super) {

    __extends(GoldMineServer, _super);

    GoldMineServer.include(Tower.Building.GoldMine.GoldMineBase);

    GoldMineServer.include(Tower.Building.BuildingServer);

    function GoldMineServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        GoldMineServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return GoldMineServer;

  })(Module);

  Tower.Building.IronMine.IronMineBase = (function() {

    function IronMineBase() {
      var _this = this;
      this.costForm = function(level) {
        return {
          iron: 60 * Math.pow(1.5, level - 1),
          gold: 15 * Math.pow(1.5, level - 1),
          cristal: 0,
          uranium: 0,
          petrol: 0,
          energy: 0,
          pop: 0
        };
      };
    }

    return IronMineBase;

  })();

  Tower.Building.IronMine.IronMineClient = (function(_super) {

    __extends(IronMineClient, _super);

    IronMineClient.include(Tower.Building.IronMine.IronMineBase);

    IronMineClient.include(Tower.Building.BuildingClient);

    function IronMineClient(city, cityHall, socket) {
      IronMineClient.__super__.constructor.call(this, [], [city, cityHall, socket, baseDefenseTowerImage]);
    }

    return IronMineClient;

  })(Module);

  Tower.Building.IronMine.IronMineServer = (function(_super) {

    __extends(IronMineServer, _super);

    IronMineServer.include(Tower.Building.IronMine.IronMineBase);

    IronMineServer.include(Tower.Building.BuildingServer);

    function IronMineServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        IronMineServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return IronMineServer;

  })(Module);

  Tower.Building.Laboratory.LaboratoryBase = (function() {

    function LaboratoryBase() {
      var _this = this;
      this.costForm = function(level) {
        return {
          iron: 1 * Math.pow(1.5, level - 1),
          gold: 1 * Math.pow(1.5, level - 1),
          cristal: 0,
          uranium: 0,
          petrol: 0,
          energy: 0,
          pop: 0
        };
      };
    }

    return LaboratoryBase;

  })();

  Tower.Building.Laboratory.LaboratoryClient = (function(_super) {

    __extends(LaboratoryClient, _super);

    LaboratoryClient.include(Tower.Building.Laboratory.LaboratoryBase);

    LaboratoryClient.include(Tower.Building.BuildingClient);

    LaboratoryClient.prototype.percent = 0;

    function LaboratoryClient(city, labo, socket) {
      LaboratoryClient.__super__.constructor.call(this, [], [city, labo, socket, laboratoryImage]);
      this.image.setOffset(0, 10);
      this.MakeTechnoProgress();
    }

    LaboratoryClient.prototype.MakeTechnoMenu = function() {
      var name, techno, technoMenu, _ref;
      technoMenu = {};
      _ref = this.owner.cityManager.technologyManager.technos;
      for (name in _ref) {
        techno = _ref[name];
        technoMenu[name.toString()] = techno.GetContextContent(this.menu, this.city);
      }
      return this.menuContent["technos"] = {
        "name": "Technologies ->",
        "items": technoMenu
      };
    };

    LaboratoryClient.prototype.MakeTechnoProgress = function() {
      this.technoProgress = new ProgressBar.ProgressBar({
        amount: this.percent,
        total: 100
      }, this, 2, 'green');
      this.technoProgress.image.setX(this.technoProgress.image.getX() - 50 + tileSizeX / 2 + (tileSizeX / 2 * (this.posEnd.x - this.pos.x - 1)));
      return this.technoProgress.image.setY(this.technoProgress.image.getY() - (tileSizeY * (this.posEnd.x - this.pos.x + 1)));
    };

    return LaboratoryClient;

  })(Module);

  Tower.Building.Laboratory.LaboratoryServer = (function(_super) {

    __extends(LaboratoryServer, _super);

    LaboratoryServer.include(Tower.Building.Laboratory.LaboratoryBase);

    LaboratoryServer.include(Tower.Building.BuildingServer);

    function LaboratoryServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        LaboratoryServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return LaboratoryServer;

  })(Module);

  Tower.Building.PetrolMine.PetrolMineBase = (function() {

    function PetrolMineBase() {
      var _this = this;
      this.costForm = function(level) {
        return {
          iron: 60 * Math.pow(1.5, level - 1),
          gold: 15 * Math.pow(1.5, level - 1),
          cristal: 0,
          uranium: 0,
          petrol: 0,
          energy: 0,
          pop: 0
        };
      };
    }

    return PetrolMineBase;

  })();

  Tower.Building.PetrolMine.PetrolMineClient = (function(_super) {

    __extends(PetrolMineClient, _super);

    PetrolMineClient.include(Tower.Building.PetrolMine.PetrolMineBase);

    PetrolMineClient.include(Tower.Building.BuildingClient);

    function PetrolMineClient(city, cityHall, socket) {
      PetrolMineClient.__super__.constructor.call(this, [], [city, cityHall, socket, baseDefenseTowerImage]);
    }

    return PetrolMineClient;

  })(Module);

  Tower.Building.PetrolMine.PetrolMineServer = (function(_super) {

    __extends(PetrolMineServer, _super);

    PetrolMineServer.include(Tower.Building.PetrolMine.PetrolMineBase);

    PetrolMineServer.include(Tower.Building.BuildingServer);

    function PetrolMineServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        PetrolMineServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return PetrolMineServer;

  })(Module);

  Tower.Building.SolarCentral.SolarCentralBase = (function() {

    function SolarCentralBase() {
      var _this = this;
      this.costForm = function(level) {
        return {
          iron: 60 * Math.pow(1.5, level - 1),
          gold: 15 * Math.pow(1.5, level - 1),
          cristal: 0,
          uranium: 0,
          petrol: 0,
          energy: 0,
          pop: 0
        };
      };
    }

    return SolarCentralBase;

  })();

  Tower.Building.SolarCentral.SolarCentralClient = (function(_super) {

    __extends(SolarCentralClient, _super);

    SolarCentralClient.include(Tower.Building.SolarCentral.SolarCentralBase);

    SolarCentralClient.include(Tower.Building.BuildingClient);

    function SolarCentralClient(city, cityHall, socket) {
      SolarCentralClient.__super__.constructor.call(this, [], [city, cityHall, socket, baseDefenseTowerImage]);
    }

    return SolarCentralClient;

  })(Module);

  Tower.Building.SolarCentral.SolarCentralServer = (function(_super) {

    __extends(SolarCentralServer, _super);

    SolarCentralServer.include(Tower.Building.SolarCentral.SolarCentralBase);

    SolarCentralServer.include(Tower.Building.BuildingServer);

    function SolarCentralServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        SolarCentralServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return SolarCentralServer;

  })(Module);

  Tower.Building.UraniumMine.UraniumMineBase = (function() {

    function UraniumMineBase() {
      var _this = this;
      this.costForm = function(level) {
        return {
          iron: 60 * Math.pow(1.5, level - 1),
          gold: 15 * Math.pow(1.5, level - 1),
          cristal: 0,
          uranium: 0,
          petrol: 0,
          energy: 0,
          pop: 0
        };
      };
    }

    return UraniumMineBase;

  })();

  Tower.Building.UraniumMine.UraniumMineClient = (function(_super) {

    __extends(UraniumMineClient, _super);

    UraniumMineClient.include(Tower.Building.UraniumMine.UraniumMineBase);

    UraniumMineClient.include(Tower.Building.BuildingClient);

    function UraniumMineClient(city, cityHall, socket) {
      UraniumMineClient.__super__.constructor.call(this, [], [city, cityHall, socket, baseDefenseTowerImage]);
    }

    return UraniumMineClient;

  })(Module);

  Tower.Building.UraniumMine.UraniumMineServer = (function(_super) {

    __extends(UraniumMineServer, _super);

    UraniumMineServer.include(Tower.Building.UraniumMine.UraniumMineBase);

    UraniumMineServer.include(Tower.Building.BuildingServer);

    function UraniumMineServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        UraniumMineServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return UraniumMineServer;

  })(Module);

  Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerClient = (function(_super) {

    __extends(BaseDefenseTowerClient, _super);

    BaseDefenseTowerClient.include(Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerBase);

    BaseDefenseTowerClient.include(Tower.DefenseTower.DefenseTowerClient);

    function BaseDefenseTowerClient(city, tower, socket) {
      BaseDefenseTowerClient.__super__.constructor.call(this, [], [city, tower, socket, baseDefenseTowerImage]);
    }

    return BaseDefenseTowerClient;

  })(Module);

  Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerServer = (function(_super) {

    __extends(BaseDefenseTowerServer, _super);

    BaseDefenseTowerServer.include(Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerBase);

    BaseDefenseTowerServer.include(Tower.DefenseTower.DefenseTowerServer);

    function BaseDefenseTowerServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        BaseDefenseTowerServer.__super__.constructor.call(_this, [], []);
        if (cb != null) {
          return cb();
        }
      });
    }

    return BaseDefenseTowerServer;

  })(Module);

  Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerClient = (function(_super) {

    __extends(BaseSpawnTowerClient, _super);

    BaseSpawnTowerClient.include(Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase);

    BaseSpawnTowerClient.include(Tower.SpawnTower.SpawnTowerClient);

    function BaseSpawnTowerClient(city, soldierSpawner, socket) {
      var _this = this;
      BaseSpawnTowerClient.__super__.constructor.call(this, [], [city, soldierSpawner, socket, baseSpawnTowerImage, Entity.BaseEntity.BaseEntityClient]);
      this.socket.on('changeTarget' + this.id, function(target) {
        return _this.ChangeTarget(target);
      });
    }

    BaseSpawnTowerClient.prototype.AskChangeTarget = function(target) {
      return this.socket.emit('askChangeTarget' + this.id, {
        id: target.id,
        owner: target.city.owner.id,
        city: target.city.id
      });
    };

    BaseSpawnTowerClient.prototype.ChangeTarget = function(target) {
      return this._super(target);
    };

    BaseSpawnTowerClient.prototype.AskStartSpawn = function() {
      return this.socket.emit('askStartSpawn' + this.id);
    };

    BaseSpawnTowerClient.prototype.AskStopSpawn = function() {
      return this.socket.emit('askStopSpawn' + this.id);
    };

    return BaseSpawnTowerClient;

  })(Module);

  Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerServer = (function(_super) {

    __extends(BaseSpawnTowerServer, _super);

    BaseSpawnTowerServer.include(Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase);

    BaseSpawnTowerServer.include(Tower.SpawnTower.SpawnTowerServer);

    function BaseSpawnTowerServer(city, id, cb) {
      var _this = this;
      this.city = city;
      this.id = id;
      this.InitDb(Tower.schema, this.id, function() {
        BaseSpawnTowerServer.__super__.constructor.call(_this, [], [Entity.BaseEntity.BaseEntityServer]);
        if (cb != null) {
          return cb();
        }
      });
    }

    return BaseSpawnTowerServer;

  })(Module);

  TowerManager.DefTowerManager.DefTowerManagerBase = (function() {

    function DefTowerManagerBase() {}

    return DefTowerManagerBase;

  })();

  TowerManager.DefTowerManager.DefTowerManagerClient = (function(_super) {

    __extends(DefTowerManagerClient, _super);

    DefTowerManagerClient.include(TowerManager.DefTowerManager.DefTowerManagerBase);

    function DefTowerManagerClient(city) {
      DefTowerManagerClient.__super__.constructor.call(this, [city]);
    }

    return DefTowerManagerClient;

  })(Module);

  TowerManager.DefTowerManager.DefTowerManagerServer = (function(_super) {

    __extends(DefTowerManagerServer, _super);

    DefTowerManagerServer.include(TowerManager.DefTowerManager.DefTowerManagerBase);

    function DefTowerManagerServer(city) {
      DefTowerManagerServer.__super__.constructor.call(this, [city]);
    }

    DefTowerManagerServer.prototype.NewBuilding = function(building, socket) {
      var _this = this;
      return this.dbManager.NewBuilding(building, this.GetPriceOf(building.name, 1).time, function(build) {
        var newBuild;
        newBuild = new Tower.Building.BuildingServer(build, build._city);
        _this.AddTower(newBuild);
        return newBuild.SendTo(socket, true, false);
      });
    };

    DefTowerManagerServer.prototype.GetPriceOf = function(building, level) {
      var price;
      price = (function() {
        switch (building) {
          case 'ironMine':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'goldMine':
            return {
              iron: 48 * Math.pow(1.6, level - 1),
              gold: 24 * Math.pow(1.6, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'cristalMine':
            return {
              iron: 225 * Math.pow(1.5, level - 1),
              gold: 75 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'uraniumMine':
            return {
              iron: 527 * Math.pow(1.8, level - 1),
              gold: 480 * Math.pow(1.8, level - 1),
              cristal: 240 * Math.pow(1.8, level - 1),
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'petrolMine':
            return {
              iron: 0,
              gold: 0,
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'solarMine':
            return {
              iron: 75 * Math.pow(1.5, level - 1),
              gold: 30 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
          case 'architectOffice':
            return {
              iron: 60 * Math.pow(1.5, level - 1),
              gold: 15 * Math.pow(1.5, level - 1),
              cristal: 0,
              uranium: 0,
              petrol: 0,
              energy: 0,
              pop: 0
            };
        }
      })();
      price.time = Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000;
      return price;
    };

    DefTowerManagerServer.prototype.CanBuy = function(building, level) {
      var price;
      price = this.GetPriceOf(building, level);
      if (price.iron > this.city.resources.iron || price.gold > this.city.resources.gold || price.cristal > this.city.resources.cristal || price.uranium > this.city.resources.uranium || price.petrol > this.city.resources.petrol || price.energy > this.city.resources.energy || price.pop > this.city.resources.pop) {
        return false;
      } else {
        return true;
      }
    };

    return DefTowerManagerServer;

  })(Module);

  TowerManager.SpawnTowerManager.SpawnTowerManagerBase = (function() {

    function SpawnTowerManagerBase() {}

    return SpawnTowerManagerBase;

  })();

  TowerManager.SpawnTowerManager.SpawnTowerManagerClient = (function(_super) {

    __extends(SpawnTowerManagerClient, _super);

    SpawnTowerManagerClient.include(TowerManager.SpawnTowerManager.SpawnTowerManagerBase);

    function SpawnTowerManagerClient(city) {
      SpawnTowerManagerClient.__super__.constructor.call(this, [city]);
    }

    return SpawnTowerManagerClient;

  })(Module);

  TowerManager.SpawnTowerManager.SpawnTowerManagerServer = (function(_super) {

    __extends(SpawnTowerManagerServer, _super);

    SpawnTowerManagerServer.include(TowerManager.SpawnTowerManager.SpawnTowerManagerBase);

    function SpawnTowerManagerServer(city) {
      SpawnTowerManagerServer.__super__.constructor.call(this, [city]);
    }

    return SpawnTowerManagerServer;

  })(Module);

}).call(this);
