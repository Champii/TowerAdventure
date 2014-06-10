#<< Module
#<< EntityManager/EntityManagerBase
#<< Entity/BaseEntity/BaseEntityClient

class EntityManager.EntityManagerClient extends Module

  @include EntityManager.EntityManagerBase

  socket: null

  constructor: (@socket) ->
    super []
    @socket.on 'newEntity', (entity) =>
      @AddEntity entity
    setInterval =>
      entityContainer.draw()
    , 500

  AddEntity: (entity) ->
    ent = switch entity.name
      when 'baseEntity' then new Entity.BaseEntity.BaseEntityClient this, entity, @socket
    @_super ent

