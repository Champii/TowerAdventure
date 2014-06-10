#<< Module
#<< PlayerManager/PlayerManagerBase
#<< Player/PlayerServer
#<< Singleton
#<< Social/Chat/ChatServer
#<< DbManager/DbCollection

class PlayerManager.PlayerManagerServer extends Module

  @include PlayerManager.PlayerManagerBase
  @include DbManager.DbCollection

  chat: null
  map: null

  constructor: (sockets) ->
    super [], [Player.schema]
    @map = new Map.MapServer
    @chat = new Social.Chat.ChatServer sockets
    @GetAllDb null, null, (players) =>
      @FillPlayers players

  FillPlayers: (players) ->
    i = 1
    Log.log ''
    Log.log "**** Loading Players ****"
    for player in players
      Log.log "Load Player" + " (" + i++ + ") "+ player.login
      @AddPlayer new Player.PlayerServer this, player.id

  SignIn: (data, socket, callback) ->
    @GetOneDb 'login', data.login, (player) =>
      if player?
        playerDb = player
        player = @GetPlayer playerDb.login
        if !(player?) || data.pass != playerDb.pass
          socket.emit 'error', {error: 'Bad login or pass1'}
        else if player.loggedIn
          socket.emit 'error', {error: 'Already LoggedIn. Please disconnect previous session first.'}
        else
          socket.emit 'loggedIn'
          @SetGeneralCallback player, socket
          callback() if callback
      else
        socket.emit 'error', {error: 'Bad login or pass2'}

  SignUp: (data, socket, pos, callback) ->
    @GetOneDb 'login', data.login, (playerGet) =>
      if !(playerGet?)
        @dbManager.addPlayerModel data, pos, (player) =>
          if player?
            Log.log "PlayerManager: Player " + player.login + " just SignedUp"
            @SendNewPlayer player
            newPlayer = new Player.PlayerServer this, player.id, =>
              socket.emit 'signedUp'
              @AddPlayer newPlayer
              @SetGeneralCallback newPlayer, socket
              callback() if callback?
      else
        socket.emit 'error', {error: "Player already exists"}    

  SetGeneralCallback: (player, socket) ->
    player.SignIn socket
    @SendPlayerList player
    @chat.JoinChannel player, {name: 'general'}
    socket.on 'askJoinChannel', (channel) =>
      @chat.JoinChannel player, data
    socket.on 'askMessageChannel', (message) =>
      @chat.AddMessage message
    socket.on 'getChunk', (data) =>
      chunk = @map.GetChunk data
      if !chunk.IsObservator player
        player.Attach chunk
        chunk.Attach player
        chunk.SendTo socket, player
    @NotifyToAllPlayers 'Player Connected', 'Player \'' + player.login + '\' is connected'
    socket.on 'disconnect', () =>
      console.log "Disconnect event received"
      @NotifyToAllPlayers 'Player Disconnect', 'Player \'' + player.login + '\' has leave'
      player.LogOut()
      

  NotifyToAllPlayers: (title, message) ->
    for player in @players
      if player.loggedIn
        player.socket.emit 'notification', {title: title, message: message, persistant: false}
      
  GetPlayerSocket: (socket) ->
    for player in @players
      if player.socket is socket
        return player
    return null

  SendNewPlayer: (play) ->
    for player in @players
      if player != play && player.socket?
        player.socket.emit 'playerList', [{id: play.id, login: play.login, own: false}]
    
  SendPlayerList: (play) ->
    list = []
    for player in @players
      if player != play
        list.push {id: player.id, login: player.login, own: false}
    play.socket.emit 'playerList', list

