class Map.MapBase

  chunks: null
  
  constructor: ->
    @chunks = [[]]

  GetChunk: (pos) ->
#     realPos = {x: (parseInt pos.x), y: (parseInt pos.y)}
    realPos = {x: pos.x, y: pos.y}
    realPos.x = (pos.x - pos.x % Map.Chunk.ChunkBase.size).toString()
    realPos.y = (pos.y - pos.y % Map.Chunk.ChunkBase.size).toString()
    if !(@chunks[realPos.x]?)
      @chunks[realPos.x] = []
    @chunks[realPos.x][realPos.y]

  GetChunkNear: (pos, range, callback) ->
    pos.x = pos.x - pos.x % Map.Chunk.ChunkBase.size
    pos.y = pos.y - pos.y % Map.Chunk.ChunkBase.size
    makeTablePos = (range, pos) ->
      arr = []
      for i in [-range..range]
        arr.push pos + Map.Chunk.ChunkBase.size * i
      arr

    for i in makeTablePos(range.x, pos.x)
      for j in makeTablePos(range.y, pos.y)
        callback @GetChunk({x: i, y: j}), {x: i, y: j}

  AddChunk: (chunk) ->
    if !(@chunks[chunk.pos.x.toString()]?)
      @chunks[chunk.pos.x.toString()] = []
    @chunks[chunk.pos.x.toString()][chunk.pos.y.toString()] = chunk

  SendTo: (socket) ->
    socket.emit 'mapObject', {}
