#<< Social/Chat/ChatBase

class Social.Chat.ChatServer extends Social.Chat.ChatBase

  sockets: null
  
  constructor: (sockets) ->
    super()
    @sockets = sockets

  JoinChannel: (player, channel) ->
    if !@ChannelExists channel
      @AddChannel channel
    @channels[channel.name]?.AddPeople player
    
  AddChannel: (channel) ->
    super (new Social.Channel.ChannelServer channel, @sockets)

  AddMessage: (message) ->
    @channels[message.channel].AddMessage message
    