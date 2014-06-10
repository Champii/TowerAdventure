#<< Module
#<< Tower/Building/SolarCentral/SolarCentralBase
#<< Tower/Building/BuildingClient

class Tower.Building.SolarCentral.SolarCentralClient extends Module

  @include Tower.Building.SolarCentral.SolarCentralBase
  @include Tower.Building.BuildingClient

  constructor: (city, cityHall, socket) ->
    super [], [city, cityHall, socket, baseDefenseTowerImage]

