class Territory.TerritoryBase

  id: null
  city: null
  owner: null
  territory: null
  socket: null

  constructor: (territory) ->
    @territory = []
    @owner = @city.parent.parent if @city?
    @Deserialize territory if territory?
    
  Serialize: ->
    territory: @territory

  Deserialize: (territory) ->
    @id = territory.id
    @territory = territory.territory

  IsInTerritory: (pos) ->
    for ter in @territory
      if ter.x is pos.x and ter.y is pos.y
        return true
    false
    