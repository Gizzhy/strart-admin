"use client"; // Ensure this is treated as a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/firebaseConfig";

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false);
          router.push("/login"); // Redirect to login if not authenticated
        }
        setIsLoading(false); // Stop loading when auth check completes
      });

      return () => unsubscribe(); // Cleanup listener on unmount
    }, [auth, router]);

    // Show a loading state while checking authentication
    if (isLoading) {
      return <p>Loading...</p>;
    }

    // Render the protected component if authenticated
    if (isAuthenticated) {
      return <Component {...props} />;
    }

    return null; // Prevent rendering if not authenticated
  };
}
