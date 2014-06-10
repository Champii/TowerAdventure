(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Social.Chat.ChatServer = (function(_super) {

    __extends(ChatServer, _super);

    ChatServer.prototype.sockets = null;

    function ChatServer(sockets) {
      ChatServer.__super__.constructor.call(this);
      this.sockets = sockets;
    }

    ChatServer.prototype.JoinChannel = function(player, channel) {
      var _ref;
      if (!this.ChannelExists(channel)) {
        this.AddChannel(channel);
      }
      return (_ref = this.channels[channel.name]) != null ? _ref.AddPeople(player) : void 0;
    };

    ChatServer.prototype.AddChannel = function(channel) {
      return ChatServer.__super__.AddChannel.call(this, new Social.Channel.ChannelServer(channel, this.sockets));
    };

    ChatServer.prototype.AddMessage = function(message) {
      return this.channels[message.channel].AddMessage(message);
    };

    return ChatServer;

  })(Social.Chat.ChatBase);

}).call(this);
