#<< ContextMenu/ContextMenuBase

class ContextMenu.ContextMenuTower
  _instance = undefined

  menuContent: null

  constructor: ->
    @menuContent =
      selector: '#game'
      events:
        show: =>
          stage.setDraggable false
        hide: =>
          stage.setDraggable true
      items: {}

  Show: (content) ->
    @Hide()
    @menuContent.items = content
    $.contextMenu @menuContent

  Hide: ->
    $.contextMenu( 'destroy' )

  ColorizePrice: (name, price, city, colorName) ->
    res = ''

    color = colorName
    res  += "<p><font color='" + color + "'>" + name + "</font> ("
   
    color = (if city.resources.iron < price.iron then '#A00' else '#AAA')
    res  += "<font color='" + color + "'>" + price.iron + "</font> "

    color = (if city.resources.gold < price.gold then '#A00' else '#AAA')
    res  += "<font color='" + color + "'>" + price.gold + "</font> "

    color = (if city.resources.cristal < price.cristal then '#A00' else '#AAA')
    res  += "<font color='" + color + "'>" + price.cristal + "</font> "

    color = (if city.resources.uranium < price.uranium then '#A00' else '#AAA')
    res  += "<font color='" + color + "'>" + price.uranium + "</font> "

    color = (if city.resources.petrol < price.petrol then '#A00' else '#AAA')
    res  += "<font color='" + color + "'>" + price.petrol + "</font> "

    color = (if city.resources.energy < price.energy then '#A00' else '#AAA')
    res  += "<font color='" + color + "'>" + price.energy + "</font> "

    color = (if city.resources.pop < price.pop then '#A00' else '#AAA')
    res  += "<font color='" + color + "'>" + price.pop + "</font>) "

    left = new Date price.time
    time = ''
    time += left.getDate() - 1 + 'd ' if left.getDate() - 1
    time += left.getHours() - 1 + 'h 'if left.getHours - 1
    time += left.getMinutes() + 'm' if left.getMinutes()
    time += left.getSeconds() + 's'
    res  += time + " </p>"

    res
    

  @get: ->
    _instance ?= new this()