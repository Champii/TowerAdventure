#<< Module
#<< TechnologyManager/TechnologyManagerBase

class TechnologyManager.TechnologyManagerClient extends Module

  @include TechnologyManager.TechnologyManagerBase

  constructor: (@parent, @socket, @scope) ->
    super []
    @socket.on 'technology' + @parent.parent.id, (techno) =>
      @AddTechno new Technology.TechnologyClient this, techno, @socket, scope
      console.log "New Techno : ", techno
