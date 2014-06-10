class Entity.EntityBase

  id: null
  name: null
  type: null
  parent: null
  target: null
  path: null
  pathIdx: null
  speed: null #In tile per second
  moveTimer: null

  constructor: (entity) ->
    @type = 'Entity'
    @Deserialize entity

  Serialize: ->
    id: @id
    name: @name
    pos: @pos
    speed: @speed
    path: @path
    life: @life
    pathIdx: @pathIdx

  Deserialize: (entity) ->
    if entity?
      @id = entity.id if entity.id?
      @name = entity.name if entity.name?
      @pos = entity.pos if entity.pos?
      @speed = entity.speed if entity.speed?
      @path = entity.path if entity.path?
      @life = entity.life if entity.life?
      @pathIdx = entity.pathIdx if entity.pathIdx?
