#<< Module
#<< Map/MapBase
#<< Map/Chunk/ChunkServer
#<< Map/Generator
#<< DbManager/DbCollection

class Map.MapServer extends Module

  @include Map.MapBase
  @include DbManager.DbCollection

  generator: null

  constructor: ->
    super [], [Map.Chunk.schema]
    @generator = new Map.Generator()
    @GetAllDb null, null, (chunks) =>
      @FillChunks chunks
    

  FillChunks: (chunks) ->
    Log.log "**** Loading Map ****"
    for chunk in chunks
      Log.log "Load Chunk" + " (" + chunk.pos[0] + "x " + chunk.pos[1] + "y" + ") "
      @AddChunk new Map.Chunk.ChunkServer chunk

  GetChunk: (pos) ->
    if (chunk = @_super pos)
      chunk
    else
      newChunk = @generator.newChunk {x: parseInt(pos.x), y: parseInt(pos.y)}
      @AddChunk newChunk
      newChunk.parent = this
      newChunk

  GetNextNewPlayerPos: (length) ->
    space = 2 * Map.Chunk.ChunkBase.size

    return {x:space * length, y:0}
    
    
