#<< Module
#<< Tower/BaseTower/BaseTowerBase
#<< Tower/TowerClient

class Tower.BaseTower.BaseTowerClient extends Module

  @include Tower.BaseTower.BaseTowerBase
  @include Tower.TowerClient
  
  constructor: (city, baseTower, socket) ->
    super [], [city, baseTower, socket, baseTowerImage]
  
  
  