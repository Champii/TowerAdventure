(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Map.Chunk.ChunkClient = (function(_super) {

    __extends(ChunkClient, _super);

    function ChunkClient(chunk) {
      ChunkClient.__super__.constructor.call(this, chunk);
    }

    return ChunkClient;

  })(Map.Chunk.ChunkBase);

}).call(this);
