(function() {

  Map.MapBase = (function() {

    MapBase.prototype.chunks = [];

    function MapBase() {}

    MapBase.prototype.AddChunk = function(chunk) {
      return this.chunks.push(chunk);
    };

    MapBase.prototype.SendTo = function(socket) {
      return socket.emit('mapObject', {});
    };

    return MapBase;

  })();

}).call(this);
