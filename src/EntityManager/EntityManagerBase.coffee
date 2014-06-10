class EntityManager.EntityManagerBase

  entities: null

  constructor: ->
    @entities = []

  AddEntity: (entity) ->
    @entities.push entity
    entity

  DeleteEntity: (entity) ->
    for i, ent of @entities
      if ent is entity
        delete @entities[i]
        @entities.splice i, 1
    