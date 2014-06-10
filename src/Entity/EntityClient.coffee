#<< Module
#<< Entity/EntityBase
#<< AliveObject/AliveObjectClient

class Entity.EntityClient extends Module

  @include Entity.EntityBase
  @include AliveObject.AliveObjectClient

  socket: null
  pathIdx: null
  anim: null

  constructor: (entity, entityImage)->
    super [entity], [entity, entityImage]

    @image.setOffset 0, 10
    isoPos = Map.MapClient.PosToIsoScreen @pos
    @lifeBar.image.setX isoPos.x
    @lifeBar.image.setY isoPos.y - 15
    @nameText.setX isoPos.x
    @nameText.setY isoPos.y - 30
    setTimeout =>
      @UpdateAnim()
    , 1000

    @socket.on 'updateEntity' + @id , (ent) =>
      @Deserialize ent
      isoPos = Map.MapClient.PosToIsoScreen @pos
      @lifeBar.image.setX isoPos.x
      @lifeBar.image.setY isoPos.y - 15
      @nameText.setX isoPos.x
      @nameText.setY isoPos.y - 30
      @UpdateLife()
      @image.setPosition isoPos
      if @pathIdx is @path.length
        @anim.stop()
      else
        @UpdateAnim()
      hudContainer.draw()

    @socket.on 'destroyEntity' + @id, =>
      @anim.stop() if @anim?
      @image.remove()
      @lifeBar.Hide()
      @nameText.hide()

    console.log this

  GetNextDir: ->
    x = 0
    y = 0
    if @path[@pathIdx].dir is 'N' then y++
    if @path[@pathIdx].dir is 'NE' then x++; y++
    if @path[@pathIdx].dir is 'E' then x++
    if @path[@pathIdx].dir is 'SE' then x++; y--
    if @path[@pathIdx].dir is 'S' then y--
    if @path[@pathIdx].dir is 'SO' then x--; y--
    if @path[@pathIdx].dir is 'O' then x--
    if @path[@pathIdx].dir is 'NO' then x--; y++
    Map.MapClient.PosToIsoScreen {x: x, y: y}

  UpdateAnim: ->
    @anim.stop() if @anim?
    @anim = new Kinetic.Animation (frame) =>
      dir = @GetNextDir()
      @image.setPosition {x: @image.attrs.x + (dir.x * (frame.timeDiff / 1000)), y: @image.attrs.y + (dir.y * (frame.timeDiff / 1000))}
    , entityContainer
    @anim.start()
