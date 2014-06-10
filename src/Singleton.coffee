class Singleton
  _instance = undefined # Must be declared here to force the closure on the class

  @get: (classType, args) -> # Must be a static method
    _instance ?= new classType args
