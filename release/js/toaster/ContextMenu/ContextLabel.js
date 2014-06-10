(function() {

  ContextMenu.ContextLabel = (function() {

    ContextLabel.prototype.label = null;

    function ContextLabel() {
      this.label = null;
    }

    ContextLabel.prototype.Show = function(attachedObject, x, y) {
      var back;
      this.label = new Kinetic.Container();
      return back = new Kinetic.Rect({
        x: x,
        y: y,
        width: 250,
        height: 40,
        fill: '#777777',
        stroke: 'black',
        strokeWidth: 1
      });
    };

    ContextLabel.prototype.Hide = function() {};

    return ContextLabel;

  })();

}).call(this);
