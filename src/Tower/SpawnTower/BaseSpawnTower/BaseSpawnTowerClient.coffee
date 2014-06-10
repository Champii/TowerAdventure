#<< Module
#<< Tower/SpawnTower/BaseSpawnTower/BaseSpawnTowerBase
#<< Tower/SpawnTower/SpawnTowerClient
#<< Entity/BaseEntity/BaseEntityClient

class Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerClient extends Module

  @include Tower.SpawnTower.BaseSpawnTower.BaseSpawnTowerBase
  @include Tower.SpawnTower.SpawnTowerClient

  constructor: (city, soldierSpawner, socket) ->
    super [], [city, soldierSpawner, socket, baseSpawnTowerImage, Entity.BaseEntity.BaseEntityClient]
    @socket.on 'changeTarget' + @id, (target) =>
      @ChangeTarget target

  AskChangeTarget: (target) ->
    @socket.emit 'askChangeTarget' + @id, {id: target.id, owner: target.city.owner.id, city: target.city.id}

  ChangeTarget: (target) ->
    @_super target

  AskStartSpawn: ->
    @socket.emit 'askStartSpawn' + @id

  AskStopSpawn: ->
    @socket.emit 'askStopSpawn' + @id

  
