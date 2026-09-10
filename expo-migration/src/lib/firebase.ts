import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getDatabase } from '@react-native-firebase/database';
import { getStorage } from '@react-native-firebase/storage';

/**
 * The Firebase singletons. Configuration comes from the native side —
 * `google-services.json` / `GoogleService-Info.plist`, wired up in
 * app.config.ts — so there is nothing to initialise here.
 */
export const firebaseApp = getApp();
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getDatabase(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
