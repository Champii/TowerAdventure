class Tower.SpawnTower.SpawnTowerBase

  entityManager: null
  spawnType: null
  rateSpawnForm: null
  spawnTarget: null

  
  constructor: ->

  ChangeTarget: (@target) ->

  Spawn: ->

  StartSpawn: -> #Abstract

  StopSpawn: -> #Abstract

    