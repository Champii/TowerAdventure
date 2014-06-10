(function() {

  Resources.ResourcesBase = (function() {

    ResourcesBase.prototype.city = null;

    ResourcesBase.prototype.iron = null;

    ResourcesBase.prototype.gold = null;

    ResourcesBase.prototype.cristal = null;

    ResourcesBase.prototype.uranium = null;

    ResourcesBase.prototype.petrol = null;

    ResourcesBase.prototype.energy = null;

    function ResourcesBase(resources, city) {
      if ((resources != null)) {
        this.iron = resources.iron;
        this.gold = resources.gold;
        this.cristal = resources.cristal;
        this.uranium = resources.uranium;
        this.petrol = resources.petrol;
        this.energy = resources.energy;
        this.pop = resources.pop;
      }
      this.city = city;
    }

    ResourcesBase.prototype.SendTo = function(socket) {
      return socket.emit('resources', {
        city: this.city.name,
        iron: Math.floor(this.iron),
        gold: Math.floor(this.gold),
        cristal: Math.floor(this.cristal),
        uranium: Math.floor(this.uranium),
        petrol: Math.floor(this.petrol),
        energy: this.energy,
        pop: this.pop
      });
    };

    return ResourcesBase;

  })();

}).call(this);
