(function() {

  Map.MapBase = (function() {

    MapBase.prototype.chunks = null;

    function MapBase() {
      this.chunks = [[]];
    }

    MapBase.prototype.GetChunk = function(pos) {
      var realPos;
      realPos = pos;
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

}).call(this);
