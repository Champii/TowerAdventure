#<< Module
#<< Tower/SpawnTower/BaseSpawnTower/BaseSpawnTowerBase
#<< Tower/SpawnTower/SpawnTowerServer
#<< Entity/BaseEntity/BaseEntityServer

class Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerServer extends Module

  @include Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase
  @include Tower.SpawnTower.SpawnTowerServer

  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], [Entity.BaseEntity.BaseEntityServer]
      cb() if cb?
  