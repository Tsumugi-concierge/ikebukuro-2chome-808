Summary of Changes for Multilingual Support (6 languages)

- Created a new feature branch: feat/i18n-6lang
- Added shared i18n assets:
  - assets/i18n.css: CSS helpers to show/hide .lang-xx blocks via html.show-xx classes, plus a styled language switcher (injected when needed).
  - assets/i18n.js: Global language manager that persists the selection (localStorage key felizStayLang), initializes from browser language, injects a language switcher when a page doesn’t have one, toggles visibility of .lang-xx elements, and bridges to existing per-page translators (applyTranslations / setLang). Also syncs the homepage chat UI when present.
- Updated assets/site.css: Added styling for additional menu label classes (.pl-zh, .pl-ko, .pl-fr, .pl-es) so the top menu keeps consistent visual design across languages.

Pages updated to load the new assets (i18n.css + i18n.js):
- index.html (root), and all subpages under this repository.

Homepage (index.html):
- Added a global language switcher (injected by assets/i18n.js).
- Extended existing EN/JA menu labels to six languages by adding per-language spans (pl-en/ja/zh/ko/fr/es with matching lang-xx classes).
- Wrapped Wi‑Fi labels (title, Network, Password, QR hint) with six-language text.
- Kept existing design, layout and image paths unchanged.

Subpages that already had their own 6-language switchers/translators (no content rewriting):
- access/, equipment/, parking/, taxi/, circuit-breaker/, how-to-open/, nearby-shops/, laundry/, gas-reset/
- These now also load the shared i18n assets. The global script detects the existing switcher and syncs selection and persistence without injecting a duplicate control.

Subpages that lacked full 6-language content (content updated and translated):
- manual/: Added six-language page title and translated check-in guidance into ja/zh/ko/fr/es. No access codes were added.
- emergency/: Added six-language page title and an “Emergency Contacts” title line in six languages. The map link is left intact.
- nearby/: Added six-language page title and a short “Nearby Places” title in six languages. The map link is left intact.
- airport/: Added six-language page title. Wrapped and localized the Wi‑Fi information heading and ID/PASS labels; the SSID and password values remain unchanged.
- transportation/: Rewrote the section into six languages (EN/JA/ZH/KO/FR/ES) covering Airport Transfer, Sightseeing Transfer, Domestic Luggage Forwarding, and booking instructions. Prices and proper nouns remain as-is.
- trash/: Localized page title and back link. Converted the note box into six languages (balcony garbage bin guidance and long-stay collection info).

Notes / Safeguards:
- URLs and image/link paths were not changed.
- No access codes were added anywhere. The existing Wi‑Fi SSID/password already present on the homepage and airport page were retained as-is per the brief.
- Selection persists in localStorage and initializes to the browser language if supported, otherwise English.
