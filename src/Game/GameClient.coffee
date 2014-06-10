#<< Module
#<< PlayerManager/PlayerManagerClient
#<< Game/GameBase
#<< Player/PlayerClient
#<< ContextMenu/ContextMenuStage
#<< Notification/Notification

globalServerDelay = null

stage = null
mainContainer = null
hudContainer = null
entityContainer = null

mapContainer = null
rangeContainer = null
buildingsContainer = null
peopleContainer = null

grassImage = null
ironImage = null
goldImage = null
cristalImage = null
uraniumImage = null
petrolImage = null

cityHallImage = null
laboratoryImage = null

baseTowerImage = null
baseDefenseTowerImage = null
baseSpawnTowerImage = null

cityRangeImage = null
cityRangeEnemyImage = null

floor = null
floorSprite = null
buildings = null
buildingsSprite = null

grassShape = null

baseEntityImage = null

class Game.GameClient extends Module

  @include Game.GameBase

  socket:     null
  player:     null
  map:        null
  playerManager: null
  scopeLogin: null
  scopePanel: null
  menu:       null
  ready:      false
  chat:       null
  notification: null

  constructor: (socket) ->
    super()
    @socket = socket
    @notification = new Notification.Notification


  InitGraph: (callback) ->
    stage = new Kinetic.Stage
      container: 'game'
      width: document.body.scrollWidth
      height: document.body.scrollHeight
      draggable: true

    mainContainer = new Kinetic.Layer()
    hudContainer = new Kinetic.Layer()
    entityContainer = new Kinetic.Layer()

    mapContainer = new Kinetic.Container()
    rangeContainer = new Kinetic.Container()
    buildingsContainer = new Kinetic.Container()

    mainContainer.add mapContainer
    mainContainer.add rangeContainer
    mainContainer.add buildingsContainer
    stage.add mainContainer
    stage.add entityContainer
    stage.add hudContainer

    floorSprite =
      grass: [{
        x: 0
        y: 0
        width: 128
        height: 64
        }]

    buildingsSprite =
      main: [{
        x: 0
        y: 0
        width: 128
        height: 128
        }]


    floorShape = new Kinetic.Polygon
      points: [0, tileSizeY / 2, tileSizeY, tileSizeY, tileSizeX, tileSizeY / 2, tileSizeY, 0]

    grassShape = floorShape.clone()
    grassShape.setFill 'green'
    grassShape.setStroke 'green'
    grassShape.setStrokeWidth 1

    ironShape = floorShape.clone()
    ironShape.setFill 'grey'
    ironShape.setStroke 'grey'
    ironShape.setStrokeWidth 1

    goldShape = floorShape.clone()
    goldShape.setFill 'yellow'
    goldShape.setStroke 'yellow'
    goldShape.setStrokeWidth 1

    cristalShape = floorShape.clone()
    cristalShape.setFill 'blue'
    cristalShape.setStroke 'blue'
    cristalShape.setStrokeWidth 1

    uraniumShape = floorShape.clone()
    uraniumShape.setFill 'purple'
    uraniumShape.setStroke 'purple'
    uraniumShape.setStrokeWidth 1

    petrolShape = floorShape.clone()
    petrolShape.setFill 'black'
    petrolShape.setStroke 'black'
    petrolShape.setStrokeWidth 1

    cityRangeShape = floorShape.clone()
    cityRangeShape.setFill 'white'
    cityRangeShape.setStroke 'black'
    cityRangeShape.setStrokeWidth 1

#     grassShape.toImage
#       height: tileSizeY
#       width: tileSizeX
#       callback: (img) ->
#         grassImage = img

    grassImage = new Image()
    grassImage.src = 'assets/img/grass_tile.png'

    ironImage = new Image()
    ironImage.src = 'assets/img/iron_tile.png'

    goldImage = new Image()
    goldImage.src = 'assets/img/gold_tile.png'

    cristalImage = new Image()
    cristalImage.src = 'assets/img/cristal_tile.png'

