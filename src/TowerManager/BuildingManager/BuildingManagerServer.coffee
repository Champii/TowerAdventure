#<< Module
#<< TowerManager/BuildingManager/BuildingManagerBase
#<< TowerManager/TowerManagerServer
#<< DbManager/DbCollection

class TowerManager.BuildingManager.BuildingManagerServer extends Module

  @include TowerManager.BuildingManager.BuildingManagerBase
  @include TowerManager.TowerManagerServer
  @include DbManager.DbCollection

  socket: null
  
  constructor: (city, callback) ->
    super [], [city], [Tower.schema]
    @dbManager = Singleton.get(DbManager.DbManager)
    loaded = 0
    @GetAllDb '_city', @city.id, (buildings) =>
      @FillBuildings buildings, =>
        if ++loaded == buildings.length
          callback() if callback?

  FillBuildings: (buildings, callback) ->
    i = 1
    for building in buildings
      @AddTower building, callback
      Log.log "Load |---- Building" + " (" + i++ + ") " + building.name

  NewBuilding: (building, socket, cb) ->
    if @CanBuy building.name, building.level
      posEnd = {x: 1, y: 1}
      if building.name == 'cityHall'
        posEnd = {x: 3, y: 3}
      if building.name == 'laboratory'
        posEnd = {x: 2, y: 2}
      now = new Date()
      build =
        _owner:     @city.item._owner
        _city:      @city.id
        name:       building.name
        level:      0
        fireRange:  3
        fireRate:   1
        pos:        {x: Math.floor(building.pos.x), y: Math.floor(building.pos.y)}
        posEnd:     {x: Math.floor(building.pos.x) + posEnd.x, y: Math.floor(building.pos.y) + posEnd.y}
        startTime: now
        finishTime: new Date(now.getTime() + @GetPriceOf(building.name, 1).time)
        underConstruct: false

      @NewDb build, (building) =>
        newBuild = @AddTower building, =>
#           newBuild.SendTo socket, true, false
          newBuild.LevelUp()
          cb building if cb?
    else
      socket.emit 'error', {error: "Lol"}

  AddTower: (build, cb) ->
    tower = null
    switch build.name
      when 'cityHall' then tower = new Tower.Building.CityHall.CityHallServer @city, build.id, cb
      when 'architectOffice' then tower = new Tower.Building.ArchitectOffice.ArchitectOfficeServer @city, build.id, cb
      when 'laboratory' then tower = new Tower.Building.Laboratory.LaboratoryServer @city, build.id, cb
      when 'ironMine' then tower = new Tower.Building.IronMine.IronMineServer @city, build.id, cb
      when 'goldMine' then tower = new Tower.Building.GoldMine.GoldMineServer @city, build.id, cb
      when 'cristalMine' then tower = new Tower.Building.CristalMine.CristalMineServer @city, build.id, cb
      when 'uraniumMine' then tower = new Tower.Building.UraniumMine.UraniumMineServer @city, build.id, cb
      when 'petrolMine' then tower = new Tower.Building.PetrolMine.PetrolMineServer @city, build.id, cb
      when 'solarCentral' then tower = new Tower.Building.SolarCentral.SolarCentralServer @city, build.id, cb
      when 'baseTower' then tower = new Tower.BaseTower.BaseTowerServer @city, build.id, cb
      when 'baseSpawnTower' then tower = new Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerServer @city, build.id, cb
      when 'baseDefenseTower' then tower = new Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerServer @city, build.id, cb
    tower.PropagSocket @city.socket if @city.socket?
    @_super tower

  Evolve: (actual, next) ->
    @DeleteTower actual
    actual.destructor()
    evoluatedTower = @AddTower next
#     evoluatedTower.Deserialize actual

    
  PropagDisconnect: ->
    for tower in @towers
      tower.PropagDisconnect()
