var api = globalThis.browser || globalThis.chrome;

// 800px is wide enough that current macOS Safari clips the FamilySearch and
// Ancestry actions. 700px keeps them on screen. Opera needs a taller window.
var POPUP = {
  width: 800,
  height: 650,
  safariWidth: 700,
  operaHeight: 690
};

var MENU_ID = "recordseek";

function popupSize(browserName) {
  return {
    width: browserName === "safari" ? POPUP.safariWidth : POPUP.width,
    height: browserName === "opera" ? POPUP.operaHeight : POPUP.height
  };
}

function canRun(tab) {
  if (!tab || tab.id == null) {
    return false;
  }
  var url = tab.url || "";
  if (!url) {
    return true;
  }
  return !/^(chrome|chrome-extension|chrome-untrusted|edge|brave|opera|vivaldi|whale|about|safari|safari-web-extension|moz-extension|devtools|view-source):/i.test(url);
}

function invokeRecordSeek() {
  if (typeof RecordSeek === "function") {
    RecordSeek();
  }
}

function runOnTab(tab) {
  if (!canRun(tab)) {
    return;
  }
  api.scripting.executeScript({
    target: { tabId: tab.id },
    func: invokeRecordSeek
  }).catch(function () {});
}

function clearSessionCookies() {
  var targets = [
    { url: "https://recordseek.com/share/", name: "FS_ACCESS_TOKEN_1" },
    { url: "https://ident.familysearch.org/cis-web/oauth2/v3/authorization", name: "fssessionid" }
  ];
  return Promise.all(targets.map(function (cookie) {
    return api.cookies.remove(cookie).catch(function () {});
  }));
}

function openShare(request) {
  var size = popupSize(request.browser);
  var createData = {
    url: request.url,
    type: "popup",
    width: size.width,
    height: size.height
  };
  if (request.screenWidth && request.screenHeight) {
    createData.left = Math.ceil((request.screenWidth / 2) - (size.width / 2));
    createData.top = Math.ceil((request.screenHeight / 2) - (size.height / 2));
  }

  api.storage.local.set({ lastSource: Date.now() });
  return api.windows.create(createData).catch(function () {
    return api.tabs.create({ url: request.url });
  });
}

function forgetSessionThenOpen(request) {
  api.storage.local.get("RecordSeek").then(function (stored) {
    var settings = stored && stored.RecordSeek;
    var forget = settings && settings.forgetUserSession === true;
    var pending = forget ? clearSessionCookies() : Promise.resolve();
    return pending.then(function () {
      return openShare(request);
    });
  }).catch(function () {
    return openShare(request);
  });
}

var menuReady = null;
function ensureMenu() {
  if (menuReady) {
    return menuReady;
  }
  menuReady = api.contextMenus.removeAll().then(function () {
    return api.contextMenus.create({
      id: MENU_ID,
      title: "RecordSeek",
      contexts: ["all"]
    });
  }).catch(function () {
    menuReady = null;
  });
  return menuReady;
}

api.action.onClicked.addListener(runOnTab);

api.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === MENU_ID) {
    runOnTab(tab);
  }
});

api.runtime.onInstalled.addListener(ensureMenu);
api.runtime.onStartup.addListener(ensureMenu);
ensureMenu();

api.runtime.onMessage.addListener(function (request, sender) {
  if (!request || request.action !== "newTab" || !request.url) {
    return;
  }
  if (sender && sender.id && sender.id !== api.runtime.id) {
    return;
  }
  forgetSessionThenOpen(request);
});
