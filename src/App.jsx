import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TermsLanding from "./pages/TermsLanding";
import Documentation from "./pages/Documentation";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header"; // Import the Header component

function App() {
  return (
    <BrowserRouter>
      {/* Header is placed here so it renders on all pages.
         The Header component itself checks the location and returns null if on /login 
      */}
      <Header />

      <Routes>
        {/* Public Route: Login */}
        <Route path="/login" element={<Login />} />

        {/* Private Route: Home Page (Dashboard Card View) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Private Route: Terms Landing (Knowledge Base Category Grid) */}
        <Route
          path="/terms"
          element={
            <ProtectedRoute>
              <TermsLanding />
            </ProtectedRoute>
          }
        />

        {/* Private Route: Documentation Detail (Article View) */}
        <Route
          path="/docs"
          element={
            <ProtectedRoute>
              <Documentation />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: Redirect unknown routes to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;