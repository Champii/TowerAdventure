(function() {
  var Browser;

  Browser = (function() {

    function Browser() {
      Log.log("Browser Side");
      angular.module('TowerAdventure', []).controller('LoginController', ['$scope', Client.Client]);
    }

    return Browser;

  })();

}).call(this);
