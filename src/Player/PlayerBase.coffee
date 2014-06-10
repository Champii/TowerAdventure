class Player.PlayerBase

  id: null
  socket: null
  type: null
  login: null
  cityManager: null
  parent: null
  technologyManager: null

  constructor: (player, @socket) ->
    @type = 'Player'
    @Deserialize player if player?

  Serialize: ->
    login: @login

  Deserialize: (player) ->
    @login = player.login if player.login?