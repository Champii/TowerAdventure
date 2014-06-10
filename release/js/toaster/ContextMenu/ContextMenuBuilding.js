(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ContextMenu.ContextMenuBuilding = (function(_super) {
    var _instance;

    __extends(ContextMenuBuilding, _super);

    _instance = void 0;

    function ContextMenuBuilding() {
      var _this = this;
      stage.on('mousedown', function(e) {
        if (e.button !== 2) {
          return _this.Hide();
        }
      });
    }

    ContextMenuBuilding.prototype.Show = function(attachedObject, x, y) {
      var levelText, nameText,
        _this = this;
      ContextMenuBuilding.__super__.Show.call(this, attachedObject, x, y);
      levelText = new Kinetic.Text({
        x: x + 5,
        y: y + 30,
        text: "Buy level " + (attachedObject.level + 1),
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: 'white',
        drawHitFunc: function(canvas) {
          var context;
          context = canvas.getContext();
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(100, 0);
          context.lineTo(100, 15);
          context.lineTo(0, 15);
          context.closePath();
          return canvas.fillStroke(this);
        }
      });
      nameText = new Kinetic.Text({
        x: x + 5,
        y: y + 5,
        text: attachedObject.name + " (" + attachedObject.level + ")",
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: 'white'
      });
      this.menu.add(levelText);
      this.menu.add(nameText);
      hudContainer.draw();
      levelText.on('mousedown', function(e) {
        return attachedObject.LevelUp();
      });
      return levelText.on('mouseover', function(e) {
        return _this.label.Show(attachedObject.city, e.x, e.y);
      });
    };

    ContextMenuBuilding.prototype.Hide = function() {
      return ContextMenuBuilding.__super__.Hide.call(this);
    };

    ContextMenuBuilding.get = function() {
      return _instance != null ? _instance : _instance = new this();
    };

    return ContextMenuBuilding;

  })(ContextMenu.ContextMenuBase);

}).call(this);
