#<< Server/Server
#<< Log

class Node

  constructor: ->
    Log.log "Node Side"
    new Server.Server
    