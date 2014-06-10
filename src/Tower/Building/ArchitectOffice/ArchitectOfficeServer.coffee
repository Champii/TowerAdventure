#<< Module
#<< Tower/Building/ArchitectOffice/ArchitectOfficeBase
#<< Tower/Building/BuildingServer

class Tower.Building.ArchitectOffice.ArchitectOfficeServer extends Module

  @include Tower.Building.ArchitectOffice.ArchitectOfficeBase
  @include Tower.Building.BuildingServer
  
  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
    