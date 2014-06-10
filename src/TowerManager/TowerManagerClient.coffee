#<< Module
#<< TowerManager/TowerManagerBase

class TowerManager.TowerManagerClient extends Module

  @include TowerManager.TowerManagerBase

  constructor: (city) ->
    super [city]

    