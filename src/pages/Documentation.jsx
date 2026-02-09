import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  FolderOpen,
  Clock,
  Loader2,
  FileText,
  ChevronDown,
} from "lucide-react";

const Documentation = () => {
  const [categories, setCategories] = useState([]);
  const [docs, setDocs] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeDocId, setActiveDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_WP_API_URL || "http://localhost/progressivebyte_terms";
        const [catRes, docRes] = await Promise.all([
          fetch(`${apiUrl}/wp-json/wp/v2/doc_category`),
          fetch(`${apiUrl}/wp-json/wp/v2/docs?per_page=100`),
        ]);

        const catData = await catRes.json();
        const rawDocData = await docRes.json();

        // Sort categories by doc_category_order
        const sortedCategories = catData.sort((a, b) => {
          const orderA = parseInt(a.doc_category_order || 0);
          const orderB = parseInt(b.doc_category_order || 0);
          return orderA - orderB;
        });

        setCategories(sortedCategories);

        // --- H2 Processing Logic ---
        let processedDocs = [];

        rawDocData.forEach((doc) => {
          let contentHtml = doc.content.rendered;

          // Parse H2 headings for Section Indexing (visual only here as search is global now)
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(contentHtml, "text/html");
          const headings = htmlDoc.querySelectorAll("h2");

          headings.forEach((h2, index) => {
            const sectionId = `section-${doc.id}-${index}`;
            // Inject ID into content for scrolling
            contentHtml = contentHtml.replace(
              h2.outerHTML,
              `<h2 id="${sectionId}" class="scroll-mt-32 text-2xl font-bold mb-4 text-gray-800 mt-8 border-b border-gray-100 pb-2">${h2.innerHTML}</h2>`
            );
          });

          processedDocs.push({
            ...doc,
            content: { ...doc.content, rendered: contentHtml },
          });
        });

        setDocs(processedDocs);

        // --- NAVIGATION STATE HANDLING ---
        if (location.state?.targetCatId && location.state?.targetDocId) {
          setActiveCategoryId(location.state.targetCatId);
          setActiveDocId(location.state.targetDocId);
          setExpandedCategories({ [location.state.targetCatId]: true });
          setTimeout(() => {
             window.scrollTo({ top: 0, behavior: "smooth" });
          }, 100);
        } else if (sortedCategories.length > 0 && !activeDocId) {
          const firstCat = sortedCategories[0];
          setActiveCategoryId(firstCat.id);
          setExpandedCategories({ [firstCat.id]: true });
          const firstDoc = processedDocs.find((d) =>
            d.doc_category.includes(firstCat.id)
          );
          if (firstDoc) setActiveDocId(firstDoc.id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.state]);

  const handleCategoryClick = (id) => {
    setActiveCategoryId(id);
    setExpandedCategories((p) => ({ ...p, [id]: !p[id] }));
    if (!expandedCategories[id]) {
        const firstDoc = docs.find(d => d.doc_category.includes(id));
        if(firstDoc) setActiveDocId(firstDoc.id);
    }
  };

  const docsByCategory = categories.reduce((acc, cat) => {
    acc[cat.id] = docs.filter((doc) => doc.doc_category.includes(cat.id));
    return acc;
  }, {});

  const currentDoc = docs.find((doc) => doc.id === activeDocId);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="animate-spin text-[#10b981] h-8 w-8" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 font-sans">
      
      {/* --- MAIN LAYOUT --- */}
      {/* Updated padding to match Home.jsx responsive style */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12 md:pt-40 md:pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 self-start max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-hide">
            
            <div className="mb-6 pl-2">
                <Link to="/terms" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#10b981] transition-colors uppercase tracking-widest">
                    <ChevronRight className="h-3 w-3 rotate-180" /> Back to Terms & Policies
                </Link>
            </div>

            <div className="space-y-1">
              {categories.map((cat) => (
                <div key={cat.id} className="mb-2">
                  {/* Category Header */}
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                      activeCategoryId === cat.id
                        ? "text-gray-900 bg-white shadow-sm font-semibold"
                        : "text-gray-500 hover:bg-white/60 hover:text-gray-900"
                    }`}
                  >
                    <FolderOpen className={`h-4 w-4 transition-colors ${activeCategoryId === cat.id ? "text-[#10b981]" : "text-gray-400 group-hover:text-gray-600"}`} />
                    <span className="text-sm flex-1" dangerouslySetInnerHTML={{ __html: cat.name }} />
                    {docsByCategory[cat.id]?.length > 0 && (
                      <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${expandedCategories[cat.id] ? "rotate-180" : ""}`} />
                    )}
                  </button>

                  {/* Document List (Tree View) */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCategories[cat.id] ? "max-h-[1000px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                    <div className="relative ml-5 pl-4 border-l-2 border-gray-100 space-y-1 py-1">
                        {docsByCategory[cat.id]?.map((doc) => {
                             const isActive = activeDocId === doc.id;
                             return (
                                <button
                                    key={doc.id}
                                    onClick={() => {
                                        setActiveDocId(doc.id);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className={`relative w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-start gap-2 ${
                                        isActive
                                        ? "bg-green-50 text-[#10b981] font-medium shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                                >
                                    {/* Active Indicator Dot */}
                                    {isActive && (
                                        <span className="absolute -left-[19px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-sm"></span>
                                    )}
                                    <span className="line-clamp-2" dangerouslySetInnerHTML={{ __html: doc.title.rendered }} />
                                </button>
                             );
                        })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-6 md:p-12 min-h-[600px]">
              {currentDoc ? (
                <article className="prose prose-emerald prose-headings:font-bold prose-a:text-[#10b981] max-w-none">
                    <header className="mb-10 pb-8 border-b border-gray-100">
                        <h1
                            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight"
                            dangerouslySetInnerHTML={{ __html: currentDoc.title.rendered }}
                        />
                         <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" /> 
                                Last updated: {new Date(currentDoc.modified).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FileText className="h-4 w-4" />
                                {currentDoc.word_count || "Read"}
                            </span>
                        </div>
                    </header>
                  
                  {/* Content Injection */}
                  <div
                    className="text-gray-600 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: currentDoc.content.rendered,
                    }}
                  />
                </article>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <FileText className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Select a document</h3>
                    <p>Choose a topic from the sidebar to start reading.</p>
                </div>
              )}
            </div>
            
            {/* Footer / Support Link */}
            <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                    Can't find what you're looking for? <a href="mailto:support@progressivebyte.com" className="text-[#10b981] hover:underline font-medium">Contact HR</a>
                </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documentation;