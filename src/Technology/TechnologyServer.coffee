#<< Module
#<< Technology/TechnologyBase
#<< DbManager/DbItem

Technology.schema =
  __name__:         'Techno'
  _owner:           { type: 'ObjectId', ref: 'Player' }
  name:             String
  level:            Number
  cost:             [Number]
  requiredBuilds:   [{name: String, level: Number}]
  requiredTechnos:  [{name: String, level: Number}]
  underConstruct:   Boolean
  startTime:        { type: Date }
  finishTime:       { type: Date }

class Technology.TechnologyServer extends Module

  @include Technology.TechnologyBase
  @include DbManager.DbItem

  constructor: (@parent, @id, callback) ->
    super [], [Technology.schema, @id, =>
      @Deserialize this
      callback() if callback?]

  PropagSocket: (@socket) ->
    @SendTo @socket
    @socket.on 'updateTechno' + @id, (techno) =>
      @Deserialize techno
    @socket.on 'askLevelUpTechno' + @id, =>
      @LevelUp()

  LevelUp: ->
    city = @parent.parent.currentCity
    if !@CanLevelUp city
      @socket.emit 'notification', {title: "Can't level up", message: "The techno " + @name + " can't be leveled up to " + (@level + 1), persistance: false}
      return
    city.resources.Buy @GetPrice()
    @_super()
    @socket.emit 'levelUpTechno' + @id, @Serialize()
    @socket.emit 'notification', {title: "Starting level up techno", message: "The techno " + @name + " has begun to level up to " + @level, persistance: false}
    setTimeout =>
      @socket.emit 'notification', {title: "Level up !", message: "The techno " + @name + " has level up to " + @level + "!", persistance: false} if @socket?
      @underConstruct = false
      @startTime = 0
      @finishTime = 0
      @SendUpdateTo @socket
    , @GetPrice().time

  SendTo: (socket) ->
    socket.emit 'technology' + @parent.parent.owner.id, @Serialize()

  SendUpdateTo: (socket) ->
    socket.emit 'updateTechnology' + @id, @Serialize()

