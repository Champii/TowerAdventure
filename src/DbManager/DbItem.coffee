class DbManager.DbItem

  dbName: null
  dbManager: null
  schema: null
  Model: null
  item: null

  constructor: (schema, id, cb) ->
    @InitDb schema, id, cb if schema

  InitDb: (schema, id, cb) ->
    @dbManager = Singleton.get(DbManager.DbManager)
    @dbName = schema.__name__

    @schema = schema
    if !(@dbManager.models[@dbName]?)
      @Model = @dbManager.InitModel schema
    else
      @Model = @dbManager.models[@dbName]
    @LoadDb id, cb if id?

  SaveDb: (cb) ->
    for k, v of @schema
      for x, y of this
        if k is x
          @item[k] = y
    @item.save (err) =>
      return handleError(err) if err
      cb() if cb?

  LoadDb: (id, cb) ->
    if @Model? and @schema
      @Model.findOne {_id: id},  (err, obj) =>
        return handleError(err) if err
        if obj
          @item = obj
          @id = @item.id
          for k, v of @schema
            for x, y of this
              if k is x
                this[x] = @item[x]
          cb obj if cb?

