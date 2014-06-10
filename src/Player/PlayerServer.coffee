#<< Module
#<< Player/PlayerBase
#<< CityManager/CityManagerServer
#<< DesignPattern/Observable
#<< DbManager/DbItem

Player.schema =
  __name__: 'Player'
  login:    String
  pass:     String
  citys:    { type: ['ObjectId'], ref: 'City' }
  technos:  { type: ['ObjectId'], ref: 'Techno' }

class Player.PlayerServer extends Module

  @include Player.PlayerBase
  @include DesignPattern.Observable
  @include DbManager.DbItem

  loggedIn: false

  constructor: (@parent, @id, callback) ->
    super [], [], [Player.schema, @id, =>
      @cityManager = new CityManager.CityManagerServer this, callback]

  SignIn: (@socket) ->
    @loggedIn = true
    @SendTo @socket
    @PropagSocket()
    Log.log "Player: Player " + @login + " just SignedIn"
    @socket.emit 'syncTime', {time: new Date().getTime()}

    @socket.on 'buyBuilding', (data) =>
      if (city = @cityManager.GetCity data.cityName)
        city.BuyBuilding data, @socket
    @socket.on 'ready', (data) =>
      @socket.emit 'notification', {title: "Welcome back", message: "Welcome back to the new Tower Adventure", persistent: false}


  LogOut: ->
    for obs in @observators
      obs.Detach this

    @observators = []

    @cityManager.PropagDisconnect()
    @socket = null
    @loggedIn = false
    console.log "Player " + @login + " has LogOut"

  PropagSocket: ->
    @cityManager.socket = @socket
    @cityManager.technologyManager.PropagSocket @socket
    for city in @cityManager.citys
      city.PropagSocket @socket

  SendTo: (socket) ->
    mainCityPos = @cityManager.GetMainCity().pos
    allCityPos = [] #@cityManager.GetAllCitypos()
    player = {id: @id, login: @login, mainCityPos: mainCityPos, allCityPos: allCityPos, own: true}
    socket.emit 'ownPlayerObject', player

