#<< Client/Client
#<< Log

class Browser

  client: null

  constructor: ->
    Log.log "Browser Side"
    @client = new Client.Client
    angular.module('TowerAdventure', []).controller('LoginController', ['$scope', '$rootScope', ($scope, $location) =>
      @client.InitAngular($scope, $location)
      ]).controller('CommandPanelController', ['$scope', '$rootScope', ($scope, $rootScope) =>
        $rootScope.$on 'loggedIn', (data) =>
          @client.game.CommandPanelInit($scope)])

