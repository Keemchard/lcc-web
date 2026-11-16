import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;

function parsePrivateKey(key: string): string {
  let parsed = key;
  // Strip surrounding quotes if present
  if (parsed.startsWith('"') && parsed.endsWith('"')) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      parsed = parsed.slice(1, -1);
    }
  }
  // Convert literal \n to actual newlines
  parsed = parsed.replace(/\\n/g, "\n");
  return parsed;
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (serviceAccountJson || (projectId && clientEmail && privateKey)) {
  try {
    if (getApps().length === 0) {
      if (serviceAccountJson) {
        const serviceAccount = JSON.parse(serviceAccountJson);
        app = initializeApp({ credential: cert(serviceAccount) });
      } else {
        app = initializeApp({
          credential: cert({
            projectId: projectId!,
            clientEmail: clientEmail!,
            privateKey: parsePrivateKey(privateKey!),
          }),
        });
      }
    } else {
      app = getApps()[0];
    }
  } catch (e) {
    console.warn("Firebase Admin SDK initialization failed:", e);
  }
}

export const adminAuth: Auth | null = app ? getAuth(app) : null;
export const adminDb: Firestore | null = app ? getFirestore(app) : null;
