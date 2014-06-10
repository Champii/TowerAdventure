(function() {

  Social.Chat.ChatBase = (function() {

    ChatBase.prototype.channels = null;

    ChatBase.prototype["private"] = null;

    function ChatBase() {
      this.channels = [];
      this["private"] = [];
    }

    ChatBase.prototype.AddChannel = function(channel) {
      if (!this.ChannelExists(channel)) {
        this.channels[channel.name] = channel;
        return console.log("creating channel: ", this.channels, channel);
      }
    };

    ChatBase.prototype.JoinChannel = function(channel) {
      if (!this.ChannelExists(channel)) {
        return this.AddChannel(channel);
      }
    };

    ChatBase.prototype.ChannelExists = function(channel) {
      if (this.channels[channel.name] != null) {
        return true;
      }
      return false;
    };

    return ChatBase;

  })();

}).call(this);
