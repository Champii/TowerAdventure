#<< Module
#<< Tower/Building/CityHall/CityHallBase
#<< Tower/Building/BuildingServer

class Tower.Building.CityHall.CityHallServer extends Module

  @include Tower.Building.CityHall.CityHallBase
  @include Tower.Building.BuildingServer
  
  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
      