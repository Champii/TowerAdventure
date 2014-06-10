#<< Map/LevelGenerator

class Map.Generator

  level: null

  constructor: ->
    @level = new Map.LevelGenerator()

  newChunk: (pos) ->

    arr = [[]]
    funct =  (point, value) ->
      x = Math.abs(pos.x - point[0])
      y = Math.abs(pos.y - point[1])
      if !(arr[x]?)
        arr[x] = []
      arr[x][y] = Math.floor(value * 100)

    @level.generate([pos.x, pos.y], [Map.Chunk.ChunkBase.size, Map.Chunk.ChunkBase.size], funct)

    return new Map.Chunk.ChunkServer {pos: [pos.x, pos.y], resources: arr}
