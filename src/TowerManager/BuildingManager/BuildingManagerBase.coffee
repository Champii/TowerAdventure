class TowerManager.BuildingManager.BuildingManagerBase


  constructor: ->

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
      when 'baseTower'
        {iron: 60 * Math.pow(1.5, level - 1), gold: 15 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}
      when 'baseDefenseTower'
        {iron: 60 * Math.pow(1.5, level - 1), gold: 15 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}
      when 'soldierSpawnerTower'
        {iron: 60 * Math.pow(1.5, level - 1), gold: 15 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}
      when 'laboratory'
        {iron: 60 * Math.pow(1.5, level - 1), gold: 15 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}
      else
        {iron: 1, gold: 1, cristal: 1, uranium: 1, petrol: 1, energy: 1, pop: 1}
    price.time =  Math.floor(((price.iron + price.gold) / 5.000) * 2) * 1000
    price

    
  CanBuy: (building, level) ->
    price = @GetPriceOf building, level
    if price.iron > @city.resources.iron or price.gold > @city.resources.gold or price.cristal > @city.resources.cristal or price.uranium > @city.resources.uranium or price.petrol > @city.resources.petrol or price.energy > @city.resources.energy or price.pop > @city.resources.pop
      false
    else
      true

  GetAllSpawnTowers: ->
    res = []
    for tow in @towers
      if @IsSpawnTower tow.name
        res.push tow
    res

  GotSpawnTower: ->
    for tow in @towers
      if @IsSpawnTower tow.name
        return true
    false


  IsSpawnTower: (name) ->
    switch name
      when 'baseSpawnTower' then return true
      else return false

      