# Project Instructions for AI Agents

## Stack

Expo SDK 57 · React 19.2 + React Compiler · Expo Router v6 · gluestack-ui v5
(UniWind/Tailwind v4) · Zustand · React Query v5 · Axios · zod · MMKV (v4,
createMMKV factory, + react-native-nitro-modules) · Biome · strict TS · Npm
package manager · @types/node (devDep, app.config.ts reads process.env / fs) ·
react-native-keyboard-controller (wrapped in KeyboardProvider in the root
layout; requires react-native-reanimated)

Audio & device: expo-audio (record + play) · expo-file-system (new File /
Directory / Paths API) · expo-secure-store (MMKV key, app PIN) ·
expo-local-authentication (Face ID / fingerprint) · expo-crypto (random bytes —
React Native has no WebCrypto global) · expo-haptics · expo-localization ·
expo-updates (OTA) · expo-dev-client · expo-system-ui (userInterfaceStyle on
Android) · expo-asset · expo-font

UI & interaction: react-native-gesture-handler · react-native-reanimated ·
react-native-draglist (record reordering) · react-native-svg · react-dom and
react-native-web (required on native by gluestack v5's react-aria dependency)

Tooling: jest + jest-expo + @testing-library/react-native · EAS (`npx
eas-cli@latest`, never a local dependency — see BUILD.md)

## Non-negotiable rules

1. Route files in src/app/ are ≤15 lines: import screen from a feature, export it.
2. Features import other features ONLY via their index.ts. Architecture check is
   planned (gen:arch / arch:check scripts not yet scaffolded).
3. Server data → React Query. Client state → Zustand. Screen-local → useState. Never mix.
4. Every API response is parsed with zod in features/\*/types before use. No `any`.
5. Do NOT write useMemo/useCallback/React.memo — React Compiler handles it.
6. Do NOT hand-edit src/components/ui/\*\* — regenerate via `npx gluestack-ui@latest add <component>`.
   `npm run typecheck` filters diagnostics from that directory (see scripts/typecheck.mjs).
7. Styling: UniWind className only. No StyleSheet.create, no inline style objects.
8. No new dependencies without updating this file's Stack section.
9. Layout differences use Tailwind breakpoints (md:, lg:), never Platform.OS.
10. Navigation paths come from src/config/links.ts, never hardcoded strings.

## Code culture (every session)

1. **Single responsibility per file.** endpoints.ts = URLs. queries.ts = reads. mutations.ts = writes. store.ts = client-only state. types/*.ts = zod + inferred types. If a second concern appears, split the file.
2. **CLI first, always.** Before hand-writing a feature/screen/hook/component, check for the matching `npx run gen:*` command (generator scripts pending). Reach for the generator before reaching for the keyboard.
3. **Aliases only for cross-cuts.** `@/lib`, `@/components/shared`, `@/utils`, `@/config`, `@/stores`, `@/theme`, `@features/<x>`, `@ui/*`, `@/assets`. Relative imports are intra-feature only. No deep `../../..`.
4. **Typing, linting, validation are the gate, not a hope.** Every API response is zod-parsed at the boundary. `npm run check` (biome ci . && scripts/typecheck.mjs) and `npm test` must be green before you say "done".
5. **React Compiler owns memoization.** Never write useMemo / useCallback / React.memo.
6. **Explicit public APIs.** A feature's index.ts is a deliberate allowlist, never `export *`.
7. **Every feature ships with mocks + tests + edge cases.** No feature is "done" without the negative-testing contract (template §11) covered.
8. **Clean / testable / extensible by construction.** Small files, one job each, named exports, no `any`, no `console` (warn/error only), no hardcoded route strings (use links.ts).
9. 
## Figma workflow

When given a Figma link: fetch the node via the Figma MCP server, then map
design elements to EXISTING gluestack-ui components in src/components/ui.
Match colors/spacing to Tailwind tokens in global.css — never hex literals.
If a needed component is missing, run `npx gluestack-ui@latest add <name>` first.


## Deviations from RN_PROJECT_TEMPLATE.md (record)

- **Routes dir:** src/app/ (Expo Router modern default), not root app/. Functionally identical.
- **Firebase / push (RNFirebase + googleServicesFile):** DEFERRED. The plugin throws at
  `expo prebuild` when the googleServicesFile plist/json is absent. Re-add per template §14 step 6
  when a Firebase project + creds exist.
- **react-native-mmkv v4** (not v3): use `createMMKV({ id, encryptionKey? })` factory, and `remove()`
  (not `delete()`) in the zustand adapter.
- **MMKV encryption key:** per-device key in the Keychain/Keystore via src/lib/device-key.ts
  (expo-secure-store), NOT a build-time EXPO_PUBLIC_MMKV_KEY var.
- **TS strict flags:** `verbatimModuleSyntax` is OFF (gluestack v5 alpha ships type-only imports
  without `import type`, pulled in transitively). Re-enable once gluestack v5 stabilizes.
- **gluestack-ui v5** — generated components do not typecheck cleanly against RN 0.86 /
  reanimated 4. `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are therefore OFF,
  and `npm run typecheck` runs `scripts/typecheck.mjs`, which drops the remaining four
  diagnostics that originate inside src/components/ui. Everything else is checked strictly.
  Delete the script and restore the flags once gluestack v5 typechecks cleanly.
- **gluestack component API gaps:** Avatar, Input and Heading have no `size` prop in this
  release, and Button's `size` stops at `lg`. Size them with UniWind classes (`h-14`, `text-2xl`).
- **Design tokens:** the palette from the original `theme.ts` now lives in `src/global.css`
  as UniWind `@variant light` / `@variant dark` blocks — that file is the single source of
  truth. `src/theme/palette.ts` is a hand-kept JS mirror used ONLY by the react-navigation
  header and tab bar, which cannot take a className. The Tailwind v3 `tailwind.config.js`
  that shipped with the old palette was removed (UniWind is Tailwind v4, CSS-configured).
- **global.css location:** `src/global.css`, referenced by `metro.config.js` (`cssEntryFile`)
  so that the `@/*` alias resolves it.
- **Biome, not ESLint/Prettier.** `noDuplicateCustomProperties` is off for CSS — it does not
  understand Tailwind v4 `@variant` blocks.
- **`.npmrc` pins `legacy-peer-deps=true`** — expo-router's radix/vaul chain still declares
  React 19.0 peers. Removing it breaks `npm install`.
- **The Expo SDK is pinned to 57.0.4, exactly.** Every `expo-*` dependency has an exact
  version and `overrides` pins the transitive ones (`expo-modules-core@57.0.3`,
  `expo-modules-jsi@57.0.1`, `@expo/ui@57.0.4`). Reason: SDK 57.0.5+ cannot be compiled by
  Xcode 26.2 / Swift 6.2.3. **Never run `npx expo install --fix`** — it undoes the pins and
  breaks the iOS build. All Expo modules must move together; a mismatched one fails at
  *launch* with a dyld `Symbol not found: ...ExpoModulesCore...` error, not at compile time.
  Ranges do not work (`~57.0.4` resolves to 57.0.21). Full rationale and the unpin
  procedure: BUILD.md §6.
- **`expo-router@57.0.4` does not export the `Theme` type** — `src/theme/navigation-theme.ts`
  derives it from `ComponentProps<typeof ThemeProvider>`. Leave it that way while pinned.
- **`newArchEnabled` / `edgeToEdgeEnabled`** are not set in app.config.ts: both are always-on
  in SDK 57 and are no longer part of the `ExpoConfig` type.

## Project map

```
src/app/                    routes only (≤15 lines each)
src/components/layout/      root layout, tabs layout, not-found
src/components/shared/      app design system (Screen, SettingsRow, dialogs, FAB, icons)
src/components/ui/          gluestack-ui v5 output — GENERATED, never hand-edited
src/config/                 constants.ts (limits), links.ts (routes)
src/features/articles/      library store + article screens; owns the Article/AudioRecord types
src/features/records/       records-inside-an-article screens (list, reorder, per-record settings)
src/features/recorder/      capture flow (useClipRecorder, RecordingSheet)
src/features/player/        playback sequencing (buildQueue, useArticlePlayer, useRecordPreview)
src/features/auth/          Firebase email/password auth + profile tab
src/features/security/      PIN + biometrics + the lock gate
src/features/settings/      settings hub, appearance, language, about
src/features/sync/          Firebase cloud sync: remote reads, upload, download
src/stores/                 shared client state (library, auth) — see below
src/lib/                    storage (MMKV), device-key, audio-files (FS), query-client, firebase
src/theme/                  theme store, ThemeProvider, navigation theme, palette mirror
src/utils/                  format, id, array
```

Audio files live at `documents/articles/<articleId>/<recordId>.m4a`; the metadata
that points at them is persisted to MMKV by `src/features/articles/store.ts`.

### Why `src/stores/` exists

`library.ts` and `auth.ts` live there, not inside their features, because a
second feature writes to / reads them: `sync` needs the library and the uid.
Putting them in the feature would make `articles`/`auth` and `sync` import each
other in a cycle. Rule: **client state that more than one feature touches goes
in `@/stores`.** `sync` imports `@features/articles` type-only, and never
imports `@features/auth`.

### Firebase

Native SDK (`@react-native-firebase`), configured from `google-services.json` /
`GoogleService-Info.plist` in the repo root. `ios: { disableSPM: true }` on the
app plugin is required: firebase-ios-sdk's SPM products are static libraries, so
under `useFrameworks: 'static'` each RNFirebase pod embeds its own copy and they
collide at link time.

The remote schema is inherited from the original app and must not be renamed —
articles synced by it still download. RTDB `users/{uid}/articles/{aid}`,
`articles/{aid}/records/{rid}`, `records/{rid}`; Storage
`{uid}/{aid}/records/{rid}`. **The article write replaces the whole row**, so
`toRemoteArticle` must emit every field the remote shape carries (`shared`
included) or flags get silently cleared.

## MAIN FUNCTIONALITY

- read TODO.md for detailed implementation
- read BUILD.md for local / EAS builds and OTA updates
