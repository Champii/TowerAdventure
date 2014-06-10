#<< Module
#<< CityManager/CityManagerBase
#<< City/CityClient
#<< TechnologyManager/TechnologyManagerClient

class CityManager.CityManagerClient extends Module

  @include CityManager.CityManagerBase

  socket: null
  scope: null
  currentCity: null
  parent: null
  own: false

  constructor: (@parent, @socket, @scope) ->
    super []
    @own = @parent.own
    if @own
      @socket.on 'ownCityObject', (city) =>
        newCity = new City.CityClient this, city, @socket, @scope
        @scope.updateLoadMessages 'city'
        @AddCity newCity
        if city.isMain
          @scope.centerOnCity newCity
        setInterval =>
          @scope.$apply =>
            @UpdateAllConstruct()
        ,1000
      @technologyManager = new TechnologyManager.TechnologyManagerClient this, @socket
    else
      @socket.on 'cityObject' + @parent.id , (city) =>
        newCity = new City.CityClient this, city, @socket, @scope
        @AddCity newCity


  UpdateAllConstruct: ->
    for city in @citys
      city.buildingManager.UpdateAllConstruct()

      