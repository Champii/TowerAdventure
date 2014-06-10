class Technology.TechnologyBase

  parent: null
  name: null
  level: null
  requiredBuilds: null
  requiredTechnos: null
  cost: null
  underConstruct: null
  startTime: null
  finishTime: null

  constructor: (techno) ->
    @Deserialize techno if techno?

  Deserialize: (techno) ->
    @id = techno.id if techno.id?
    @name = techno.name if techno.name?
    @level = techno.level if techno.level?
    if techno.cost?
      @costForm = (level) =>
        {iron: techno.cost[0] * Math.pow(1.5, level - 1), gold: techno.cost[1] * Math.pow(1.5, level - 1), cristal: techno.cost[2], uranium: techno.cost[3], petrol: techno.cost[4], energy: 0, pop: 0}
    @underConstruct = techno.underConstruct if techno.underConstruct?
    @startTime = new Date techno.startTime if techno.startTime?
    @finishTime = new Date techno.finishTime if techno.finishTime?

  Serialize: ->
    id: @id
    name: @name
    level: @level
    cost: @cost
    requiredBuilds: @requiredBuilds
    requiredTechnos: @requiredTechnos
    underConstruct: @underConstruct
    startTime: @startTime
    finishTime: @finishTime

  GetPrice: ->
    if @costForm?
      price = @costForm @level + 1
      price.time =  Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000
      return price
    null

  CanLevelUp: (city) ->
    price = @GetPrice()
    city.resources.UpdateResources()
    if price? && @underConstruct or price.iron > city.resources.iron or price.gold > city.resources.gold or price.cristal > city.resources.cristal or price.uranium > city.resources.uranium or price.petrol > city.resources.petrol or price.energy > city.resources.energy or price.pop > city.resources.pop
      return false
    else
      return true

  LevelUp: ->
    @underConstruct = true
    @level++
    @startTime = new Date().getTime()
    @finishTime = @startTime + @GetPrice().time
