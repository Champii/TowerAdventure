#<< Module
#<< Tower/BaseTower/BaseTowerBase
#<< Tower/TowerServer

class Tower.BaseTower.BaseTowerServer extends Module

  @include Tower.BaseTower.BaseTowerBase
  @include Tower.TowerServer
  
  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
  
  
  