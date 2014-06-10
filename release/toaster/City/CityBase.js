(function() {

  City.CityBase = (function() {

    CityBase.prototype.name = null;

    CityBase.prototype.buildingManager = null;

    function CityBase() {}

    CityBase.prototype.SendTo = function(socket) {
      return socket.emit('cityObject', {
        name: this.name
      });
    };

    return CityBase;

  })();

}).call(this);
