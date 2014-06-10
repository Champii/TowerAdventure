#<< Module
#<< Tower/TowerClient
#<< Tower/Building/BuildingBase

class Tower.Building.BuildingClient extends Module

  @include Tower.TowerClient
  @include Tower.Building.BuildingBase

  constructor: (city, building, socket, image) ->
    super [city, building, socket, image]

