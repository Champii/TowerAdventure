class Notification.Notification

  timer: null
  attached: null

  constructor: () ->
    @attached = '#summaryPanelToggle'
    $('#summaryToggle').click () =>
      if @attached != '#panelResources'
        @attached = '#panelResources'
      else
        @attached = '#summaryPanelToggle'
      @UpdateGrowls()
#     @attached = '#panelCommandCenterToggle'
#     $('#commandCenterToggle').click () =>
#       if @attached != '#panelResources'
#         @attached = '#panelResources'
#       else
#         @attached = '#panelCommandCenterToggle'
#       @UpdateGrowls()

    @timer = (event) ->
      api = $(this).data('qtip')
      lifespan = 10000
    
      if api.get('show.persistent') == true
        return
  
      clearTimeout api.timer
      if event.type != 'mouseover'
        api.timer = setTimeout api.hide, lifespan
  
    $(document).delegate('.qtip.jgrowl', 'mouseover mouseout', @timer)

  AddNotification: (notification) ->
    target = $('.qtip.jgrowl:visible:last')
        
    $(document.body).qtip(
      content:
        text: notification.message
        title: 
          text: notification.title
          button: true
      position: 
        my: 'top left'
        at: 'bottom left'
        target: if target.length then target else $(@attached)#$(window)
        adjust: if $('.qtip.jgrowl').length then { y: 5 } else { x: 5, y: 5}
        effect: (api, newPos) ->
          $(this).animate newPos,
            duration: 200
            queue: false
          api.cache.finalPos = newPos
      show: 
        event: false
        ready: true
        effect: ->
          $(this).stop(0, 1).fadeIn(400)
        delay: 0
        persistent: notification.persistent
      hide:
        event: false
        effect: (api) =>
          $(this).stop(0, 1).fadeOut(400).queue =>
            api.destroy()
            @UpdateGrowls()
      style:
        classes: 'jgrowl qtip-dark qtip-rounded'
        tip: false
      events:
        render: (event, api) =>
          @timer.call(api.elements.tooltip, event)
    ).removeData('qtip')

  UpdateGrowls: () ->
    each = $('.qtip.jgrowl')
    width = each.outerWidth()
    height = each.outerHeight()
    gap = each.eq(0).qtip('option', 'position.adjust.y')
    pos = 0

    each.each (i, value) =>
      api = $(value).data('qtip')
      api.options.position.target = if !i then $(@attached) else [
        pos.left, pos.top + (height * i) + Math.abs(gap * (i-1))]
      api.set('position.my', 'top left')
      api.set('position.at', 'bottom left')

      if !i
        pos = api.cache.finalPos
