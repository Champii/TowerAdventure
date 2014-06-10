class Tower.Building.CityHall.CityHallBase

  constructor: ->
    @costForm = (level) =>
      {iron: 60 * Math.pow(1.5, level - 1), gold: 15 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}

