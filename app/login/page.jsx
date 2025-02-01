"use client";

import React from "react";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./styles/login.module.scss";
import logo from "../../assets/strart2.png";
import app from "../../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.loginbody}>
        <div className={styles.loginArea}>
          <div className={styles.loginHead}>
            <Image src={logo} alt="strart" className={styles.logo} />
            <p className={styles.create}>Login</p>
          </div>
          <div className={styles.formBody}>
            <form onSubmit={handleLogin} className={styles.form}>
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? <div className={styles.loader}></div> : "Login"}
              </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
