#<< Module
#<< TowerManager/SpawnTowerManager/SpawnTowerManagerBase

class TowerManager.SpawnTowerManager.SpawnTowerManagerServer extends Module

  @include TowerManager.SpawnTowerManager.SpawnTowerManagerBase
  
  constructor: (city) ->
    super [city]
    