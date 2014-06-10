#<< Social/Channel/ChannelBase

class Social.Channel.ChannelServer extends Social.Channel.ChannelBase

  sockets: null

  constructor: (channel, sockets) ->
    super channel
    @sockets = sockets

  AddPeople: (player) ->
    super player
    player.socket.join @name
    player.socket.emit 'iJoinedChannel', {name: @name}
    @sockets.in(@name).emit 'joinedChannel', {name: @name, player: player.login}

  AddMessage: (message) ->
    @sockets.in(@name).emit 'messageChannel', message