#     ironShape.toImage
#       height: tileSizeY
#       width: tileSizeX
#       callback: (img) ->
#         ironImage = img
#
#     goldShape.toImage
#       height: tileSizeY
#       width: tileSizeX
#       callback: (img) ->
#         goldImage = img
#
#     cristalShape.toImage
#       height: tileSizeY
#       width: tileSizeX
#       callback: (img) ->
#         cristalImage = img
    console.log tileSizeX, tileSizeY
    uraniumShape.toImage
      height: tileSizeY
      width: tileSizeX
      callback: (img) ->
        uraniumImage = img

    petrolShape.toImage
      height: tileSizeY
      width: tileSizeX
      callback: (img) ->
        petrolImage = img

    cityRangeShape.toImage
      # height: tileSizeY
      width: 40
      height: 20
      # x: 0
      # y: 0
      callback: (img) ->
        cityRangeImage = img
    cityRangeShape.setFill 'red'
    cityRangeShape.toImage
      height: tileSizeY
      width: tileSizeX
      callback: (img) ->
        cityRangeEnemyImage = img

    cityHallImage = new Image()
    cityHallImage.src = 'assets/img/Towers/cityhall3x3.png'
    cityHallImage.onload = =>
      callback() if callback?

    laboratoryImage = new Image()
    laboratoryImage.src = 'assets/img/Towers/laboratory2x2.png'

    buildings = new Image()
    buildings.src = 'assets/img/buildings.png'
    buildings.onload = =>

    baseTowerImage = new Image()
    baseTowerImage.src = 'assets/img/Towers/basetower1x1.png'

    baseDefenseTowerImage = new Image()
    baseDefenseTowerImage.src = 'assets/img/Towers/basedefense1x1.png'


    baseSpawnTowerImage = new Image()
    baseSpawnTowerImage.src = 'assets/img/Towers/basespawn1x1.png'

    baseEntityImage = new Image()
    baseEntityImage.src = 'assets/img/baseEntity.png'

    @menu = new ContextMenu.ContextMenuStage()
    mainContainer.on 'mousedown', (e) =>
      if e.button == 2
        @menu.Show this, {x: Math.floor((-stage.attrs.x + e.x) / tileSizeX), y: Math.floor((-stage.attrs.y + e.y) / tileSizeY)}


  SignIn: (login, pass, rootScope, scope) ->
    @rootScope = rootScope
    @scopeLogin = scope
    @InitGraph =>
      @socket.emit 'signIn',
        login: login
        pass: pass

    @socket.on 'loggedIn', =>
      @InitAfterSignIn()

  SignUp: (login, pass, rootScope, scope) ->
    @rootScope = rootScope
    @scopeLogin = scope
    @InitGraph =>
      @socket.emit 'signUp',
        login: login
        pass: pass

    @socket.on 'signedUp', =>
      @InitAfterSignIn()

  InitAfterSignIn:  ->
    @rootScope.$broadcast 'loggedIn', {}
    @socket.on 'notification', (notif) =>
      @notification.AddNotification notif
    @socket.on 'syncTime', (time) =>
      now = new Date().getTime()
      globalServerDelay = time.time - now
    @socket.on 'ownPlayerObject', (data) =>
      data.own = true
      @map = new Map.MapClient @socket, @scopePanel
      @player = new Player.PlayerClient data, @socket, @scopePanel
      @playerManager = new PlayerManager.PlayerManagerClient this, @socket, @scopePanel
    $('#loginScreen').hide()
    $('#game').show()

  CommandPanelInit: ($scope) ->
    @scopePanel = $scope
    @scopePanel.loadChunkAskMessages = {count: 0}
    @scopePanel.loadChunkRecvMessages = {count: 0, total: 0}
    @scopePanel.loadCityMessages = {count: 0}
    @scopePanel.loadBuildingMessages = {count: 0}
    @scopePanel.loaddingPercent = 0
    @chat = new Social.Chat.ChatClient @socket, @scopePanel
    @scopePanel.channels = @chat.channels
    @scopePanel.visibleChunks = 0

    $('#panelCommandTab a').click (e) ->
      e.preventDefault()
      $(this).tab 'show'

    @scopePanel.updateLoadMessages = (key, image) =>
      @scopePanel.$apply =>
        switch key
          when 'chunk'
            @scopePanel.loadChunkAskMessages.count++
            @scopePanel.loadChunkRecvMessages.total++
          when 'map'
            if !@ready
              @scopePanel.loadingPercent = Math.floor(@scopePanel.loadChunkRecvMessages.count / @scopePanel.loadChunkRecvMessages.total * 100)
#               stage.draw()
            else
#               mainContainer.draw()
#               image.hide()
            if ++@scopePanel.loadChunkRecvMessages.count == @scopePanel.loadChunkRecvMessages.total && @ready
              @map.GetChunkNear {x: Math.floor((-stage.attrs.x + document.body.scrollWidth / 2) / tileSizeX), y: Math.floor((-stage.attrs.y + document.body.scrollHeight / 2) / tileSizeY)}, {x: Math.floor((document.body.scrollWidth / (tileSizeX * @map.scale * 2) / Map.Chunk.ChunkBase.size)) + 2, y: Math.floor((document.body.scrollHeight / (tileSizeY * @map.scale * 2) / Map.Chunk.ChunkBase.size)) + 2}, (chunk, pos) =>
                if chunk? && chunk.image? && !(@map.IsVisible chunk)
                  @map.visibles.push chunk
                  @scopePanel.visibleChunks = @map.visibles.length
                  chunk.image.show() if chunk.image?
#               mainContainer.draw()
            else if @scopePanel.loadChunkRecvMessages.count == @scopePanel.loadChunkRecvMessages.total && !@ready
              @scopePanel.loadFinished()
          when 'city'
            @scopePanel.loadCityMessages.count++
          when 'building'
            @scopePanel.loadBuildingMessages.count++

    @scopePanel.loadFinished = =>
      @scopePanel.citys = @player.cityManager.citys
      @socket.emit 'ready'
      @ready = true
      @map.chunkQueue.ChangeTime (Map.Chunk.ChunkBase.size * 2)
      $('#loading').slideUp('slow')
      stage.draw()

    @scopePanel.centerOnCity = (city) =>
      @scopePanel.currentCity = @player.cityManager.currentCity = @player.cityManager.GetCity city.name
      city.resources.UpdateResources()
#       @socket.emit 'viewPos', city.pos
      center = Map.MapClient.PosToIsoScreen {x: city.pos.x, y: city.pos.y}
#         x: -city.pos.x * tileSizeX + document.body.scrollWidth / 2
#         y: -city.pos.y * tileSizeY + document.body.scrollHeight / 2
#         x: -city.pos.x * tileSizeX + document.body.scrollWidth / 2
#         y: -city.pos.y * tileSizeY + document.body.scrollHeight / 2
      stage.setX -center.x + document.body.scrollWidth / 2
      stage.setY -center.y + document.body.scrollHeight / 2
      @map.UpdateVisibleChunk()
      @menu.Hide()
#       stage.draw()

    @scopePanel.centerInit = (mainCityPos) =>
      center = Map.MapClient.PosToIsoScreen {x: mainCityPos.x, y: mainCityPos.y}
      stage.setX -center.x + document.body.scrollWidth / 2
      stage.setY -center.y + document.body.scrollHeight / 2
      @map.UpdateVisibleChunk()
