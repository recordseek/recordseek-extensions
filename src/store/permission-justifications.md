# Store review notes (2.6.1)

Single purpose: turn the page the user is viewing into a genealogy source citation on RecordSeek.com.

| Permission | Why it is needed |
|---|---|
| activeTab | Reads the title, heading, URL and selected text of the current page, only after the user clicks the toolbar button or context menu item. |
| scripting | Injects the citation script into that tab on the click. |
| contextMenus | Adds the "RecordSeek" right-click item. |
| storage | Saves the user's options (the "forget session" setting). |
| cookies | Optional "forget session" setting: clears the RecordSeek/FamilySearch login cookies before the share window opens. |
| Host: recordseek.com | Tells RecordSeek.com which extension and version is installed. |
| Host: familysearch.org | Needed to clear the FamilySearch session cookie (the cookies setting above). |

No remote code. All JavaScript ships in the package. lib/genscrape.js is an unminified build of
https://github.com/rootsdev/genscrape (MIT) at commit 2a1205a, with the build command in its header.

Data: the page URL, title, heading and selected text go to RecordSeek.com only when the user clicks. Nothing is collected in the background, sold, or used for ads.
Privacy policy: https://recordseek.com/privacy/

## Chrome Web Store privacy practices (paste-ready)

- **Single purpose:** RecordSeek turns the web page the user is viewing into a genealogy source citation. When the user clicks the RecordSeek button or menu item, it reads the page's title, address, heading, selected text and any record details, and opens RecordSeek.com to save the citation to their FamilySearch or Ancestry tree.
- **activeTab:** Used to read the title, URL, main heading, selected text and genealogy record details of the current tab, only after the user clicks the RecordSeek toolbar button or context menu item. This lets the extension work on any genealogy site without broad host access.
- **scripting:** Injects the RecordSeek citation script into the active tab when the user clicks the toolbar button or context menu item, so it can read the page details for the citation. Scripts are injected only on that click and only into that tab.
- **contextMenus:** Adds a "RecordSeek" item to the right-click menu so users can create a citation from the page they're viewing, as an alternative to the toolbar button.
- **storage:** Saves the user's extension settings locally, such as the "forget my session" option. Nothing is synced or sent anywhere.
- **cookies:** Used only for the optional "forget my session" setting: before the share window opens, the extension removes the RecordSeek and FamilySearch sign-in cookies so the user can sign in with a different account. The extension never reads, stores or transmits cookie values.
- **Host permissions:** recordseek.com: tells the RecordSeek website which browser and extension version is installed, so it shows the right instructions. familysearch.org: required to remove the FamilySearch sign-in cookie for the "forget my session" setting. No other sites get host access; all other pages are reached only through activeTab after a user click.
- **Remote code:** No. All JavaScript is included in the package. No external scripts, eval or remotely loaded code.
- **Data usage:** Website content only. Tick all three certifications.
- **Privacy policy:** https://recordseek.com/privacy/
