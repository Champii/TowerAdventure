class Helpers.Queue

  timer: null
  time: null
  objects: null
  callback: null
  
  constructor: (@time, @callback) ->
    @objects = []

  Start: ->
    if !(@timer?) && @time? && @callback?
      @timer = setInterval =>
        if @objects.length
          @callback @objects[0]
          @Pop()
      , @time

  Stop: ->
    if @timer?
      clearInterval @timer
      @timer = null
    
  ChangeTime: (ms) ->
    @time = ms
    @Stop()
    @Start()
    
  ChangeCallback: (cb) ->
    @callback = cb
    
  Push: (object) ->
    @objects.push object
    if @objects.length == 1
      @Start()

  Pop: (object) ->
    @objects.splice 0, 1
    if @objects.length == 0
      @Stop()

  SortNearest: (point) ->
    nearest = (first, second, point) =>
      if first? && second? && point?
        fd = Math.sqrt(Math.pow(Math.abs(point.pos.x - first.pos.x), 2) +  Math.pow(Math.abs(point.pos.y - first.pos.y), 2))
        sd = Math.sqrt(Math.pow(Math.abs(point.pos.x - second.pos.x), 2) +  Math.pow(Math.abs(point.pos.y - second.pos.y), 2))
        return fd > sd
      return false

    for i in [0...@objects.length]
      for j in [0...@objects.length - i]
        [@objects[j], @objects[j+1]] = [@objects[j+1], @objects[j]] if nearest @objects[j], @objects[j+1], {pos: point}
    
    