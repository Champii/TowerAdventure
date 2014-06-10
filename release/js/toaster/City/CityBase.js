(function() {

  City.CityBase = (function() {

    CityBase.prototype.name = null;

    CityBase.prototype.pos = null;

    CityBase.prototype.range = null;

    CityBase.prototype.isMain = null;

    CityBase.prototype.resources = null;

    CityBase.prototype.buildingManager = null;

    CityBase.prototype.resources = null;

    function CityBase(city, resources) {
      this.name = city.name;
      this.pos = city.pos;
      this.range = city.range;
      this.isMain = city.isMain;
      this.resources = resources;
    }

    CityBase.prototype.SendTo = function(socket, isOwner, isRec) {
      var command;
      command = isOwner ? 'ownCityObject' : 'cityObject';
      socket.emit(command, {
        name: this.name,
        pos: this.pos,
        range: this.range,
        isMain: this.isMain
      });
      this.resources.UpdateResources(socket);
      this.resources.SendTo(socket);
      if (isRec) {
        return this.buildingManager.SendAllTo(socket, isOwner, isRec);
      }
    };

    return CityBase;

  })();

}).call(this);
