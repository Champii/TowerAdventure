(function() {

  Client.Client = (function() {

    Client.prototype.scope = null;

    Client.prototype.game = null;

    Client.prototype.socket = null;

    function Client($scope) {
      var _this = this;
      this.scope = $scope;
      this.Init();
      this.socket = io.connect('http://localhost:8080');
      this.socket.on('error', function(data) {
        return _this.scope.errorMessage = data.error;
      });
      this.game = new Game.GameClient(this.socket);
      this.scope.go = function() {
        return _this.game.SignIn(_this.scope.login, _this.scope.pass);
      };
      this.scope.toggleSignUp = function() {
        return _this.scope.insc = !_this.scope.insc;
      };
      this.scope.signUp = function() {
        if (_this.scope.pass === _this.scope.passconf) {
          return _this.game.SignUp(_this.scope.login, _this.scope.pass);
        } else {
          return _this.scope.errorMessage = "Passwords Doesn't match";
        }
      };
    }

    Client.prototype.Init = function() {
      this.scope.insc = false;
      this.scope.errorMessage = "";
      this.scope.login = "";
      this.scope.pass = "";
      return this.scope.passconf = "";
    };

    return Client;

  })();

}).call(this);
