class Log

  @debug: 1
  # -1 : No Output
  # 0  : Error Only
  # 1  : Verbose

  @log: (message)->
    if @debug == 1
      console.log message

  @error: (message) ->
    if @debug != -1
      console.log "ERROR: " + message
    