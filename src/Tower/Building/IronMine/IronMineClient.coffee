#<< Module
#<< Tower/Building/IronMine/IronMineBase
#<< Tower/Building/BuildingClient

class Tower.Building.IronMine.IronMineClient extends Module

  @include Tower.Building.IronMine.IronMineBase
  @include Tower.Building.BuildingClient

  constructor: (city, cityHall, socket) ->
    super [], [city, cityHall, socket, baseDefenseTowerImage]
