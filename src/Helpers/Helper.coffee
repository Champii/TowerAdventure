class Helpers.Helper

  constructor: ->

  @IfBrowserContext: (fn) ->
    if typeof ( window ) isnt 'undefined'
      fn()

  @IfNodeContext: (fn) ->
    if typeof( process ) isnt 'undefined'
      fn()

  