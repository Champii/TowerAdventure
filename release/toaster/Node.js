(function() {
  var Node;

  Node = (function() {

    function Node() {
      Log.log("Node Side");
      new Server.Server;
    }

    return Node;

  })();

}).call(this);
