class City.CityBase

  parent: null
  id: null
  name: null
  type: null
  pos: null
  range: null
  isMain: null
  buildingManager: null
  defTowerManager: null
  spawnTowerManager: null
  resources: null
  territory: null
  
  constructor: (city, resources) ->
    @Deserialize city
    @type = 'City'

  Serialize: ->
    id: @id
    name: @name
    pos: @pos
    range: @range
    isMain: @isMain

  Deserialize: (city) ->
    if city?
      @id = city.id
      @name = city.name
      @pos = city.pos
      @range = city.range
      @isMain = city.isMain
