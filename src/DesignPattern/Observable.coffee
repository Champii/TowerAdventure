class DesignPattern.Observable

  observators: null

  constructor: ->
    @observators = []
    
  Attach: (observator) ->
#     for i, obs in @observators
#       if obs is observator
#         return
    @observators.push observator

  Detach: (observator) ->
    for i, obs of @observators
      if obs is observator
        delete @observators[i]
        @observators.splice i, 1

  Notify: (owner, cb) ->
    for obs in @observators
      obs.Update owner, cb

  IsObservator: (obs) ->
    for observator in @observators
      if obs is observator
        return true
    false
