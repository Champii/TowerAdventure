#<< Module
#<< Tower/DefenseTower/BaseDefenseTower/BaseDefenseTowerBase
#<< Tower/DefenseTower/DefenseTowerClient

class Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerClient extends Module

  @include Tower.DefenseTower.BaseDefenseTower.BaseDefenseTowerBase
  @include Tower.DefenseTower.DefenseTowerClient

  constructor: (city, tower, socket) ->
    super [], [city, tower, socket, baseDefenseTowerImage]
    
  