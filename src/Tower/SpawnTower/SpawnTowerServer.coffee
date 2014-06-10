#<< Module
#<< Tower/SpawnTower/SpawnTowerBase
#<< Tower/TowerServer
#<< EntityManager/EntityManagerServer

class Tower.SpawnTower.SpawnTowerServer extends Module

  @include Tower.SpawnTower.SpawnTowerBase
  @include Tower.TowerServer
  
  path: null
  spawnTimer: null

  constructor: (@spawnType) ->
    super [], []
    @entityManager = new EntityManager.EntityManagerServer this

  ChangeTarget: (target) ->
    if target?
      if (player = @owner.parent.GetPlayerById target.owner)?
        if (city = player.cityManager.GetCityById target.city)?
          if (tower = city.buildingManager.GetTowerById target.id)?
            if @spawnTarget isnt tower
              @spawnTarget = tower
              @CalcPath()
              @socket.emit 'changeTarget' + @id, {name: @spawnTarget.name, pos: @spawnTarget.pos}
              @StartSpawn()

  CalcPath: ->
    path = []
    currentPos = @pos
    while !(currentPos.x is @spawnTarget.pos.x and currentPos.y is @spawnTarget.pos.y)
      dir = @ChooseDirection currentPos
      if !path.length || dir.dir isnt path[path.length - 1].dir
        path.push dir
      else if path.length and path[path.length - 1].dir is dir.dir
        path[path.length - 1].pos = dir.pos
      currentPos = dir.pos
    @path = path

      #quelle direction rapproche le plus
      #si obstacle
        # contourner (quelle autre direction rapproche le plus sauf la precedente)
      #aller dans cette direction si pas d'obstacle
      #si direction differente precedente
        # ajouter au path

  ChooseDirection: (currentPos) ->
    calcVector = (pos) =>
      xLength: Math.abs(@spawnTarget.pos.x - pos.x)
      yLength: Math.abs(@spawnTarget.pos.y - pos.y)
    chunk = @city.owner.parent.map.GetChunk currentPos
    tmpPos = currentPos
    allDir = []
    allDir.push {dir: 'N', length: (calcVector {x: tmpPos.x, y: tmpPos.y + 1}), pos: {x: tmpPos.x, y: tmpPos.y + 1}}
    allDir.push {dir: 'NE', length: (calcVector {x: tmpPos.x + 1, y: tmpPos.y + 1}), pos: {x: tmpPos.x + 1, y: tmpPos.y + 1}}
    allDir.push {dir: 'E', length: (calcVector {x: tmpPos.x + 1, y: tmpPos.y}), pos: {x: tmpPos.x + 1, y: tmpPos.y}}
    allDir.push {dir: 'SE', length: (calcVector {x: tmpPos.x + 1, y: tmpPos.y - 1}), pos: {x: tmpPos.x + 1, y: tmpPos.y - 1}}
    allDir.push {dir: 'S', length: (calcVector {x: tmpPos.x, y: tmpPos.y - 1}), pos: {x: tmpPos.x, y: tmpPos.y - 1}}
    allDir.push {dir: 'SO', length: (calcVector {x: tmpPos.x - 1, y: tmpPos.y - 1}), pos: {x: tmpPos.x - 1, y: tmpPos.y - 1}}
    allDir.push {dir: 'O', length: (calcVector {x: tmpPos.x - 1, y: tmpPos.y}), pos: {x: tmpPos.x - 1, y: tmpPos.y}}
    allDir.push {dir: 'NO', length: (calcVector {x: tmpPos.x - 1, y: tmpPos.y + 1}), pos: {x: tmpPos.x - 1, y: tmpPos.y + 1}}

    shortest = allDir[0]
    for len in allDir
      if len.length.xLength <= shortest.length.xLength and len.length.yLength <= shortest.length.yLength
        shortest = len
    return shortest

  Spawn: ->
    @entityManager.NewEntity {pos: @pos}, @spawnType

  StartSpawn: ->
    if !(@spawnTimer?) and @spawnTarget?
      @spawnTimer = setInterval =>
        @Spawn()
      , @rateSpawnForm @level

  StopSpawn: ->
    if @spawnTimer?
      clearInterval @spawnTimer
      @spawnTimer = null

  PropagSocket: (socket) ->
    @_super socket
    @socket.on 'askChangeTarget' + @id, (target) =>
      @ChangeTarget target
    @socket.on 'askStartSpawn' + @id, (target) =>
      @StartSpawn()
    @socket.on 'askStopSpawn' + @id, (target) =>
      @StopSpawn()


  PropagDisconnect: ->
    @entityManager.PropagDisconnect()
    @_super()

    