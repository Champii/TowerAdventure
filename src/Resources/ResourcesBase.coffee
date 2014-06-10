class Resources.ResourcesBase

  id: null

  city: null

  iron: null
  gold: null
  cristal: null
  uranium: null
  petrol: null
  energy: null
  socket: null

  constructor: () ->
#     @Deserialize resources

  Serialize: ->
    _id:     @id
    iron:   Math.floor @iron
    gold:   Math.floor @gold
    cristal:Math.floor @cristal
    uranium:Math.floor @uranium
    petrol: Math.floor @petrol
    energy: @energy
    pop:    @pop

  Deserialize: (resources) ->
    if (resources?)
      @id = @city.id
      @iron = resources.iron
      @gold = resources.gold
      @cristal = resources.cristal
      @uranium = resources.uranium
      @petrol = resources.petrol
      @energy = resources.energy
      @pop = resources.pop
