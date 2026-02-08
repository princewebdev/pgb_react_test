import { Ship, BookOpen, ExternalLink, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    // Updated container with responsive padding and overflow handling
    <div className="min-h-screen w-full bg-[#FDFDFD] flex flex-col items-center justify-center p-4 pt-28 pb-12 md:pt-40 md:pb-20 overflow-y-auto">
      
      <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0a0a0a]">
          Employee Portal
        </h1>
        <p className="text-gray-500 text-base md:text-lg">Select where you want to go</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl w-full">
        
        {/* Card 1: Leave Request (WP Admin) */}
        <a 
          href={`${import.meta.env.VITE_WP_API_URL || "http://localhost/progressivebyte_terms"}/wp-admin/admin.php?page=pgb-leave-request`}
          className="group block h-full"
        >
          <Card className="h-full p-6 md:p-8 rounded-3xl border-2 border-gray-100 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/10 transition-all cursor-pointer bg-white group-hover:-translate-y-1 flex flex-col">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <Ship className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#0a0a0a] mb-2 md:mb-3 group-hover:text-blue-600 transition-colors">
              Leave Request
            </h2>
            <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 leading-relaxed flex-grow">
              Apply for leaves, check your holiday status, and manage your attendance via the dashboard.
            </p>
            <div className="flex items-center gap-2 font-bold text-sm md:text-base text-blue-600 group-hover:text-blue-700 mt-auto">
              GO TO DASHBOARD <ExternalLink className="h-4 w-4" />
            </div>
          </Card>
        </a>

        {/* Card 2: Knowledge Base (Internal) */}
        <Link to="/terms" className="group block h-full">
          <Card className="h-full p-6 md:p-8 rounded-3xl border-2 border-gray-100 hover:border-[#10b981] hover:shadow-xl hover:shadow-[#10b981]/10 transition-all cursor-pointer bg-white group-hover:-translate-y-1 flex flex-col">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 text-[#10b981] rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#0a0a0a] mb-2 md:mb-3 group-hover:text-[#10b981] transition-colors">
              Terms & Policies
            </h2>
            <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 leading-relaxed flex-grow">
              Read company policies, employment terms, onboarding guides, and documentation.
            </p>
            <div className="flex items-center gap-2 font-bold text-sm md:text-base text-[#10b981] mt-auto">
              VIEW DOCS <ChevronRight className="h-4 w-4" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Home;