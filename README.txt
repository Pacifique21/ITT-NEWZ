ITT NEWS — STARTER WEBSITE
==========================

This is the first front-end version of ITT NEWS. It is responsive and includes:
- News section and categories
- Sports section for all sports
- Rwanda radio directory area
- Movies area with Free and Premium filters
- Language selector for 12 languages
- PWA manifest and offline shell caching
- Search UI

IMPORTANT: This package is a working website shell, not a fully connected live media service yet.
No fake current headlines, fake radio streams, unauthorized sports broadcasts, or pirated films are included.

WHAT MUST BE CONNECTED FOR REAL LIVE CONTENT
1. News: verified RSS feeds or a licensed news API. Respect publisher terms and link to original articles.
2. Sports: a licensed sports-data provider for fixtures/scores. For live video, use official broadcaster/player embeds or authorized links only.
3. Radio: official stream URLs supplied by each radio station.
4. Movies: films you own, have licensed, or are explicitly authorized to stream. Premium access needs a secure backend, user accounts and a trusted payment provider.
5. AI translation: a secure backend endpoint. Keep all AI/API keys as Cloudflare Worker Secrets; NEVER put keys in index.html, app.js or config.js.

DEPLOY TO CLOUDFLARE PAGES
1. Extract this ZIP on your computer.
2. Open Cloudflare Dashboard > Workers & Pages > Create > Pages > Upload assets.
3. Upload the extracted folder contents (index.html must be at the root).
4. Deploy and open the provided pages.dev URL.
5. Add a custom domain later from the Pages project > Custom domains.

PWA NOTE
The site includes a web manifest and service worker file. Register sw.js from app.js or add:
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'));
This starter's UI is designed to be extended after the content APIs are selected.

SECURITY / BILLING
- Never share API keys in chat or place them in public browser code.
- Any paid APIs, domain purchases, movie licences or subscriptions should be reviewed and handled with a trusted adult.
- Do not collect card details directly. Use a reputable payment provider and secure server-side verification.

NEXT DEVELOPMENT STEP
Choose verified news feeds, official radio stream URLs, a sports-data provider, and licensed movie catalogue. Then build Cloudflare Pages Functions/Workers endpoints to fetch and normalize content securely.
