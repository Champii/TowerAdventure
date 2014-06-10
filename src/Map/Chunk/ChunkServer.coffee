#<< Module
#<< Map/Chunk/ChunkBase
#<< DbManager/DbItem
#<< DesignPattern/Observable

Map.Chunk.schema =
  __name__: 'Chunk'
  pos:      { type: [Number], index: '2d'}
  resources: [Number]

class Map.Chunk.ChunkServer extends Module

  @include Map.Chunk.ChunkBase
  @include DesignPattern.Observable
  @include DbManager.DbItem

  staticTakenPlaces: null
  mobileTakenPlaces: null
  parent: null

  constructor: (chunk, id) ->
    super [chunk], [], [Map.Chunk.schema, id]
    @staticTakenPlaces = []
    @mobileTakenPlaces = []

  GetObservatorByPos: (pos) ->
    for obs in @observators
      if obs.type isnt 'Player' and obs.type isnt 'City'
        if pos.x is obs.pos.x and pos.y is obs.pos.y
          return obs
    null

  GetTakenPlace: (pos) ->
    for stat in @staticTakenPlaces
      if stat.pos.x is pos.x and stat.pos.y is pos.y
        return @GetObservatorByPos pos
    for mobile in @mobileTakenPlaces
      if mobile.pos.x is pos.x and mobile.pos.y is pos.y
        return @GetObservatorByPos pos
    null

  IsObservatorBySocket: (socket) ->
    for obs in @observators
      if obs.type is 'Player' and obs.socket is socket
        return true
    false

  Attach: (obs) ->
    @_super obs
    if obs.type is 'Tower'
      @staticTakenPlaces.push {pos: obs.pos, posEnd: obs.posEnd}
    else if obs.type is 'Entity'
      @mobileTakenPlaces.push obs

  Detach: (obs) ->
    @_super obs
    if obs.type is 'Tower'
      for i, pos of @staticTakenPlaces
        if pos.pos is obs.pos
          delete @staticTakenPlaces[i]
          @staticTakenPlaces.splice i, 1
    else if obs.type is 'Entity'
      for i, pos of @mobileTakenPlaces
        if pos.pos is obs.pos
          delete @mobileTakenPlaces[i]
          @mobileTakenPlaces.splice i, 1

  SendTo: (socket, player) ->
    @_super socket

    #cities first, always.
    for obs in @observators
      if obs.type is 'City'
        isOwner = false
        if obs.owner is player
          isOwner = true
        obs.SendTo socket, isOwner
    for obs in @observators
      if obs.type isnt 'City' and obs.type isnt 'Player'
        if obs.type is 'Tower' #Send chunk with city first
          cityChunk = @parent.GetChunk obs.city.pos
          if cityChunk isnt this and !cityChunk.IsObservator player
            @Attach player
            player.Attach this
            cityChunk.SendTo socket, player
        isOwner = false
        if obs.owner is player
          isOwner = true
        obs.SendTo socket, isOwner

  Update: (owner, cb) ->
    for obs in @observators
      if obs.type is 'Player'
        isOwner = false
        if owner? and obs is owner
          isOwner = true
        cb obs.socket, isOwner

