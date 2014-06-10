#<< Module
#<< AliveObject/AliveObjectBase
#<< ProgressBar/ProgressBar
#<< Stack/StackClient

class AliveObject.AliveObjectClient extends Module

  @include AliveObject.AliveObjectBase

  image: null
  lifeBar: null
  nameText: null

  constructor: (object, image) ->
    super [object]
    @life.amount = 50
    @life.total = 50
    @lifeBar = new ProgressBar.ProgressBar @life, this, 0, 'red'


    pos = Map.MapClient.PosToIsoScreen @pos
    @image = new Kinetic.Image
      image: image
      x: pos.x
      y: pos.y

    if @type is 'Entity'
      entityContainer.add @image
      entityContainer.draw()
    else
      buildingsContainer.add @image
      buildingsContainer.draw()

    @nameText = new Kinetic.Text
      x: 0
      y: 0
      fill: 'blue'
      text: @name
      fontSize: 15
      fontFamily: 'Calibri'

    pos =
      x: pos.x
      y: pos.y - 50
    @huds = new Stack.StackClient pos
    @huds.AddNode @nameText
    @huds.AddNode @lifeBar.image

    @image.on 'mouseenter', (e) =>
      @huds.Show()
    @image.on 'mouseout', (e) =>
      @huds.Hide()


  UpdateLife: ->
    @lifeBar.Update @life
    if @life.amount < @life.total
      @huds.Show()
      @image.off 'mouseenter'
      @image.off 'mouseout'
    else
      @image.on 'mouseenter', (e) =>
        @huds.Show()
      @image.on 'mouseout', (e) =>
        @huds.Hide()

