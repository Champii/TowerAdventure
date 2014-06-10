#<< Module
#<< CityManager/CityManagerClient
#<< Player/PlayerBase


class Player.PlayerClient extends Module

  @include Player.PlayerBase

  own: false

  constructor: (player, socket, scope) ->
    super [player, socket]
    @own = player.own
    @id = player.id
    @cityManager = new CityManager.CityManagerClient this, @socket, scope
    if @own
      scope.centerInit player.mainCityPos

