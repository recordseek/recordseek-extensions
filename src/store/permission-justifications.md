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
Privacy policy: https://recordseek.com/privacy (confirm the URL)
