#<< Module
#<< Map/MapBase
#<< Map/Chunk/ChunkClient
#<< Helpers/Queue

class Map.MapClient extends Module

  @include Map.MapBase

  socket: null
  objects: null
  visibles: null
  rangeX: null
  rangeY: null
  scale: null
  scope: null
  chunkQueue: null
  viewPos: null

  constructor: (socket, scope) ->
    super()
    @socket = socket
    @objects = []
    @visibles = []
    @scale = 1
    @scope = scope
    @chunkQueue = new Helpers.Queue 1, (object) =>
      @AddChunk (new Map.Chunk.ChunkClient object, @scope)
    @chunkQueue.Start()
    @rangeX = Math.floor((document.body.scrollWidth / (tileSizeX * @scale * 2* (Map.Chunk.ChunkBase.size)))) + 3
    @rangeY = Math.floor((document.body.scrollHeight / (tileSizeY * @scale * 2 * (Map.Chunk.ChunkBase.size)))) + 3
    pos = {x: Math.floor(-stage.attrs.x + document.body.scrollWidth / 2), y: Math.floor(-stage.attrs.y + document.body.scrollHeight / 2)}
    iso = Map.MapClient.IsoScreenToPos pos
    iso.x = iso.x  - Map.Chunk.ChunkBase.size / 2
    iso.y = iso.y  - Map.Chunk.ChunkBase.size / 2
    @viewPos = iso

    stage.on 'dragstart', (e) =>
      @chunkQueue.Stop()
    stage.on 'dragend', (e) =>
      pos = {x: Math.floor(-stage.attrs.x + document.body.scrollWidth / 2), y: Math.floor(-stage.attrs.y + document.body.scrollHeight / 2)}
      iso = Map.MapClient.IsoScreenToPos pos
      iso.x = iso.x  - Map.Chunk.ChunkBase.size
      iso.y = iso.y  - Map.Chunk.ChunkBase.size
      @viewPos = iso
      @chunkQueue.SortNearest @viewPos
      @chunkQueue.Start()
      @socket.emit 'viewPos', {viewPos: @viewPos, range: 5}
    stage.on 'dragmove', (e) =>
      @UpdateVisibleChunk()

    ui =
      zoomFactor: 1.1
      origin:
        x: 0
        y: 0
      zoom: (event) =>
        event.preventDefault()
        evt = event.originalEvent
        mx = document.body.scrollWidth / 2
        my = document.body.scrollHeight / 2
        wheel = (if evt.wheelDelta / 120 < 0 then 0.2 else 0)
        if (wheel > 0 && @scale < 0.4)
          return
        if (wheel == 0 && @scale > 3)
          return
        zoom2 = ui.zoomFactor - wheel
        newscale = @scale * zoom2
#         ui.origin.x = mx / @scale + ui.origin.x - mx / newscale
#         ui.origin.y = my / @scale + ui.origin.y - my / newscale

        stage.setOffset ui.origin.x, ui.origin.y
        @scale *= zoom2
        stage.setScale @scale
        stage.draw()
        @rangeX = Math.floor((document.body.scrollWidth / (tileSizeX * @scale * 2 * (Map.Chunk.ChunkBase.size)))) + 3
        @rangeY = Math.floor((document.body.scrollHeight / (tileSizeY * @scale  * 2 * (Map.Chunk.ChunkBase.size)))) + 3

    $(stage.content).on "mousewheel", ui.zoom

    @socket.on 'chunkObject', (chunk) =>
      @chunkQueue.Push chunk
      @chunkQueue.SortNearest @viewPos

