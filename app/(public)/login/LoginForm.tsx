"use client";

import { FC, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import styles from "./Login.module.scss";
import Link from "next/link";

import Image from "next/image";

const LoginForm: FC = () => {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);

    const result = await loginWithGoogle();
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.homeButton}>
        ← Back to Home
      </Link>
      <div className={styles.card}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Image
            src="/images/lcc-logo-icon.png"
            alt="LCC"
            width={48}
            height={48}
          />
        </div>
        <h2 className={styles.title}>Sign in</h2>
        <p className={styles.subtitle}>Livingwater Community Church admin</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button
          onClick={handleGoogle}
          className={styles.googleButton}
          disabled={loading}
        >
          Sign in with Google
        </button>

        <p className={styles.signupLink}>
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
