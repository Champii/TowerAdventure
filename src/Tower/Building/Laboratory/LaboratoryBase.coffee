class Tower.Building.Laboratory.LaboratoryBase

  constructor: ->
    @costForm = (level) =>
      {iron: 1 * Math.pow(1.5, level - 1), gold: 1 * Math.pow(1.5, level - 1), cristal: 0, uranium: 0, petrol: 0, energy: 0, pop: 0}

  

