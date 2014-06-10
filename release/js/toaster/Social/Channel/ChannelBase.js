(function() {

  Social.Channel.ChannelBase = (function() {

    ChannelBase.prototype.name = null;

    ChannelBase.prototype.people = null;

    function ChannelBase(data) {
      this.name = data.name;
      this.people = [];
    }

    ChannelBase.prototype.AddPeople = function(player) {
      return this.people.push(player);
    };

    return ChannelBase;

  })();

}).call(this);
