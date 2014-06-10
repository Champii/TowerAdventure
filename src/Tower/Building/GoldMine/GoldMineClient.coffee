#<< Module
#<< Tower/Building/GoldMine/GoldMineBase
#<< Tower/Building/BuildingClient

class Tower.Building.GoldMine.GoldMineClient extends Module

  @include Tower.Building.GoldMine.GoldMineBase
  @include Tower.Building.BuildingClient

  constructor: (city, cityHall, socket) ->
    super [], [city, cityHall, socket, baseDefenseTowerImage]
