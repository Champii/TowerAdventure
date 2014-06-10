(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Map.MapClient = (function(_super) {

    __extends(MapClient, _super);

    MapClient.prototype.socket = null;

    function MapClient(socket) {
      var _this = this;
      this.socket = socket;
      this.socket.on('chunkObject', function(chunk) {
        return _this.AddChunk(new Map.Chunk.ChunkClient(chunk));
      });
    }

    return MapClient;

  })(Map.MapBase);

}).call(this);
