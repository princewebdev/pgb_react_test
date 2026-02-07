import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, true = ok, false = fail
  const token = localStorage.getItem("token"); // or sessionStorage

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Send a request to a lightweight WP endpoint (e.g., users/me)
        const response = await fetch("http://localhost/progressivebyte_terms/wp-json/wp/v2/users/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token exists but is expired or invalid (401/403)
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Session check failed", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, [token]);

  // Show loader while checking
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-[#10b981]" />
      </div>
    );
  }

  // Check finished, if false redirect to login
  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the page
  return children;
};

export default ProtectedRoute;