class PlayerManager.PlayerManagerBase

  players:[]

  constructor: ->

  AddPlayer: (player) ->
    @players.push player

  GetPlayer: (login) ->
    for player in @players
      if player.login is login
        return player
    return null
    
  GetPlayerById: (id) ->
    for player in @players
      if player.id is id
        return player
    return null

