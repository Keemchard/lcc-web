import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, getUserRole } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const decoded = await verifyToken(session);
    if (!decoded) {
      return NextResponse.json({ user: null });
    }

    const role = await getUserRole(decoded.uid);
    if (!role) {
      return NextResponse.json({ user: null });
    }

    if (!adminDb) {
      return NextResponse.json({ user: null });
    }

    const userSnap = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();
    const userData = userSnap.data();

    return NextResponse.json({
      user: {
        uid: decoded.uid,
        email: userData?.email || decoded.email,
        displayName: userData?.displayName || "",
        role,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
