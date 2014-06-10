#<< Player/PlayerClient
#<< Game/GameClient

class Client.Client

  scope: null
  rootScope: null
  game: null
  socket: null

  constructor: ->
    @socket = io.connect 'http://127.0.0.1:8080'
    @socket.on 'error', (data) =>
      @scope.errorMessage = data.error
      $("#errorContainer").css('opacity', '0.8');
      @scope.$digest()
    @game = new Game.GameClient @socket



  InitAngular: ($scope, $rootScope) ->
    @rootScope = $rootScope
    @scope = $scope
    @scope.insc = false
    @scope.errorMessage = ""
    @scope.login = ""
    @scope.pass = ""
    @scope.passconf = ""

    
    @scope.go = =>
      @scope.errorMessage = ""
      $("#errorContainer").css('opacity', '0.0');
      @game.SignIn @scope.login, @scope.pass, @rootScope, @scope

    @scope.toggleSignUp = =>
      @scope.errorMessage = ""
      $("#errorContainer").css('opacity', '0.0');
      @scope.insc = !@scope.insc

    @scope.signUp = =>
      @scope.errorMessage = ""
      $("#errorContainer").css('opacity', '0.0');
      if @scope.pass == @scope.passconf
        @game.SignUp @scope.login, @scope.pass, @rootScope, @scope
      else
        @scope.errorMessage = "Passwords Doesn't match"
        $("#errorContainer").css('opacity', '0.8');

    
