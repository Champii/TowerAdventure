(function() {
  var Browser;

  Browser = (function() {

    Browser.prototype.client = null;

    function Browser() {
      var _this = this;
      Log.log("Browser Side");
      this.client = new Client.Client;
      angular.module('TowerAdventure', []).controller('LoginController', [
        '$scope', '$rootScope', function($scope, $location) {
          return _this.client.InitAngular($scope, $location);
        }
      ]).controller('CommandPanelController', [
        '$scope', '$rootScope', function($scope, $rootScope) {
          return $rootScope.$on('loggedIn', function(data) {
            return _this.client.game.CommandPanelInit($scope);
          });
        }
      ]);
    }

    return Browser;

  })();

}).call(this);
