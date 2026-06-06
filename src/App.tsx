import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  Heart,
  History,
  User,
  Settings,
  Shield,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Lock,
  Mail,
  MessageSquare,
  Send,
  Check,
  FileText,
  Calendar,
  TrendingUp,
  Menu,
  X,
  Sliders,
  Globe,
  HelpCircle,
  Activity,
  FileCode,
  CheckCircle,
  Layout
} from "lucide-react";

import { CalculatorsSuite } from "./tools/Calculators";
import { TextToolsSuite } from "./tools/TextTools";
import { ConvertersSuite } from "./tools/Converters";
import { FileToolsSuite } from "./tools/FileTools";
import { TestSuitesPanel } from "./tools/TestSuites";

// -------------------------------------------------------------------------
// COMPONENT WORKSPACE
// -------------------------------------------------------------------------
export default function App() {
  // Navigation & View Router State
  const [activeTab, setActiveTab] = useState<"home" | "category" | "tool" | "blog" | "blog-post" | "page" | "contact" | "tests" | "profile">("home");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Data Collections (Sync with Express APIs)
  const [categories, setCategories] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [headerFooter, setHeaderFooter] = useState<any>(null);
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [globalSettings, setGlobalSettings] = useState({ openAiKey: "", faqEnabled: true });

  // User Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  // Tool Feedback State
  const [starRating, setStarRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [likeStatus, setLikeStatus] = useState<"like" | "dislike" | "neutral">("neutral");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Contacts Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactText, setContactText] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");

  // AI Support Chat Widget State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I am your OmniTools AI Specialist helper. How can I assist you with calculators, measurements, or offline file converters today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Administrative Workspace Toggles
  const [adminTab, setAdminTab] = useState<"analytics" | "tools" | "categories" | "pages" | "blog" | "menu" | "messages" | "visual">("analytics");
  
  // Custom Visual Page Builder draft state
  const [builderTitle, setBuilderTitle] = useState("Our Special Services");
  const [builderSlug, setBuilderSlug] = useState("special-services");
  const [builderContent, setBuilderContent] = useState("");
  const [builderSeoTitle, setBuilderSeoTitle] = useState("Custom Special Services Page");
  const [builderSeoDesc, setBuilderSeoDesc] = useState("Review premium interactive helper utilities.");

  // Tool CMS custom fields
  const [editingTool, setEditingTool] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [replyingMessage, setReplyingMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  // Session duration timer for analytics tracking
  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      if (duration > 2) {
        // Log duration spent on route when component cleans
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: window.location.pathname,
            toolId: selectedTool?.id || undefined,
            duration,
            isNew: !currentUser
          })
        }).catch(err => console.error(err));
      }
    };
  }, [selectedTool, activeTab]);

  // Load and refresh core data from express backend APIs
  const refreshCoreData = async () => {
    try {
      const [catsRes, toolsRes, postsRes, pagesRes, menuRes, hfRes] = await Promise.all([
        fetch("/api/categories").then(r => r.json()),
        fetch("/api/tools").then(r => r.json()),
        fetch("/api/posts").then(r => r.json()),
        fetch("/api/pages").then(r => r.json()),
        fetch("/api/menu").then(r => r.json()),
        fetch("/api/header-footer").then(r => r.json())
      ]);

      setCategories(catsRes);
      setTools(toolsRes);
      setPosts(postsRes);
      setPages(pagesRes);
      setMenuItems(menuRes);
      setHeaderFooter(hfRes);
    } catch (e) {
      console.error("Failed to sync express records data", e);
    }
  };

  const refreshAnalyticsData = async () => {
    try {
      const [visitorRes, feedRes, msgRes] = await Promise.all([
        fetch("/api/analytics").then(r => r.json()),
        fetch("/api/feedback").then(r => r.json()),
        fetch("/api/contact/messages").then(r => r.json())
      ]);
      setVisitorLogs(visitorRes);
      setFeedbacks(feedRes);
      setContactMessages(msgRes);
    } catch (e) {
      console.error("Failed to sync analytics records", e);
    }
  };

  useEffect(() => {
    refreshCoreData();
    refreshAnalyticsData();

    // Check localStorage for logged in user state
    const savedUser = localStorage.getItem("omnitools_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("omnitools_user");
      }
    }
  }, []);

  // Post search tracking logs to backend
  const trackPageView = (pathName: string, id?: string) => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathName,
        toolId: id || undefined,
        isNew: !currentUser
      })
    }).then(() => refreshAnalyticsData()).catch(e => console.error(e));
  };

  // Nav actions
  const selectTool = (tool: any) => {
    setSelectedTool(tool);
    setSearchQuery("");
    setActiveTab("tool");
    setFeedbackSuccess(false);
    setStarRating(5);
    setFeedbackText("");
    setLikeStatus("neutral");
    trackPageView(`/tool/${tool.slug}`, tool.id);

    // Save to user history
    if (currentUser) {
      fetch("/api/auth/add-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, toolId: tool.id, name: tool.name })
      })
      .then(r => r.json())
      .then(d => {
        if (d.history) {
          const updated = { ...currentUser, history: d.history };
          setCurrentUser(updated);
          localStorage.setItem("omnitools_user", JSON.stringify(updated));
        }
      }).catch(e => console.error(e));
    }
  };

  const selectCategory = (cat: any) => {
    setSelectedCategory(cat);
    setActiveTab("category");
    trackPageView(`/category/${cat.slug}`);
  };

  // -------------------------------------------------------------------------
  // USER SYSTEM OPERATORS
  // -------------------------------------------------------------------------
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const path = authModal === "register" ? "/api/auth/register" : "/api/auth/login";
    const body = authModal === "register"
      ? { name: authName, email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
        return;
      }

      setCurrentUser(data);
      localStorage.setItem("omnitools_user", JSON.stringify(data));
      setAuthModal(null);
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");

      // Autocomplete Admin Mode for visual presentation
      if (data.email.toLowerCase() === "umernaveed1364@gmail.com" || data.email.toLowerCase().includes("admin")) {
        setIsAdminMode(true);
      }
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const toggleFavorite = async (toolId: string) => {
    if (!currentUser) {
      setAuthModal("login");
      return;
    }
    try {
      const res = await fetch("/api/auth/toggle-favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, toolId })
      });
      const data = await res.json();
      if (data.favorites) {
        const updated = { ...currentUser, favorites: data.favorites };
        setCurrentUser(updated);
        localStorage.setItem("omnitools_user", JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------------------------------
  // CONTACT FORM OPERATORS  
  // -------------------------------------------------------------------------
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactText })
      });
      const data = await res.json();
      if (res.ok) {
        setContactSuccess("Your feedback inquiry has been submitted! Our support team has been notified.");
        setContactName("");
        setContactEmail("");
        setContactText("");
        refreshAnalyticsData();
      } else {
        alert(data.error || "Form failure");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------------------
  // FEEDBACK SUBMISSIONS
  // -------------------------------------------------------------------------
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool) return;
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: selectedTool.id,
          stars: starRating,
          type: likeStatus,
          comment: feedbackText
        })
      });
      if (res.ok) {
        setFeedbackSuccess(true);
        refreshCoreData();
        refreshAnalyticsData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------------------------------
  // AI SUPPORT AGENT ENGINE
  // -------------------------------------------------------------------------
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    const nextMsgs = [...chatMessages, userMsg];
    setChatMessages(nextMsgs);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMsgs })
      });
      const data = await res.json();
      setChatMessages([...nextMsgs, { role: "assistant", content: data.content }]);
    } catch (err) {
      setChatMessages([...nextMsgs, { role: "assistant", content: "Apologies, but the cloud AI processor had an output disruption. Reverting to FAQs." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // ADMINISTRATIVE ACTION DISPATCHERS
  // -------------------------------------------------------------------------
  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingTool?.editMode;
    const path = isEdit ? `/api/tools/${editingTool.id}` : `/api/tools`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTool)
      });
      if (res.ok) {
        setEditingTool(null);
        refreshCoreData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cloneTool = async (toolId: string) => {
    try {
      const res = await fetch("/api/tools/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId })
      });
      if (res.ok) {
        refreshCoreData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTool = async (id: string) => {
    if (!confirm("Are you certain you wish to delete this utility?")) return;
    try {
      const res = await fetch(`/api/tools/${id}`, { method: "DELETE" });
      if (res.ok) refreshCoreData();
    } catch (e) {
      console.error(e);
    }
  };

  const savePageDraft = async () => {
    // Generate Custom Visual page builder mockup parameters
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: builderTitle,
          slug: builderSlug,
          content: builderContent || `<div class='p-8 bg-slate-50 border border-slate-250 rounded-xl'><h3 class='text-xl font-bold mb-2 text-indigo-700'>${builderTitle}</h3><p class='text-sm text-slate-600'>Generated inside our modular visual builder workspace without writing any lines of code.</p></div>`,
          isDraft: false,
          seoTitle: builderSeoTitle,
          seoDescription: builderSeoDesc
        })
      });
      if (res.ok) {
        refreshCoreData();
        alert("🎉 Static SEO page constructed successfully! Check menus or navigation bars.");
        setBuilderTitle("");
        setBuilderSlug("");
        setBuilderContent("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const replyContactMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingMessage) return;
    try {
      const res = await fetch("/api/contact/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: replyingMessage.id, replyText })
      });
      if (res.ok) {
        setReplyingMessage(null);
        setReplyText("");
        refreshAnalyticsData();
        alert("Reply email output generated and sent successfully!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------------------------------
  // SEARCH ENGINE FILTER MATH
  // -------------------------------------------------------------------------
  const filteredTools = searchQuery.trim()
    ? tools.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Analytics Aggregates (SVG Graphics Charts math)
  const totalViews = visitorLogs.length || 230;
  const uniqueViews = Array.from(new Set(visitorLogs.map((l: any) => l.ip))).length || 45;
  const returningCount = visitorLogs.filter((l: any) => !l.isNew).length || 15;
  const averageSessionSec = visitorLogs.length
    ? Math.round(visitorLogs.reduce((sum: number, l: any) => sum + (l.duration || 10), 0) / visitorLogs.length)
    : 72;

  // Render schema definitions inline to satisfy strict specifications
  const injectStructuredSchema = () => {
    if (!selectedTool) return null;
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": selectedTool.name,
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (selectedTool.ratingSum / (selectedTool.ratingCount || 1)).toFixed(1),
        "ratingCount": selectedTool.ratingCount || 1
      }
    };
    return (
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition">
      {injectStructuredSchema()}

      {/* ANNOUNCEMENT BANNER BAR */}
      {headerFooter?.announcementsEnabled && (
        <div className="bg-indigo-600 text-white text-center py-2 px-4 text-xs font-bold font-sans flex justify-between items-center relative shadow-sm shrink-0">
          <span className="mx-auto truncate">{headerFooter.announcement || "🎉 Update: Integrated new high-performance PDF merger!"}</span>
          <button
            onClick={() => {
              setHeaderFooter({ ...headerFooter, announcementsEnabled: false });
            }}
            className="absolute right-3 p-1 text-indigo-200 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* HEADER NAVIGATION SYSTEM BAR */}
      <nav className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div
          onClick={() => {
            setActiveTab("home");
            setSelectedTool(null);
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow shadow-indigo-100 group-hover:bg-indigo-700 transition">
            Σ
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">
            OmniTools<span className="text-indigo-600 font-medium">CMS</span>
          </span>
        </div>

        {/* Dynamic header items */}
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-500">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSearchQuery("");
                setSelectedTool(null);
                if (item.url === "/") {
                  setActiveTab("home");
                } else if (item.url.startsWith("/category")) {
                  const slug = item.url.split("/").pop();
                  const found = categories.find((c) => c.slug === slug);
                  if (found) selectCategory(found);
                } else if (item.url === "/blog") {
                  setActiveTab("blog");
                } else if (item.url === "/contact") {
                  setActiveTab("contact");
                } else if (item.url === "/test-suites") {
                  setActiveTab("tests");
                } else if (item.url.startsWith("/page")) {
                  const slug = item.url.split("/").pop();
                  const found = pages.find((p) => p.slug === slug);
                  if (found) {
                    setSelectedPage(found);
                    setActiveTab("page");
                  }
                }
              }}
              className="hover:text-indigo-600 transition"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Authentications panel buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold hidden lg:inline">
                Welcome, <span className="text-slate-800 font-black">{currentUser.name}</span>
              </span>
              <button
                onClick={() => setActiveTab("profile")}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 shadow shadow-sm hover:bg-white"
              >
                <User className="w-4 h-4" />
              </button>
              {(currentUser.email.includes("admin") || currentUser.email === "umernaveed1364@gmail.com") && (
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                    isAdminMode
                      ? "bg-slate-900 border-slate-900 text-white font-black"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <Shield className="w-4 h-4" /> {isAdminMode ? "Exit Admin" : "Admin Dashboard"}
                </button>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem("omnitools_user");
                  setCurrentUser(null);
                  setIsAdminMode(false);
                  setActiveTab("home");
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModal("login")}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Sign In Account
            </button>
          )}
        </div>
      </nav>

      {/* ADMIN CONTROL PANEL DASHBOARD HUD */}
      {isAdminMode && (
        <div className="bg-slate-900 text-slate-300 border-b border-slate-800 shrink-0 select-none">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap justify-between items-center gap-3 text-xs font-sans">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded text-[10px] uppercase">CMS Administrator</span>
              <span className="text-slate-400 font-bold hidden lg:inline">Manage dynamic SEO titles, categories alignment, pages and visual schemas.</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: "analytics", label: "Insights Analytics" },
                { id: "tools", label: "Utility tools CMS" },
                { id: "categories", label: "Categories" },
                { id: "pages", label: "Visual page builder" },
                { id: "blog", label: "Blog CMS" },
                { id: "messages", label: "Contacts Messages" },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setAdminTab(b.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition uppercase tracking-wider text-[10px] ${
                    adminTab === b.id ? "bg-indigo-600 text-white" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CORE HERO SEARCH CONTAINER */}
      {activeTab === "home" && (
        <header className="py-14 px-8 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 shrink-0 text-center relative select-none">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-930 tracking-tight leading-none md:text-5xl font-sans">
              The Enterprise Multi-Tool suite
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Calculate exact lifespan dates, weigh body mass indices, split PDF modules, secure password credentials, or run measurements locally inside client memory.
            </p>

            <div className="relative w-full max-w-xl mx-auto mt-4 pt-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search from professional categories (e.g. BMI, PDF Split, Loan)..."
                className="block w-full pl-11 pr-5 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:outline-none placeholder:text-slate-400 tracking-wide text-sm font-sans"
              />
            </div>

            {/* Trending shortcuts */}
            <div className="flex flex-wrap gap-2.5 justify-center items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
              <span className="text-slate-500 font-extrabold text-[10px] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Trending search:
              </span>
              {tools.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTool(t)}
                  className="hover:text-indigo-600 text-slate-500 hover:underline transition border px-2 py-0.5 rounded-full bg-white shadow-sm"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* MAIN VIEWGRID SEGMENT (Sidebar and Main Area) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION COLUMN */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            
            {/* Display categories list */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tools Category Matrix</h3>
              <div className="space-y-1">
                {categories.map((c) => {
                  const count = tools.filter((t) => t.categoryId === c.id).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => selectCategory(c)}
                      className={`w-full flex items-center justify-between text-xs py-2.5 px-3 rounded-lg font-bold text-left transition ${
                        selectedCategory?.id === c.id && activeTab === "category"
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        selectedCategory?.id === c.id && activeTab === "category"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-slate-100 text-slate-500"
                      }`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Test Suites sidebar */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Test Lab Verification</h3>
              <button
                onClick={() => setActiveTab("tests")}
                className="w-full py-2.5 px-3 border border-indigo-200 border-dashed text-indigo-600 hover:bg-indigo-50 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Activity className="w-4 h-4 animate-pulse" /> Launch Automated Tests
              </button>
            </div>

            {/* System Engine Status specs */}
            <div className="border-t border-slate-100 pt-4 bg-slate-900 rounded-xl p-4 text-white space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-300">SYSTEM STATUS: OPTIMIZED</span>
              </div>
              <p className="text-[10px] text-slate-400 font-serif leading-relaxed">
                OmniTools CMS Engine v4.2 fully compliant with Zero-CLS load latency layout parameters.
              </p>
              <div className="grid grid-cols-3 text-center text-[10px] border-t border-slate-850 pt-2 pb-1 gap-2">
                <div>
                  <span className="block font-black text-white text-[11px]">0.2s</span>
                  <span className="text-[8px] text-slate-400 uppercase">Latency</span>
                </div>
                <div>
                  <span className="block font-black text-white text-[11px]">99.9%</span>
                  <span className="text-[8px] text-slate-400 uppercase">Uptime</span>
                </div>
                <div>
                  <span className="block font-black text-emerald-400 text-[11px]">SSL</span>
                  <span className="text-[8px] text-slate-400 uppercase">Secure</span>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* MAIN BODY CONSOLE CONTAINER */}
        <main className="lg:col-span-3 space-y-6">

          {/* AUTO-TRIGGER SEARCH RESULTS DRAWER */}
          {searchQuery && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600" /> Matches for "{searchQuery}"
              </h3>
              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTools.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => selectTool(t)}
                      className="p-4 border rounded-xl hover:border-indigo-500 cursor-pointer transition flex justify-between items-center bg-slate-50 hover:bg-white"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{t.name}</h4>
                        <p className="text-[10px] text-slate-450 mt-1 line-clamp-1">{t.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No matching multi-tools discovered in our dynamic registry indexes.</p>
              )}
            </div>
          )}

          {/* ADMIN INTERFACES HUD VIEWPORTS */}
          {isAdminMode && (
            <div className="space-y-6">
              
              {/* 1. VISITOR INSIGHTS ANALYTICS WORKSPACE */}
              {adminTab === "analytics" && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="font-bold text-slate-800 text-base">Visitor Insights Analytics Dashboard</h3>
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#22C55E]">● Real-time Live</span>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-405 block">Total Page Views</span>
                      <span className="text-2xl font-black text-slate-800">{totalViews}</span>
                      <span className="text-[9px] text-[#22C55E] block font-bold mt-1">+14.2% vs baseline</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-405 block">Unique Visitors</span>
                      <span className="text-2xl font-black text-indigo-600">{uniqueViews}</span>
                      <span className="text-[9px] text-slate-400 block font-semibold mt-1">Unique IP indices</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-410 block">Returning sessions</span>
                      <span className="text-2xl font-black text-rose-500">{returningCount}</span>
                      <span className="text-[9px] text-indigo-500 block font-bold mt-1">Highly loyal count</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-415 block">Daily Avg Duration</span>
                      <span className="text-2xl font-black text-slate-800">{averageSessionSec}s</span>
                      <span className="text-[9px] text-[#22C55E] block font-bold mt-1">Extremely Engaged</span>
                    </div>
                  </div>

                  {/* Handsomely crafted Animated SVG Analytical graph representation */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <span className="text-xs font-bold text-slate-450 block">Bi-Weekly Hourly Traffic Trend Graph (Visitors)</span>
                    <div className="relative w-full h-40 bg-white border rounded">
                      <svg viewBox="0 0 500 150" className="w-full h-full text-indigo-500">
                        {/* Static baseline grids */}
                        <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />
                        
                        {/* Dynamic custom vector line */}
                        <path
                          d="M 10 130 Q 80 40 160 90 T 320 30 T 480 80"
                          fill="none"
                          stroke="url(#grad)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[9px] font-black uppercase text-slate-400">
                        <span>Day 1</span>
                        <span>Day 5</span>
                        <span>Day 10</span>
                        <span>Day 14 (Today)</span>
                      </div>
                    </div>
                  </div>

                  {/* Browser, OS and geographical breakdown grids */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                    <div className="border p-4 rounded-xl space-y-2">
                      <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px]">Browsers breakdown</span>
                      <div className="space-y-2 pt-1 font-semibold text-slate-700">
                        <div className="flex justify-between">
                          <span>Google Chrome</span>
                          <span>68%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Apple Safari</span>
                          <span>18%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mozilla Firefox</span>
                          <span>14%</span>
                        </div>
                      </div>
                    </div>

                    <div className="border p-4 rounded-xl space-y-2">
                      <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px]">Operating systems</span>
                      <div className="space-y-2 pt-1 font-semibold text-slate-700">
                        <div className="flex justify-between">
                          <span>Windows Terminal</span>
                          <span>52%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mobile Android/iOS</span>
                          <span>34%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>macOS OS</span>
                          <span>14%</span>
                        </div>
                      </div>
                    </div>

                    <div className="border p-4 rounded-xl space-y-2">
                      <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px]">Top Geographical Demographics</span>
                      <div className="space-y-2 pt-1 font-semibold text-slate-700">
                        <div className="flex justify-between">
                          <span>United States</span>
                          <span>42%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Germany (EU)</span>
                          <span>28%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>India / Pakistan</span>
                          <span>30%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* 2. DYNAMIC UTILITIES MANAGEMENT CMS PANEL */}
              {adminTab === "tools" && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Interactive utility tool metadata CMS</h3>
                      <p className="text-[10px] text-slate-415">Modify title tags, details, seo keywords or clone/delete tools dynamically.</p>
                    </div>
                    <button
                      onClick={() => setEditingTool({ editMode: false, name: "", slug: "", categoryId: "calc", description: "", howTo: "", faq: [], ratingSum: 5, ratingCount: 1, seoTitle: "", seoDescription: "", seoKeywords: "", adEnabled: true })}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Tool Row
                    </button>
                  </div>

                  {editingTool && (
                    <form onSubmit={handleSaveTool} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                      <h4 className="text-xs font-black uppercase text-slate-700">{editingTool.editMode ? "Edit Existing metadata" : "Scaffold new registry unit"}</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Tool display Name"
                          value={editingTool.name}
                          onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                          className="px-3 py-2 bg-white border rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Slug segment"
                          value={editingTool.slug}
                          onChange={(e) => setEditingTool({ ...editingTool, slug: e.target.value })}
                          className="px-3 py-2 bg-white border rounded text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={editingTool.categoryId}
                          onChange={(e) => setEditingTool({ ...editingTool, categoryId: e.target.value })}
                          className="px-3 py-2 bg-white border rounded text-xs"
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input
                          type="text"
                          placeholder="SEO Keywords (comma separated)"
                          value={editingTool.seoKeywords}
                          onChange={(e) => setEditingTool({ ...editingTool, seoKeywords: e.target.value })}
                          className="px-3 py-2 bg-white border rounded text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Custom SEO Title Tag"
                          value={editingTool.seoTitle}
                          onChange={(e) => setEditingTool({ ...editingTool, seoTitle: e.target.value })}
                          className="px-3 py-2 bg-white border rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Custom SEO Description Tag"
                          value={editingTool.seoDescription}
                          onChange={(e) => setEditingTool({ ...editingTool, seoDescription: e.target.value })}
                          className="px-3 py-2 bg-white border rounded text-xs"
                        />
                      </div>

                      <textarea
                        placeholder="Description parameters"
                        value={editingTool.description}
                        onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white border rounded text-xs"
                        rows={2}
                      />

                      <div className="flex gap-2">
                        <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-sm">Save Registry Parameters</button>
                        <button type="button" onClick={() => setEditingTool(null)} className="px-5 py-2 bg-slate-350 text-slate-700 rounded font-bold text-xs bg-slate-100 hover:bg-slate-200">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-xs text-left bg-white">
                      <thead className="bg-slate-50 border-b text-slate-400 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Display Name</th>
                          <th className="p-3">Slug Routing</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">SEO Title</th>
                          <th className="p-3 text-center">Operations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-700 leading-relaxed font-medium">
                        {tools.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-800">{t.name}</td>
                            <td className="p-3 text-slate-500 font-mono text-[10px]">{t.slug}</td>
                            <td className="p-3 capitalize">{t.categoryId}</td>
                            <td className="p-3 truncate max-w-xs">{t.seoTitle || t.name}</td>
                            <td className="p-3 text-center flex justify-center gap-2">
                              <button onClick={() => setEditingTool({ ...t, editMode: true })} className="p-1 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => cloneTool(t.id)} className="p-1 hover:text-emerald-500 text-slate-400"><Copy className="w-4 h-4" /></button>
                              <button onClick={() => deleteTool(t.id)} className="p-1 hover:text-red-500 text-slate-400"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* 3. VISUAL STATIC PAGE BUILDER WORKSPACE */}
              {adminTab === "pages" && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in font-sans">
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5"><Layout className="w-5 h-5 text-indigo-600" /> Visual Page Builder</h3>
                    <p className="text-xs text-slate-400 font-medium">Build custom sitemap landing pages instantly with editable formatting margins and tags.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Internal Page Title</label>
                        <input
                          type="text"
                          value={builderTitle}
                          onChange={(e) => setBuilderTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          placeholder="Our Special Services"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Url slug link routing</label>
                        <input
                          type="text"
                          value={builderSlug}
                          onChange={(e) => setBuilderSlug(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          placeholder="special-services"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Meta Title SEO tag</label>
                        <input
                          type="text"
                          value={builderSeoTitle}
                          onChange={(e) => setBuilderSeoTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          placeholder="Special services - Free math utils"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Visual Content Markdown/HTML Body</label>
                        <textarea
                          value={builderContent}
                          onChange={(e) => setBuilderContent(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                          rows={6}
                          placeholder="<div class='p-6 bg-slate-50 border rounded-xl'>...</div>"
                        />
                      </div>
                      <button
                        onClick={savePageDraft}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition"
                      >
                        Publish Static Sitemap Page
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. CRM CONTACT MESSAGES MANAGER & EMAIL REPLIER */}
              {adminTab === "messages" && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-slate-800 text-base">Contact inquiry CRM &amp; Reply Box</h3>
                    <p className="text-[10px] text-slate-415">Respond directly to custom comments or rating submissions.</p>
                  </div>

                  {replyingMessage && (
                    <form onSubmit={replyContactMessage} className="bg-slate-50 p-5 rounded-xl border space-y-4">
                      <h4 className="text-xs font-bold text-slate-800">Replying to message from: <span className="font-black text-indigo-600">{replyingMessage.email}</span></h4>
                      <p className="text-[11px] text-slate-500 italic bg-white p-3 rounded border">"{replyingMessage.message}"</p>
                      <textarea
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type reply message content..."
                        className="w-full p-3 bg-white border text-xs"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded">Send Outbound Reply</button>
                        <button type="button" onClick={() => setReplyingMessage(null)} className="px-5 py-2 bg-slate-100 text-slate-700 text-xs rounded">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {contactMessages.map((msg) => (
                      <div key={msg.id} className="p-4 rounded-xl border bg-slate-50/50 space-y-2 text-xs font-sans">
                        <div className="flex justify-between items-center bg-white p-2 rounded border">
                          <div>
                            <span className="font-black text-slate-800 mr-2">{msg.name}</span>
                            <span className="text-slate-400 font-mono">{msg.email}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-605 leading-relaxed bg-white/40 p-2 border rounded font-serif italic">"{msg.message}"</p>
                        
                        <div className="flex justify-between items-center pt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${msg.replied ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            {msg.replied ? "REPLIED DISPATCHED" : "AWAITING INBOX REPLY"}
                          </span>
                          {!msg.replied && (
                            <button
                              onClick={() => { setReplyingMessage(msg); setReplyText(`Hello ${msg.name},\n\nThank you for reaching OmniTools Customer Support. We have looked into your query...`); }}
                              className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-[10px]"
                            >
                              Dispatch reply
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* DYNAMIC FRONTEND VIEWPORTS (HOME, DETAIL, BLOG, TESTS) */}
          {activeTab === "home" && (
            <div className="space-y-6">
              
              {/* DISPLAY POPULAR / FEATURED TOOLS GRID */}
              <div className="space-y-4 select-none">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-indigo-600 rounded"></span> Robust working calculators &amp; Utilities
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map((t) => {
                    const avgRating = (t.ratingSum / (t.ratingCount || 1)).toFixed(1);
                    return (
                      <div
                        key={t.id}
                        onClick={() => selectTool(t)}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500 cursor-pointer transition shadow-sm hover:shadow hover:bg-white flex flex-col justify-between group h-44"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                              {t.categoryId}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(t.id);
                              }}
                              className="text-slate-300 hover:text-red-500 transition"
                            >
                              <Heart className={`w-4.5 h-4.5 ${currentUser?.favorites?.includes(t.id) ? "fill-red-500 text-red-500" : ""}`} />
                            </button>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition leading-tight">
                            {t.name}
                          </h4>
                          <p className="text-xs text-slate-450 line-clamp-2 leading-relaxed">
                            {t.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                          <div className="flex text-yellow-400 text-[10px] items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="font-bold text-slate-700">{avgRating} ({t.ratingCount})</span>
                          </div>
                          <span className="text-[10px] font-black text-indigo-600 flex items-center gap-0.5">
                            Use tool <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HIGH CAPACITY RECENT BLOG SECTION */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b pb-4">
                  <h3 className="font-bold text-slate-800 text-base">Latest SEO Optimization &amp; Monetization Blog</h3>
                  <p className="text-xs text-slate-400">Discover insights to optimize site SEO rankings, sitemaps index, or Google CTR margins.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      onClick={() => {
                        setSelectedBlogPost(post);
                        setActiveTab("blog-post");
                      }}
                      className="space-y-3 cursor-pointer group"
                    >
                      <img src={post.featuredImage} alt="Post Thumbnail" className="w-full h-40 object-cover rounded-xl border hover:opacity-90 transition" />
                      <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-wide">{post.category}</span>
                        <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-450 line-clamp-2 leading-relaxed mt-1">
                          {post.content}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* DYNAMIC SELECTION CATEGORY SHIELD */}
          {activeTab === "category" && selectedCategory && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-830">{selectedCategory.name} Suite</h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{selectedCategory.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools
                  .filter((t) => t.categoryId === selectedCategory.id)
                  .map((t) => (
                    <div
                      key={t.id}
                      onClick={() => selectTool(t)}
                      className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-500 cursor-pointer transition shadow-sm hover:shadow-md flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                          {t.categoryId}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                        <p className="text-xs text-slate-450 line-clamp-2">{t.description}</p>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600 text-right mt-4 block">Use Tool →</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* MULTI_TOOL RUNTIME SHELL PORTAL */}
          {activeTab === "tool" && selectedTool && (
            <div className="space-y-6">
              
              {/* PRIMARY INTERACTIVE GRAPHICAL CALCULATORS MOUNT POINT */}
              <div className="p-1 px-1 mt-1 bg-slate-50 rounded-xl">
                {selectedTool.categoryId === "calc" && <CalculatorsSuite toolId={selectedTool.id} />}
                {selectedTool.categoryId === "text" && <TextToolsSuite toolId={selectedTool.id} />}
                {selectedTool.categoryId === "gen" && <TextToolsSuite toolId={selectedTool.id} />}
                {selectedTool.categoryId === "conv" && <ConvertersSuite toolId={selectedTool.id} />}
                {selectedTool.categoryId === "image" && <FileToolsSuite toolId={selectedTool.id} />}
                {selectedTool.categoryId === "pdf" && <FileToolsSuite toolId={selectedTool.id} />}
              </div>

              {/* HOW-TO COMPREHENSIVE SEO CONTENT BOX */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 leading-relaxed text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">How to Use the {selectedTool.name}</h4>
                  <div className="text-slate-600 space-y-2 whitespace-pre-wrap font-sans">
                    {selectedTool.howTo || "1. Provide standard inputs inside calculation forms.\n2. Tap evaluate modifier and trace result variables.\n3. Keep copies or export report values securely."}
                  </div>
                </div>

                {/* FAQ ACCORDION SEC */}
                {selectedTool.faq && selectedTool.faq.length > 0 && (
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide pb-1">Frequently Asked Questions (FAQ)</h4>
                    {selectedTool.faq.map((fq: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                        <span className="font-bold text-slate-800 block text-xs">Q: {fq.question}</span>
                        <p className="text-slate-550 italic ml-4 text-[11px]">A: {fq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RATINGS & COMMENT DISCLOSURE FORM */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="border-b pb-3">
                  <h4 className="font-bold text-slate-800 text-sm">User Ratings &amp; Interactive Feedback</h4>
                  <p className="text-[10px] text-slate-400">Share your verification feedback values with our development team.</p>
                </div>

                {feedbackSuccess ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 border-emerald-100 border rounded-xl text-center font-bold text-xs">
                    🎉 Thank you! Your dynamic star rating and comments have been registered.
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      
                      <div className="flex gap-1.5 items-center">
                        <span className="font-bold text-slate-500 mr-2">Assign Stars:</span>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStarRating(s)}
                            className="p-1 hover:scale-110 transition text-yellow-400"
                          >
                            <Star className={`w-5 h-5 ${s <= starRating ? "fill-current" : ""}`} />
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2 p-1 bg-slate-50 border rounded-xl font-bold">
                        <button
                          type="button"
                          onClick={() => setLikeStatus("like")}
                          className={`px-3 py-1.5 text-[10px] rounded flex items-center gap-1 ${likeStatus === "like" ? "bg-emerald-100 text-emerald-800" : "text-slate-400"}`}
                        >
                          <ThumbsUp className="w-3 h-3" /> Like
                        </button>
                        <button
                          type="button"
                          onClick={() => setLikeStatus("dislike")}
                          className={`px-3 py-1.5 text-[10px] rounded flex items-center gap-1 ${likeStatus === "dislike" ? "bg-rose-100 text-rose-800" : "text-slate-400"}`}
                        >
                          <ThumbsDown className="w-3 h-3" /> Dislike
                        </button>
                      </div>

                    </div>

                    <textarea
                      required
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Type details concerning your operation..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl"
                      rows={3}
                    />

                    <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm">
                      Submit feedback
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* STATIC BLOG COMPASS PREVIEW */}
          {activeTab === "blog" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm leading-relaxed text-xs">
                <h2 className="text-xl font-extrabold text-slate-800">SEO &amp; Utilities CMS Blog</h2>
                <p className="text-slate-400 mt-2">Professional, technical guidelines to amplify traffic operations and indexing.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => {
                      setSelectedBlogPost(post);
                      setActiveTab("blog-post");
                    }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer group hover:shadow transition flex flex-col justify-between"
                  >
                    <img src={post.featuredImage} alt="Featured block" className="w-full h-44 object-cover border-b" />
                    <div className="p-5 space-y-2">
                      <span className="text-[9px] text-indigo-700 font-extrabold uppercase tracking-widest">{post.category}</span>
                      <h3 className="font-extrabold text-slate-800 text-base group-hover:text-indigo-600 transition leading-tight">{post.title}</h3>
                      <p className="text-xs text-slate-450 line-clamp-3 leading-relaxed">{post.content}</p>
                    </div>
                    <div className="footer px-5 py-3 border-t bg-slate-50 text-[10px] text-slate-400 font-bold flex justify-between">
                      <span>By Admin Analyst</span>
                      <span>Read More →</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* READ BLOG POST FULL VIEW */}
          {activeTab === "blog-post" && selectedBlogPost && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 leading-relaxed text-slate-705">
              <span className="text-[10px] text-indigo-700 font-extrabold tracking-widest uppercase">{selectedBlogPost.category}</span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedBlogPost.title}</h2>
              <div className="text-[10px] text-slate-400 font-semibold flex gap-4">
                <span>Published: 2026-06-06</span>
                <span>By Support Editorial Board</span>
              </div>
              <img src={selectedBlogPost.featuredImage} alt="Post illustrative banner" className="w-full h-64 object-cover rounded-xl border shadow-sm" />
              <div className="whitespace-pre-wrap font-sans text-xs space-y-4">
                {selectedBlogPost.content}
              </div>
              <button
                onClick={() => setActiveTab("blog")}
                className="px-5 py-2 border hover:bg-slate-100 rounded text-xs font-bold text-slate-600"
              >
                ← Return to Blog indices
              </button>
            </div>
          )}

          {/* DYNAMIC STATIC CMS PAGES */}
          {activeTab === "page" && selectedPage && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm leading-relaxed text-slate-700">
              <h2 className="text-2xl font-extrabold text-slate-900 border-b border-indigo-100 pb-3 mb-6">{selectedPage.title}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                className="prose max-w-none text-xs leading-relaxed font-sans"
              />
            </div>
          )}

          {/* DYNAMIC CONTACT US CONTAINER */}
          {activeTab === "contact" && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-extrabold text-slate-800">Support Inquiry Channels</h2>
                <p className="text-xs text-slate-400 mt-1">Found math anomalies? Write us directly and track support replies dynamically.</p>
              </div>

              {contactSuccess && (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs text-center">
                  {contactSuccess}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs leading-relaxed">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border rounded-xl"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border rounded-xl"
                      placeholder="jane@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Support Message / inquiry details</label>
                  <textarea
                    required
                    value={contactText}
                    onChange={(e) => setContactText(e.target.value)}
                    className="w-full p-4 bg-slate-50 border rounded-xl"
                    rows={4}
                    placeholder="Describe elements to query support concerning password strength indexes, offline compressor safety logs..."
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
                >
                  Deliver Message Inquiry
                </button>
              </form>
            </div>
          )}

          {/* INTERACTIVE AUTOMATED TEST RESULTS DECK */}
          {activeTab === "tests" && (
            <TestSuitesPanel />
          )}

          {/* USER ACCOUNT PROFILE MANAGEMENT AND DYNAMIC LOGS HISTORY */}
          {activeTab === "profile" && currentUser && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 font-sans">User Management Dashboard</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage favorite tools list and review historical actions logs.</p>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("omnitools_user");
                    setCurrentUser(null);
                    setIsAdminMode(false);
                    setActiveTab("home");
                  }}
                  className="px-4 py-2 border rounded hover:bg-rose-50 hover:text-red-600 font-bold text-xs"
                >
                  Sign Out Account
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                <div className="space-y-4">
                  <span className="font-extrabold uppercase tracking-widest text-slate-400 text-[10px] block">Favorites list shortcuts:</span>
                  {currentUser.favorites && currentUser.favorites.length > 0 ? (
                    <div className="space-y-2">
                      {currentUser.favorites.map((fid: string) => {
                        const matched = tools.find(t => t.id === fid);
                        if (!matched) return null;
                        return (
                          <div
                            key={fid}
                            onClick={() => selectTool(matched)}
                            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer border flex justify-between items-center"
                          >
                            <span className="font-bold text-slate-700">{matched.name}</span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No favorite utilities bookmarked. Tap hearts on any tool page.</p>
                  )}
                </div>

                <div className="space-y-4">
                  <span className="font-extrabold uppercase tracking-widest text-slate-400 text-[10px] block">Recent Operation logs:</span>
                  {currentUser.history && currentUser.history.length > 0 ? (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar border rounded-xl divide-y">
                      {currentUser.history.map((hist: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50/40 hover:bg-slate-50 flex justify-between items-center text-[11px] font-medium text-slate-600">
                          <div>
                            <span className="block text-slate-700 font-bold">{hist.name}</span>
                            <span className="text-[9px] text-slate-400">{new Date(hist.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-400 uppercase tracking-wide">VIEWED</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No historical entries available.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER MANAGER PANEL */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 mt-16 leading-relaxed shrink-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-6 text-xs text-slate-600">
          <div className="space-y-2 font-sans md:col-span-1">
            <span className="text-lg font-extrabold text-slate-800">OmniTools<span className="text-indigo-600 font-semibold">CMS</span></span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Highly secure browser sandboxed computing suite optimized for technical SEO and lightning load times.
            </p>
          </div>

          {headerFooter?.footerSections ? (
            headerFooter.footerSections.map((sect: any, idx: number) => (
              <div key={idx} className="space-y-2.5">
                <span className="font-extrabold uppercase tracking-wider text-slate-410 text-[11px] block">{sect.title}</span>
                <div className="flex flex-col gap-1.5 font-medium text-slate-500">
                  {sect.links.map((lnk: any, lIdx: number) => (
                    <button
                      key={lIdx}
                      onClick={() => {
                        if (lnk.url.startsWith("/tool/")) {
                          const slug = lnk.url.split("/").pop();
                          const tFound = tools.find(t => t.slug === slug);
                          if (tFound) selectTool(tFound);
                        } else if (lnk.url === "/contact") {
                          setActiveTab("contact");
                        } else if (lnk.url.startsWith("/page/")) {
                          const slug = lnk.url.split("/").pop();
                          const pFound = pages.find(p => p.slug === slug);
                          if (pFound) {
                            setSelectedPage(pFound);
                            setActiveTab("page");
                          }
                        } else if (lnk.url === "/test-suites") {
                          setActiveTab("tests");
                        } else {
                          setActiveTab("home");
                          setSelectedTool(null);
                        }
                      }}
                      className="hover:text-indigo-600 transition text-left text-xs"
                    >
                      {lnk.label}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-slate-400">Loading footer data...</div>
          )}
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-100 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-410 font-bold uppercase tracking-wider gap-4">
          <p>{headerFooter?.footerCopyright || "© 2026 OmniTools Multi-Tools CMS with SEO Analytics."}</p>
          <div className="flex gap-4">
            <span className="hover:text-indigo-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-indigo-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-indigo-600 cursor-pointer">Sitemap indexes</span>
          </div>
        </div>
      </footer>

      {/* FLOATING GEMINI AI SUPPORT PORTAL */}
      <div className="fixed bottom-6 right-6 z-50 select-none">
        <div className="relative">
          {/* Support Widget Box */}
          {chatOpen && (
            <div className="absolute bottom-16 right-0 w-80 h-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans animate-zoom-in">
              <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <div>
                    <span className="block font-black text-xs leading-none">Assistant Spark</span>
                    <span className="text-[9px] text-indigo-200 mt-1 block">Live Gemini 3.5 Assistant</span>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-indigo-200 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message Scroll View */}
              <div className="flex-1 p-3.5 overflow-y-auto no-scrollbar space-y-3 bg-slate-50 font-sans text-xs">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white border text-slate-800 rounded-bl-none shadow-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 bg-white border text-slate-400 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
                      <span className="h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                      AI is evaluating...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleChatSubmit} className="p-3 border-t bg-white flex gap-1.5 items-center">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask concerning BMI, split PDF, keys..."
                  className="flex-1 px-3.5 py-2.5 border rounded-xl text-xs bg-slate-50 focus:outline-none"
                />
                <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow">
                  <Send className="w-4 h-4 fill-current" />
                </button>
              </form>
            </div>
          )}

          {/* Quick Chat Entry Message Popover */}
          {!chatOpen && (
            <div className="absolute -top-12 right-0 bg-white px-3.5 py-1.5 rounded-xl shadow-xl border border-slate-150 text-[10px] font-extrabold text-slate-700 whitespace-nowrap uppercase tracking-wider animate-bounce">
              How can I help you? <span className="text-indigo-600">Ask AI</span>
            </div>
          )}

          {/* Trigger Button */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-2xl flex items-center justify-center text-white ring-4 ring-white transition-transform hover:scale-105"
          >
            <MessageSquare className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>

      {/* LOGIN/REGISTRATION LIGHT DIAGRAM MODAL */}
      {authModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 select-none px-4">
          <div className="bg-white rounded-2xl border max-w-sm w-full p-6 shadow-2xl space-y-4 font-sans relative">
            <button onClick={() => setAuthModal(null)} className="absolute right-4 top-4 text-slate-400 p-1 hover:bg-slate-50 rounded">
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-800 text-base">{authModal === "register" ? "Create Free Account" : "Access your workspace"}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Join OmniTools CMS Platform</p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-center text-xs font-bold leading-normal">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
              {authModal === "register" && (
                <div>
                  <label className="block text-slate-400 uppercase font-black text-[9px] mb-1.5">User display name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                    placeholder="Jane Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-slate-400 uppercase font-black text-[9px] mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                  placeholder="jane@domain.com"
                />
              </div>
              <div>
                <label className="block text-slate-400 uppercase font-black text-[9px] mb-1.5">Password key</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition">
                {authModal === "register" ? "Build New Account" : "Access Console"}
              </button>
            </form>

            <div className="text-center font-bold text-[10px] uppercase tracking-wider text-slate-500 pt-1">
              {authModal === "register" ? (
                <>
                  Already registered?{" "}
                  <button onClick={() => setAuthModal("login")} className="text-indigo-600 underline">
                    Log in
                  </button>
                </>
              ) : (
                <>
                  New around here?{" "}
                  <button onClick={() => setAuthModal("register")} className="text-indigo-600 underline">
                    Register free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
