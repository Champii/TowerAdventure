class Tower.TowerBase

  id: null
  posEnd: null
  type: null
  city: null
  owner: null
  underConstruct: null
  finishTime: null
  evolvList: null
  level: null
  fireRange: 8
  fireRate: null
  socket: null

  #Formulas for cost and production
  costForm: null
  prodForm: null

  constructor: (city, tower) ->
    @type = 'Tower'
    @Deserialize tower if tower?
    @city = city if city?

  LevelUp: ->
    @underConstruct = true
    @level++
    @startTime = new Date().getTime()
    @finishTime = @startTime + @GetPrice().time

  Evolve: (className) ->
    evol = @GetEvol className
    @underConstruct = true
    @startTime = new Date().getTime()
    @finishTime = @startTime + @GetPrice(evol).time


  Serialize: ->
    _id: @id
    name: @name
    pos: @pos
    posEnd: @posEnd
    level: @level
    fireRange: @fireRange
    fireRate: @fireRate
    underConstruct: @underConstruct
    startTime: @startTime
    finishTime: @finishTime
    life: @life

  Deserialize: (tower) ->
    if tower?
      @id = tower._id if tower._id?
      @pos = tower.pos if tower.pos?
      @posEnd = tower.posEnd if tower.posEnd?
      @underConstruct = tower.underConstruct if tower.underConstruct?
      @startTime = new Date tower.startTime if tower.startTime?
      @finishTime = new Date tower.finishTime if tower.finishTime?
      @level = tower.level if tower.level?
      @range = tower.range if tower.range?
      @own = tower.own if tower.own?
      @life = tower.life if tower.life?

  GetPrice: (other) ->
    if other? #If evolution
      price = other.costForm @level
      price.time =  Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000
      return price
    else if @costForm? #If levelUp
      price = @costForm @level + 1
      price.time =  Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000
      return price
    null

  CanLevelUp: ->
    price = @GetPrice()
    @city.resources.UpdateResources()
    if price? && @underConstruct or price.iron > @city.resources.iron or price.gold > @city.resources.gold or price.cristal > @city.resources.cristal or price.uranium > @city.resources.uranium or price.petrol > @city.resources.petrol or price.energy > @city.resources.energy or price.pop > @city.resources.pop
      return false
    else
      return true

  CanEvolve: (className) ->
    evol = @GetEvol className
    price = @GetPrice evol
    @city.resources.UpdateResources()
    if price? && @underConstruct or price.iron > @city.resources.iron or price.gold > @city.resources.gold or price.cristal > @city.resources.cristal or price.uranium > @city.resources.uranium or price.petrol > @city.resources.petrol or price.energy > @city.resources.energy or price.pop > @city.resources.pop
      return false
    else
      return true

  ForEachEvol: (cb) ->
    for name, evol of @evolveList
      cb name, evol

  GetEvol: (name) ->
    for evolName, evol of @evolveList
      if name is evolName
        return evol
    null


