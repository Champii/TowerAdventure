#<< Node
#<< Browser
#<< Helpers/Helper

handleError = (err) ->
  console.log "Error Mongo: ", err

class Main

  constructor: ->
    Helpers.Helper.IfBrowserContext ->
      new Browser
      
    Helpers.Helper.IfNodeContext ->
      new Node


new Main