class Map.LevelGenerator

  constructor: (table) ->
    @_table = table || @makeTable 255 

    @octaves = 20 #20
    @frequency = 0.01 #0.01
    @persistence = 0.45 #0.45

  random: ->
    Math.random()

  makeTable: (size) ->
    result = []
    for n in [0..(size - 1)]
      result[n] = @random()
    result

  cosineInterpolate: ( a, b, t ) ->
    c = ( 1 - Math.cos( t * Math.PI ) ) * 0.5
    return ( 1 - c ) * a + c * b

  _randify : ( n ) ->
    @_table[ Math.floor( Math.abs(n) % @_table.length ) ]

  _noise : ( point ) ->
    value = 0
    dimensions = point.length;
    for dimension in [0..(dimensions - 1)]
      value = @_randify( Math.floor( value * 85000 ) + point[ dimension ] )
    value

  _smooth : ( point, dimension ) ->
    if ( dimension < 0 )
      return @_noise( point );

    value = point[dimension];
    integer = Math.floor( value );
    fractional = value - integer;

    point[ dimension ] = integer;
    a = @_smooth( point, dimension - 1 );

    point[ dimension ] = integer + 1;
    b = @_smooth( point, dimension - 1 );

    point[ dimension ] = value;

    return @cosineInterpolate( a, b, fractional );

  _perlin : ( point ) ->
    value = 0;
    amplitude = 1;

    octaves = @octaves;
    frequency = @frequency;
    persistence = @persistence;

    copy = point.slice( );
    dimensions = copy.length;

    for i in [0..(octaves - 1)]
      t = i * 4096;

      for dimension in [0..(dimensions - 1)]
        copy[ dimension ] = point[ dimension ] * frequency + t;

      value += @_smooth( copy, dimensions - 1 ) * amplitude;

      amplitude *= persistence;
      frequency *= 2;

    limiter = ( 1 - persistence ) / ( 1 - amplitude );
    return value * limiter;

  _generate : ( start, size, callback, dimension ) ->
    if ( dimension < 0 )
      return callback( start, @_perlin( start ) );

    end = start[ dimension ] + size[ dimension ]
    for i in [start[dimension]..(end - 1)]
      @_generate( start, size, callback, dimension - 1 );
      start[dimension]++

    start[dimension] -= size[dimension];
    return null;

  generate : ( start, size, callback ) ->
    @_generate( start, size, callback, start.length - 1 );