#     @socket.on 'buildingObject', (building) =>
#       @AddToMap building, 'building'

  IsVisible: (chunk) ->
    for visible in @visibles
      if chunk is visible
        return true
    return false

  AddToMap: (object, type) ->
    switch type
      when 'building'
        build = null
        object.own = false
        switch object.name
          when 'cityHall' then build = (new Tower.Building.CityHall.CityHallClient null, object, @socket)
          when 'ironMine' then build = (new Tower.Building.IronMine.IronMineClient null, object, @socket)
          when 'goldMine' then build = (new Tower.Building.GoldMine.GoldMineClient null, object, @socket)
          when 'cristalMine' then build = (new Tower.Building.CristalMine.CristalMineClient null, object, @socket)
          when 'uraniumMine' then build = (new Tower.Building.UraniumMine.UraniumMineClient null, object,@socket)
          when 'petrolMine' then build = (new Tower.Building.PetrolMine.PetrolMineClient null, object, @socket)
          when 'solarCentral' then build = (new Tower.Building.SolarCentral.SolarCentralClient null, object, @socket)
          when 'soldierSpawnerTower' then build = (new Tower.SpawnTower.SoldierSpawner.SoldierSpawnerClient null, object, @socket)
          when 'baseDefenseTower' then build = (new Tower.DefTower.BaseDefense.BaseDefenseClient null, object, @socket)
        build.own = false
        @objects.push build

  UpdateVisibleChunk: ->
    pos = {x: Math.floor((-stage.attrs.x + document.body.scrollWidth / 2)) - Map.Chunk.ChunkBase.size * tileSizeX / 2, y: Math.floor((-stage.attrs.y + document.body.scrollHeight / 2)) - Map.Chunk.ChunkBase.size * tileSizeY / 2}
    realIso = Map.MapClient.IsoScreenToPos pos
    @UpdateChunkHide()
    @GetChunkNear realIso, {x: @rangeX, y: @rangeY}, (chunk, pos) =>
      if !(chunk?)
        @AddChunk {pos: pos}
        @socket.emit 'getChunk', pos
        @scope.updateLoadMessages 'chunk'
      else
        if chunk.image? && !(@IsVisible chunk)
          @visibles.push chunk
          @scope.visibleChunks = @visibles.length
          chunk.image.show()


  UpdateChunkHide: ->
    p = {x: Math.floor(-stage.attrs.x + document.body.scrollWidth / 2) - Map.Chunk.ChunkBase.size * tileSizeX / 2, y: Math.floor(-stage.attrs.y + document.body.scrollHeight / 2) - Map.Chunk.ChunkBase.size * tileSizeY / 2}
    i = 0
    for visible in @visibles
      if visible? && p?
        if (visible.image.attrs.x > p.x + @rangeX * Map.Chunk.ChunkBase.size * tileSizeX) || (visible.image.attrs.x < p.x - @rangeX * Map.Chunk.ChunkBase.size * tileSizeX) ||
           (visible.image.attrs.y > p.y + @rangeY * Map.Chunk.ChunkBase.size * tileSizeY) || (visible.image.attrs.y < p.y - @rangeY * Map.Chunk.ChunkBase.size * tileSizeY)
          visible.image.hide() if visible.image? 
          @visibles.splice i, 1
      i++
    @scope.visibleChunks = @visibles.length

  # /!\ DON'T TOUCH /!\
  #
  #pos = game pos
  #iso = iso position
  #isoScreen = iso position on stage

  #Get the ready-to-place iso from pos
  @PosToIsoScreen: (pos) ->
    res = {}
    res.x = (pos.x - pos.y) * (tileSizeX / 2);
    res.y = (pos.x + pos.y) * (tileSizeY / 2);
    res

  #Get iso from pos
  @PosToIso: (pos) ->
    res = {}
    res.x = (pos.x - pos.y) / 2;
    res.y = (pos.x + pos.y) / 2;
    res

  #Get pos from iso screen iso
  @IsoScreenToPos: (pos) ->
    res = {}
    res.x = Math.floor((pos.x/(tileSizeX/2) + pos.y/(tileSizeY/2)) / 2)
    res.y = Math.floor((pos.y/(tileSizeY/2) - pos.x/(tileSizeX/2)) / 2)
    res

  #Get iso from pos
  @IsoToPos: (pos) ->
    res = {}
    res.x = (pos.x/2 + pos.y/2) * 2
    res.y = (pos.y/2 - pos.x/2) * 2
    res
    