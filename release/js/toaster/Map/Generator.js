(function() {

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

}).call(this);
