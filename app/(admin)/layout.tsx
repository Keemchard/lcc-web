import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, getUserRole } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import SessionGuard from "@/components/AdminSidebar/SessionGuard";
import { AuthProvider } from "@/lib/auth/context";
import styles from "./Admin.module.scss";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session || !adminDb) redirect("/login");

  const decoded = await verifyToken(session);
  if (!decoded) redirect("/login");

  const role = await getUserRole(decoded.uid);
  if (role !== "admin" && role !== "supreme_admin") redirect("/login");

  const userSnap = await adminDb.collection("users").doc(decoded.uid).get();
  const userData = userSnap.data();

  const adminUser = {
    uid: decoded.uid,
    email: userData?.email || decoded.email || "",
    role: role!,
  };

  return (
    <AuthProvider>
      <div className={styles.adminLayout}>
        <SessionGuard />
        <AdminSidebar user={adminUser} />
        <main className={styles.adminContent}>{children}</main>
      </div>
    </AuthProvider>
  );
}
