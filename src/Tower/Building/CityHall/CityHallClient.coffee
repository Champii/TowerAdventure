#<< Module
#<< Tower/Building/CityHall/CityHallBase
#<< Tower/Building/BuildingClient

class Tower.Building.CityHall.CityHallClient extends Module

  @include Tower.Building.CityHall.CityHallBase
  @include Tower.Building.BuildingClient

  constructor: (city, cityHall, socket) ->
    super [], [city, cityHall, socket, cityHallImage]
    @image.setOffset 0, 40
    

    if @own
      @image.on 'mouseenter', (e) =>
        @city.ShowRange()
      @image.on 'mouseout', (e) =>
        @city.HideRange()
