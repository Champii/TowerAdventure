#<< ContextMenu/ContextLabel

class ContextMenu.ContextMenuBase


  menu: null
  label: null
  back: null
  
  constructor: ->
#     @label = new ContextMenu.ContextLabel()
    
  Show: (attachedObject, x, y) ->

    @Hide() # Ne marche pas, je sais pas pourquoi
    
    @menu = new Kinetic.Container()
    
    @back = new Kinetic.Rect
      x: x
      y: y
      width: 100
      height: 100
      fill: '#777777'
      stroke: 'black'
      strokeWidth: 1

    @menu.add @back

    hudContainer.add @menu


  Hide: ->
    hudContainer.removeChildren()
    hudContainer.draw()

  DevelopMenu: ->
#     anim = new Kinetic.Animation (frame) =>
#       console.log frame
#       
#       scale = @back.attrs.scaleX + (0.0005 * frame.time)
#       console.log scale
#       if scale > 2
#         anim.stop()
#       @back.setScale scale, 1
#     , hudContainer
#     
#     anim.start()

