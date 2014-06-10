#<< Module
#<< TowerManager/TowerManagerBase

class TowerManager.TowerManagerServer extends Module

  @include TowerManager.TowerManagerBase
  
  constructor: (city) ->
    super [city]
  
#   SendAllTo: (socket, isOwner) ->
#     @socket = socket
#     for tower in @towers
#       tower.SendTo socket, isOwner
      