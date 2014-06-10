#<< Module
#<< TowerManager/BuildingManager/BuildingManagerBase
#<< TowerManager/TowerManagerClient

class TowerManager.BuildingManager.BuildingManagerClient extends Module

  @include TowerManager.BuildingManager.BuildingManagerBase
  @include TowerManager.TowerManagerClient

  socket: null
  scope: null

  constructor: (city, socket, scope) ->
    super [], [city]
    @socket = socket
    @scope = scope
    if @city.own
      @socket.on 'ownBuildingObject' + @city.id, (building) =>
        console.log "Building received", building
        @scope.updateLoadMessages 'building'
        @scope.$apply =>
          @AddTower @city, building
    else
      @socket.on 'buildingObject' + @city.id, (building) =>
        console.log "Building received", building
        @AddTower @city, building

  PlaceNewBuilding: (name, pos) ->
    @city.ShowRange()
    type = cityHallImage
    switch name
      when 'cityHall' then type = cityHallImage
      when 'baseDefenseTower' then type = baseDefenseTowerImage
      when 'soldierSpawnerTower' then type = soldierSpawnerTowerImage
      else type = baseTowerImage
    trueIso = (posI) =>
      n = Math.floor(posI.y/tileSizeY + posI.x/tileSizeX);
      m = Math.floor(posI.y/tileSizeY - posI.x/tileSizeX);
      x = (n - m)/2*tileSizeX;
      y = (n + m)/2*tileSizeY;
      {x: x, y: y}

    build = new Kinetic.Image
      image: type
      x: pos.x * tileSizeX
      y: pos.y * tileSizeY
#       offset:
#         y: -20
      opacity: 0.5
      draggable: true
      dragBoundFunc: (posB) =>
        posRes = trueIso posB
        buildIso =
          x: posRes.x + -stage.attrs.x
          y: posRes.y + -stage.attrs.y
        buildPos = Map.MapClient.IsoScreenToPos buildIso
        if @city.territory.IsInTerritory {x: buildPos.x + 1, y: buildPos.y + 1}
          posRes = Map.MapClient.PosToIsoScreen buildPos
          posRes =
            x: posRes.x + stage.attrs.x
            y: posRes.y + stage.attrs.y
#           console.log buildPos, (@city.territory.IsInTerritory buildPos), posRes
        else
          posRes = build.getAbsolutePosition()
#         posRes =
#           x: posRes.x + stage.attrs.x % tileSizeX
#           y: posRes.y + stage.attrs.y % tileSizeY
        return posRes



#         posRes = trueIso posB
#         buildIso =
#           x: Math.floor(posRes.x + -stage.attrs.x)
#           y: Math.floor(posRes.y + -stage.attrs.y)
#
#         buildPos = Map.MapClient.IsoScreenToPos buildIso
#
#         low =
#           x: @city.pos.x - @city.range
#           y: @city.pos.y - @city.range - 2
#         high =
#           x: @city.pos.x + @city.range + 2
#           y: @city.pos.y + @city.range
#
#         bounded = false
#         if buildPos.x < low.x
#           buildPos.x = low.x
#           bounded = true
#         if buildPos.y < low.y
#           buildPos.y = low.y
#           bounded = true
#         if buildPos.x > high.x
#           buildPos.x = high.x
#           bounded = true
#         if buildPos.y > high.y
#           buildPos.y = high.y
#           bounded = true
#
#         if bounded
#           posRes = Map.MapClient.PosToIsoScreen buildPos
#           posRes =
#             x: posRes.x + stage.attrs.x #- stage.attrs.x % tileSizeX
#             y: posRes.y + stage.attrs.y #- stage.attrs.y % tileSizeY
#         else
#           posRes =
#             x: posRes.x + stage.attrs.x % tileSizeX
#             y: posRes.y + stage.attrs.y % tileSizeY
#
#         return posRes


    build.on 'dragstart', (e) ->
      e.cancelBubble = true

#     build.on 'mousedown', (e) =>
#       stage.setDraggable false

    build.on 'mouseUp', (e) =>
      stage.setDraggable true

    build.on 'dragend', (e) =>
      stage.setDraggable true
      posReal = Map.MapClient.IsoScreenToPos build.attrs
      build.remove()
      @city.HideRange()

      @socket.emit 'buyBuilding', {cityName: @city.name, name: name, level: 1, pos: posReal}
      mainContainer.draw()

    buildingsContainer.add build
    mainContainer.draw()

  UpdateAllConstruct: ->
    i = 0
    for build in @towersConstruct
      if build?
        build.UpdateConstruct() if build?
        if build? && build.finishTime < new Date()
          build.underConstruct = false if build
          build.timeLeft = 0 if build
#           build.progressBar.Hide()
          build.huds.SetHidden build.progressBar.image, true
          build.huds.SetPersistant build.progressBar.image, false
          @towersConstruct.splice i, 1 if build
      i++

  AddTower: (city, tower) ->
    build = null
    switch tower.name
      when 'cityHall' then build = (new Tower.Building.CityHall.CityHallClient city, tower, @socket)
      when 'architectOffice' then build = (new Tower.Building.ArchitectOffice.ArchitectOfficeClient city, tower, @socket)
      when 'laboratory' then build = (new Tower.Building.Laboratory.LaboratoryClient city, tower, @socket)
      when 'ironMine' then build = (new Tower.Building.IronMine.IronMineClient city, tower, @socket)
      when 'goldMine' then build = (new Tower.Building.GoldMine.GoldMineClient city, tower, @socket)
      when 'cristalMine' then build = (new Tower.Building.CristalMine.CristalMineClient city, tower, @socket)
      when 'uraniumMine' then build = (new Tower.Building.UraniumMine.UraniumMineClient tower, city,@socket)
      when 'petrolMine' then build = (new Tower.Building.PetrolMine.PetrolMineClient city, tower, @socket)
      when 'solarCentral' then build = (new Tower.Building.SolarCentral.SolarCentralClient city, tower, @socket)
      when 'baseTower' then build = (new Tower.BaseTower.BaseTowerClient city, tower, @socket)
      when 'baseSpawnTower' then build = (new Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerClient city, tower, @socket)
      when 'baseDefenseTower' then build = (new Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerClient city, tower, @socket)
    @_super build

  DestroyTower: (tower) ->
    @DeleteTower tower
    tower.destructor()
    