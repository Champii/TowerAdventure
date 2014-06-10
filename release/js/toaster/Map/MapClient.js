(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Map.MapClient = (function(_super) {

    __extends(MapClient, _super);

    MapClient.prototype.socket = null;

    MapClient.prototype.objects = null;

    MapClient.prototype.visibles = null;

    MapClient.prototype.rangeX = null;

    MapClient.prototype.rangeY = null;

    MapClient.prototype.scale = null;

    MapClient.prototype.scope = null;

    MapClient.prototype.chunkQueue = null;

    function MapClient(socket, scope) {
      var ui,
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
      this.rangeX = Math.floor(document.body.scrollWidth / (tileSizeX * this.scale * Map.Chunk.ChunkBase.size)) + 2;
      this.rangeY = Math.floor(document.body.scrollHeight / (tileSizeY * this.scale * Map.Chunk.ChunkBase.size)) + 2;
      stage.on('dragstart', function(e) {
        return _this.chunkQueue.Stop();
      });
      stage.on('dragend', function(e) {
        return _this.chunkQueue.Start();
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
          mx = evt.clientX;
          my = evt.clientY;
          wheel = (evt.wheelDelta / 120 < 0 ? 0.2 : 0);
          if (wheel > 0 && _this.scale < 0.4) {
            return;
          }
          if (wheel === 0 && _this.scale > 3) {
            return;
          }
          zoom2 = ui.zoomFactor - wheel;
          newscale = _this.scale * zoom2;
          ui.origin.x = mx / _this.scale + ui.origin.x - mx / newscale;
          ui.origin.y = my / _this.scale + ui.origin.y - my / newscale;
          stage.setOffset(ui.origin.x, ui.origin.y);
          _this.scale *= zoom2;
          stage.setScale(_this.scale);
          stage.draw();
          _this.rangeX = Math.floor(document.body.scrollWidth / (tileSizeX * _this.scale * 2 * (Map.Chunk.ChunkBase.size / 2)));
          return _this.rangeY = Math.floor(document.body.scrollHeight / (tileSizeY * _this.scale * 2 * (Map.Chunk.ChunkBase.size / 2)));
        }
      };
      $(stage.content).on("mousewheel", ui.zoom);
      this.socket.on('chunkObject', function(chunk) {
        return _this.chunkQueue.Push(chunk);
      });
      this.socket.on('buildingObject', function(building) {
        return _this.AddToMap(building, 'building');
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
      switch (type) {
        case 'building':
          return this.objects.push(new Building.BuildingClient(object));
      }
    };

    MapClient.prototype.UpdateVisibleChunk = function() {
      var iso, pos, realIso,
        _this = this;
      pos = {
        x: Math.floor((-stage.attrs.x + document.body.scrollWidth / 2) / tileSizeX),
        y: Math.floor((-stage.attrs.y + document.body.scrollHeight / 2) / tileSizeY)
      };
      iso = Map.MapClient.GetIsoPos(pos);
      realIso = {};
      realIso.x = Math.floor(iso.x / tileSizeX) * 2;
      realIso.y = Math.floor(iso.y / tileSizeY) * 2;
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
            return chunk.image.show();
          }
        }
      });
    };

    MapClient.prototype.UpdateChunkHide = function() {
      var i, p, pos, visible, _i, _len, _ref, _results;
      p = {
        x: Math.floor((-stage.attrs.x + document.body.scrollWidth / 2) / tileSizeX),
        y: Math.floor((-stage.attrs.y + document.body.scrollHeight / 2) / tileSizeY)
      };
      pos = Map.MapClient.GetIsoPos(p);
      pos.x = Math.floor(pos.x / tileSizeX);
      pos.y = Math.floor(pos.y / tileSizeY);
      i = 0;
      _ref = this.visibles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        visible = _ref[_i];
        if ((visible != null) && (pos != null)) {
          if ((visible.pos.x > p.x + (this.rangeX + Map.Chunk.ChunkBase.size)) || (visible.pos.x < p.x - (this.rangeX + Map.Chunk.ChunkBase.size)) || (visible.pos.y > p.y + (this.rangeY + Map.Chunk.ChunkBase.size)) || (visible.pos.y < p.y - (this.rangeY + Map.Chunk.ChunkBase.size))) {
            if (visible.image != null) {
              visible.image.hide();
            }
            this.visibles.splice(i, 1);
          }
        }
        _results.push(i++);
      }
      return _results;
    };

    MapClient.GetIsoPos = function(pos) {
      var res;
      res = {};
      res.x = (pos.y * tileSizeX / 2) + (pos.x * tileSizeX / 2);
      res.y = (pos.x * tileSizeY / 2) - (pos.y * tileSizeY / 2);
      return res;
    };

    return MapClient;

  })(Map.MapBase);

}).call(this);
