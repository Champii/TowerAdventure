class Social.Channel.ChannelBase

  name: null
  people: null
  
  constructor: (data) ->
    @name = data.name
    @people = []
    
  AddPeople: (player) ->
    @people.push player
  