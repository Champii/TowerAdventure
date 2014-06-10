#<< Tower/DefenseTower/BaseDefenseTower/BaseDefenseTowerBase
#<< Tower/SpawnTower/BaseSpawnTower/BaseSpawnTowerBase

class Tower.BaseTower.BaseTowerBase

  @costForm:  (level) =>
    {iron: 1 * Math.pow(1.5, level - 1), gold: 1 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}

  constructor: ->
    @costForm =  (level) ->
      Tower.BaseTower.BaseTowerBase.costForm level
    @evolveList = 
      'baseSpawnTower': (Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase)
      'baseDefenseTower': (Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerBase)

      
  