# Store listing copy

Use the same copy for every store (Chrome, Edge, Firefox, Opera and others).

## Name

RecordSeek

## Short description (132 characters max; Chrome "summary", Firefox "summary")

Turn any genealogy record or web page into a proper source citation and attach it to your family tree on FamilySearch or Ancestry.

## Full description

RecordSeek turns the things you find online into sources you can trust, and keeps them connected to the people in your family tree.

Found an ancestor in a census record, an obituary, a newspaper article, a grave listing or a family website? Click the RecordSeek button. RecordSeek reads the page and creates a properly formatted source citation for you, with the title, link and details already filled in. No more copying and pasting.

Then choose where it goes:

• FamilySearch: create the source and attach it to the right person in the Family Tree, or save it to your Source Box to attach later.
• Ancestry: send the page to Ancestry's Save to Ancestry, ready to add to your tree.
• Anywhere else: copy a ready-made citation for your own notes, software or research log.

WHAT RECORDSEEK DOES FOR YOU

• One click from discovery to source. Works on any web page, not only genealogy sites.
• Reads the record for you. On popular genealogy sites, RecordSeek picks up the person's name, dates, places and family members and uses them to search your tree.
• Citations in the style you need: Evidence Explained, Chicago, NGSQ, MLA, APA or Harvard.
• Tag what the source proves (name, gender, birth, christening, death, burial) and add a reason, so others know why it is attached.
• Remembers your choices, like citation style and whether to file sources in your Source Box.

PRIVATE BY DESIGN

RecordSeek only looks at a page when you click the button. It then opens recordseek.com with that page's title, address, any text you selected and the record details it found, so it can build your citation. It doesn't track your browsing or sell your data. You sign in to FamilySearch through FamilySearch's own login page; RecordSeek never sees your password.

Trusted by more than 150,000 family historians, with over 2 million sources saved.

RecordSeek is an independent tool and is not affiliated with or endorsed by FamilySearch or Ancestry.

Questions or feedback: https://recordseek.com

## Category

Productivity (Chrome, Edge) · Other / Search Tools (Firefox)

## Images

Rendered from `promo/promo.html` (open it with `?size=tile|marquee|large`):

| File | Size | Use |
|---|---|---|
| `promo/promo-tile-440x280.png` | 440×280 | Chrome small promo tile, Edge/Opera thumbnail |
| `promo/promo-marquee-1400x560.png` | 1400×560 | Chrome marquee, Edge large promo |
| `promo/promo-large-920x680.png` | 920×680 | Older 920×680 slots (Opera, Yandex) |
| `promo/screenshot-1…5-*-1280x800.png` | 1280×800 | Store screenshots, in order (all stores) |

Screenshots come from `promo/screenshot.html?shot=main|source|search|attach|citation`, which frames the app captures in `promo/screens/`. To refresh those captures, run `promo/screens/capture-app.py` against the local dev server (see the comment at its top).

To re-render after editing the HTML:

```bash
cd src/store/promo
for spec in tile:440:280 marquee:1400:560 large:920:680; do
  IFS=: read n w h <<< "$spec"
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 --virtual-time-budget=4000 \
    --window-size=$w,$h --screenshot="$PWD/promo-$n-${w}x${h}.png" "file://$PWD/promo.html?size=$n"
done
```
