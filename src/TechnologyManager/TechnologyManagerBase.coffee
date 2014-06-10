class TechnologyManager.TechnologyManagerBase

  technos: null
  socket: null
  owner: null

  constructor: ->
    @technos = {}

  AddTechno: (techno) ->
    @technos[techno.name] = techno

  GetTechno: (name) ->
    @technos[name]
