(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Building.BuildingClient = (function(_super) {

    __extends(BuildingClient, _super);

    BuildingClient.prototype.menu = null;

    BuildingClient.prototype.percent = 0;

    BuildingClient.prototype.timeLeft = 0;

    function BuildingClient(building, city) {
      var build, pos,
        _this = this;
      BuildingClient.__super__.constructor.call(this, building, city);
      this.menu = ContextMenu.ContextMenuBuilding.get();
      pos = Map.MapClient.GetIsoPos(this.pos);
      build = new Kinetic.Image({
        image: cityHallImage,
        x: pos.x,
        y: pos.y,
        offset: {
          y: 85
        }
      });
      if (building.name === 'cityHall') {
        build.on('mouseenter', function(e) {
          return _this.city.ShowRange();
        });
        build.on('mouseout', function(e) {
          return _this.city.HideRange();
        });
      }
      buildingsContainer.add(build);
      buildingsContainer.draw();
    }

    BuildingClient.prototype.LevelUp = function() {};

    BuildingClient.prototype.UpdateConstruct = function() {
      var left, now, passed, total;
      now = new Date().getTime();
      total = this.finishTime.getTime() - this.startTime.getTime();
      passed = now - this.startTime.getTime();
      left = new Date(this.finishTime.getTime() - now);
      this.timeLeft = '';
      if (left.getDate() - 1) {
        this.timeLeft += left.getDate() - 1 + 'd ';
      }
      if (left.getHours - 1) {
        this.timeLeft += left.getHours() - 1 + 'h ';
      }
      if (left.getMinutes()) {
        this.timeLeft += left.getMinutes() + 'm';
      }
      this.timeLeft += left.getSeconds() + 's';
      return this.percent = Math.floor((passed / total) * 100);
    };

    return BuildingClient;

  })(Building.BuildingBase);

}).call(this);
