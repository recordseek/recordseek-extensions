var api = (typeof browser !== "undefined") ? browser : chrome;

function update() {
  var hazChecked = document.getElementById("forgetUserSession").checked;
  api.storage.local.set(
    {
      RecordSeek: { forgetUserSession: hazChecked }
    }, function () {
      var display = document.getElementById("display");
      display.innerHTML = "\u2713";
      setTimeout(function () {
        display.innerHTML = "";
      }, 750);
    }
  );
}

function show() {
  document.getElementById("forgetUserSession").addEventListener("click", update);
  document.getElementById("optionSession").textContent = api.i18n.getMessage("optionSessionText");
  document.getElementById("optionTitle").textContent = api.i18n.getMessage("optionSessionTitle");
  document.title = api.i18n.getMessage("optionTitle");

  api.storage.local.get("RecordSeek", function (items) {
    if (items.RecordSeek && items.RecordSeek.forgetUserSession === true) {
      document.getElementById("forgetUserSession").checked = true;
    }
  });
}

document.addEventListener("DOMContentLoaded", show);
