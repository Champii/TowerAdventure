#<< Module
#<< Tower/Building/CristalMine/CristalMineBase
#<< Tower/Building/BuildingClient

class Tower.Building.CristalMine.CristalMineClient extends Module

  @include Tower.Building.CristalMine.CristalMineBase
  @include Tower.Building.BuildingClient

  constructor: (city, cityHall, socket) ->
    super [], [city, cityHall, socket, baseDefenseTowerImage]
