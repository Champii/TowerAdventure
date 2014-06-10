#<< Social/Chat/ChatBase

class Social.Chat.ChatClient extends Social.Chat.ChatBase

  socket: null
  scope: null

  constructor: (socket, scope) ->
    super()
    @channels = []
    @socket = socket
    @scope = scope
    @socket.on 'iJoinedChannel', (channel) =>
      @IJoinChannel channel
    @socket.on 'joinedChannel', (channel) =>
      @channels[channel.name]?.AddPeople channel.player
    @socket.on 'messageChannel', (message) =>
      @channels[message.channel].AddMessage message

  AskJoinChannel: (name) ->
    @socket.emit 'askJoinChannel', {name: name}

  IJoinChannel: (channel) ->
    if !@ChannelExists channel
      @AddChannel (new Social.Channel.ChannelClient channel, @socket, @scope)
      @scope.$apply =>
        @scope.channels = @channels
#         console.log @scope.channels, @channels

  AddChannel: (channel) ->
    if !@ChannelExists channel
#       @channels[0] = channel
      @channels[channel.name] = channel
#       console.log @channels[channel.name], @channels
      for i,j of @channels
        1
#         console.log i,j
#       console.log "creating channel: ", @channels[channel.name], channel.name
  
#     super channel