#<< Module
#<< Tower/Building/PetrolMine/PetrolMineBase
#<< Tower/Building/BuildingClient

class Tower.Building.PetrolMine.PetrolMineClient extends Module

  @include Tower.Building.PetrolMine.PetrolMineBase
  @include Tower.Building.BuildingClient

  constructor: (city, cityHall, socket) ->
    super [], [city, cityHall, socket, baseDefenseTowerImage]

