(function() {

  Client.Client = (function() {

    Client.prototype.scope = null;

    Client.prototype.rootScope = null;

    Client.prototype.game = null;

    Client.prototype.socket = null;

    function Client() {
      var _this = this;
      this.socket = io.connect('http://localhost:8080');
      this.socket.on('error', function(data) {
        _this.scope.errorMessage = data.error;
        $("#errorContainer").css('opacity', '0.8');
        return _this.scope.$digest();
      });
      this.game = new Game.GameClient(this.socket);
    }

    Client.prototype.InitAngular = function($scope, $rootScope) {
      var _this = this;
      this.rootScope = $rootScope;
      this.scope = $scope;
      this.scope.insc = false;
      this.scope.errorMessage = "";
      this.scope.login = "";
      this.scope.pass = "";
      this.scope.passconf = "";
      this.scope.go = function() {
        _this.scope.errorMessage = "";
        $("#errorContainer").css('opacity', '0.0');
        return _this.game.SignIn(_this.scope.login, _this.scope.pass, _this.rootScope, _this.scope);
      };
      this.scope.toggleSignUp = function() {
        _this.scope.errorMessage = "";
        $("#errorContainer").css('opacity', '0.0');
        return _this.scope.insc = !_this.scope.insc;
      };
      return this.scope.signUp = function() {
        _this.scope.errorMessage = "";
        $("#errorContainer").css('opacity', '0.0');
        if (_this.scope.pass === _this.scope.passconf) {
          return _this.game.SignUp(_this.scope.login, _this.scope.pass, _this.rootScope, _this.scope);
        } else {
          _this.scope.errorMessage = "Passwords Doesn't match";
          return $("#errorContainer").css('opacity', '0.8');
        }
      };
    };

    return Client;

  })();

}).call(this);
