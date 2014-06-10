#<< Module
#<< EntityManager/EntityManagerBase
#<< DbManager/DbCollection

class EntityManager.EntityManagerServer extends Module

  @include EntityManager.EntityManagerBase
  @include DbManager.DbCollection

  parent: null

  constructor: (@parent) ->
    super [], [Entity.schema]

  NewEntity: (entity, type) ->
    name = switch type
      when Entity.BaseEntity.BaseEntityServer then 'baseEntity'
    entity.name = name
    entity.pos = {x: entity.pos.x, y: entity.pos.y}
    @NewDb entity , (ent) =>
      @AddEntity new type this, ent.id

  PropagDisconnect: ->
    for entity in @entities
      entity.PropagDisconnect()

  DeadEntity: (entity) ->
    entity.destructor()
    @DeleteEntity entity