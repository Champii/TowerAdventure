(function() {

  Map.LevelGenerator = (function() {

    function LevelGenerator(table) {
      this._table = table || this.makeTable(255);
      this.octaves = 20;
      this.frequency = 0.01;
      this.persistence = 0.45;
    }

    LevelGenerator.prototype.random = function() {
      return Math.random();
    };

    LevelGenerator.prototype.makeTable = function(size) {
      var n, result, _i, _ref;
      result = [];
      for (n = _i = 0, _ref = size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; n = 0 <= _ref ? ++_i : --_i) {
        result[n] = this.random();
      }
      return result;
    };

    LevelGenerator.prototype.cosineInterpolate = function(a, b, t) {
      var c;
      c = (1 - Math.cos(t * Math.PI)) * 0.5;
      return (1 - c) * a + c * b;
    };

    LevelGenerator.prototype._randify = function(n) {
      return this._table[Math.floor(Math.abs(n) % this._table.length)];
    };

    LevelGenerator.prototype._noise = function(point) {
      var dimension, dimensions, value, _i, _ref;
      value = 0;
      dimensions = point.length;
      for (dimension = _i = 0, _ref = dimensions - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; dimension = 0 <= _ref ? ++_i : --_i) {
        value = this._randify(Math.floor(value * 85000) + point[dimension]);
      }
      return value;
    };

    LevelGenerator.prototype._smooth = function(point, dimension) {
      var a, b, fractional, integer, value;
      if (dimension < 0) {
        return this._noise(point);
      }
      value = point[dimension];
      integer = Math.floor(value);
      fractional = value - integer;
      point[dimension] = integer;
      a = this._smooth(point, dimension - 1);
      point[dimension] = integer + 1;
      b = this._smooth(point, dimension - 1);
      point[dimension] = value;
      return this.cosineInterpolate(a, b, fractional);
    };

    LevelGenerator.prototype._perlin = function(point) {
      var amplitude, copy, dimension, dimensions, frequency, i, limiter, octaves, persistence, t, value, _i, _j, _ref, _ref1;
      value = 0;
      amplitude = 1;
      octaves = this.octaves;
      frequency = this.frequency;
      persistence = this.persistence;
      copy = point.slice();
      dimensions = copy.length;
      for (i = _i = 0, _ref = octaves - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        t = i * 4096;
        for (dimension = _j = 0, _ref1 = dimensions - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; dimension = 0 <= _ref1 ? ++_j : --_j) {
          copy[dimension] = point[dimension] * frequency + t;
        }
        value += this._smooth(copy, dimensions - 1) * amplitude;
        amplitude *= persistence;
        frequency *= 2;
      }
      limiter = (1 - persistence) / (1 - amplitude);
      return value * limiter;
    };

    LevelGenerator.prototype._generate = function(start, size, callback, dimension) {
      var end, i, _i, _ref, _ref1;
      if (dimension < 0) {
        return callback(start, this._perlin(start));
      }
      end = start[dimension] + size[dimension];
      for (i = _i = _ref = start[dimension], _ref1 = end - 1; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
        this._generate(start, size, callback, dimension - 1);
        start[dimension]++;
      }
      start[dimension] -= size[dimension];
      return null;
    };

    LevelGenerator.prototype.generate = function(start, size, callback) {
      return this._generate(start, size, callback, start.length - 1);
    };

    return LevelGenerator;

  })();

}).call(this);
