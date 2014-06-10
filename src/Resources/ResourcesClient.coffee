#<< Module
#<< Resources/ResourcesBase

class Resources.ResourcesClient extends Module

  @include Resources.ResourcesBase

  scope: null

  constructor: (@city, @socket, @scope) ->
    super []
    @id = @city.id
    
    @socket.on 'updateResources' + @id, (resources) =>
      @Deserialize resources

    setInterval =>
      @UpdateResources()
    , 30000
    @UpdateResources()

  UpdateResources: ->
    @socket.emit 'updateResources' + @id

