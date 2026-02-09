import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking, true = ok, false = fail

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token"); 
      
      // 1. If no token is found in storage, deny access immediately
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_WP_API_URL || "http://localhost/progressivebyte_terms";
        
        // 2. Validate the token using the specific JWT validation endpoint
        // This endpoint does not require specific user permissions, unlike 'users/me'
        const response = await fetch(`${apiUrl}/wp-json/jwt-auth/v1/token/validate`, {
          method: "POST", // Must be POST for validation
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Token is valid (200 OK)
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired (403/401)
          console.warn("Token validation failed");
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          localStorage.removeItem("userRole");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Session check network error:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  // 3. Show loading spinner while the check is in progress
  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-10 w-10 text-[#10b981]" />
      </div>
    );
  }

  // 4. If authentication failed, redirect to Login
  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // 5. If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;