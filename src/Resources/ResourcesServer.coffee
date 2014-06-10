#<< Module
#<< Resources/ResourcesBase
#<< DbManager/DbItem

Resources.schema =
  __name__: 'Resources'
  _owner:   { type: 'ObjectId', ref: 'City' }
  iron: Number
  gold: Number
  cristal: Number
  uranium: Number
  petrol: Number
  energy: Number
  lastUpdate: { type: Date, default: Date.now }

class Resources.ResourcesServer extends Module

  @include Resources.ResourcesBase
  @include DbManager.DbItem

  lastUpdate: null

  constructor: (@city, @id, cb) ->
    super [], [Resources.schema, @id, =>
      @lastUpdate =  new Date @item.lastUpdate
      cb() if cb?]

  Send: ->
    @UpdateResources()
    @socket.emit 'updateResources' + @city.id, @Serialize()

  UpdateResources: ->
    now = new Date
    time = now.getTime() - @lastUpdate.getTime()
    @lastUpdate = now

    ironMines = @city.buildingManager.GetAllTowerByName 'ironMine'
    goldMines = @city.buildingManager.GetAllTowerByName 'goldMine'
    cristalMines = @city.buildingManager.GetAllTowerByName 'cristalMine'
    uraniumMines = @city.buildingManager.GetAllTowerByName 'uraniumMine'
    petrolMines = @city.buildingManager.GetAllTowerByName 'petrolMine'

    for ironMine in ironMines
      if !(ironMineLevel = ironMine.level)
        ironMineLevel = 0
      @iron = @iron + (((30 + 30 * ironMineLevel * (Math.pow 1.1, ironMineLevel)) / 3600) * (time / 1000))

    for goldMine in goldMines
      if !(goldMineLevel = goldMine.level)
        goldMineLevel = 0
      @gold = @gold + (((20 + 20 * goldMineLevel * (Math.pow 1.1, goldMineLevel)) / 3600) * (time / 1000))

    for cristalMine in cristalMines
      if !(cristalMineLevel = cristalMine.level)
        cristalMineLevel = 0
      @cristal = @cristal + (((10 + 10 * cristalMineLevel * (Math.pow 1.1, cristalMineLevel)) / 3600) * (time / 1000))

    for uraniumMine in uraniumMines
      if !(uraniumMineLevel = uraniumMine.level)
        uraniumMineLevel = 0
      @uranium = @uranium + (((5 * uraniumMineLevel * (Math.pow 1.1, uraniumMineLevel)) / 3600) * (time / 1000))

    for petrolMine in petrolMines
      if !(petrolMineLevel = petrolMine.level)
        petrolMineLevel = 0
      @petrol = @petrol + (((3 * petrolMineLevel * (Math.pow 1.1, petrolMineLevel)) / 3600) * (time / 1000))

  Buy: (price) ->
    @iron -= price.iron
    @gold -= price.gold
    @cristal -= price.cristal
    @uranium -= price.uranium
    @petrol -= price.petrol
    @energy -= price.energy
    @pop -= price.pop
    @Send()

  PropagSocket: (@socket) ->
    @socket.on 'updateResources' + @city.id, =>
      @Send()
#     @Send()

