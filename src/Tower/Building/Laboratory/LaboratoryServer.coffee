#<< Module
#<< Tower/Building/Laboratory/LaboratoryBase
#<< Tower/Building/BuildingServer

class Tower.Building.Laboratory.LaboratoryServer extends Module

  @include Tower.Building.Laboratory.LaboratoryBase
  @include Tower.Building.BuildingServer

  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
  
  
  