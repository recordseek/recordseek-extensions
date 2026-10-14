(function (root) {
  var api = root.browser || root.chrome;
  var app = root.app = root.app || {};

  app.browser = {
    name: "firefox"
  };

  app.newTab = function (url) {
    api.runtime.sendMessage({
      action: "newTab",
      url: url,
      browser: app.browser.name,
      screenWidth: root.screen ? root.screen.width : 0,
      screenHeight: root.screen ? root.screen.height : 0
    });
  };

  app.getVersion = function () {
    return api.runtime.getManifest().version;
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
