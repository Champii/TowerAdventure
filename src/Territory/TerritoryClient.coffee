#<< Module
#<< Territory/TerritoryBase

class Territory.TerritoryClient extends Module

  @include Territory.TerritoryBase

  rangeGroup: null

  constructor: (city, @socket) ->
    @city = city
    super []
    @socket.on 'territory' + @city.id, (territory) =>
      @Deserialize territory
      @MakeTerritoryImage()
    @socket.emit 'territory' + @city.id

  MakeTerritoryImage: (callback) ->
    @rangeGroup.remove() if @rangeGroup?
    @rangeGroup = new Kinetic.Group()
    image = (if @city.own then cityRangeImage else cityRangeEnemyImage)
    for ter in @territory
      pos = Map.MapClient.PosToIsoScreen ter
      tile = new Kinetic.Image
        image: image
        x: pos.x
        y: pos.y
        opacity:0.2
      @rangeGroup.add tile
    rangeContainer.add @rangeGroup
    mainContainer.draw()
    
#     rangeGroup.toImage
#       width: tileSizeX * @range * 2 + 3 * tileSizeX
#       height:tileSizeY * @range * 2 + 3 * tileSizeY
#       callback: (img) =>
#         pos = Map.MapClient.PosToIsoScreen @pos
#         @territoryImage = new Kinetic.Image
#           image: img
#           x: pos.x - @range * tileSizeX
#           y: pos.y - @range * tileSizeY
#           opacity: 0.2
#         rangeContainer.add @rangeImage
#         callback() if callback

  Show: ->
    if !(@rangeGroup?)
      @MakeTerritoryImage =>
#         @rangeGroup.show()
#         mainContainer.draw()
    else
#       @rangeGroup.show()
#       mainContainer.draw()

  Hide: ->
    if !(@rangeGroup?)
      @MakeTerritoryImage =>
#         @rangeGroup.hide()
#         mainContainer.draw()
    else
#       @rangeGroup.hide()
#       mainContainer.draw()