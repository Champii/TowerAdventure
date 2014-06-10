#<< Module
#<< Tower/Building/SolarCentral/SolarCentralBase
#<< Tower/Building/BuildingServer

class Tower.Building.SolarCentral.SolarCentralServer extends Module

  @include Tower.Building.SolarCentral.SolarCentralBase
  @include Tower.Building.BuildingServer
  
  constructor: (@city, @id, cb)->
    @InitDb Tower.schema, @id, =>
      super [], []
      cb() if cb?
    