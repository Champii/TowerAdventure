(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  City.CityClient = (function(_super) {

    __extends(CityClient, _super);

    CityClient.prototype.socket = null;

    CityClient.prototype.scope = null;

    CityClient.prototype.rangeImage = null;

    function CityClient(city, socket, scope) {
      CityClient.__super__.constructor.call(this, city);
      this.scope = scope;
      this.socket = socket;
      this.resources = new Resources.ResourcesClient(null, this);
      this.buildingManager = new BuildingManager.BuildingManagerClient(this, this.socket);
    }

    CityClient.prototype.MakeRangeImage = function(callback) {
      var i, j, pos, rangeGroup, tile, _i, _j, _ref, _ref1,
        _this = this;
      rangeGroup = new Kinetic.Group();
      for (i = _i = 0, _ref = (this.range * 2) + 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        for (j = _j = 0, _ref1 = (this.range * 2) + 2; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          pos = Map.MapClient.GetIsoPos({
            x: i,
            y: j
          });
          tile = new Kinetic.Image({
            image: cityRangeImage,
            x: pos.x,
            y: pos.y + tileSizeY * this.range + tileSizeY
          });
          rangeGroup.add(tile);
        }
      }
      return rangeGroup.toImage({
        width: tileSizeX * (this.range * 2) + tileSizeX * 3,
        height: tileSizeY * (this.range * 2) * 2,
        callback: function(img) {
          pos = Map.MapClient.GetIsoPos(_this.pos);
          _this.rangeImage = new Kinetic.Image({
            image: img,
            x: pos.x - (_this.range * tileSizeX),
            y: pos.y - (_this.range * tileSizeY) - tileSizeY,
            opacity: 0.2
          });
          rangeContainer.add(_this.rangeImage);
          if (callback) {
            return callback();
          }
        }
      });
    };

    CityClient.prototype.ShowRange = function() {
      var _this = this;
      if (!(this.rangeImage != null)) {
        return this.MakeRangeImage(function() {
          _this.rangeImage.show();
          return mainContainer.draw();
        });
      } else {
        this.rangeImage.show();
        return mainContainer.draw();
      }
    };

    CityClient.prototype.HideRange = function() {
      var _this = this;
      if (!(this.rangeImage != null)) {
        return this.MakeRangeImage(function() {
          _this.rangeImage.hide();
          return mainContainer.draw();
        });
      } else {
        this.rangeImage.hide();
        return mainContainer.draw();
      }
    };

    return CityClient;

  })(City.CityBase);

}).call(this);
