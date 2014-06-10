#<< ContextMenu/ContextMenuBase

class ContextMenu.ContextMenuStage

  constructor: ->
#     super()

  Show: (attachedObject, pos) ->
#     super(attachedObject, x, y)
    $.contextMenu( 'destroy' )
    city = attachedObject.player.cityManager.currentCity

    callback = (key, options) =>
      city.buildingManager.PlaceNewBuilding key, pos
      @Hide()

    $.contextMenu
      selector: '#game'
      events:
        show: =>
          stage.setDraggable false
        hide: =>
          stage.setDraggable true
      items:
        "actions":
          "name": "<p>Actions Menu</p>"
          "disabled": true
        "separator": "--------"
        "buildings":
          "name": "Buildings ->"
          "items":
            "offices":
              "name": "Offices ->"
              "items":
                "architectOffice":
                  "name": @ColorizePrice attachedObject, 'architectOffice', 'Architect Office'
                  "disabled": !city.buildingManager.CanBuy 'architectOffice', 1
                  "callback": callback
                "laboratory":
                  "name": @ColorizePrice attachedObject, 'laboratory', 'Laboratory'
                  "disabled": !city.buildingManager.CanBuy 'laboratory', 1
                  "callback": callback
            "mines":
              "name": "Mines ->"
              "items":
                "solarMine":
                  "name": @ColorizePrice attachedObject, 'solarMine', 'Solar Mine'
                  "disabled": !city.buildingManager.CanBuy 'solarMine', 1
                  "callback": callback
                "ironMine":
                  "name": @ColorizePrice attachedObject, 'ironMine', 'Iron Mine'
                  "disabled": !city.buildingManager.CanBuy 'ironMine', 1
                  "callback": callback
                "goldMine":
                  "name": @ColorizePrice attachedObject, 'goldMine', 'Gold Mine'
                  "disabled": !city.buildingManager.CanBuy 'goldMine', 1
                  "callback": callback
                "cristalMine":
                  "name": @ColorizePrice attachedObject, 'cristalMine', 'Cristal Mine'
                  "disabled": !city.buildingManager.CanBuy 'cristalMine', 1
                  "callback": callback
                "uraniumMine":
                  "name": @ColorizePrice attachedObject, 'uraniumMine', 'Uranium Mine'
                  "disabled": !city.buildingManager.CanBuy 'uraniumMine', 1
                  "callback": callback
                "petrolMine":
                  "name": @ColorizePrice attachedObject, 'petrolMine', 'Petrol Mine'
                  "disabled": !city.buildingManager.CanBuy 'petrolMine', 1
                  "callback": callback
        "tower":
          "name": "Tower ->"
          "items":
            "baseTower":
              "name": @ColorizePrice attachedObject, 'baseTower', 'Base Tower'
              "disabled": !city.buildingManager.CanBuy 'baseTower', 1
              "callback": callback



  Hide: ->
    $.contextMenu( 'destroy' )

#     nameText = new Kinetic.Text
#       x: x + 5
#       y: y + 5
#       text: "Actions"
#       fontSize: 20
#       fontFamily: 'Calibri'
#       fill: 'white'
#
#     buildingText = new Kinetic.Text
#       x: x + 5
#       y: y + 30
#       text: "Buildings ->"
#       fontSize: 12
#       fontFamily: 'Calibri'
#       fill: 'white'
#       drawHitFunc: (canvas) ->
#         context = canvas.getContext();
#         context.beginPath();
#         context.moveTo(0, 0);
#         context.lineTo(100, 0);
#         context.lineTo(100, 15);
#         context.lineTo(0, 15);
#         context.closePath();
#         canvas.fillStroke(this);
#       
#     @menu.add nameText
#     @menu.add buildingText

#     buildingText.on 'mousedown', (e) =>
#       e.cancelBubble = true
#       if e.button == 0
#         @DevelopMenu()

  ColorizePrice: (attachedObject, building, name) ->
    res = ''
    city = attachedObject.player.cityManager.currentCity
    price = city.buildingManager.GetPriceOf building, 1

    color = (if city.buildingManager.CanBuy building, 1 then '#080' else '#800')
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
    res  += time + "</p>"

    res
    

    