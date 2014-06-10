#<< Module
#<< Tower/SpawnTower/SpawnTowerBase
#<< Tower/TowerClient

class Tower.SpawnTower.SpawnTowerClient extends Module

  @include Tower.SpawnTower.SpawnTowerBase
  @include Tower.TowerClient

  constructor: (city, soldierSpawner, socket, image) ->
    super [], [city, soldierSpawner, socket, image]

