#<< Module
#<< City/CityBase
#<< Resources/ResourcesServer
#<< TowerManager/BuildingManager/BuildingManagerServer
#<< DbManager/DbItem
#<< DesignPattern/Observable
#<< Territory/TerritoryServer

City.schema =
  __name__: 'City'
  _owner:   { type: 'ObjectId', ref: 'Player' }
  isMain:   Boolean
  pos:      {x: Number, y: Number}
  range:    Number
  name:     String
  resources:{ type: 'ObjectId', ref: 'Resources' }
  buildings:{ type: ['ObjectId'], ref: 'Building' }
  territory:{ type: 'ObjectId', ref: 'Territory' }

class City.CityServer extends Module

  @include City.CityBase
  @include DesignPattern.Observable
  @include DbManager.DbItem

  socket: null
  owner: null

  constructor: (@parent,  @id, callback) ->
    onLoad = =>
#       @pos = {x: @pos[0], y:@pos[1]}
      @owner = @parent.owner
      chunk = @owner.parent.map.GetChunk @pos
      chunk.Attach this
      @Attach chunk
      @resources = new Resources.ResourcesServer this, @item.resources, =>
        @territory = new Territory.TerritoryServer this, @item.territory, =>
          @buildingManager = new TowerManager.BuildingManager.BuildingManagerServer this, callback
          @Notify @owner, (socket, isOwner) =>
            @SendTo socket, isOwner
#       @defTowerManager = new TowerManager.DefTowerManager.DefTowerManagerClient city, this
#       @spawnTowerManager = new TowerManager.SpawnTowerManager.SpawnTowerManagerClient city, this
    super [], [], [City.schema, @id, onLoad]

  BuyBuilding: (building, socket) ->
    @resources.UpdateResources()
    @buildingManager.NewBuilding building, socket, (build) =>
      @territory.AddTerritory build
      @item.buildings.push build
#       @SaveDb()
      @Notify @owner, (socket) =>
        @SendUpdateTo socket

  PropagSocket: (@socket) ->
    @resources.PropagSocket @socket
    @territory.PropagSocket @socket
    for build in @buildingManager.towers
      build.PropagSocket @socket
    @socket.on 'updateCity' + @id, (city) =>
      @SendUpdateTo @socket
      @resources.Send()
      
  SendTo: (socket, isOwner, isRec) ->
#     @PropagSocket socket
    command =  if isOwner then 'ownCityObject' else 'cityObject' + @owner.id
    serie = @Serialize()
    socket.emit command, serie
    @territory.SendTo socket
    @resources.Send() if isOwner and @socket?

  SendUpdateTo: (socket) ->
    socket.emit 'updateCity' + @id, @Serialize()
    @territory.SendTo socket

  PropagDisconnect: ->
#     for obs in @observators
#       obs.Detach this
#       @Detach obs
    @buildingManager.PropagDisconnect()
    @socket = null
