class ContextMenu.ContextLabel

  label: null

  constructor: ->
    @label = null

  Show: (attachedObject, x, y) ->
    
    @label = new Kinetic.Container()

    back = new Kinetic.Rect
      x: x
      y: y
      width: 250
      height: 40
      fill: '#777777'
      stroke: 'black'
      strokeWidth: 1

  
  Hide: ->
  