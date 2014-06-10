(function() {
  var tileSizeX, tileSizeY,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  tileSizeX = 40;

  tileSizeY = 20;

  Map.Chunk.ChunkClient = (function(_super) {

    __extends(ChunkClient, _super);

    ChunkClient.prototype.layer = null;

    ChunkClient.prototype.image = null;

    ChunkClient.prototype.tileQueue = null;

    function ChunkClient(chunk, scope) {
      var arr, i, j, res, tmp, _i, _j, _len, _len1, _ref,
        _this = this;
      ChunkClient.__super__.constructor.call(this, chunk);
      this.pos = chunk.pos;
      j = 0;
      this.layer = new Kinetic.Group();
      this.tileQueue = new Helpers.Queue(1, function(object) {
        var pos, tile;
        pos = Map.MapClient.GetIsoPos({
          x: object.x,
          y: object.y
        });
        tile = new Kinetic.Image({
          image: object.type,
          x: pos.x,
          y: -pos.y + tileSizeY * Map.Chunk.ChunkClient.size
        });
        _this.layer.add(tile);
        if (object.x === Map.Chunk.ChunkClient.size - 1 && object.y === Map.Chunk.ChunkClient.size - 1) {
          _this.layer.toImage({
            width: (tileSizeX * Map.Chunk.ChunkClient.size) + tileSizeX,
            height: (tileSizeY * Map.Chunk.ChunkClient.size) * 2,
            callback: function(img) {
              pos = Map.MapClient.GetIsoPos(_this.pos);
              _this.image = new Kinetic.Image({
                image: img,
                x: pos.x,
                y: pos.y
              });
              mapContainer.add(_this.image);
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
            if ((20 <= res && res < 30)) {
              type = goldImage;
            }
            if ((30 <= res && res < 40)) {
              type = ironImage;
            }
            if (40 <= res) {
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

  })(Map.Chunk.ChunkBase);

}).call(this);
