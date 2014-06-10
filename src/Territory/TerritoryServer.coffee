#<< Module
#<< Territory/TerritoryBase
#<< DbManager/DbItem

Territory.schema =
  __name__: 'Territory'
  _owner:   { type: 'ObjectId', ref: 'Player' }
  _city:   { type: 'ObjectId', ref: 'City' }
  territory: [{x: Number, y: Number}]

class Territory.TerritoryServer extends Module

  @include Territory.TerritoryBase
  @include DbManager.DbItem
  
  constructor: (@city, @id, cb) ->
    super [], [Territory.schema, @id, =>
      newTer = []
      for ter, i in @territory
        newTer.push {x: ter.x, y: ter.y}
      @territory = newTer
      cb()]

  AddTerritory: (tower) ->
    xLength = tower.posEnd.x - tower.pos.x
    yLength = tower.posEnd.y - tower.pos.y
    for i in [tower.pos.x - 4  .. tower.posEnd.x + 5]
      for j in [tower.pos.y  - 4 - (yLength - 1).. tower.posEnd.y + 5  - (yLength - 1)]
        @territory.push {x: i, y: j} if !@IsInTerritory {x: i, y: j}
    @SendTo @socket

  SendTo: (socket) ->
    socket.emit 'territory' + @city.id, @Serialize()
#     console.log @Serialize

  PropagSocket: (socket) ->
    if !(@socket?)
      @socket = socket
      @socket.on 'territory' + @city.id, =>
        @SendTo @socket
      @SendTo @socket
