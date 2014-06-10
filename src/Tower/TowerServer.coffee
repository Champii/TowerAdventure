#<< Module
#<< Tower/TowerBase
#<< AliveObject/AliveObjectServer
#<< DbManager/DbItem

Tower.schema =
  __name__: 'Tower'
  _owner:   { type: 'ObjectId', ref: 'Player' }
  _city:    { type: 'ObjectId', ref: 'City' }
  name:     String
  level:    Number
  range:    Number
  pos:      {x: Number, y: Number}
  posEnd:   {x: Number, y: Number}
  underConstruct: Boolean
  startTime: { type: Date }
  finishTime: { type: Date }

class Tower.TowerServer extends Module

  @include Tower.TowerBase
  @include AliveObject.AliveObjectServer
  @include DbManager.DbItem

  state: null
  attackTimer: null
  getTargetTimer: null

  constructor: () ->
    super [], [], []
    @owner = @city.owner
#     @pos = {x: @item.pos[0], y: @item.pos[1]}
#     @posEnd = {x: @item.posEnd[0], y: @item.posEnd[1]}
    chunk = @owner.parent.map.GetChunk @pos
    @Attach chunk
    console.log "Attachement of " + @name + ", chunk obs length = ", chunk.observators.length
    chunk.Attach this
    console.log "Attached " + @name + ", chunk obs length = ", chunk.observators.length
    @Notify @owner, (socket, isOwner) =>
      @SendTo socket, isOwner
    @state = 'GetTarget'
    @GetTarget()

  destructor: ->
    @Notify @owner, (socket, isOwner) =>
      socket.emit 'destroyedObject' + @id
    for obs in @observators
      obs.Detach this
    @observators = []
    @socket.removeAllListeners 'askLevelUp' + @id
    @socket.removeAllListeners 'askEvolve' + @id
    @socket.removeAllListeners 'updateTower' + @id
    @socket.removeAllListeners 'destroyedObject' + @id
    clearInterval @attackTimer
    clearInterval @getTargetTimer


  LevelUp: ->
    if !@CanLevelUp()
      @socket.emit 'notification', {title: "Can't level up", message: "The building " + @name + " can't be leveled up to " + (@level + 1), persistance: false}
      return
    @city.resources.Buy @GetPrice()
    @_super()
    @socket.emit 'levelUp' + @id, @Serialize()
    @socket.emit 'notification', {title: "Starting level up", message: "The building " + @name + " has begun to level up to " + @level, persistance: false}
    setTimeout =>
      @socket.emit 'notification', {title: "Level up !", message: "The building " + @name + " has level up to " + @level + "!", persistance: false} if @socket?
      @underConstruct = false
      @startTime = 0
      @finishTime = 0
      @Notify @owner, (socket) =>
        @SendUpdateTo socket
    , @GetPrice().time

  Evolve: (className) ->
    console.log "Evolution"
    evol = @GetEvol className
    if evol?
      if @CanEvolve className
        @city.resources.Buy evol.costForm @level
        @_super className
        @socket.emit 'evolve' + @id, @Serialize()
        @socket.emit 'notification', {title: "Evolution", message: "The Tower \'" + @name + "\' has started to evolve into \'" + className + "\' !", persistance: false}
        setTimeout =>
          @underConstruct = false
          @startTime = 0
          @finishTime = 0
          @name = className
          @SaveDb =>
#             @Notify @owner, (socket) =>
#               @SendUpdateTo socket
            @socket.emit 'notification', {title: "Evolution !", message: "The Tower \'" + @name + "\' has finished to evolve into \'" + className + "\' !", persistance: false} if @socket?
            @city.buildingManager.Evolve this, {name: className, id: @id}
        , @GetPrice(evol).time
      else
        @socket.emit 'notification', {title: 'Can\'t evolve', message: 'You cannot evolve \'' + @name + '\' to \'' + className + '\'', persistance: false}


  PropagSocket: (socket) ->
    @socket = socket
    @socket.on 'askLevelUp' + @id, =>
      @LevelUp()
    @socket.on 'askEvolve' + @id, (className) =>
      console.log "AskEvole received"
      @Evolve className.className

  SendTo: (socket, isOwner, isRec) ->
    serie = @Serialize()
    serie.own = isOwner
    command =  if isOwner then 'ownBuildingObject' + @city.id else 'buildingObject' + @city.id
    socket.emit command, serie
    console.log "Tower Send " + @name + " own = " + isOwner + " id = " + @id + " cityId = " + @city.id

  SendUpdateTo: (socket) ->
    socket.emit 'updateTower' + @id, @Serialize()

  PropagDisconnect: ->
    @socket.removeAllListeners 'askLevelUp' + @id
    @socket.removeAllListeners 'askEvolve' + @id
    @socket = null

  ChangeState: (state) ->
    if @state isnt state
      console.log 'Changing state : ', state
      @state = state
      if @target?
        clearInterval @getTargetTimer
        @Attack()
      else
        clearInterval @attackTimer
        @GetTarget()

  Attack: ->
    @attackTimer = setInterval =>
      length = {x: Math.abs(@pos.x - @target.pos.x), y: Math.abs(@pos.y - @target.pos.y)} if @target?
      console.log length, @target.name, @fireRange
      if !(@target?) or length.x > @fireRange or length.y > @fireRange or @target.life.amount <= 0
        @target = null
        @ChangeState 'GetTarget'
      else
        bulletTimer = setTimeout =>
          @target.HitBy this
          console.log "Attacking ", @target.name
        , 5
    , 1
#     , @fireRate / 60 * 1000


  GetTarget: ->
    @getTargetTimer = setInterval =>
      chunk = @observators[0]
      for i in [@pos.x - @fireRange .. @posEnd.x + @fireRange]
        for j in [@pos.y - @fireRange .. @posEnd.y + @fireRange]
          if i is @pos.x - @fireRange or i is @posEnd.x + @fireRange or j is @pos.y - @fireRange or j is @posEnd.y + @fireRange
            @target = chunk.GetTakenPlace {x: i, y: j}
            if @target? and @target.id isnt @id and @owner.id isnt @target.owner.id
              console.log "Target = ", @target.name
              @ChangeState 'Attack'
              return

    , 1000
