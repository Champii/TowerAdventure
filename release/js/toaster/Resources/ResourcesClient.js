(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Resources.ResourcesClient = (function(_super) {

    __extends(ResourcesClient, _super);

    function ResourcesClient(resources, city) {
      ResourcesClient.__super__.constructor.call(this, resources, city);
    }

    ResourcesClient.prototype.UpdateResources = function(resources) {
      if (resources) {
        this.iron = resources.iron;
        this.gold = resources.gold;
        this.cristal = resources.cristal;
        this.uranium = resources.uranium;
        this.petrol = resources.petrol;
        this.energy = resources.energy;
        return this.pop = resources.pop;
      }
    };

    ResourcesClient.prototype.GetResources = function(socket) {
      return socket.emit('getResources', {
        name: this.city.name
      });
    };

    return ResourcesClient;

  })(Resources.ResourcesBase);

}).call(this);
