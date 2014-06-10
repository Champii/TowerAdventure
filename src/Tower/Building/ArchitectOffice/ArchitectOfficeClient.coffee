#<< Module
#<< Tower/Building/ArchitectOffice/ArchitectOfficeBase
#<< Tower/Building/BuildingClient

class Tower.Building.ArchitectOffice.ArchitectOfficeClient extends Module

  @include Tower.Building.ArchitectOffice.ArchitectOfficeBase
  @include Tower.Building.BuildingClient

  constructor: (city, cityHall, socket) ->
    super [], [city, cityHall, socket, baseDefenseTowerImage]

