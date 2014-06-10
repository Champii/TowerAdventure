#<< Module
#<< PlayerManager/PlayerManagerBase
#<< Player/PlayerServer

class PlayerManager.PlayerManagerClient extends Module

  @include PlayerManager.PlayerManagerBase
  @include DbManager.DbCollection

  scope: null
  socket: null
  parent: null
  
  constructor: (@parent, @socket, @scope) ->
    super [], []
    @entityManager = new EntityManager.EntityManagerClient @socket
      
    @socket.on 'playerList', (list) =>
      for player in list
        player.own = false
        if player.login != @parent.player.login
          @AddPlayer new Player.PlayerClient player, @socket, @scope
    