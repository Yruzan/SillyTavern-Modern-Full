# Modern Tavern 0.2 update

- Responsive shell uses a defined containing block and dynamic viewport height.
- Opt-in styles remove the upstream root transform while Modern is active;
  Advanced restores the original selector behavior.
- Narrow screens wrap action rows, use a single-column hero, and reserve safe-area
  space for mobile navigation. Recent chats are no longer hidden at tablet widths.
- Character creation and editing use Modern forms and native SillyTavern routes.
- Partial card edits preserve unrelated extension fields and embedded lore.
- Settings provides the existing live appearance controls directly in Modern.
- CREATE destinations awaiting redesign explicitly offer Advanced instead of
  switching without explanation. This is not a completed redesign of every editor.

## Validation

Passed: JavaScript syntax, ESLint, diff whitespace, adapter regression tests,
and a real server integration test with a disposable data root and CSRF enabled.
The integration test creates a character, edits and reads it back, verifies
unrelated creator/extension fields remain, and clears alternate greetings.

Commands:

```sh
node --test modern-tools/bridge-regression.test.mjs
node modern-tools/card-integration.test.mjs
```

Visual testing for this revision is NOT complete: the available cloud browser
cannot access the local test server (ERR_BLOCKED_BY_CLIENT). Physical 2246x1080
devices, their CSS viewports, keyboard opening and orientation changes need
follow-up visual verification. Existing prototype screenshots are not evidence
for this revision. Provider generation and third-party extension combinations
are also not certified by these tests.

## Update and recovery

Stop the app, run `git pull --ff-only` on `release`, then restart and refresh the
browser. No data migration is performed. The change is a single GitHub commit;
it can be reverted with `git revert <update-commit>` if needed. Avoid hard resets
or replacing your data folder.
