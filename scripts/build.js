#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");
var childProcess = require("child_process");

var root = path.resolve(__dirname, "..");
var vendorDir = path.join(root, "src", "vendor");
var devRoot = path.join(root, "tmp", "dev");
var distRoot = path.join(root, "tmp", "dist");

var ORDER = [
  "chrome", "edge", "firefox", "opera", "safari",
  "brave", "vivaldi", "yandex", "arc", "whale",
  "samsung", "orion", "chromium"
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}

function applyTokens(text, tokens) {
  return text.replace(/\{\{([^}]+)\}\}/g, function (_, key) {
    var value = tokens;
    var parts = key.trim().split(".");
    for (var i = 0; i < parts.length; i++) {
      if (value == null || typeof value !== "object") {
        return "";
      }
      value = value[parts[i]];
    }
    return value == null ? "" : String(value);
  });
}

function walk(dir, files) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    var full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  });
  return files;
}

function copyShared(dest) {
  ["lib", "img", "js", "html"].forEach(function (name) {
    fs.cpSync(path.join(root, "src", name), path.join(dest, name), { recursive: true });
  });
  fs.cpSync(
    path.join(root, "src", "_locales", "en", "messages.json"),
    path.join(dest, "_locales", "en", "messages.json")
  );
}

function discover() {
  var found = fs.readdirSync(vendorDir).filter(function (name) {
    return fs.existsSync(path.join(vendorDir, name, "manifest.json")) &&
      fs.existsSync(path.join(vendorDir, name, "browser.js"));
  });
  found.sort(function (a, b) {
    var ai = ORDER.indexOf(a);
    var bi = ORDER.indexOf(b);
    if (ai === -1) ai = ORDER.length;
    if (bi === -1) bi = ORDER.length;
    if (ai !== bi) return ai - bi;
    return a.localeCompare(b);
  });
  return found;
}

function buildOne(id, config) {
  var dest = path.join(devRoot, id);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  copyShared(dest);
  fs.copyFileSync(path.join(vendorDir, id, "manifest.json"), path.join(dest, "manifest.json"));
  fs.copyFileSync(path.join(vendorDir, id, "browser.js"), path.join(dest, "js", "browser.js"));

  var tokens = {
    version: config.version,
    author: config.author,
    vendor: config.vendor || {}
  };
  walk(dest, []).forEach(function (file) {
    if (file.indexOf(path.sep + "lib" + path.sep) !== -1) {
      return;
    }
    if (!/\.(js|json|html)$/.test(file)) {
      return;
    }
    var text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
    var next = applyTokens(text, tokens);
    if (next.indexOf("{{") !== -1) {
      throw new Error("Unreplaced token in " + path.relative(root, file));
    }
    fs.writeFileSync(file, next);
  });

  var manifest = readJson(path.join(dest, "manifest.json"));
  if (manifest.manifest_version !== 3) {
    throw new Error(id + " is not Manifest V3");
  }
  // The Chrome Web Store rejects an upload that still contains "key".
  if (manifest.key) {
    delete manifest.key;
    fs.writeFileSync(path.join(dest, "manifest.json"), JSON.stringify(manifest, null, 4) + "\n");
  }
  var background = manifest.background || {};
  if (background.service_worker !== "js/background.js" || !background.scripts || background.scripts[0] !== "js/background.js") {
    throw new Error(id + " background must declare both scripts and service_worker");
  }
  // AMO lint flags service_worker as unsupported; Firefox only runs scripts.
  if (id === "firefox") {
    delete background.service_worker;
    fs.writeFileSync(path.join(dest, "manifest.json"), JSON.stringify(manifest, null, 4) + "\n");
  }

  var archive = id === "firefox" ? "xpi" : "zip";
  var distDir = path.join(distRoot, id);
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
  var archiveName = "recordseek-" + config.version + "-" + id + "." + archive;
  childProcess.execFileSync("zip", ["-r", "-X", "-q", path.join(distDir, archiveName), ".", "-x", "*.DS_Store"], {
    cwd: dest
  });
  return archiveName;
}

function main() {
  var config = readJson(path.join(root, "src", "config", "config.json"));
  var available = discover();
  var requested = process.argv.slice(2);
  var targets = requested.length ? requested : available;
  targets.forEach(function (id) {
    if (available.indexOf(id) === -1) {
      throw new Error("Unknown browser '" + id + "'. Available: " + available.join(", "));
    }
  });

  var built = targets.map(function (id) {
    return id + " -> " + buildOne(id, config);
  });
  process.stdout.write(built.join("\n") + "\n");
}

main();
