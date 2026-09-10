# Building & shipping Voicegram

Bundle id (both platforms): **`com.voicegram`**

Everything below assumes Node 20 and `npm install` has been run once. The repo
pins `legacy-peer-deps=true` in `.npmrc` — Expo SDK 57 + React 19.2 still has a
couple of unresolved peer ranges upstream, so keep that file.

---

## 1. Local development

The app uses native modules that Expo Go does not contain (MMKV/Nitro,
`expo-audio` recording, local authentication), so you need a **development
build** rather than Expo Go.

```bash
npm install
npm run prebuild        # generates ios/ and android/ from app.config.ts
npm run ios             # or: npm run android
```

`npm run prebuild` is destructive (`--clean`): `ios/` and `android/` are
generated output and are not committed. Re-run it whenever `app.config.ts` or a
config plugin changes.

Once a dev build is installed on the device or simulator:

```bash
npm start               # Metro, targeting the dev client
```

Quality gates — both must be green before anything is called done:

```bash
npm run check           # biome ci + typecheck
npm test
```

---

## 2. First-time EAS setup

Done once per Expo account, by whoever owns the project.

```bash
npm i -g eas-cli        # or rely on the npx form used in package.json scripts
npx eas-cli@latest login
npx eas-cli@latest init          # creates the project, prints its project id
```

Put the printed id in your environment (and in EAS project secrets for CI) —
`app.config.ts` reads it and only then enables OTA updates:

```bash
export EXPO_PUBLIC_EAS_PROJECT_ID=<the id from eas init>
```

Without it the app still builds and runs; `updates.enabled` is simply `false`.

Credentials (iOS certificates, Android keystore) are managed by EAS the first
time you run a build for that platform — answer the prompts once and they are
stored in the project.

---

## 3. Remote builds (EAS Build servers)

Profiles live in `eas.json`.

| Profile              | Distribution | Channel     | Output                    |
| -------------------- | ------------ | ----------- | ------------------------- |
| `development`        | internal     | development | dev client, iOS simulator |
| `development:device` | internal     | development | dev client, real device   |
| `preview`            | internal     | preview     | installable apk / ipa     |
| `production`         | store        | production  | aab / ipa for the stores  |

```bash
npm run build:dev       # both platforms, development profile
npm run build:preview
npm run build:prod
```

Or per platform:

```bash
npx eas-cli@latest build --platform ios     --profile preview
npx eas-cli@latest build --platform android --profile preview
```

Builds run on Expo's servers; the CLI prints a URL to watch and to download the
artifact when it finishes.

---

## 4. Local builds (your own machine)

Same profiles, compiled locally. Requires the platform toolchain: Xcode 16+ for
iOS, JDK 17 + Android SDK for Android.

```bash
npm run build:local:ios
npm run build:local:android
```

The artifact is written to the project root (`build-*.ipa` / `build-*.apk`).
Local builds still read credentials from EAS unless you pass
`--local --output ... --non-interactive` with your own credentials configured.

---

## 5. OTA updates

`runtimeVersion` uses the `appVersion` policy: an update only reaches clients
whose native build has the same `version` in `app.config.ts`. Bump `version`
whenever you change native code or dependencies, and ship a new binary — an OTA
cannot deliver native changes.

```bash
npm run update:preview      # publishes to the preview branch
npm run update:prod         # publishes to the production branch
```

Branches map to the channels set in `eas.json`, so a `production` build picks up
whatever the `production` branch points at. To roll back, republish an older
update or use `npx eas-cli@latest update:rollback`.

---

## 6. The SDK is pinned to 57.0.4 — do not "upgrade" it casually

**Every Expo package in `package.json` is pinned to an exact version, and
`overrides` pins the transitive ones. This is deliberate.** Undoing it breaks
the local iOS build.

### Why

Expo SDK 57.0.5+ cannot be built by Xcode 26.2 (Swift 6.2.3). The blocker is
`expo-modules-jsi`, the one Expo module written in Swift 6 language mode with
C++/Swift interop:

- **57.0.5 and later** annotate `RuntimeScheduler`'s *constructors* with
  `SWIFT_RETURNS_RETAINED`. Upstream added that to fix a prebuild failure under
  **Xcode 27**; Swift 6.2 rejects it ("not returning a SWIFT_SHARED_REFERENCE
  type").
- **57.1.0** additionally pairs with `expo-modules-core@57.0.17`, which brings
  Swift 6 strict-concurrency errors (`sending 'x' risks causing data races`).

Xcode 26.2 sits in a gap: too new for the older code, too old for the Xcode-27
annotation.

`expo-modules-jsi@57.0.1` is the last version clear of both — it has no
constructor annotation and predates `JavaScriptCodable+Date.swift` (whose
`abs()` call is ambiguous under newer toolchains). **No source patches are
needed at this pin; `node_modules` stays pristine.**

### The pinned set

`expo@57.0.4`, plus every `expo-*` dependency pinned to the version that was
current when 57.0.4 was published (2026-07-07), plus `overrides` for the
transitive ones — notably:

| package | pin |
| ------- | --- |
| expo | 57.0.4 |
| expo-modules-core | 57.0.3 |
| expo-modules-jsi | 57.0.1 |
| @expo/ui | 57.0.4 |
| expo-router | 57.0.4 |
| expo-file-system | 57.0.0 |

Ranges are not enough: `~57.0.4` means `>=57.0.4 <57.1.0`, which resolves to
57.0.21 today. Only exact pins hold.

### Rules

1. **Never run `npx expo install --fix`.** It drags `expo` back to the latest
   57.0.x and breaks the build. (It also fails halfway, leaving a mixed tree.)
2. **All Expo modules must move together.** They link against
   `ExpoModulesCore` as a binary framework, so a mismatched one fails at launch
   with a dyld error, not at compile time. The symptom looks like:
   `Symbol not found: _$s15ExpoModulesCore10BaseModuleC11willDestroyyyFTj,
   Referenced from: ExpoFileSystem.framework`. That means some module is newer
   than `expo-modules-core@57.0.3`.
3. **`react-native` and friends are pinned too** (`0.86.0`, reanimated `4.5.0`,
   worklets `0.10.0`, screens `4.25.2`, nitro `0.36.1`) to match.
4. `src/theme/navigation-theme.ts` derives its theme type from
   `ComponentProps<typeof ThemeProvider>` because `expo-router@57.0.4` does not
   export `Theme` yet. Leave it that way.

### When to unpin

Once **any** of these is true, drop the pins and run `npx expo install --fix`:

- Expo publishes an `expo-modules-jsi` that builds under Swift 6.2.x.
- You move to **Xcode 27** (what 57.1.0 was patched for) or **Xcode 16.x**
  (what SDK 57 was developed against). Either makes the pins unnecessary.

To unpin: replace the exact versions with `~`/`^` ranges, delete `overrides`,
`rm -rf node_modules package-lock.json && npm install`, then
`npm run prebuild && npm run ios`.

Android is unaffected by all of this and builds at any of these versions.

## 7. What is not wired up yet

- **Firebase** (auth, storage, hosting). Auth is mocked in
  `src/features/auth/api/mock-auth.ts`; swapping it out touches
  `mutations.ts` and `endpoints.ts` only. The RNFirebase config plugin is
  deliberately absent — it throws at `expo prebuild` when
  `googleServicesFile` is missing.
- **Store submission** (`eas submit`). The `submit.production` profile in
  `eas.json` is an empty placeholder until App Store Connect / Play Console
  accounts exist.
