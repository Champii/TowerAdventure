(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Building.BuildingServer = (function(_super) {

    __extends(BuildingServer, _super);

    function BuildingServer(building, city) {
      BuildingServer.__super__.constructor.call(this, building, city);
      this.pos = {
        x: building.pos[0],
        y: building.pos[1]
      };
    }

    return BuildingServer;

  })(Building.BuildingBase);

}).call(this);
