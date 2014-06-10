(function() {
  var Main;

  Main = (function() {

    function Main() {
      Helpers.Helper.IfBrowserContext(function() {
        return new Browser;
      });
      Helpers.Helper.IfNodeContext(function() {
        return new Node;
      });
    }

    return Main;

  })();

  new Main;

}).call(this);
