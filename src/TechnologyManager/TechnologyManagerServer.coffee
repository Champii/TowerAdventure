#<< Module
#<< TechnologyManager/TechnologyManagerBase
#<< Technology/TechnologyServer

class TechnologyManager.TechnologyManagerServer extends Module

  @include TechnologyManager.TechnologyManagerBase
  @include DbManager.DbCollection

  constructor: (@parent, callback) ->
    super [], [Technology.schema]
    @GetAllDb '_owner', @parent.parent.id, (technos) =>
      for techno in technos
        do (techno) =>
          t = new Technology.TechnologyServer this, techno.id, =>
            @AddTechno t
      callback() if callback?

  PropagSocket: (@socket) ->
    console.log @technos
    for name, techno of @technos
      console.log techno
      techno.PropagSocket @socket

