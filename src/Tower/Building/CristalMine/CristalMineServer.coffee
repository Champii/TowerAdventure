#<< Module
#<< Tower/Building/CristalMine/CristalMineBase
#<< Tower/Building/BuildingServer

class Tower.Building.CristalMine.CristalMineServer extends Module

  @include Tower.Building.CristalMine.CristalMineBase
  @include Tower.Building.BuildingServer
  
  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
    