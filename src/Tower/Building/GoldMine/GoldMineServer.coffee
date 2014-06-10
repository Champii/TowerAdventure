#<< Module
#<< Tower/Building/GoldMine/GoldMineBase
#<< Tower/Building/BuildingServer

class Tower.Building.GoldMine.GoldMineServer extends Module

  @include Tower.Building.GoldMine.GoldMineBase
  @include Tower.Building.BuildingServer
  
  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?