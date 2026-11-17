import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/context";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  );
}
