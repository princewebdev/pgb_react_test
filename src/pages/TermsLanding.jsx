import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  FolderOpen,
  FileText,
  ChevronRight,
  Loader2,
  X,
  ArrowLeft
} from "lucide-react";

const TermsLanding = () => {
  const [categories, setCategories] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_WP_API_URL || "http://localhost/progressivebyte_terms";
        const [catRes, docRes] = await Promise.all([
          fetch(`${apiUrl}/wp-json/wp/v2/doc_category`),
          fetch(`${apiUrl}/wp-json/wp/v2/docs?per_page=100`)
        ]);
        
        const catData = await catRes.json();
        const docData = await docRes.json();

        setCategories(catData);
        
        // Pre-process docs for Deep Search
        const processedDocs = docData.map(doc => ({
            ...doc,
            searchableText: `${doc.title.rendered} ${doc.content.rendered}`.toLowerCase()
        }));
        setDocs(processedDocs);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Keyboard shortcut (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Helper: Get Category Name by ID
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : "Uncategorized";
  };

  // Search Logic for Dropdown (Top 5 results)
  const getDropdownResults = () => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    // Filter docs based on title or content
    return docs.filter(d => d.searchableText.includes(query)).slice(0, 5);
  };

  const handleDocClick = (catId, docId) => {
    navigate("/docs", { state: { targetCatId: catId, targetDocId: docId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="animate-spin text-[#10b981] h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 font-sans">
      
      {/* --- MAIN CONTENT CONTAINER --- */}
      {/* Reduced padding top slightly as requested: pt-24 md:pt-32 */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 md:pt-32 md:pb-20 relative z-10">
        
        {/* --- PAGE HEADER SECTION --- */}
        <div className="mb-10 space-y-6">
            {/* Back Button */}
            <div>
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#10b981] transition-colors uppercase tracking-widest"
                >
                    <ArrowLeft className="h-3 w-3" /> BACK TO PORTAL
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                {/* Title */}
                <div className="relative z-0">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        PGB Terms & Condition
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Browse categories or search to find the information you need.
                    </p>
                </div>

                {/* Search Bar + Live Dropdown */}
                <div className="relative w-full md:max-w-md z-50">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search... (Ctrl+K)"
                        className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 shadow-sm outline-none text-gray-800 bg-white focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}

                    {/* LIVE SEARCH DROPDOWN */}
                    {searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 max-h-96 overflow-y-auto">
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Top Results
                            </div>
                            
                            {getDropdownResults().length > 0 ? (
                                <div>
                                    {getDropdownResults().map((doc) => {
                                        const catId = doc.doc_category[0];
                                        return (
                                            <button
                                                key={doc.id}
                                                onClick={() => handleDocClick(catId, doc.id)}
                                                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#10b981]/5 transition-colors border-b border-gray-50 last:border-0 text-left group"
                                            >
                                                <div className="mt-1 p-1.5 bg-gray-100 rounded text-gray-500 group-hover:text-[#10b981] group-hover:bg-white transition-colors">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 
                                                        className="font-semibold text-gray-800 group-hover:text-[#10b981] text-sm truncate" 
                                                        dangerouslySetInnerHTML={{__html: doc.title.rendered}} 
                                                    />
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 group-hover:text-[#10b981]/70">
                                                            <FolderOpen className="h-3 w-3" />
                                                            <span dangerouslySetInnerHTML={{__html: getCategoryName(catId)}} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-300 self-center group-hover:text-[#10b981]" />
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-400 text-sm">
                                    No direct matches found. Try looking in the categories below.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- CATEGORIES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map(cat => {
            const query = searchQuery.toLowerCase();
            
            // 1. Check if Category Name matches
            const isCatNameMatch = cat.name.toLowerCase().includes(query);

            // 2. Filter Docs inside this category
            const relevantDocs = docs.filter(d => {
                const belongsToCat = d.doc_category.includes(cat.id);
                if (!belongsToCat) return false;
                if (!query) return true;
                return d.searchableText.includes(query);
            });

            // 3. DECIDE: Should we show this Card?
            const shouldShowCard = isCatNameMatch || relevantDocs.length > 0;

            if (!shouldShowCard) return null;

            return (
              <div 
                key={cat.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full"
              >
                {/* Card Header */}
                <div className="bg-gray-50/80 border-b border-gray-100 py-4 px-5 md:py-5 md:px-6 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-[#10b981]">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <h3 
                    className="text-lg font-bold text-gray-900 group-hover:text-[#10b981] transition-colors" 
                    dangerouslySetInnerHTML={{__html: cat.name}} 
                  />
                </div>

                {/* Card Content (Doc List) */}
                <div className="flex-1 p-0">
                    <div className="divide-y divide-gray-50">
                        {relevantDocs.length > 0 ? (
                            relevantDocs.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => handleDocClick(cat.id, doc.id)}
                                    className="w-full text-left px-5 py-3 md:px-6 md:py-4 flex items-center gap-3 hover:bg-green-50/50 transition-colors group/item"
                                >
                                    <FileText className="h-4 w-4 text-gray-400 group-hover/item:text-[#10b981] flex-shrink-0" />
                                    <span 
                                        className="text-sm font-medium text-gray-600 group-hover/item:text-gray-900 line-clamp-1 flex-1" 
                                        dangerouslySetInnerHTML={{__html: doc.title.rendered}} 
                                    />
                                    <ChevronRight className="h-3 w-3 text-gray-300 group-hover/item:text-[#10b981]" />
                                </button>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm italic">
                                {docs.filter(d => d.doc_category.includes(cat.id)).length === 0 
                                    ? "No documents in this folder." 
                                    : "No documents match your search."}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer / Count */}
                {relevantDocs.length > 0 && (
                     <div className="bg-gray-50 px-6 py-3 text-xs text-gray-400 font-medium border-t border-gray-100">
                        {relevantDocs.length} {relevantDocs.length === 1 ? 'Article' : 'Articles'}
                     </div>
                )}
              </div>
            );
          })}
          
          {/* Empty State */}
          {categories.length > 0 && !loading && document.querySelectorAll('.group').length === 0 && searchQuery && (
             <div className="col-span-full text-center py-20 text-gray-400">
                <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No results found</h3>
                <p>We couldn't find any categories or documents matching "{searchQuery}"</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsLanding;