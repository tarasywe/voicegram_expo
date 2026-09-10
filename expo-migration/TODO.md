Implement each TODO item step by step. 
Request user commit and testing each step before proceed with another.
Mark completed task as done in this document and start with next ready to development

Main features
Application allows user to record, play and manage short audio records, compile then into albums, upload that albums into firebase hosting
If user not auth, the articles, records saved in local file system. If user is auth using Firebise Auth, he can sync it (upload new articles, download previosly created)

Bundle ID for IOS/Android
com.voicegram

STEP 1 — DONE (pending your testing)

1. [x] Setup expo project
   Tech stack described in CLAUDE, meanwhile add support of audio recording (expo-audio), firebase auth, firebase, download/upload files support
   Build should be managed by EAS, as well OTA updates preparation.
   Prepare BUILD file with instruction how to run build on local or remote EAS server.
   Tabs based application. If user not auth profile tab shows login form, otherwise profile data. 
   Implement mocked auth (later will use firebase auth).
   
2. [x] User Experience
   Clean UI/UX - Modern design with Gluestack UI components
   Responsive Layout - Optimized for all screen sizes
   Smooth Animations - Polished transitions using React Native Reanimated
   Keyboard Handling - Proper keyboard avoidance and input management
3. [x] Theme System
   Dark/Light Theme Support - Complete dual-theme implementation with instant switching
   System Theme Detection - Automatically follows device appearance settings
   WCAG AA Compliance - Proper contrast ratios for accessibility in both themes
   Persistent Preferences - Theme selection saved securely using Expo Secure Store
   Professional Design - Banking-appropriate color schemes with cyan/blue accent colors
   Universal Coverage - All screens and components support theme switching
   💡 Accessing Theme Settings: Navigate to the Settings tab in the bottom navigation to choose between Light, Dark, or System (follows device settings) themes.
    main colors for themes is provided in theme.ts, tailwind config file in root, files are copied from another project


4. [x] Setup screens and main logic
   in parent folder of  this project is folder 'voicegram' with old javascript and react-native implementation of application. use it as reference how the logic were work
   in parent folder of this project is folder 'old_app_screens', where old screens is present
   please foolow 'features' based implementation  in folder architecture
   implement screens there but change application main tabs order
   3. [x] first tab - articles
      4. [x] show the list of articles. before user can start record any audio he should create album (article).
      5. [x] user can enter created article. and inside list can create record audio. after time is over (15 sec max) user have to provide the name of recording
      6. [x] if more then 1 records user can change position of records in list by drag and drop it
      7. [x] if user press on record he can see configuration of each record, can listen, can remove it, rename or duplicate. set delay and repeat. can delete it
   4. [x] second tab - profile. contains login if user not auth (mocked auth)
   5. [x] third tab - settings
      6. [x] theme configuration - light / dark / system
      7. [x] use faceid (or fingerprint) for auth
      8. [x] setup pincode for enter
      9. [x] about app page and screen
      10. [x] language profile (preference stored; translations pending)

### Step 1 notes / what to test

- `npm install && npm run prebuild && npm run ios` (or `npm run android`) — Expo Go
  will NOT work, the app needs a dev build (MMKV/Nitro, expo-audio, local auth).
- Gates: `npm run check` and `npm test` are green (48 tests).
- Article settings has a "Make public" toggle — it stores the flag only; publishing
  arrives with Firebase.
- Language screen stores the preference; strings are not translated yet.
- Firebase auth, sync/upload/download, and the old app's "Shared" tab are NOT in
  step 1 — they are the obvious step 2 candidates.

STEP 2 — DONE (pending your testing)

    fixes:
    - [x] when article is playing, show progress of article, also indicate on article using icons that shuffle or loop is enabled

    new features
    [x] implement login and logout to firebase using integration email and password
    [x] integrate project with firebase
    
    test user creds you can test login flow
    // userLogin({ email: 'Email4@gmail.com', password: 'Test1234' }); 
    
    in root there are google service file for connecting to firebase

    [x] check model implementation in old project. after user is logged in read associated articles for account.
    then implement download feature. in old project it is implemented by redux-sagas. here we need to chose async implementation, that track progress of downloading previously implemented article
each article contains data.txt file in root in storage with article configuration.
for logic of downloading check sagas/article/downloadArticle
for uploading check syncArticle in the same file

at the end of this step i need to be able upload article by pressing sync in article and download previously synced articles.
i will see after login my articles on cloud in article screen - they should be marked as not present on device

### Step 2 notes / what to test

Verified live on the iOS simulator against the real Firebase project
(react-native-4823e), signed in as Email4@gmail.com:

- login / logout through Firebase Auth, session restored on relaunch
- the five cloud articles listed under "In your cloud", marked as not on device
- download of "Timer" with live progress, then playback of the downloaded audio
- duplicate x2, then sync -> upload with live progress
- delete locally, re-download: 10 records / 88 KB round-tripped intact

Fix after first testing round:
- Delays were missing from article totals. Two causes, both under-counting:
  the old app wrote `delay`/`repeat` as Picker STRINGS, and the remote schema's
  `z.number()` fell through to `.catch(0)`, zeroing every delay; and the delay
  cap was 60s while the old picker went to 120s. Schema now coerces numbers
  (with a boolean reader that does not read "false" as true) and the cap is 120s
  with a preset ladder. ALREADY-DOWNLOADED ARTICLES KEEP THE ZEROED DELAYS —
  re-download them to pick the real values back up.

Second fix round:
- Playback now survives leaving the article. A module-level engine
  (features/player/lib/playback-engine.ts) owns the audio and timers, and the
  state lives in features/player/store.ts — a hook could not do this, because
  unmounting the screen would kill the run. A gradient now-playing bar sits
  above the article list with name, elapsed/total, pause/resume and stop; stop
  clears the store, which is what makes the bar disappear.
- Pause is a real pause, not a stop: a run paused mid-silence remembers how much
  of the delay was left and resumes from there.

Known gaps:
- ANDROID NEEDS A REBUILD (`npm run prebuild && npm run android`) — RNFirebase
  and expo-build-properties changed native config; only iOS has been verified.
- Recording (mic capture) is still unverified on a real device.
- `deleteRemoteArticle` is implemented but not wired to any UI yet: deleting an
  article removes it locally only, and it reappears under "In your cloud".
- Firebase RTDB/Storage security rules are whatever the old project set; not
  reviewed as part of this step.
