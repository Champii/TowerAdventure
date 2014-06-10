
class Map.Chunk.ChunkBase

  @size: 16
  pos: null
  resources: null

  constructor: (chunk) ->
    @pos = {x: chunk.pos[0], y: chunk.pos[1]}
    @resources = chunk.resources
    @size = 16

  SendTo: (socket) ->
    socket.emit 'chunkObject', {size: @size, pos: @pos, resources: @resources}
  