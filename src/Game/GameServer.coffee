#<< Module
#<< PlayerManager/PlayerManagerServer
#<< Game/GameBase
#<< Map/MapServer
#<< DbManager/DbManager

class Game.GameServer extends Module

  @include Game.GameBase

  dbManager:  null
  io:         null

  constructor: (io) ->
    super()    
    @io = io
    @dbManager = Singleton.get(DbManager.DbManager) #Pre initialisation
    dbWaiter = setInterval =>
      if @dbManager.ready
        clearInterval dbWaiter
        @playerManager = new PlayerManager.PlayerManagerServer @io.sockets

        @io.sockets.on 'connection', (socket) =>
          socket.on 'signIn', (data) =>
            @playerManager.SignIn data, socket, =>
              @SetCallbacks socket

          socket.on 'signUp', (data) =>
            @playerManager.SignUp data, socket, @playerManager.map.GetNextNewPlayerPos(@playerManager.players.length), =>
              @SetCallbacks socket

    , 1000

  SetCallbacks: (socket) ->




