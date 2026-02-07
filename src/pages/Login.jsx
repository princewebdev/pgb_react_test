import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  // --- LOGIC: GUEST GUARD START ---
  // If user is already logged in, redirect them away from login page
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole"); 

    if (token) {
      if (userRole && userRole.includes("administrator")) {
        window.location.href = "http://api-terms.progressivebyte.com/";
      } else {
        navigate("/terms");
      }
    }
  }, [navigate]);
  // --- LOGIC: GUEST GUARD END ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost/progressivebyte_terms/wp-json/jwt-auth/v1/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Important for WP Session Cookie
          body: JSON.stringify({
            username: userName,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Force a clean English error message instead of using data.message (which has HTML)
        throw new Error("Username and password do not match.");
      }

      if (data.token) {
        // Save session data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user_display_name);
        
        // IMPORTANT: Save role to localStorage for future checks
        if (data.user_role) {
            localStorage.setItem("userRole", JSON.stringify(data.user_role));
        }

        // Redirect Logic
        if (data.user_role && data.user_role.includes("administrator")) {
          window.location.href = "http://api-terms.progressivebyte.com/";
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 py-8 relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#10b981] opacity-5 blur-[100px] rounded-full"></div>
      
      <Card className="w-full max-w-md shadow-2xl border-gray-100 rounded-3xl relative z-10">
        <CardHeader className="text-center space-y-2 pb-6 pt-10">
          <div>
            <img className="m-auto" src="https://api.progressivebyte.com/wp-content/uploads/2025/06/download.png" alt="Progressive Byte Logo" />
          </div>
          <CardTitle className="text-3xl font-black text-[#0a0a0a] tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-gray-500 font-medium">
            Login to your Progressive Byte account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded shadow-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="font-bold text-[#0a0a0a]">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                className="py-6 rounded-xl border-gray-200 focus-visible:ring-[#10b981]"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password font-bold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="py-6 rounded-xl pr-12 border-gray-200 focus-visible:ring-[#10b981]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#10b981] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 pb-10">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-7 bg-[#10b981] hover:bg-[#0da06f] text-[#0a0a0a] font-black text-lg rounded-xl shadow-lg shadow-[#10b981]/20 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#0a0a0a]" /> VERIFYING...
                </>
              ) : "LOGIN"}
            </Button>
            
            <p className="text-sm font-bold text-gray-400 text-center">
              By logging in, you agree to our{" "}
              <Link to="/terms" className="text-[#10b981] hover:underline transition-colors">
                Terms & Conditions
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;