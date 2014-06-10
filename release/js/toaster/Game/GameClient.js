(function() {
  var buildings, buildingsContainer, buildingsSprite, cityHallImage, cityRangeImage, cristalImage, floor, floorSprite, goldImage, grassImage, grassShape, hudContainer, ironImage, mainContainer, mapContainer, peopleContainer, petrolImage, rangeContainer, stage, uraniumImage,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  stage = null;

  mainContainer = null;

  hudContainer = null;

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

  cityRangeImage = null;

  floor = null;

  floorSprite = null;

  buildings = null;

  buildingsSprite = null;

  grassShape = null;

  Game.GameClient = (function(_super) {

    __extends(GameClient, _super);

    GameClient.prototype.socket = null;

    GameClient.prototype.player = null;

    GameClient.prototype.map = null;

    GameClient.prototype.location = null;

    GameClient.prototype.scopeLogin = null;

    GameClient.prototype.scopePanel = null;

    GameClient.prototype.menu = null;

    GameClient.prototype.ready = false;

    GameClient.prototype.chat = null;

    function GameClient(socket) {
      this.socket = socket;
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
      mapContainer = new Kinetic.Container();
      rangeContainer = new Kinetic.Container();
      buildingsContainer = new Kinetic.Container();
      peopleContainer = new Kinetic.Container();
      mainContainer.add(mapContainer);
      mainContainer.add(rangeContainer);
      mainContainer.add(buildingsContainer);
      mainContainer.add(peopleContainer);
      stage.add(mainContainer);
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
      grassShape.toImage({
        height: tileSizeY,
        width: tileSizeX,
        callback: function(img) {
          return grassImage = img;
        }
      });
      ironShape.toImage({
        height: tileSizeY,
        width: tileSizeX,
        callback: function(img) {
          return ironImage = img;
        }
      });
      goldShape.toImage({
        height: tileSizeY,
        width: tileSizeX,
        callback: function(img) {
          return goldImage = img;
        }
      });
      cristalShape.toImage({
        height: tileSizeY,
        width: tileSizeX,
        callback: function(img) {
          return cristalImage = img;
        }
      });
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
        height: tileSizeY,
        width: tileSizeX,
        callback: function(img) {
          return cityRangeImage = img;
        }
      });
      cityHallImage = new Image();
      cityHallImage.src = 'assets/img/city_hall.png';
      cityHallImage.onload = function() {
        console.log('load');
        if (callback != null) {
          return callback();
        }
      };
      buildings = new Image();
      buildings.src = 'assets/img/buildings.png';
      buildings.onload = function() {};
      this.menu = new ContextMenu.ContextMenuStage();
      return mainContainer.on('mousedown', function(e) {
        if (e.button === 2) {
          console.log(e);
          console.log(Math.floor((-stage.attrs.x + (e.x - e.x % tileSizeX)) / tileSizeX), Math.floor((-stage.attrs.y + e.y) / tileSizeY));
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
      this.socket.on('ownPlayerObject', function(data) {
        _this.player = new Player.PlayerClient(data, _this.socket, _this.scopePanel);
        return _this.map = new Map.MapClient(_this.socket, _this.scopePanel);
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
        _this.map.chunkQueue.ChangeTime(Map.Chunk.ChunkBase.size * 3);
        $('#loading').slideUp('slow');
        return stage.draw();
      };
      return this.scopePanel.centerOnCity = function(city) {
        var center;
        _this.scopePanel.currentCity = _this.player.cityManager.currentCity = _this.player.cityManager.GetCity(city.name);
        city.resources.GetResources(_this.socket);
        center = {
          x: -city.pos.x * tileSizeX + document.body.scrollWidth / 2,
          y: -city.pos.y * tileSizeY + document.body.scrollHeight / 2
        };
        stage.setX(center.x);
        stage.setY(center.y);
        _this.map.UpdateVisibleChunk();
        _this.menu.Hide();
        return stage.draw();
      };
    };

    return GameClient;

  })(Game.GameBase);

}).call(this);
