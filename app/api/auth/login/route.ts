import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: "Firebase not configured" },
        { status: 500 }
      );
    }

    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json(
        { error: "Missing ID token" },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email || "";

    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { error: "No account found. Please sign up first." },
        { status: 404 }
      );
    }

    let role = userSnap.data()?.role;

    const supremeEmail = process.env.SUPREME_ADMIN_EMAIL;
    if (
      supremeEmail &&
      email.toLowerCase() === supremeEmail.toLowerCase() &&
      role !== "supreme_admin"
    ) {
      const existingSupreme = await adminDb
        .collection("users")
        .where("role", "==", "supreme_admin")
        .limit(1)
        .get();

      if (existingSupreme.empty) {
        await userRef.update({
          role: "supreme_admin",
          approvedAt: new Date(),
        });
        role = "supreme_admin";
      }
    }

    if (role === "pending") {
      return NextResponse.json(
        { error: "Your account is pending approval by an admin." },
        { status: 403 }
      );
    }

    if (role !== "admin" && role !== "supreme_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const cookieStore = await cookies();
    cookieStore.set("session", idToken, {
      maxAge: 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      user: {
        email: userSnap.data()?.email,
        displayName: userSnap.data()?.displayName,
        role,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
