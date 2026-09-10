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

STEP 2 (to be provided)
    