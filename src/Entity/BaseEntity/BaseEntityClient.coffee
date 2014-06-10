#<< Module
#<< Entity/BaseEntity/BaseEntityBase
#<< Entity/EntityClient

class Entity.BaseEntity.BaseEntityClient extends Module

  @include Entity.BaseEntity.BaseEntityBase
  @include Entity.EntityClient

  constructor: (@parent, entity, @socket) ->
    super [], [entity, baseEntityImage]
    console.log @path
  