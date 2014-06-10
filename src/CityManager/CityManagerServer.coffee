#<< Module
#<< CityManager/CityManagerBase
#<< City/CityServer
#<< DbManager/DbCollection
#<< TechnologyManager/TechnologyManagerServer

class CityManager.CityManagerServer extends Module

  @include CityManager.CityManagerBase
  @include DbManager.DbCollection

  owner: null
  currentCity: null

  constructor: (@parent, callback) ->
    super [], [City.schema]
    loaded = 0
    @owner = @parent
    @technologyManager = new TechnologyManager.TechnologyManagerServer this, =>
      @GetAllDb '_owner', @parent.id, (citys) =>
        @FillCitys citys, =>
          if ++loaded == citys.length
            @currentCity = @GetMainCity()
            callback() if callback?

  FillCitys: (citys, callback) ->
    i = 1
    for city in citys
      @AddCity new City.CityServer(this, city.id, callback)
      Log.log "Load |-- City" + " (" + i++ + ") "+ city.name + " id: " + city.id

  PropagDisconnect: ->
    for city in @citys
      city.PropagDisconnect()

