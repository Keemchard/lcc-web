"use client";

import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import styles from "./Signup.module.scss";

const SignupForm: FC = () => {
  const { signup } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (displayName.trim().length < 2) {
      setError("Full name must be at least 2 characters");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    setLoading(true);

    const result = await signup(email, password, displayName);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <Link href="/" className={styles.homeButton}>
          ← Back to Home
        </Link>
        <div className={styles.card}>
          <h2 className={styles.title}>Account Created</h2>
          <p className={styles.successMessage}>
            Your account has been created and is pending approval by an admin.
            You will be able to log in once your account is approved.
          </p>
          <a href="/login" className={styles.backLink}>
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.homeButton}>
        ← Back to Home
      </Link>
      <div className={styles.card}>
        <h2 className={styles.title}>Create account</h2>
        <p className={styles.subtitle}>Request access to the LCC admin panel</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="displayName">Full Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

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
              minLength={8}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
