(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Social.Channel.ChannelServer = (function(_super) {

    __extends(ChannelServer, _super);

    ChannelServer.prototype.sockets = null;

    function ChannelServer(channel, sockets) {
      ChannelServer.__super__.constructor.call(this, channel);
      this.sockets = sockets;
    }

    ChannelServer.prototype.AddPeople = function(player) {
      ChannelServer.__super__.AddPeople.call(this, player);
      player.socket.join(this.name);
      player.socket.emit('iJoinedChannel', {
        name: this.name
      });
      return this.sockets["in"](this.name).emit('joinedChannel', {
        name: this.name,
        player: player.login
      });
    };

    ChannelServer.prototype.AddMessage = function(message) {
      return this.sockets["in"](this.name).emit('messageChannel', message);
    };

    return ChannelServer;

  })(Social.Channel.ChannelBase);

}).call(this);
