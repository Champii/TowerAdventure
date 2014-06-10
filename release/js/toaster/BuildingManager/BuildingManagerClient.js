(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BuildingManager.BuildingManagerClient = (function(_super) {

    __extends(BuildingManagerClient, _super);

    BuildingManagerClient.prototype.socket = null;

    function BuildingManagerClient(city, socket) {
      BuildingManagerClient.__super__.constructor.call(this, city);
      this.socket = socket;
    }

    BuildingManagerClient.prototype.PlaceNewBuilding = function(name, pos) {
      var build, type,
        _this = this;
      type = cityHallImage;
      switch (name) {
        case 'ironMine':
          type = cityHallImage;
      }
      build = new Kinetic.Image({
        image: type,
        x: pos.x * tileSizeX,
        y: pos.y * tileSizeY,
        offset: {
          y: 85
        },
        opacity: 0.5,
        draggable: true,
        dragBoundFunc: function(pos) {
          return {
            x: pos.x - pos.x % 40,
            y: pos.y - pos.y % 10
          };
        }
      });
      build.on('dragstart', function(e) {
        return e.cancelBubble = true;
      });
      build.on('mousedown', function(e) {
        return stage.setDraggable(false);
      });
      build.on('mouseUp', function(e) {
        return stage.setDraggable(true);
      });
      build.on('dragend', function(e) {
        stage.setDraggable(true);
        build.remove();
        _this.socket.emit('buyBuilding', {
          cityName: _this.city.name,
          name: name,
          level: 1,
          pos: {
            x: e.shape.attrs.x / 40,
            y: e.shape.attrs.y / 10
          }
        });
        return mainContainer.draw();
      });
      buildingsContainer.add(build);
      return mainContainer.draw();
    };

    BuildingManagerClient.prototype.UpdateAllConstruct = function() {
      var build, i, _i, _len, _ref, _results;
      i = 0;
      _ref = this.buildingsConstruct;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        build = _ref[_i];
        if (build != null) {
          if (build != null) {
            build.UpdateConstruct();
          }
          if ((build != null) && build.finishTime < new Date()) {
            if (build) {
              build.underConstruct = false;
            }
            if (build) {
              build.timeLeft = 0;
            }
            if (build) {
              this.buildingsConstruct.splice(i, 1);
            }
          }
        }
        _results.push(i++);
      }
      return _results;
    };

    return BuildingManagerClient;

  })(BuildingManager.BuildingManagerBase);

}).call(this);
