(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  City.CityClient = (function(_super) {

    __extends(CityClient, _super);

    function CityClient(city) {
      this.name = city.name;
    }

    return CityClient;

  })(City.CityBase);

}).call(this);
