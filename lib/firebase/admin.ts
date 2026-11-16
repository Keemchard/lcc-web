import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;

function getServiceAccount() {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!base64) return null;

  try {
    // Try base64 decode first
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (parsed.project_id && parsed.private_key) return parsed;
  } catch {}

  try {
    // Fall back to raw JSON
    const parsed = JSON.parse(base64);
    if (parsed.project_id && parsed.private_key) return parsed;
  } catch {}

  return null;
}

const serviceAccount = getServiceAccount();

if (serviceAccount) {
  try {
    app =
      getApps().length === 0
        ? initializeApp({ credential: cert(serviceAccount) })
        : getApps()[0];
  } catch (e) {
    console.warn("Firebase Admin SDK initialization failed:", e);
  }
}

export const adminAuth: Auth | null = app ? getAuth(app) : null;
export const adminDb: Firestore | null = app ? getFirestore(app) : null;
