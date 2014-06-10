#<< Module
#<< Tower/Building/IronMine/IronMineBase
#<< Tower/Building/BuildingServer

class Tower.Building.IronMine.IronMineServer extends Module

  @include Tower.Building.IronMine.IronMineBase
  @include Tower.Building.BuildingServer

  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
      