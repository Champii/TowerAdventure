class Social.Chat.ChatBase

  channels: null
  private: null

  constructor: ->
    @channels = []
    @private = []
    
  AddChannel: (channel) ->
    if !@ChannelExists channel
#       @channels.push channel
      @channels[channel.name] = channel

  JoinChannel: (channel) ->
    if !@ChannelExists channel
      @AddChannel channel
      
  ChannelExists: (channel) ->
    if @channels[channel.name]?
      return true
    return false
  