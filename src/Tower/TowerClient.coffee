#<< Module
#<< Tower/TowerBase
#<< AliveObject/AliveObjectClient
#<< ContextMenu/ContextMenuTower
#<< Stack/StackClient


class Tower.TowerClient extends Module

  @include Tower.TowerBase
  @include AliveObject.AliveObjectClient

  percent: 0
  timeLeft: 0
  progressBar: null
  own: true
  owner: null
  menu: null
  menuContent: null
  huds: null

  constructor: (city, tower, socket, image) ->
    super [city, tower], [tower, image]
    @socket = socket if socket?
    @owner = @city.parent.parent
    if @own
      @progressBar = new ProgressBar.ProgressBar {amount: @percent, total: 100}, this, 1, 'yellow'
      @huds.AddNode @progressBar.image
      @huds.SetHidden @progressBar.image, true
      if @underConstruct
        @huds.SetHidden @progressBar.image, false
        @huds.SetPersistant @progressBar.image, true
        update = setInterval =>
          @UpdateConstruct()
          if @finishTime < new Date()
#             @huds.SetHidden @progressBar.image, true
#             @huds.SetPersistant @progressBar.image, false
            clearInterval update
        , 1000

#     @lifeBar.image.setX @lifeBar.image.getX() - 50 + tileSizeX / 2 + (tileSizeX / 2 * (@posEnd.x - @pos.x - 1))
#     @lifeBar.image.setY @lifeBar.image.getY() - (tileSizeY * (@posEnd.x - @pos.x + 1))

#     @nameText.setX @nameText.getX() - 50 + tileSizeX / 2 + (tileSizeX / 2 * (@posEnd.x - @pos.x - 1))
#     @nameText.setY @nameText.getY() - (tileSizeY * (@posEnd.x - @pos.x + 1)) - 20

#     if @own
#       @progressBar.image.setX @progressBar.image.getX() - 50 + tileSizeX / 2 + (tileSizeX / 2 * (@posEnd.x - @pos.x - 1))
#       @progressBar.image.setY @progressBar.image.getY() - (tileSizeY * (@posEnd.x - @pos.x + 1))

    @socket.on 'levelUp' + @id, (tower) =>
      @LevelUp tower
    @socket.on 'evolve' + @id, (tower) =>
      @Evolve tower
    @socket.on 'updateTower' + @id, (tower) =>
      @Deserialize tower
    @socket.on 'destroyedObject' + @id, =>
      @city.buildingManager.DestroyTower this

    @image.on 'mousedown', (e) =>
      if e.button == 2
        e.cancelBubble = true
        @ShowContextMenu()

  destructor: ->
    @image.remove()
#     @progressBar.image.remove()
#     @lifeBar.image.remove()
#     @nameText.image.remove()
    @socket.removeListener 'levelUp' + @id


  ShowContextMenu: ->
    @menu = ContextMenu.ContextMenuTower.get()
    @menuContent =
      "actions":
        "name": "<p>Actions Menu " + @name + "</p>"
        "disabled": true
      "separator": "--------"

    if @own
      callbackLevelUp = (key, options) =>
        @AskLevelUp()
        stage.setDraggable true
        @menu.Hide()

      callbackEvol = (key, options) =>
        @AskEvolve key
        stage.setDraggable true
        @menu.Hide()

      if @MakeTechnoMenu?
        @MakeTechnoMenu()


      @menuContent["levelUp"] =
        "name": @ColorizePriceLevelUp "Level Up (" + (@level + 1) + ")"
        "disabled": !@CanLevelUp()
        "callback": callbackLevelUp

      if @evolveList?
        evolveMenu = {}
        for name, evol of @evolveList
          evolveMenu[name.toString()] =
            "name": @ColorizePriceEvolve name
            "disabled": !@CanEvolve()
            "callback": callbackEvol
        @menuContent["evolve"] =
          "name": "Evolve ->"
          "items": evolveMenu
    else if @city.scope.currentCity?
      callbackAttack = (key, options) =>
        spawnTower = @city.scope.currentCity.buildingManager.GetTowerById key
        spawnTower.AskChangeTarget this
        stage.setDraggable true
        @menu.Hide()

      attackTowerMenu = {}
      for tower in @city.scope.currentCity.buildingManager.GetAllSpawnTowers()
        attackTowerMenu[tower.id] =
          "name": tower.name + " (Target: " + tower.target?.name + " from city " + tower.target?.city?.name + ")"
          "callback": callbackAttack

      if @city.scope.currentCity.buildingManager.GotSpawnTower()
        @menuContent["attack"] =
          "name": "Attack ->"
          "items": attackTowerMenu


    @menu.Show @menuContent

  AskLevelUp: ->
    @socket.emit 'askLevelUp' + @id

  AskEvolve: (className) ->
    @socket.emit 'askEvolve' + @id, {className: className}

  LevelUp: (tower) ->
    @Deserialize tower
    @Construct()

  Evolve: (tower) ->
    @Deserialize tower
    @Construct()

  Construct: ->
    @startTime = new Date(@startTime.getTime() - globalServerDelay)
    @finishTime = new Date(@finishTime.getTime() - globalServerDelay)
    @huds.SetHidden @progressBar.image, false
    @huds.SetPersistant @progressBar.image, true
#     @huds.ShowNode @progressBar.image

    if @own
      @city.scope.$apply =>
        @city.buildingManager.towersConstruct.push this
    else
      update = setInterval =>
        @UpdateConstruct()
        if @finishTime < new Date()
#           @huds.SetHidden @progressBar.image, true
#           @huds.SetPersistant @progressBar.image, false
#           @huds.HideNode @progressBar.image
          clearInterval update
      , 1000

  UpdateConstruct: ->
    now = new Date().getTime()
    total = @finishTime.getTime() - @startTime.getTime()
    passed = now - @startTime.getTime()
    left = new Date(@finishTime.getTime() - now)
    
    @timeLeft = ''
    @timeLeft += left.getDate() - 1 + 'd ' if left.getDate() - 1
    @timeLeft += left.getHours() - 1 + 'h 'if left.getHours - 1
    @timeLeft += left.getMinutes() + 'm' if left.getMinutes()
    @timeLeft += left.getSeconds() + 's'
    @percent = Math.floor((passed / total) * 100)
    @progressBar.Update {amount: @percent, total: 100}
    
  ColorizePriceEvolve: (name) ->
    price = @GetPrice @GetEvol name
    color = if @CanEvolve() then '#080' else '#800'
    @menu.ColorizePrice name, price, @city, color
    
  ColorizePriceLevelUp: (name) ->
    price = @GetPrice()
    color = if @CanLevelUp() then '#080' else '#800'
    @menu.ColorizePrice name, price, @city, color
    