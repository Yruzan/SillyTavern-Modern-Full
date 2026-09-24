# SillyTavern Modern — prototype 0.1

A new interface on the official SillyTavern codebase. The upstream server,
providers, data formats, character editing, generation pipeline, chat renderer,
slash commands and installed extensions are retained.

Base: SillyTavern release 1.19.0, commit
`06bde939fb1e9c4c8d8641d810f0a916b5bce127`.
Upstream: https://github.com/SillyTavern/SillyTavern

## Install the complete app

Clone the private repository and start it using SillyTavern's normal launcher:

```text
git clone https://github.com/Yruzan/SillyTavern-Modern-Full.git
cd SillyTavern-Modern-Full
npm install
npm start
```

GitHub will ask you to authenticate because the repository is private. On
Windows, you can alternatively clone it with GitHub Desktop and run `Start.bat`.
Open the local address shown by SillyTavern, normally http://localhost:8000.

No provider credentials or user data are included. Existing SillyTavern launch
scripts, Docker support, and command-line entry points are preserved.

## Add only the redesign to another installation

Copy this `modern-tavern` folder to:

`SillyTavern/public/scripts/extensions/third-party/modern-tavern`

Restart SillyTavern and refresh the page. It was validated against SillyTavern
1.19.0; older versions have not been validated. To uninstall, remove only that
folder. Your characters, chats, settings, and other user data are not deleted.

## Access every original feature

Choose **SillyTavern Advanced** (mobile: **More → Settings → Open Settings**).
A floating **Modern Tavern** button returns to the new homepage. CREATE delegates
character/group creation to the existing editors. Persona, lorebook and preset
creation opens the relevant original editor. Existing user data is not migrated.

For a session that starts in the original UI, append `?classic=1` to the local URL.
To uninstall the redesign, remove only its extension folder and refresh. It
never deletes original controls or unregisters another extension.

## Implemented

- Modern dark shell, collapsible desktop sidebar, mobile bottom navigation.
- Homepage, continue chatting, recent chats, favorites and recently visited characters.
- CREATE menu with all seven requested destinations.
- Character grid/list, name/description/tag search, favorites, character details.
- Real native chat with upstream controls and renderer; Focus Mode.
- Search current chat, bookmark excerpts, browse bookmarks in Library.
- Theme Studio: colors, fonts, size, surfaces, radius, spacing, width, avatars,
  wallpaper, opacity, shadows, blur and animation; live preview, save, duplicate,
  reset, validated JSON import/export; optional per-character accents.
- Read-only prompt snapshots from real SillyTavern generation events. Chat
  completion messages retain their actual role/order; text completion retains
  its combined prompt. Token counting uses SillyTavern's tokenizer, labeled as
  the serialized snapshot count rather than an exact provider billing count.
- Original editors available for full cards, World Info, personas, presets,
  all providers, extensions, TTS/STT, image generation, regex and Quick Replies.

## Prototype boundaries

The hosted URL is an interactive frontend preview with explicitly labeled sample
stories. It cannot run the Node.js SillyTavern backend; it does not generate fake
AI replies, collect API keys, or claim to connect to your local server. Preview
character drafts, themes and bookmarks are saved only in that browser. Real chats
and cards use SillyTavern's existing backend in the downloadable app.

World Info and full character authoring still use the original advanced editors.
Advanced settings search, collections, a redesigned branch/tree viewer, model
comparison, gestures and a new provider editor are not implemented in v0.1.
Prompt snapshots are transient and captured after a real generation; they are
not guessed from a fixed conceptual prompt order. The upstream prompt inspector
remains available for deeper provenance and context details.

## Compatibility architecture

All new code is under `public/scripts/extensions/modern-tavern/`:

- `bridge.js`: the only SillyTavern adapter, using `SillyTavern.getContext()` and
  the existing `/api/chats/recent` endpoint.
- `app.js`, `ui.css`: presentation, rendered in Shadow DOM to isolate its styles.
- `native.css`: opt-in native chat styling scoped to `body[data-modern-view]`.
- `index.js`: initialization after APP_READY; the core lifecycle is not blocked.
- `demo.js`: separate, explicitly labeled standalone-preview adapter.
- `webmcp.js`: optional page navigation tool; safely skipped if unsupported.

The original `#chat`, `#send_form`, message nodes, swipes and event handlers are
not reparented, replaced or cloned. Advanced mode removes the styling selector
and exposes the original application. Unknown character-card fields are never
rewritten. Modern settings live under `extensionSettings.modern_tavern`; native
favorites remain readable, while Modern's favorite overrides are namespaced.
Prompt observers clone data and do not modify the generation payload.

Potential conflicts with arbitrary third-party UI extensions and future upstream
DOM changes remain possible. The full integration matrix is not certified;
use Advanced for an incompatible layout. No real provider generation, TTS/STT,
or image integration has been tested without configured services.

## License and attribution

SillyTavern and this derivative are distributed under AGPL-3.0; see LICENSE.
Upstream notices and source are included. Seraphina and scenery in the preview
come from SillyTavern's default content, with upstream credits retained.
Seraphina is credited upstream to @OtisAlejandro. Sample scene names and opening
text in `demo.js` are new demonstration content, not the user's chat history.
The complete corresponding source is downloadable alongside the hosted preview.
