(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Social.Channel.ChannelClient = (function(_super) {

    __extends(ChannelClient, _super);

    ChannelClient.prototype.messages = null;

    ChannelClient.prototype.socket = null;

    ChannelClient.prototype.scope = null;

    function ChannelClient(channel, socket, scope) {
      ChannelClient.__super__.constructor.call(this, channel);
      this.messages = [];
      this.socket = socket;
      this.scope = scope;
    }

    ChannelClient.prototype.AddMessage = function(message) {
      return this.messages.push(message);
    };

    ChannelClient.prototype.AskAddMessage = function(message) {
      return this.socket.emit('askMessageChannel', message);
    };

    ChannelClient.prototype.AddPeople = function(people) {
      return ChannelClient.__super__.AddPeople.call(this, people);
    };

    return ChannelClient;

  })(Social.Channel.ChannelBase);

}).call(this);
