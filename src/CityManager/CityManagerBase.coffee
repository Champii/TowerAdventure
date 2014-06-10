class CityManager.CityManagerBase

  parent: null
  citys: null

  constructor: ->
    @citys = []

  AddCity: (city) ->
    @citys.push city
    city

  GetCity: (name) ->
    for city in @citys
      if city.name == name
        return city
    null
    
  GetCityById: (id) ->
    for city in @citys
      if city.id == id
        return city
    null

  GetMainCity: ->
    for city in @citys
      if city.isMain
        return city
    null

  GetAllCityPos: ->
    