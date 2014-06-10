(function() {

  Helpers.Queue = (function() {

    Queue.prototype.timer = null;

    Queue.prototype.time = null;

    Queue.prototype.objects = null;

    Queue.prototype.callback = null;

    function Queue(time, callback) {
      this.time = time;
      this.callback = callback;
      this.objects = [];
    }

    Queue.prototype.Start = function() {
      var _this = this;
      if ((this.time != null) && (this.callback != null)) {
        return this.timer = setInterval(function() {
          if (_this.objects.length) {
            _this.callback(_this.objects[0]);
            return _this.Pop();
          }
        }, this.time);
      }
    };

    Queue.prototype.Stop = function() {
      if (this.timer != null) {
        return clearInterval(this.timer);
      }
    };

    Queue.prototype.ChangeTime = function(ms) {
      this.time = ms;
      this.Stop();
      return this.Start();
    };

    Queue.prototype.ChangeCallback = function(cb) {
      return this.callback = cb;
    };

    Queue.prototype.Push = function(object) {
      return this.objects.push(object);
    };

    Queue.prototype.Pop = function(object) {
      return this.objects.splice(0, 1);
    };

    return Queue;

  })();

}).call(this);
