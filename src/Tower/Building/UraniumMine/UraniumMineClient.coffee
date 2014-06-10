#<< Module
#<< Tower/Building/UraniumMine/UraniumMineBase
#<< Tower/Building/BuildingClient

class Tower.Building.UraniumMine.UraniumMineClient extends Module

  @include Tower.Building.UraniumMine.UraniumMineBase
  @include Tower.Building.BuildingClient

  constructor: (city, cityHall, socket) ->
    super [], [city, cityHall, socket, baseDefenseTowerImage]

