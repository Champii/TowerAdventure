#<< Module
#<< Tower/TowerServer
#<< Tower/Building/BuildingBase

class Tower.Building.BuildingServer extends Module

  @include Tower.Building.BuildingBase
  @include Tower.TowerServer

  constructor: () ->
    super [], []
