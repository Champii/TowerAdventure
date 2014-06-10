(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Map.MapServer = (function(_super) {

    __extends(MapServer, _super);

    function MapServer() {
      var _this = this;
      this.dbManager = Singleton.get(DbManager.DbManager);
      this.dbManager.getAllChunksModels(function(chunks) {
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

    return MapServer;

  })(Map.MapBase);

}).call(this);
