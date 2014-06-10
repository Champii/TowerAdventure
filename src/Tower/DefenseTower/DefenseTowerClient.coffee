#<< Module
#<< Tower/DefenseTower/DefenseTowerBase
#<< Tower/TowerClient

class Tower.DefenseTower.DefenseTowerClient extends Module

  @include Tower.DefenseTower.DefenseTowerBase
  @include Tower.TowerClient

  constructor: (city, defenseTower, socket, image) ->
    super [], [city, defenseTower, socket, image]

  