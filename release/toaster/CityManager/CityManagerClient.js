(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CityManager.CityManagerClient = (function(_super) {

    __extends(CityManagerClient, _super);

    CityManagerClient.prototype.socket = null;

    function CityManagerClient(player, socket) {
      var city, _i, _len, _ref,
        _this = this;
      this.citys = [];
      this.socket = socket;
      this.socket.on('cityObject', function(data) {
        console.log(data);
        return _this.AddCity(new City.CityClient(data));
      });
      _ref = player.citys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        city = _ref[_i];
        this.socket.emit('getCity', city);
      }
    }

    return CityManagerClient;

  })(CityManager.CityManagerBase);

}).call(this);
