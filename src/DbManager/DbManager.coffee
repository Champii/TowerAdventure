class DbManager.DbManager

  mongoose: null
  ready: false

  ObjectId: null
  models: null
  schemas: null
  technoSchema: null

  constructor: ->
    @models = []
    @schemas = []
    @mongoose = require 'mongoose'
    con = @mongoose.connect 'mongodb://localhost:27017/tdadv', (err) =>
      return handleError(err) if err

      @mongoose.set('debug', true)
      Log.log "Connected to database"
      @mongoose.connection.on 'error', (err) ->
        console.error('MongoDB error: %s', err)
      @mongoose.connection.db.dropDatabase (err) =>
        return handleError(err) if err
        @ObjectId = @mongoose.Schema.ObjectId
        @ready = true

  InitModel: (schema) ->
    name = schema.__name__
    if !(@models[name]?)
      for k, v of schema
        if k is '__name__'
          delete schema[k]
        else if k.type? and k.type is 'ObjectId' or k.type is ['ObjectId']
          k.type = @mongoose.Schema.ObjectId if k.type == 'ObjectId'
          k.type = [@mongoose.Schema.ObjectId] if k.type == ['ObjectId']

      mSchema = new @mongoose.Schema schema
#       mSchema.virtual('id').get ->
#         return parseInt(this._id.toHexString())
      model = @mongoose.model name, mSchema
      @models[name] = model
      @schemas[name] = mSchema
      schema.__name__ = name
      return model
    null


  addPlayerModel: (data, pos, callback) ->
    if !(@models['Player']?)
      @InitModel Player.schema
    
    newPlayer = new @models['Player']
      login:    data.login
      pass:     data.pass
      technos:  []

    @addCityModel newPlayer, null, pos, (newBase) =>
      newPlayer.citys.push newBase
      newPlayer.save (err) =>
        return handleError(err) if err
#         @models['Player'].findOne({login: data.login}).populate('citys').exec (err, gettedPlayer) ->
#           return handleError(err) if err
        Log.log "DB : Player " + newPlayer.login + " is added to the database"
        @addAllTechnos newPlayer, null, (techno, end) =>
          newPlayer.technos.push techno
          newPlayer.save (err) =>
            console.log "TECHNO : ", techno
            if end?
              callback newPlayer if callback?

  addCityModel: (owner, data, pos, callback) ->
    isMain = (if data then false else true)
    name = (if data then data.name else "MainCity")

    if !(@models['City']?)
      @InitModel City.schema
    newCity = new @models['City']
      _owner:   owner
      pos:      pos
      range:    8
      isMain:   isMain
      name:     name

    @addResourcesModel newCity, (newResources) =>
      newCity.resources = newResources
      @addTerritoryModel newCity, (territory) =>
        newCity.territory = territory
        @addBuildingModel owner, newCity, null, (newBuilding) =>
          newCity.buildings.push newBuilding
          newBuilding.save (err) =>
            return handleError(err) if err
          newCity.save (err) =>
            return handleError(err) if err
            Log.log "DB : New city " + newCity.name + " is added to the database"
            callback newCity if callback
    return newCity


  addResourcesModel: (city, callback) ->
    if !(@models['Resources']?)
      @InitModel Resources.schema
    newResources = new @models['Resources']
      _owner:   city
      iron:     500
      gold:     200
      cristal:  50
      uranium:  0
      petrol:   0
      energy:   0
      lastUpdate: new Date()

    newResources.save (err) =>
      return handleError(err) if err
      callback newResources


  addTerritoryModel: (city, callback) ->
    if !(@models['Territory']?)
      @InitModel Territory.schema

    territory = []
    range = 6
    for i in [city.pos.x - range..city.pos.x + range + 2]
      for j in [city.pos.y - range - 2..city.pos.y + range]
        territory.push {x: i, y: j}
    newTerritory = new @models['Territory']
      _owner:   city._owner
      _city:    city
      territory: territory

    newTerritory.save =>
      callback newTerritory
      
  addBuildingModel: (owner, city, data, callback) ->
    name = (if data then data.name else "cityHall")
    underConstruct = (if data then data.underConstruct else false)
    pos = (if data then data.pos else city.pos)
    posEnd = (if data then data.posEnd else {x:city.pos.x + 3, y:city.pos.y + 3})
    if !(@models['Tower']?)
      @InitModel Tower.schema
    newBuilding = new @models['Tower']
      _owner:   owner
      _city:    city
      name:     name
      pos:      {x: pos.x, y: pos.y}
      posEnd:   posEnd
      level:    1
      fireRange:1
      fireRate: 1
      underConstruct: underConstruct
      startTime: 0
      finishTime: 0

    callback newBuilding if callback
    Log.log "DB : New Building " + newBuilding.name + " is added to the database"
    return newBuilding

  addAllTechnos: (owner, data, callback) ->
    technos =
      defenseScience:
        cost: [60, 15, 12, 0, 0]
        requiredBuilds: [{name: "laboratory", level: 1}]
        requiredTechnos: []
      spawnScience:
        cost: [60, 15, 12, 0, 0]
        requiredBuilds: [{name: "laboratory", level: 5}]
        requiredTechnos: []

    if !(@models['Techno']?)
      @InitModel Technology.schema

    for name, obj of technos
      do (name, obj) =>
        console.log "AAAAAAAAAAAAAAAAAA"
        console.log "AAAAAAAAAAAAAAAAAA"
        console.log "AAAAAAAAAAAAAAAAAA"
        console.log "AAAAAAAAAAAAAAAAAA"
        console.log "AAAAAAAAAAAAAAAAAA"
        console.log "AAAAAAAAAAAAAAAAAA"
        console.log name, obj
        newTech = new @models['Techno']
          _owner:           owner
          name:             name
          level:            0
          cost:             obj.cost
          requiredBuilds:   obj.requiredBuilds
          requiredTechnos:  obj.requiredTechnos
        newTech.save ->
          end = (if name is 'spawnScience' then true else null)
          callback newTech, end

  getTechnos: (player) ->
    
