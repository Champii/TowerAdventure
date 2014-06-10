#<< Module
#<< Technology/TechnologyBase

class Technology.TechnologyClient extends Module

  @include Technology.TechnologyBase

  constructor: (@parent, techno, @socket, @scope)->
    super [techno]
    @socket.on 'updateTechno' + @id, (techno) =>
      @Deserialize techno
    @socket.on 'levelUpTechno' + @id, (techno) =>
      @LevelUp techno

  AskLevelUp: ->
    @socket.emit 'askLevelUpTechno' + @id

  LevelUp: (techno) ->
    @Deserialize techno
    @Construct()

  Construct: ->
    @startTime = new Date(@startTime.getTime() - globalServerDelay)
    @finishTime = new Date(@finishTime.getTime() - globalServerDelay)
    if (labo = @parent.parent.currentCity.buildingManager.GetTower('laboratory'))?
      labo.technoProgress.Show()
      update = setInterval =>
        @UpdateConstruct labo
        if @finishTime < new Date()
          clearInterval update
          labo.technoProgress.Hide()
      , 1000

  ColorizePriceLevelUp: (name, menu, city) ->
    price = @GetPrice()
    color = if @CanLevelUp city then '#080' else '#800'
    menu.ColorizePrice name, price, city, color

  GetContextContent: (menu, city) ->
    "name": @ColorizePriceLevelUp @name + " (" + (@level + 1) + ")", menu, city
    "disabled": !@CanLevelUp city
    "callback": =>
      @AskLevelUp()

  UpdateConstruct: (labo) ->
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
    labo.technoProgress.Update {amount: @percent, total: 100}

