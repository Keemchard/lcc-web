import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (projectId && clientEmail && privateKey) {
  try {
    let parsedKey = privateKey;
    // Handle JSON-encoded strings (wrapped in quotes)
    if (parsedKey.startsWith('"') && parsedKey.endsWith('"')) {
      parsedKey = JSON.parse(parsedKey);
    }
    // Convert literal \n to actual newlines
    parsedKey = parsedKey.replace(/\\n/g, "\n");

    app =
      getApps().length === 0
        ? initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey: parsedKey,
            }),
          })
        : getApps()[0];
  } catch {
    console.warn("Firebase Admin SDK initialization failed — check FIREBASE_PRIVATE_KEY format");
  }
}

export const adminAuth: Auth | null = app ? getAuth(app) : null;
export const adminDb: Firestore | null = app ? getFirestore(app) : null;
