class ProgressBar.ProgressBar

  amountBar: null
  totalBar: null
  text: null
  pair: null
  image: null
  parent: null
  percent: null
  height: null
  width: null
  border: null

  constructor: (pair, parent, offset, color)->
    @height = 15
    @width = 100
    @border = 3
    
    @pair = pair
    @percent = @pair.amount / @pair.total
#     console.log "progressbar: ", parent
    pos = Map.MapClient.PosToIsoScreen parent.pos
    group = new Kinetic.Group()
    @totalBar = new Kinetic.Rect
      x: 0
      y: 0
      width: @width
      height: @height
      fill: 'black'

    @amountBar = new Kinetic.Rect
      x: 0 + @border
      y: 0 + @border
      width: (@width - @border * 2) * @percent
      height: @height - @border * 2
      fill: color

    @text = new Kinetic.Text
      x: 0 + @border
      y: 0 + @border
      fill: 'blue'
      text: '' + @pair.amount + '/' + @pair.total
      width: @width
      fontSize: @height - @border * 2
      fontFamily: 'Calibri'
      align: 'center'
#     @totalBar = new Kinetic.Rect
#       x: pos.x
#       y: pos.y + (offset * @height)
#       width: @width
#       height: @height
#       fill: 'black'
# 
#     @amountBar = new Kinetic.Rect
#       x: pos.x + @border
#       y: pos.y + @border + (offset * @height)
#       width: (@width - @border * 2) * @percent
#       height: @height - @border * 2
#       fill: color
# 
#     @text = new Kinetic.Text
#       x: pos.x + @border
#       y: pos.y + @border + (offset * @height)
#       fill: 'blue'
#       text: '' + @pair.amount + '/' + @pair.total
#       width: @width
#       fontSize: @height - @border * 2
#       fontFamily: 'Calibri'
#       align: 'center'

    group.add @totalBar
    group.add @amountBar
    group.add @text
    @image = group
    @image.setPosition pos
    @image.setHeight @height
    @image.setWidth @width
    hudContainer.add @image

  Update: (progress) ->
    @pair = progress
    @percent = @pair.amount / @pair.total
    @amountBar.setWidth @width * @percent - @border * 2
    @text.setText '' + @pair.amount + '/' + @pair.total
    hudContainer.draw()

  Hide: ->
    @image.hide()
    hudContainer.draw()

  Show: ->
    @image.show()
    hudContainer.draw()

