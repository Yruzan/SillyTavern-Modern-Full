# Modern Tavern 0.3

- Advanced has a clearly labeled Back to Modern UI button. On current browsers it uses a manual popover, escaping transformed ancestors and native drawer stacking. It has a 44px touch target and safe-area spacing; mobile places it above the composer.
- Create Character and the character library now offer Import Character in Modern UI. Multi-file imports use SillyTavern's original API for PNG, JSON, YAML/YML, CHARX and BYAF. Tag handling is explicitly selectable. Failed files are reported individually; successful imports remain available.
- Generation blocks imports, matching the native importer. Existing cards are not overwritten. No data formats or backend routes were replaced.
- GitHub maintenance workflows use the repository token when the upstream bot App ID is absent. Issue extraction checks the full history and accepts commits without issue references.
- A separate GitHub workflow runs Modern lint, bridge regression tests and the isolated server integration test.

Validation: ESLint and bridge regression passed. Real server tests passed for create/edit, JSON/PNG import and readback, embedded lore/extension metadata, alternate greetings, duplicate-safe filenames, malformed file rejection and generation blocking with CSRF enabled.

Visual device testing remains outstanding: the cloud browser cannot reach this workspace's local server. Do not treat automated API checks as confirmation of portrait, landscape, keyboard, or 2246x1080 rendering. Editors not yet redesigned are still accessible in Advanced.

Update an existing clone with `git pull --ff-only`, restart SillyTavern, then reload the browser. The previous commit can be restored with a normal Git revert if necessary.
