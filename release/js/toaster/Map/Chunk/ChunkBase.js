(function() {

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

}).call(this);
