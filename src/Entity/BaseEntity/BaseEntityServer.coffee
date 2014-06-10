#<< Module
#<< Entity/BaseEntity/BaseEntityBase
#<< Entity/EntityServer

class Entity.BaseEntity.BaseEntityServer extends Module

  @include Entity.BaseEntity.BaseEntityBase
  @include Entity.EntityServer
  
  constructor: (@parent, @id) ->
    super [], []
  
  