#<< Module
#<< Tower/Building/PetrolMine/PetrolMineBase
#<< Tower/Building/BuildingServer

class Tower.Building.PetrolMine.PetrolMineServer extends Module

  @include Tower.Building.PetrolMine.PetrolMineBase
  @include Tower.Building.BuildingServer
  
  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
      