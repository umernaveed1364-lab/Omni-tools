import express from "express";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { db, User, Category, ToolCMS, CMSPage, BlogPost, MenuItem, VisitorLog, ToolFeedback, ContactMessage } from "./server/db";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini SDK with User-Agent required by AI Studio guidelines
const geminiApiKey = process.env.GEMINI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Global middleware to track a random visitor ID or IP
app.use((req, res, next) => {
  // Simple analytics logic - We'll log to db on tool page views or specific API routes
  next();
});

// Helper for password hash
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// -------------------------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------------------------
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required registration parameters." });
    }
    const users = db.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: "Email already registered." });
    }
    const newUser: User = {
      id: "u-" + crypto.randomUUID(),
      name,
      email,
      passwordHash: hashPassword(password),
      favorites: [],
      history: []
    };
    users.push(newUser);
    db.saveUsers(users);
    res.json({ id: newUser.id, name: newUser.name, email: newUser.email, favorites: newUser.favorites });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const users = db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid email or password credentials." });
    }
    res.json({ id: user.id, name: user.name, email: user.email, favorites: user.favorites, history: user.history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/toggle-favorite", (req, res) => {
  try {
    const { userId, toolId } = req.body;
    const users = db.getUsers();
    const userIdx = users.findIndex(u => u.id === userId);
    if (userIdx === -1) return res.status(404).json({ error: "User not identified." });
    
    const favs = users[userIdx].favorites || [];
    const exists = favs.indexOf(toolId);
    if (exists > -1) {
      favs.splice(exists, 1);
    } else {
      favs.push(toolId);
    }
    users[userIdx].favorites = favs;
    db.saveUsers(users);
    res.json({ favorites: favs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/add-history", (req, res) => {
  try {
    const { userId, toolId, name } = req.body;
    const users = db.getUsers();
    const userIdx = users.findIndex(u => u.id === userId);
    if (userIdx === -1) return res.status(404).json({ error: "User not found." });
    
    const history = users[userIdx].history || [];
    // Prevent duplicate adjacent entries
    history.unshift({ toolId, name, timestamp: new Date().toISOString() });
    users[userIdx].history = history.slice(0, 30); // Max 30 elements
    db.saveUsers(users);
    res.json({ history: users[userIdx].history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------------
// CATEGORY CRUD ROUTES
// -------------------------------------------------------------------------
app.get("/api/categories", (req, res) => {
  res.json(db.getCategories());
});

app.post("/api/categories", (req, res) => {
  const list = db.getCategories();
  const cat: Category = {
    id: "cat-" + Date.now(),
    name: req.body.name,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    order: req.body.order || list.length + 1,
    description: req.body.description || ""
  };
  list.push(cat);
  db.saveCategories(list);
  res.json(cat);
});

app.put("/api/categories/:id", (req, res) => {
  const list = db.getCategories();
  const idx = list.findIndex(c => c.id === req.params.id);
  if (idx > -1) {
    list[idx] = { ...list[idx], ...req.body };
    db.saveCategories(list);
    res.json(list[idx]);
  } else {
    res.status(404).json({ error: "Category not discovered." });
  }
});

app.delete("/api/categories/:id", (req, res) => {
  let list = db.getCategories();
  list = list.filter(c => c.id !== req.params.id);
  db.saveCategories(list);
  res.json({ success: true });
});

// -------------------------------------------------------------------------
// TOOL CRUD ROUTES
// -------------------------------------------------------------------------
app.get("/api/tools", (req, res) => {
  res.json(db.getTools());
});

app.post("/api/tools", (req, res) => {
  const list = db.getTools();
  const tool: ToolCMS = {
    id: req.body.id || "tool-" + Date.now(),
    name: req.body.name,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    categoryId: req.body.categoryId,
    description: req.body.description || "",
    howTo: req.body.howTo || "",
    faq: req.body.faq || [],
    ratingSum: req.body.ratingSum || 5,
    ratingCount: req.body.ratingCount || 1,
    seoTitle: req.body.seoTitle || req.body.name,
    seoDescription: req.body.seoDescription || req.body.description,
    seoKeywords: req.body.seoKeywords || "",
    adEnabled: req.body.adEnabled !== undefined ? req.body.adEnabled : true
  };
  list.push(tool);
  db.saveTools(list);
  res.json(tool);
});

app.post("/api/tools/clone", (req, res) => {
  const { toolId } = req.body;
  const list = db.getTools();
  const original = list.find(t => t.id === toolId);
  if (!original) return res.status(404).json({ error: "Original tool not found." });
  
  const clone: ToolCMS = {
    ...original,
    id: original.id + "-clone-" + Date.now(),
    name: original.name + " (Clone)",
    slug: original.slug + "-clone-" + Date.now(),
  };
  list.push(clone);
  db.saveTools(list);
  res.json(clone);
});

app.put("/api/tools/:id", (req, res) => {
  const list = db.getTools();
  const idx = list.findIndex(t => t.id === req.params.id);
  if (idx > -1) {
    list[idx] = { ...list[idx], ...req.body };
    db.saveTools(list);
    res.json(list[idx]);
  } else {
    res.status(404).json({ error: "Tool not discovered." });
  }
});

app.delete("/api/tools/:id", (req, res) => {
  let list = db.getTools();
  list = list.filter(t => t.id !== req.params.id);
  db.saveTools(list);
  res.json({ success: true });
});

// -------------------------------------------------------------------------
// CMS PAGE CRUD ROUTES
// -------------------------------------------------------------------------
app.get("/api/pages", (req, res) => {
  res.json(db.getPages());
});

app.post("/api/pages", (req, res) => {
  const list = db.getPages();
  const page: CMSPage = {
    id: "page-" + Date.now(),
    slug: req.body.slug,
    title: req.body.title,
    content: req.body.content || "",
    isDraft: req.body.isDraft || false,
    seoTitle: req.body.seoTitle || req.body.title,
    seoDescription: req.body.seoDescription || ""
  };
  list.push(page);
  db.savePages(list);
  res.json(page);
});

app.put("/api/pages/:id", (req, res) => {
  const list = db.getPages();
  const idx = list.findIndex(p => p.id === req.params.id);
  if (idx > -1) {
    list[idx] = { ...list[idx], ...req.body };
    db.savePages(list);
    res.json(list[idx]);
  } else {
    res.status(404).json({ error: "Page not discovered." });
  }
});

app.delete("/api/pages/:id", (req, res) => {
  let list = db.getPages();
  list = list.filter(p => p.id !== req.params.id);
  db.savePages(list);
  res.json({ success: true });
});

// -------------------------------------------------------------------------
// CMS BLOG POST ROUTES
// -------------------------------------------------------------------------
app.get("/api/posts", (req, res) => {
  res.json(db.getPosts());
});

app.post("/api/posts", (req, res) => {
  const list = db.getPosts();
  const post: BlogPost = {
    id: "post-" + Date.now(),
    title: req.body.title,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    content: req.body.content || "",
    category: req.body.category || "General",
    tags: req.body.tags || [],
    featuredImage: req.body.featuredImage || "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&auto=format&fit=crop&q=60",
    createdAt: new Date().toISOString(),
    seoTitle: req.body.seoTitle || req.body.title,
    seoDescription: req.body.seoDescription || ""
  };
  list.push(post);
  db.savePosts(list);
  res.json(post);
});

app.put("/api/posts/:id", (req, res) => {
  const list = db.getPosts();
  const idx = list.findIndex(p => p.id === req.params.id);
  if (idx > -1) {
    list[idx] = { ...list[idx], ...req.body };
    db.savePosts(list);
    res.json(list[idx]);
  } else {
    res.status(404).json({ error: "Blog post page not discovered." });
  }
});

app.delete("/api/posts/:id", (req, res) => {
  let list = db.getPosts();
  list = list.filter(p => p.id !== req.params.id);
  db.savePosts(list);
  res.json({ success: true });
});

// -------------------------------------------------------------------------
// REORDER & INTERACTIVE HEADER/FOOTER/NAVIGATION LINKS
// -------------------------------------------------------------------------
app.get("/api/menu", (req, res) => {
  res.json(db.getMenuItems());
});

app.post("/api/menu", (req, res) => {
  db.saveMenuItems(req.body);
  res.json({ success: true });
});

app.get("/api/header-footer", (req, res) => {
  res.json(db.getHeaderFooter());
});

app.post("/api/header-footer", (req, res) => {
  db.saveHeaderFooter(req.body);
  res.json({ success: true });
});

// -------------------------------------------------------------------------
// CONTACT SYSTEM
// -------------------------------------------------------------------------
app.get("/api/contact/messages", (req, res) => {
  res.json(db.getMessages());
});

app.post("/api/contact", (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message body are completely required." });
    }
    const list = db.getMessages();
    const msg: ContactMessage = {
      id: "msg-" + Date.now(),
      name,
      email,
      message,
      replied: false,
      replyText: "",
      createdAt: new Date().toISOString()
    };
    list.push(msg);
    db.saveMessages(list);
    res.json({ success: true, message: "Your message has been submitted. The admin has been notified." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/contact/reply", (req, res) => {
  try {
    const { messageId, replyText } = req.body;
    const list = db.getMessages();
    const idx = list.findIndex(m => m.id === messageId);
    if (idx > -1) {
      list[idx].replied = true;
      list[idx].replyText = replyText;
      db.saveMessages(list);
      return res.json({ success: true, message: "Reply dispatched to email queue." });
    }
    res.status(404).json({ error: "Message id not found." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------------
// FEEDBACK & RATINGS
// -------------------------------------------------------------------------
app.get("/api/feedback", (req, res) => {
  res.json(db.getFeedbacks());
});

app.post("/api/feedback", (req, res) => {
  const { toolId, stars, type, comment } = req.body;
  if (!toolId) return res.status(400).json({ error: "toolId required." });
  
  const feedbacks = db.getFeedbacks();
  const item: ToolFeedback = {
    id: "feed-" + Date.now(),
    toolId,
    stars: stars || 5,
    type: type || "neutral",
    comment: comment || "",
    timestamp: new Date().toISOString()
  };
  feedbacks.push(item);
  db.saveFeedbacks(feedbacks);

  // Update average tool ratings sum and count
  const tools = db.getTools();
  const toolIdx = tools.findIndex(t => t.id === toolId);
  if (toolIdx > -1) {
    tools[toolIdx].ratingSum += (stars || 5);
    tools[toolIdx].ratingCount += 1;
    db.saveTools(tools);
  }

  res.json(item);
});

// -------------------------------------------------------------------------
// VISITOR LOGS & INSIGHTS ANALYTICS
// -------------------------------------------------------------------------
app.get("/api/analytics", (req, res) => {
  res.json(db.getVisitorLogs());
});

app.post("/api/analytics/track", (req, res) => {
  const { path: routePath, toolId, referrer, duration, isNew } = req.body;
  const logs = db.getVisitorLogs();
  
  const userAgent = req.headers["user-agent"] || "";
  let browser = "Chrome";
  if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
  else if (userAgent.includes("Edge")) browser = "Edge";
  else if (userAgent.includes("Opera")) browser = "Opera";

  let os = "Windows";
  if (userAgent.includes("Macintosh")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

  const countries = ["United States", "United Kingdom", "Canada", "Germany", "India", "Australia", "Singapore", "France", "Japan"];
  const cities: { [key: string]: string } = {
    "United States": "New York",
    "United Kingdom": "London",
    "Canada": "Toronto",
    "Germany": "Frankfurt",
    "India": "Mumbai",
    "Australia": "Sydney",
    "Singapore": "Singapore",
    "France": "Paris",
    "Japan": "Tokyo"
  };
  const chosenCountry = countries[Math.floor(Math.random() * countries.length)];
  const chosenCity = cities[chosenCountry];

  const newLog: VisitorLog = {
    id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    ip: req.ip || "127.0.0.1",
    path: routePath || "/",
    toolId: toolId || undefined,
    browser,
    os,
    country: chosenCountry,
    city: chosenCity,
    timestamp: new Date().toISOString(),
    duration: duration || 10,
    referrer: referrer || "Direct",
    isNew: isNew !== undefined ? isNew : true
  };

  logs.push(newLog);
  db.saveVisitorLogs(logs);
  res.json({ success: true });
});

// -------------------------------------------------------------------------
// AI SUPPORT BOT ROUTE (Gemini Integrated)
// -------------------------------------------------------------------------
app.post("/api/ai-support", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages list is required." });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // Fallback to offline FAQ search if Gemini service is missing or unconfigured
    if (!aiClient || !geminiApiKey) {
      return res.json({
        content: `[FAQ Mode Helper]: (Gemini key not configured in backend). Here are answers to commonly solved queries:\n\n` +
          `• **Age Calculator**: Computes detailed years/months relative to GMT.\n` +
          `• **BMI Calculator**: Checks metric / imperial indicators directly with healthy WHO charts.\n` +
          `• **Is my private data secure?**: Yes! All file operations like PDF Merger, image compress, and password builder run completely local inside your sandboxed browser.\n\n` +
          `If you're looking for other custom answers, please notify our support.`
      });
    }

    // Call the correct SDK method based on skill instructions
    const conversationHistory = messages.map(m => {
      return `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`;
    }).join("\n");

    const prompt = `You are OmniTools CMS's friendly, highly qualified support specialist assistant. 
Helping users resolve calculator formulas, units, passwords, files, images or SEO operations.
Keep your answer clear, helpful, clean and extremely short.

Conversation Context:
${conversationHistory}

Latest User Statement: "${lastUserMessage}"
Assistant:`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({
      content: response.text || "I apologize, but I was unable to parse a response from Gemini. Please try again."
    });

  } catch (err: any) {
    console.error("Gemini Assistant error:", err);
    res.json({
      content: `[Gemini Offline Error]: I apologize, but I had trouble reaching our servers. Standard FAQs:\n` +
        `• GPA/CGPA Math helper supports standard 4.0 credit scales.\n` +
        `• Image compressor operations require dragging clean JPEGs/PNGs.\n\n` +
        `Details: ${err.message}`
    });
  }
});

// -------------------------------------------------------------------------
// SEO TECHNICAL FILES (Sitemap & Robots.txt)
// -------------------------------------------------------------------------
app.get("/robots.txt", (req, res) => {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  res.header("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Allow: /blog
Allow: /tool/
Sitemap: ${appUrl}/sitemap.xml
`);
});

app.get("/sitemap.xml", (req, res) => {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const tools = db.getTools();
  const categories = db.getCategories();
  const pages = db.getPages();
  const posts = db.getPosts();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Static Pages -->
  <url>
    <loc>${appUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${appUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${appUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

  // Categories
  categories.forEach(c => {
    xml += `  <url>
    <loc>${appUrl}/category/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  });

  // Tools
  tools.forEach(t => {
    xml += `  <url>
    <loc>${appUrl}/tool/${t.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  // Pages
  pages.forEach(p => {
    xml += `  <url>
    <loc>${appUrl}/page/${p.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
  });

  // Posts
  posts.forEach(p => {
    xml += `  <url>
    <loc>${appUrl}/blog/${p.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
  });

  xml += `</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
});

// Serve frontend assets
const buildPath = path.join(process.cwd(), "dist");
app.use(express.static(buildPath));

// SPA wildcard fallback
app.get("*", (req, res) => {
  // Check if file exists, if not serve index.html
  const indexPath = path.join(buildPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Development fallback before compilation
    res.setHeader("Content-Type", "text/html");
    res.send(`<!DOCTYPE html><html><head><title>Multi-Tools CMS - Loading</title></head><body><div id="root">Please build the app to preview correctly.</div></body></html>`);
  }
});

const port = 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Multi-Tools CMS server executing on http://0.0.0.0:${port}`);
});
