#<< Player/PlayerServer
#<< PlayerManager/PlayerManagerServer
#<< Game/GameServer

class Server.Server

  io: null
  game: null

  constructor: ->
    @io = require('socket.io').listen(8080)
    @io.set 'log level', 1
    @game = new Game.GameServer @io
