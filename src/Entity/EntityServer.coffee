#<< Module
#<< Entity/EntityBase
#<< AliveObject/AliveObjectServer
#<< DesignPattern/Observable
#<< DbManager/DbItem

Entity.schema =
  __name__: "Entity"
  name: String
  pos: {x: Number, y: Number}
  speed: Number

class Entity.EntityServer extends Module

  @include Entity.EntityBase
  @include AliveObject.AliveObjectServer
  @include DesignPattern.Observable
  @include DbManager.DbItem

  playersObs: null
  currentDir: null
  owner: null

  constructor: () ->
    super [], [{pos: @parent.parent.pos}], [], [Entity.schema, @id, =>
      @target = @parent.parent.spawnTarget
      @owner = @parent.parent.owner
      @speed = 1
      @pathIdx = 0
      @path = @parent.parent.path
      @currentDir = @path[0]
      @pos = @GetNextPos()
      @playersObs = []
      @Start()
      @NotifyNewPlayers()]

  destructor: ->
    @playersObs = null
    @path = null
    @owner = null
    @target = null
    @parent = null
    @observators[0].Detach this
    @Detach @observators[0]

  UpdateReferentChunk: ->
    chunk = @owner.parent.map.GetChunk @pos
    if chunk != @observators[0]
      @observators[0].Detach this if @observators.length
      @Detach @observators[0] if @observators.length
      chunk.Attach this
      @Attach chunk

  NotifyNewPlayers: ->
    @UpdateReferentChunk()
    for obs in @observators[0].observators
      if obs? and obs.type is 'Player'
        if !@IsPlayerObs obs
          @playersObs.push obs
          @SendTo obs.socket

  NotifyPlayers: ->
    for obs in @playersObs
      @SendUpdateTo obs.socket

  IsPlayerObs: (player) ->
    for play in @playersObs
      if play is player
        return true
    false

  # tant que pas arrivé
    # choisis une autre direction

  FindAlternatePath: (takenPlace) ->
    path = []
    currentPos = @pos
    console.log "Prealternate : ", (@ChooseDirection currentPos, @currentDir), @currentDir
    dir = @ChooseDirection currentPos, @currentDir
    while !(currentPos.x is @target.pos.x and currentPos.y is @target.pos.y) and !(dir.length.xLength <= 1 and dir.length.yLength <= 1)
      dir = @ChooseDirection currentPos, @currentDir
      console.log "alternate", currentPos, dir
      if !path.length or dir.dir isnt path[path.length - 1].dir
        path.push dir
      else if path.length and path[path.length - 1].dir is dir.dir
        path[path.length - 1].pos = dir.pos
      currentPos = dir.pos
    @path = path
    console.log "new path : ", @path
    @pathIdx = 0
    @currentDir = @path[@pathIdx]



  ChooseDirection: (currentPos, currentDir) ->
    console.log "Find alternate path : Choose Direction"
    calcVector = (pos) =>
      xLength: Math.abs(@target.pos.x - pos.x)
      yLength: Math.abs(@target.pos.y - pos.y)
    chunk = @owner.parent.map.GetChunk currentPos
    tmpPos = currentPos
    allDir = []
    allDir.push {dir: 'N', length: (calcVector {x: tmpPos.x, y: tmpPos.y + 1}), pos: {x: tmpPos.x, y: tmpPos.y + 1}} if !(@observators[0].GetTakenPlace({x: tmpPos.x, y: tmpPos.y + 1})?)
    allDir.push {dir: 'NE', length: (calcVector {x: tmpPos.x + 1, y: tmpPos.y + 1}), pos: {x: tmpPos.x + 1, y: tmpPos.y + 1}} if !(@observators[0].GetTakenPlace({x: tmpPos.x + 1, y: tmpPos.y + 1})?)
    allDir.push {dir: 'E', length: (calcVector {x: tmpPos.x + 1, y: tmpPos.y}), pos: {x: tmpPos.x + 1, y: tmpPos.y}} if !(@observators[0].GetTakenPlace({x: tmpPos.x + 1, y: tmpPos.y})?)
    allDir.push {dir: 'SE', length: (calcVector {x: tmpPos.x + 1, y: tmpPos.y - 1}), pos: {x: tmpPos.x + 1, y: tmpPos.y - 1}} if !(@observators[0].GetTakenPlace({x: tmpPos.x + 1, y: tmpPos.y - 1})?)
    allDir.push {dir: 'S', length: (calcVector {x: tmpPos.x, y: tmpPos.y - 1}), pos: {x: tmpPos.x, y: tmpPos.y - 1}} if !(@observators[0].GetTakenPlace({x: tmpPos.x, y: tmpPos.y - 1})?)
    allDir.push {dir: 'SO', length: (calcVector {x: tmpPos.x - 1, y: tmpPos.y - 1}), pos: {x: tmpPos.x - 1, y: tmpPos.y - 1}} if !(@observators[0].GetTakenPlace({x: tmpPos.x - 1, y: tmpPos.y - 1})?)
    allDir.push {dir: 'O', length: (calcVector {x: tmpPos.x - 1, y: tmpPos.y}), pos: {x: tmpPos.x - 1, y: tmpPos.y}} if !(@observators[0].GetTakenPlace({x: tmpPos.x - 1, y: tmpPos.y})?)
    allDir.push {dir: 'NO', length: (calcVector {x: tmpPos.x - 1, y: tmpPos.y + 1}), pos: {x: tmpPos.x - 1, y: tmpPos.y + 1}} if !(@observators[0].GetTakenPlace({x: tmpPos.x - 1, y: tmpPos.y + 1})?)

    shortest = allDir[0]
    for len in allDir
      if len.dir isnt currentDir.dir
        if len.length.xLength <= shortest.length.xLength and len.length.yLength <= shortest.length.yLength
          shortest = len
    return shortest

  GetNextPos: ->
    dir = @currentDir
    tmpPos = {x: @pos.x, y: @pos.y}
    if dir?
      switch dir.dir
        when 'N'
          tmpPos.y++
        when 'NE'
          tmpPos.x++
          tmpPos.y++
        when 'E'
          tmpPos.x++
        when 'SE'
          tmpPos.x++
          tmpPos.y--
        when 'S'
          tmpPos.y--
        when 'SO'
          tmpPos.x--
          tmpPos.y--
        when 'O'
          tmpPos.x--
        when 'NO'
          tmpPos.x--
          tmpPos.y++
    tmpPos

  # UpdatePos: ->
    #

  UpdatePos: ->
    if @currentDir? && @pos.x is @currentDir.pos.x and @pos.y is @currentDir.pos.y
      @currentDir = @path[++@pathIdx]
      @NotifyPlayers()

    if @currentDir?
      tmpPos = @GetNextPos()

      if tmpPos.x is @target.pos.x and tmpPos.y is @target.pos.y
        @Stop()
        @pathIdx = @path.length
        @NotifyPlayers()
        return

      # console.log @observators[0].mobileTakenPlaces
      if (@observators[0].GetTakenPlace tmpPos)?
        1
        console.log "Find alternate path"
        if @FindAlternatePath tmpPos
          @pos = @GetNextPos()
      else
        @pos = tmpPos

      @NotifyNewPlayers()
      # @NotifyPlayers()
    else
      @Stop()
      @NotifyPlayers()

  SendTo: (socket) ->
    socket.emit 'newEntity', @Serialize() if socket?

  SendUpdateTo: (socket) ->
    socket.emit 'updateEntity' + @id, @Serialize() if socket?

  PropagDisconnect: ->
#     console.log @playersObs
    for i, obs of @playersObs
      console.log i, obs.login, @owner.login, "Length : ", @playersObs.length
      if obs.login is @owner.login
        delete @playersObs[i]
        @playersObs.splice i, 1
    console.log "End PropagDisconnect", @playersObs.length

  Start: ->
    if !(@moveTimer?)
      @currentDir = @path[0]
      @moveTimer = setInterval =>
        @UpdatePos()
      , @speed * 1000

  Stop: ->
    if @moveTimer?
      clearInterval @moveTimer
      @moveTimer = null
      console.log "Stop"

  HitBy: (attacker) ->
    @life.amount -= 5
    @NotifyPlayers()
    if @life.amount <= 0
      @Dead()

  Dead: ->
    @Notify null, (socket) =>
      socket.emit 'destroyEntity' + @id #provisoire
    @parent.DeadEntity this
