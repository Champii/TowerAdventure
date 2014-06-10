(function() {

  ContextMenu.ContextMenuBase = (function() {

    ContextMenuBase.prototype.menu = null;

    ContextMenuBase.prototype.label = null;

    ContextMenuBase.prototype.back = null;

    function ContextMenuBase() {}

    ContextMenuBase.prototype.Show = function(attachedObject, x, y) {
      this.Hide();
      this.menu = new Kinetic.Container();
      this.back = new Kinetic.Rect({
        x: x,
        y: y,
        width: 100,
        height: 100,
        fill: '#777777',
        stroke: 'black',
        strokeWidth: 1
      });
      this.menu.add(this.back);
      return hudContainer.add(this.menu);
    };

    ContextMenuBase.prototype.Hide = function() {
      hudContainer.removeChildren();
      return hudContainer.draw();
    };

    ContextMenuBase.prototype.DevelopMenu = function() {};

    return ContextMenuBase;

  })();

}).call(this);
