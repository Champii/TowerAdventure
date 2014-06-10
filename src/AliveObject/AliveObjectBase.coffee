class AliveObject.AliveObjectBase

  name: null
  type: null
  pos: null
  life: null

  constructor: (object) ->
    @life = {amount: 50, total: 50}
    if object?
      @name = object.name if object.name?
      @type = object.type if object.type?
      @pos = object.pos if object.pos?

#   Serialize: ->
#     @life
# 
#   Deserialize: (object) ->
#     @life = object.life if object.life?
    