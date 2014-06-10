#<< Module
#<< Tower/DefenseTower/BaseDefenseTower/BaseDefenseTowerBase
#<< Tower/DefenseTower/DefenseTowerServer

class Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerServer extends Module

  @include Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerBase
  @include Tower.DefenseTower.DefenseTowerServer
  
  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
    