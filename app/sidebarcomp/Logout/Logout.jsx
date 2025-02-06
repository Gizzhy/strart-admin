import React from "react";
import { getAuth, signOut } from "firebase/auth";
import app from "@/firebaseConfig"; // Your Firebase configuration
import styles from "./logout.module.scss";

const Logout = () => {
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      // Optionally, redirect user after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className={styles.logout}>
        <p>Do you wish to logout from the admin dashboard?</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Logout;
