#<< Module
#<< City/CityBase
#<< Resources/ResourcesServer
#<< Territory/TerritoryClient
#<< TowerManager/BuildingManager/BuildingManagerClient


class City.CityClient extends Module

  @include City.CityBase

  socket: null
  scope: null
  rangeImage: null
  parent: null
  own: false
  owner: null

  constructor: (@parent, city, socket, scope) ->
    super [city]
    @scope = scope
    @socket = socket
    @owner = @parent.parent
    @own = @parent.own
    @territory = new Territory.TerritoryClient this, socket
    @resources = new Resources.ResourcesClient this, socket, scope
    @buildingManager = new TowerManager.BuildingManager.BuildingManagerClient this, @socket, scope
    @socket.on 'updateCity' + @id, (city) =>
      @Deserialize city

  ShowRange: ->
    @territory.Show()

  HideRange: ->
    @territory.Hide()

