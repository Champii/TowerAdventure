class TowerManager.TowerManagerBase

  towers: null
  city: null
  towersConstruct: null

  constructor: (city) ->
    @towers = []
    @towersConstruct = []
    @city = city if city?

  GetTower: (name) ->
    for tower in @towers
      if tower.name is name
        return tower
    null

  GetTowerById: (id) ->
    for tower in @towers
      if tower.id is id
        return tower
    null

  GetAllTowerByName: (name) ->
    res = []
    for tower in @towers
      if tower.name is name
        res.push tower
    res

  AddTower: (tower) ->
    if tower?
      if tower.underConstruct
        @towersConstruct.push tower
      @towers.push tower
    tower


  DeleteTower: (tower) ->
    if tower?
      for tow, i in @towers
        if tower is tow
          @towers.splice i, 1
        