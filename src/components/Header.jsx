import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  LifeBuoy
} from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const location = useLocation();

  // Scroll Shadow Effect - MUST be before any conditional returns
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logic to hide Header on Login page - AFTER all hooks
  if (location.pathname === "/login") {
    return null;
  }

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Terms & Policies", path: "/terms" },
  ];

  return (
    <>
      {/* --- HEADER BAR --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b border-gray-100/50
        ${isScrolled ? "bg-white/80 shadow-md backdrop-blur-[100px]" : "bg-white/60 backdrop-blur-[100px]"}`}
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* LEFT: LOGO */}
          <Link to="/" className="flex-shrink-0">
            <img 
                src="https://api.progressivebyte.com/wp-content/uploads/2025/06/download.png" 
                alt="ProgressiveByte Logo" 
                className="h-10 w-auto object-contain"
            />
          </Link>

          {/* MIDDLE: SPACER (To push nav to right) */}
          <div className="hidden md:flex flex-1"></div>

          {/* RIGHT: NAVIGATION & ACTIONS */}
          <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 mr-4">
                {navLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-bold transition-colors uppercase tracking-wide
                    ${location.pathname === link.path 
                        ? "text-[#10b981]" 
                        : "text-gray-500 hover:text-[#10b981]"
                    }`}
                >
                    {link.name}
                </Link>
                ))}
            </nav>


            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-[#10b981] transition-colors"
            >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-xl md:hidden pt-24 px-6 animate-in slide-in-from-top-10">
            <div className="flex flex-col space-y-6 text-center">
                {navLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-bold text-gray-800 hover:text-[#10b981]"
                >
                    {link.name}
                </Link>
                ))}
            </div>
            
            <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 right-4 p-2 bg-gray-100 rounded-full"
            >
                <X className="h-6 w-6 text-gray-600" />
            </button>
        </div>
      )}
    </>
  );
};

export default Header;