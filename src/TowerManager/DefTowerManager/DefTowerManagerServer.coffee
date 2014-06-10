#<< Module
#<< TowerManager/DefTowerManager/DefTowerManagerBase

class TowerManager.DefTowerManager.DefTowerManagerServer extends Module

  @include TowerManager.DefTowerManager.DefTowerManagerBase
  
  constructor: (city) ->
    super [city]


  NewBuilding: (building, socket) ->
    @dbManager.NewBuilding building, @GetPriceOf(building.name, 1).time, (build) =>
      newBuild = new Tower.Building.BuildingServer build, build._city
      @AddTower newBuild
      newBuild.SendTo socket, true, false

  GetPriceOf: (building, level) ->
    price = switch building
      when 'ironMine'
        {iron: 60 * Math.pow(1.5, level - 1), gold: 15 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}
      when 'goldMine'
        {iron: 48 * Math.pow(1.6, level - 1), gold: 24 * Math.pow(1.6, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}
      when 'cristalMine'
        {iron: 225 * Math.pow(1.5, level - 1), gold: 75 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}
      when 'uraniumMine'
        {iron: 527 * Math.pow(1.8, level - 1), gold: 480 * Math.pow(1.8, level - 1), cristal: 240 * Math.pow(1.8, level - 1), uranium: 0, petrol: 0, energy: 0, pop: 0}
      when 'petrolMine'
        {iron: 0, gold: 0, cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}
      when 'solarMine'
        {iron: 75 * Math.pow(1.5, level - 1), gold: 30 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}

      when 'architectOffice'
        {iron: 60 * Math.pow(1.5, level - 1), gold: 15 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}
    price.time =  Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000
    price
   
   
  CanBuy: (building, level) ->
    price = @GetPriceOf building, level
    if price.iron > @city.resources.iron or price.gold > @city.resources.gold or price.cristal > @city.resources.cristal or price.uranium > @city.resources.uranium or price.petrol > @city.resources.petrol or price.energy > @city.resources.energy or price.pop > @city.resources.pop
      false
    else
      true