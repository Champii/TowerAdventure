(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Building.BuildingServer = (function(_super) {

    __extends(BuildingServer, _super);

    function BuildingServer(building) {
      this.name = building.name;
      this.level = building.name;
    }

    return BuildingServer;

  })(Building.BuildingBase);

}).call(this);
