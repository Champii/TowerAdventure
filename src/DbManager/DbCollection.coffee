class DbManager.DbCollection

  @Models: []

  dbName: null
  dbManager: null
  schema: null
  Model: null
  
  
  constructor: (schema) ->
    @InitDb schema if schema
  
  InitDb: (schema) ->
    @dbManager = Singleton.get(DbManager.DbManager)
    @dbName = schema.__name__

    @schema = schema
    if !(@dbManager.models[@dbName]?)
      @Model = @dbManager.InitModel schema
    else
      @Model = @dbManager.models[@dbName]

    
  NewDb: (obj, cb) ->
    item = new @Model obj
    item.save (err) =>
      return handleError(err) if err
      cb item if cb?

  GetAllDb: (field, value, cb) ->
    query = {}
    query[field] = value if field? and value?
    @Model.find query, (err, obj) ->
      return handleError(err) if err
      cb obj if cb?

  GetOneDb: (field, value, cb) ->
    query = {}
    query[field] = value if field? and value?
    @Model.findOne query, (err, obj) ->
      return handleError(err) if err
      cb obj if cb?
