#<< Social/Channel/ChannelBase

class Social.Channel.ChannelClient extends Social.Channel.ChannelBase

  messages: null
  socket: null
  scope: null
  
  constructor: (channel, socket, scope) ->
    super channel
    @messages = []
    @socket = socket
    @scope = scope

  AddMessage: (message) ->
    @messages.push message

  AskAddMessage: (message) ->
    @socket.emit 'askMessageChannel', message

  AddPeople: (people) ->
    super people