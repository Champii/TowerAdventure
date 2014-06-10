#<< Module
#<< Map/Chunk/ChunkBase
#<< Helpers/Queue

tileSizeX = 40
tileSizeY = 20

# tileSideX = Math.sqrt(Math.pow(tileSizeY / 2, 2) + Math.pow(tileSizeX / 2, 2))
# tileSideY = Math.sqrt(Math.pow(tileSizeX / 2, 2) + Math.pow(tileSizeY / 2, 2))

# chunkSizeX = Math.sqrt(Math.pow(tileSideX * Map.Chunk.ChunkBase.size, 2) * 2)
# chunkSizeY = Math.sqrt(Math.pow(tileSideY * Map.Chunk.ChunkBase.size, 2) * 2)
chunkSizeX = Map.Chunk.ChunkBase.size * tileSizeX
chunkSizeY = Map.Chunk.ChunkBase.size * tileSizeY

class Map.Chunk.ChunkClient extends Module

  @include Map.Chunk.ChunkBase

  layer: null
  image: null
  tileQueue: null

  constructor: (chunk, scope) ->
    super [chunk]
    @pos = chunk.pos
    j = 0
    @layer = new Kinetic.Group()
    @tileQueue = new Helpers.Queue 1, (object) =>
      pos = Map.MapClient.PosToIsoScreen {x: object.x, y: object.y}
      tile = new Kinetic.Image
        image: object.type
        x: -pos.x + chunkSizeX / 2
        y: pos.y# - chunkSizeY  - tileSizeY
      @layer.add tile
      if object.x == Map.Chunk.ChunkBase.size - 1 && object.y == Map.Chunk.ChunkBase.size - 1
        @layer.toImage
          width: chunkSizeX  + tileSizeX /2
          height:chunkSizeY
          callback: (img) =>
            pos = Map.MapClient.PosToIsoScreen @pos
            @image = new Kinetic.Image
              image: img
              x: pos.x
              y: pos.y
            mapContainer.add @image
            mainContainer.draw()
            scope.updateLoadMessages 'map', @image
        @tileQueue.Stop()
    @tileQueue.Start()

    for arr in @resources
      i = 0
      for res in arr
        tmp = (res) =>
          type = grassImage
          if 0 <= res < 5 then type = uraniumImage
          if 5 <= res < 10 then type = petrolImage
          if 10 <= res < 20 then type = cristalImage
          if 20 <= res < 35 then type = goldImage
          if 35<= res < 55 then type = ironImage
          if 55 <= res then type = grassImage

          @tileQueue.Push {x: i, y: j, type: type}
        tmp res
        i++
      j++
