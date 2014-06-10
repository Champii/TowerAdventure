#<< Module
#<< Tower/Building/UraniumMine/UraniumMineBase
#<< Tower/Building/BuildingServer

class Tower.Building.UraniumMine.UraniumMineServer extends Module

  @include Tower.Building.UraniumMine.UraniumMineBase
  @include Tower.Building.BuildingServer
  
  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
    