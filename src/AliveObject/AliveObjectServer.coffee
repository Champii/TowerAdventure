#<< Module
#<< AliveObject/AliveObjectBase
#<< DesignPattern/Observable

class AliveObject.AliveObjectServer extends Module

  @include AliveObject.AliveObjectBase
  @include DesignPattern.Observable

  constructor: (object) ->
    super [object]

  