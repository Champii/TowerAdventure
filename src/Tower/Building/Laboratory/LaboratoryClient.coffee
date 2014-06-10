#<< Module
#<< Tower/Building/Laboratory/LaboratoryBase
#<< Tower/Building/BuildingClient

class Tower.Building.Laboratory.LaboratoryClient extends Module

  @include Tower.Building.Laboratory.LaboratoryBase
  @include Tower.Building.BuildingClient

  percent: 0

  constructor: (city, labo, socket) ->
    super [], [city, labo, socket, laboratoryImage]
    @image.setOffset 0, 10
    @MakeTechnoProgress()

  MakeTechnoMenu: ->
    technoMenu = {}
    for name, techno of @owner.cityManager.technologyManager.technos
      technoMenu[name.toString()] =
        techno.GetContextContent @menu, @city
    @menuContent["technos"] =
      "name": "Technologies ->"
      "items": technoMenu

  MakeTechnoProgress: ->
    @technoProgress = new ProgressBar.ProgressBar {amount: @percent, total: 100}, this, 2, 'green'
    @technoProgress.image.setX @technoProgress.image.getX() - 50 + tileSizeX / 2 + (tileSizeX / 2 * (@posEnd.x - @pos.x - 1))
    @technoProgress.image.setY @technoProgress.image.getY() - (tileSizeY * (@posEnd.x - @pos.x + 1))
