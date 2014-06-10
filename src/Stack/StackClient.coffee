#<< Module

class Stack.StackClient extends Module

  stack: null
  height: null
  width: null
  border: null
  container: null
  background: null
  visibleNb: null

  constructor: (pos) ->
    @stack = []
    @border = 5
    @height = 0
    @width = 0
    @visibleNb = 0
    @container = new Kinetic.Container
      x: pos.x
      y: pos.y
      height: @height + 2 * @border
      width: @width + 2 * @border
    @background = new Kinetic.Rect
      x: -@border
      y: -@border
      height: @height + 2 * @border
      width: @width + 2 * @border
      fill: 'black'

    hudContainer.add @container
    @container.add @background
    @Hide()

  AddNode: (node) ->
    node.setX 0
    node.setY @height

    @width = node.getWidth() if node.getWidth() > @width
    @height += node.getHeight()

    @UpdateSize()

#     @visibleNb++
    @stack.push {node: node, persistant: false, hidden: false}
    @container.add node

  UpdateSize: ->
    @container.setHeight @height + 2 * @border
    @container.setWidth @width + 2 * @border
    @background.setHeight @height + 2 * @border
    @background.setWidth @width + 2 * @border

  Reorganise: ->
    @width = 0
    @height = 0
    for n in @stack
      if !n.hidden and n.node.isVisible()
        n.node.setPosition {x: 0, y: @height}
        @width = n.node.getWidth() if n.node.getWidth() > @width
        @height += n.node.getHeight()
    @UpdateSize()

  Hide: ->
    for n in @stack
      if !n.persistant and !n.hidden
        @HideNode n.node
        console.log "Hide :", n
    console.log "end", @visibleNb, @stack
    if !@visibleNb
      @container.hide()
    @Reorganise()
    hudContainer.draw()
#     @container.hide()
#     hudContainer.draw()

  Show: ->
    for n in @stack
      if !n.persistant and !n.hidden
        @ShowNode n.node
    console.log "end", @visibleNb, @stack
    @Reorganise()
    @container.show()
    hudContainer.draw()

  HideNode: (node) ->
    if node?
      n = @GetNode node
      if n?
        node.hide()
        @visibleNb--
        @Reorganise()
        if !@visibleNb
          @container.hide()
          hudContainer.draw()

  ShowNode: (node, persist) ->
    if node?
      n = @GetNode node
      if n?
        node.show()
        @visibleNb++
        n.persistant = persist if persist?
        console.log "Show  ", n, persist
        @Reorganise()
        if !@container.isVisible()
          @container.show()
          hudContainer.draw()

  GetNode: (node) ->
    for n in @stack
      if n.node is node
        return n
    null

  SetPersistant: (node, persist) ->
    n = @GetNode node
    n.persistant = persist

  SetHidden: (node, hidden) ->
    n = @GetNode node
#     if hidden and !n.hidden
# #       @HideNode n.node
#       n.node.hide()
#       if !@visibleNb
#         @container.hide()
#         hudContainer.draw()
#     else if !hidden
# #       @ShowNode n.node
#       n.node.show()
#       if !@container.isVisible()
#         @Reorganise()
#         @container.show()
#         hudContainer.draw()
    n.hidden = hidden

