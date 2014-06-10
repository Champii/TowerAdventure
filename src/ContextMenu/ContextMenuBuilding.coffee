#<< ContextMenu/ContextMenuBase

class ContextMenu.ContextMenuBuilding extends ContextMenu.ContextMenuBase
  _instance = undefined
  
  constructor: () ->
    stage.on 'mousedown', (e) =>
      if e.button != 2
        @Hide()

  Show: (attachedObject, x, y) ->
    super(attachedObject, x, y)
    
    levelText = new Kinetic.Text
      x: x + 5
      y: y + 30
      text: "Buy level " + (attachedObject.level + 1)
      fontSize: 12
      fontFamily: 'Calibri'
      fill: 'white'
      drawHitFunc: (canvas) ->
        context = canvas.getContext();
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(100, 0);
        context.lineTo(100, 15);
        context.lineTo(0, 15);
        context.closePath();
        canvas.fillStroke(this);


    nameText = new Kinetic.Text
      x: x + 5
      y: y + 5
      text: attachedObject.name + " (" + attachedObject.level + ")"
      fontSize: 20
      fontFamily: 'Calibri'
      fill: 'white'

    @menu.add levelText
    @menu.add nameText
    hudContainer.draw()
    
    levelText.on 'mousedown', (e) =>
      attachedObject.LevelUp()

    levelText.on 'mouseover', (e) =>
      @label.Show attachedObject.city, e.x, e.y

  Hide: ->
    super()


  @get: ->
    _instance ?= new this()
    