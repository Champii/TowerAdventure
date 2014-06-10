class Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase

  @costForm = (level) =>
    {iron: 1 * Math.pow(1.5, level - 1), gold: 1 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}

  @rateSpawnForm = (level) =>
    5000 - 100 * level

  constructor: ->
    @costForm = (level) ->
      Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase.costForm level
    @rateSpawnForm = (level) ->
      Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase.rateSpawnForm level
