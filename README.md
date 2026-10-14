# RecordSeek Browser Extensions

Manifest V3 extension that sends the current page to `https://recordseek.com/share/`. One codebase is packaged for every browser below.

## Build

Node 18 or newer. Nothing to install.

```bash
node scripts/build.js
node scripts/build.js chrome firefox safari
```

- `tmp/dev/<browser>` is the unpacked extension.
- `tmp/dist/<browser>` is the zip to upload. Firefox is an `.xpi`.

Load `tmp/dev/chrome` from `chrome://extensions` (Developer mode, Load unpacked). Firefox: `about:debugging`, Load Temporary Add-on, pick `tmp/dev/firefox/manifest.json`. Edge: `edge://extensions`.

Version and author come from `src/config/config.json`.

## Safari

`tmp/dev/safari` is a Web Extension. The legacy `.safariextension` files in `src/vendor/safari` are not packaged. Make the Mac app with Xcode:

```bash
xcrun safari-web-extension-converter tmp/dev/safari \
  --project-location tmp/dist/safari \
  --app-name RecordSeek \
  --bundle-identifier simplerain.recordseek \
  --swift --no-prompt
```

On current macOS the share window opens at 700×650. At 800px Safari clips the FamilySearch and Ancestry actions.

## Browsers

| Package | Where it is submitted |
| --- | --- |
| Chrome | Chrome Web Store. Brave, Vivaldi, Arc, Opera, Yandex, and Chromium can install that listing too. |
| Edge | Microsoft Edge Add-ons |
| Firefox | Firefox Add-ons. The same `.xpi` installs on Firefox for Android, LibreWolf, Floorp, Waterfox, and Zen. |
| Opera | Opera Add-ons |
| Safari | Mac App Store, via the Xcode app above |
| Brave, Vivaldi, Yandex, Arc, Chromium | Same Manifest V3 package as Chrome, tagged with that browser name |
| Whale | Naver Whale Store |
| Samsung Internet | Galaxy Store |
| Orion | Orion's extension installer (WebKit) |

Each `src/vendor/<browser>` folder supplies that package's `manifest.json` and `browser.js`. The build copies those over the shared files in `src`.
