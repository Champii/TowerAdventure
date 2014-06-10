(function() {

  Building.BuildingBase = (function() {

    BuildingBase.prototype.name = null;

    BuildingBase.prototype.pos = null;

    BuildingBase.prototype.posEnd = null;

    BuildingBase.prototype.level = 0;

    BuildingBase.prototype.city = null;

    BuildingBase.prototype.underConstruct = null;

    BuildingBase.prototype.finishTime = null;

    function BuildingBase(building, city) {
      this.name = building.name;
      this.pos = building.pos;
      this.posEnd = building.posEnd;
      this.level = building.level;
      this.underConstruct = building.underConstruct;
      this.startTime = new Date(building.startTime);
      this.finishTime = new Date(building.finishTime);
      this.city = city;
    }

    BuildingBase.prototype.SendTo = function(socket, isOwner, isRec) {
      var command;
      command = isOwner ? 'ownBuildingObject' : 'buildingObject';
      return socket.emit(command, {
        name: this.name,
        pos: this.pos,
        posEnd: this.posEnd,
        level: this.level,
        city: this.city,
        underConstruct: this.underConstruct,
        startTime: this.startTime,
        finishTime: this.finishTime
      });
    };

    return BuildingBase;

  })();

}).call(this);
