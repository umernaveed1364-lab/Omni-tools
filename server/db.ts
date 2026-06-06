import fs from "fs";
import path from "path";

// Define the data types
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  favorites: string[]; // toolIds
  history: { toolId: string; timestamp: string; name: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  description: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolCMS {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  howTo: string;
  faq: ToolFAQ[];
  ratingSum: number;
  ratingCount: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  adEnabled: boolean;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content: string; // HTML-like visual content
  isDraft: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  createdAt: string;
  seoTitle: string;
  seoDescription: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
}

export interface HeaderFooterConfig {
  logoUrl: string;
  announcement: string;
  announcementsEnabled: boolean;
  footerCopyright: string;
  footerSections: {
    title: string;
    links: { label: string; url: string }[];
  }[];
}

export interface VisitorLog {
  id: string;
  ip: string;
  path: string;
  toolId?: string; // If viewed a tool
  browser: string;
  os: string;
  country: string;
  city: string;
  timestamp: string;
  duration: number; // in seconds
  referrer: string;
  isNew: boolean;
}

export interface ToolFeedback {
  id: string;
  toolId: string;
  stars: number;
  type: "like" | "dislike" | "neutral";
  comment: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  replied: boolean;
  replyText: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

// Helper to guarantee data file exists and read it
function readJsonFile<T>(filename: string, defaultData: T): T {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${filename}`, e);
    return defaultData;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// Seed categories
const defaultCategories: Category[] = [
  { id: "calc", name: "Calculators", slug: "calculators", order: 1, description: "Professional mathematical modules including finance, health, and academic calculators." },
  { id: "text", name: "Text Tools", slug: "text-tools", order: 2, description: "Advanced text manipulation, case converters, analyzers, and repetition utils." },
  { id: "gen", name: "Generators", slug: "generators", order: 3, description: "Secure credential generators, cryptographic UUID loaders, and custom QR generators." },
  { id: "conv", name: "Converters", slug: "converters", order: 4, description: "Instant measurement, international currencies, and thermal index calculators." },
  { id: "image", name: "Image Tools", slug: "image-tools", order: 5, description: "High-performance browser-side compression, image resizing, and graphic optimization." },
  { id: "pdf", name: "PDF Tools", slug: "pdf-tools", order: 6, description: "On-the-fly multi-file PDF merges and custom visual splitters." }
];

// Seed tools
const defaultTools: ToolCMS[] = [
  // Calculators
  {
    id: "age-calc",
    name: "Age Calculator",
    slug: "age-calculator",
    categoryId: "calc",
    description: "Determine exact age in years, months, weeks, days, and hours from your birth timestamp.",
    howTo: "1. Select your complete Date of Birth from the calendar dropdown.\n2. Optional: Adjust the 'Age at' target date of reference.\n3. Press Calculate to view granular analytics.",
    faq: [
      { question: "How does it handle leap years?", answer: "The calculator accurately checks standard Gregorian calendar constraints, measuring 366-day leap intervals correctly." },
      { question: "Is my birthdate saved?", answer: "Absolutely not. All age math calculation logic is run on-the-fly." }
    ],
    ratingSum: 48,
    ratingCount: 10,
    seoTitle: "Exact Age Calculator - Granular Lifespan Breakdown",
    seoDescription: "Calculate your exact digital age down to the hour, minute, and second with this fast Web Age Calculator.",
    seoKeywords: "age calculator, birthday calculator, calculate exact age, years months days counter",
    adEnabled: true
  },
  {
    id: "bmi-calc",
    name: "BMI Calculator",
    slug: "bmi-calculator",
    categoryId: "calc",
    description: "Calculate your Body Mass Index (BMI) using metric or imperial inputs alongside health analysis guides.",
    howTo: "Input your weight and height in kilograms/cm or lbs/inches. Press submit to identify weight status categories.",
    faq: [{ question: "What is a healthy BMI range?", answer: "According to WHO standards, standard healthy BMIs are between 18.5 and 24.9." }],
    ratingSum: 45,
    ratingCount: 10,
    seoTitle: "BMI Calculator - Instantly Find Your Health Category",
    seoDescription: "Check your Body Mass Index (BMI) easily with instant status gauges and standard WHO weight range breakdowns.",
    seoKeywords: "bmi calculator, body mass index, weight calculator, health index",
    adEnabled: true
  },
  {
    id: "gpa-calc",
    name: "GPA Calculator",
    slug: "gpa-calculator",
    categoryId: "calc",
    description: "Calculate your semester Grade Point Average (GPA) instantly using current grades and credit weightings.",
    howTo: "Add your subject courses, pick class grades (A+, A, B, etc.) and enter credit hours. Press Calculate.",
    faq: [{ question: "Can I add custom weights?", answer: "Yes, you can edit subjects and match standard 4.0 scale grades easily." }],
    ratingSum: 23,
    ratingCount: 5,
    seoTitle: "GPA Calculator - Fast Semester GPA Grade Computations",
    seoDescription: "Quickly compute your semester Grade Point Average (GPA) using credit weight inputs in our clean grid interface.",
    seoKeywords: "gpa calculator, grade calculator, credit hour gpa, semester marks",
    adEnabled: false
  },
  {
    id: "cgpa-calc",
    name: "CGPA Calculator",
    slug: "cgpa-calculator",
    categoryId: "calc",
    description: "Calculate Cumulative Grade Point Average (CGPA) securely across multiple active semesters.",
    howTo: "Enter semester titles, average GPAs, and cumulative credit counts to assess final results.",
    faq: [{ question: "How does CGPA differ from GPA?", answer: "CGPA aggregates stats from all completed semesters, weighted by cumulative credit numbers." }],
    ratingSum: 24,
    ratingCount: 5,
    seoTitle: "CGPA Calculator - Cumulative Multi-Semester Grade Tracker",
    seoDescription: "Compile your accumulated university CGPA easily using cumulative GPA metrics across your entire studies.",
    seoKeywords: "cgpa calculator, cumulative gpa, university grade tracker, marks calculator",
    adEnabled: false
  },
  {
    id: "percentage-calc",
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    categoryId: "calc",
    description: "Perform fast percentage formulas: find fraction values, calculation changes, and visual growth scales.",
    howTo: "Select your percentage question mode (e.g., 'What is X% of Y?'), insert inputs, and get immediate answers.",
    faq: [{ question: "Are negative rates supported?", answer: "Yes, percentage changes correctly report drop ratios and discounts." }],
    ratingSum: 47,
    ratingCount: 10,
    seoTitle: "Percentage Calculator - Fast Growth and Drop Rate Math",
    seoDescription: "Calculate percentage calculations, increases, decreases, and fractions instantly with high mathematical precision.",
    seoKeywords: "percentage calculator, fraction calculator, growth math solver, ratios calculator",
    adEnabled: true
  },
  {
    id: "loan-calc",
    name: "Loan & EMI Calculator",
    slug: "loan-emi-calculator",
    categoryId: "calc",
    description: "Structure auto loans, mortgages, or personal credits. Compute monthly Equated Monthly Installments (EMI).",
    howTo: "Enter loan principal cash, raw interest percentages, and duration months. Press compile to review amortization reports.",
    faq: [{ question: "What is an amortization schedule?", answer: "A detailed timeline highlighting how much of each payment applies to interest vs. principal repayment." }],
    ratingSum: 49,
    ratingCount: 10,
    seoTitle: "Loan Amortization & EMI Calculator - Mortgages Optimizer",
    seoDescription: "Structure personal loans or mortgages accurately with dynamic monthly payback metrics and interest graphics.",
    seoKeywords: "emi calculator, loan calculator, monthly mortgage calculator, amortization table",
    adEnabled: true
  },
  {
    id: "discount-calc",
    name: "Discount Calculator",
    slug: "discount-calculator",
    categoryId: "calc",
    description: "Flesh out discount rate saves. Subtract original lists, sales rates, and optional local taxation scales.",
    howTo: "Enter initial price, discount rates, and optional taxes to get exact purchase prices.",
    faq: [{ question: "Can I compound discounts?", answer: "Yes, you can configure secondary reductions to simulate stackable promotional events." }],
    ratingSum: 42,
    ratingCount: 9,
    seoTitle: "Sales & Discount Calculator - Exact Money Saved",
    seoDescription: "Calculate money saved and final price checks instantly. Perfect for black friday and seasonal shopping clearances.",
    seoKeywords: "discount calculator, coupon calculator, sale price solver, shopping percentage checker",
    adEnabled: false
  },
  {
    id: "profit-calc",
    name: "Profit Calculator",
    slug: "profit-calculator",
    categoryId: "calc",
    description: "Calculate retail markup margins, absolute yield gains, and gross profits on corporate assets.",
    howTo: "Input wholesale inventory costs, retail selling pricing elements, or target markup rates.",
    faq: [{ question: "What is the margin to markup conversion?", answer: "Margin is profits divided by selling price, while markup is profits divided by wholesale inventory costs." }],
    ratingSum: 46,
    ratingCount: 10,
    seoTitle: "Business Profit Margin & Markup Calculator",
    seoDescription: "Estimate retail profit margins, percentage outputs, and business revenue metrics instantly.",
    seoKeywords: "profit calculator, profit margin solver, markup calculator, business financial tool",
    adEnabled: true
  },

  // Text Tools
  {
    id: "word-counter",
    name: "Word Counter",
    slug: "word-counter",
    categoryId: "text",
    description: "Compute letters, non-space characters, words, lines, custom read runtimes, and top-key recurrence metrics.",
    howTo: "Paste or type text into the live field. Review structural counts instantly mapped on the lower gauge drawer.",
    faq: [{ question: "How is reading time computed?", answer: "Based on an average adult silent speed of 220 words per minute." }],
    ratingSum: 49,
    ratingCount: 10,
    seoTitle: "Live Word Counter & Character Analyzer",
    seoDescription: "Count active characters, document sentences, spaces, lines, and speaking runtime on the fly.",
    seoKeywords: "word counter, character counter, letter counter, text length checker",
    adEnabled: true
  },
  {
    id: "text-repeater",
    name: "Text Repeater",
    slug: "text-repeater",
    categoryId: "text",
    description: "Replicating key terms or text up to thousands of coordinates with customized separators.",
    howTo: "Enter string inputs, specify target replication numbers (e.g., 50), and select line splits. Copy output instantly.",
    faq: [{ question: "Does this crash with huge logs?", answer: "No, we optimize memory allocation for immediate bulk downloads." }],
    ratingSum: 38,
    ratingCount: 8,
    seoTitle: "Fast Bulk Text Repeater - Custom Dividers",
    seoDescription: "Repeat phrases, sentences, emojis, or individual numbers instantly with line-break triggers and clipboard support.",
    seoKeywords: "text repeater, sentence duplicator, clone word strings, message spam repeater",
    adEnabled: false
  },
  {
    id: "case-converter",
    name: "Case Converter",
    slug: "case-converter",
    categoryId: "text",
    description: "Format files into lowercase, UPPERCASE, Title Case, Sentence case, kebab-case, or snake_case instantly.",
    howTo: "Insert custom text snippets and click formatting modifiers below the responsive workspace board.",
    faq: [{ question: "Is my original layout safe?", answer: "Yes, you can restore initial text sets with the reset switch." }],
    ratingSum: 44,
    ratingCount: 10,
    seoTitle: "Instant Online Text Case Converter",
    seoDescription: "Transform letters between caps lock, lower case, snake, kebab, and word capitalization schemas instantly.",
    seoKeywords: "case converter, upper case converter, title capitalization checker, snake case generator",
    adEnabled: true
  },

  // Generators
  {
    id: "password-gen",
    name: "Password Generator",
    slug: "password-generator",
    categoryId: "gen",
    description: "Formulate ultra-secure passwords incorporating nested custom numbers, casings, symbols, and length regulators.",
    howTo: "Slide the length gauge, choose character constraints and click generate. Check entropy strength.",
    faq: [{ question: "Can the database read my password?", answer: "No, the script functions entirely inside client-side virtual environments." }],
    ratingSum: 48,
    ratingCount: 10,
    seoTitle: "Secure Random Password Generator - Strong Security Keys",
    seoDescription: "Create strong random cryptographic password keys containing high safety index layouts. Free from leaks.",
    seoKeywords: "password generator, generate strong passwords, key generator, safety checker",
    adEnabled: true
  },
  {
    id: "qr-gen",
    name: "QR Code Generator",
    slug: "qr-code-generator",
    categoryId: "gen",
    description: "Translate URLs, text snippets, phone numbers, or Wi-Fi credentials into scannable custom QR matrix images.",
    howTo: "Input your data target links, adjust dimension ratios, and obtain downloadable high-fidelity QR results.",
    faq: [{ question: "Are QR codes permanent?", answer: "Static QR codes run forever without payment or tracking constraints." }],
    ratingSum: 45,
    ratingCount: 10,
    seoTitle: "QR Code Generator - Generate Free Downloadable QRs",
    seoDescription: "Generate customized high-quality QR codes for brochures, cards, or social links instantly.",
    seoKeywords: "qr code generator, create qr, downloadable vector qr, barcode maker",
    adEnabled: true
  },
  {
    id: "uuid-gen",
    name: "UUID Generator",
    slug: "uuid-generator",
    categoryId: "gen",
    description: "Generate compliant RFC 4122 Version-4 UUID coordinates. Supports bulk generating up to 100 entries.",
    howTo: "Enter your target count, tick customization modifiers, and extract copies of RFC-safe UUID strings.",
    faq: [{ question: "Are these UUIDs truly unique?", answer: "UUID v4 yields 2^122 states, making collisions statistically virtually zero." }],
    ratingSum: 41,
    ratingCount: 9,
    seoTitle: "UUID v4 Generator - High-Performance Unique Identifiers",
    seoDescription: "Generate RFC 4122 compliant single or batch UUID indicators instantly for databases, logs, and development.",
    seoKeywords: "uuid generator, guid generator, uuid v4 maker, develop random identifiers",
    adEnabled: false
  },

  // Converters
  {
    id: "unit-converter",
    name: "Unit Converter",
    slug: "unit-converter",
    categoryId: "conv",
    description: "Cross-translate between length metrics, masses, volumetric units, and area surfaces securely.",
    howTo: "Select your target measurement category, choose original and target unit keys, and type amounts.",
    faq: [{ question: "Is metric system integration compliant?", answer: "All conversion scales are coded according to the International System of Units." }],
    ratingSum: 46,
    ratingCount: 10,
    seoTitle: "Multi-Unit Measurement Converter - Metric and Imperial",
    seoDescription: "Convert length ratios, weight, volume, and geographical areas accurately inside a simple search terminal.",
    seoKeywords: "unit converter, measurement converter, kg to lbs, meters to feet analyzer",
    adEnabled: true
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    slug: "currency-converter",
    categoryId: "conv",
    description: "Track global currency calculations using updated exchange variables securely.",
    howTo: "Select your initial base currency code (e.g. USD), designate target payouts, and view ratios.",
    faq: [{ question: "How often are exchange variables refreshed?", answer: "Rates are simulated and updated daily to align with standard international central files." }],
    ratingSum: 44,
    ratingCount: 10,
    seoTitle: "Currency Converter - International Exchange Ratios",
    seoDescription: "Track live dollar exchange results, euro indicators, rupees, and pounds instantly.",
    seoKeywords: "currency converter, forex calculator, usd to eur exchange, dollar rate tracker",
    adEnabled: true
  },
  {
    id: "temp-converter",
    name: "Temperature Converter",
    slug: "temperature-converter",
    categoryId: "conv",
    description: "Analyze, gauge, and translate Celsius, Fahrenheit, and Kelvin temperature scales instantly.",
    howTo: "Key in values, assign correct source scales, and instantly read equivalent thermal levels.",
    faq: [{ question: "What is absolute zero?", answer: "Absolute zero represents 0 Kelvin, which equates to -273.15 degrees Celsius." }],
    ratingSum: 39,
    ratingCount: 8,
    seoTitle: "Temperature Converter - Celsius Fahrenheit Kelvin solver",
    seoDescription: "Quick thermal conversion calculator supporting celsius parameters, fahrenheit, and kelvin values on the fly.",
    seoKeywords: "temperature converter, celsius to fahrenheit tracker, kelvin temperature solver",
    adEnabled: false
  },

  // Image Tools
  {
    id: "image-compress",
    name: "Image Compressor",
    slug: "image-compressor",
    categoryId: "image",
    description: "Reduce JPEG, PNG, and WebP visual file bytes up to 90% without losing layout clarity.",
    howTo: "1. Upload an image file.\n2. Choose visual output quality utilizing the adjustment slider.\n3. Save compressed file copies.",
    faq: [{ question: "Do my images upload to external networks?", answer: "Never. Compression algorithms are executed 100% inside sandboxed browser canvases, protecting data." }],
    ratingSum: 48,
    ratingCount: 10,
    seoTitle: "Free Browser Image Compressor - Optimize File Size",
    seoDescription: "Reduce image file sizes securely without losing critical visual quality. Compresses local files local in browser.",
    seoKeywords: "image compressor, reduce image size, optimize photos, jpeg compressor",
    adEnabled: true
  },
  {
    id: "image-resize",
    name: "Image Resizer",
    slug: "image-resizer",
    categoryId: "image",
    description: "Alter layout width and height fields using lock ratios to generate ideal image dimensions.",
    howTo: "Specify pixels or scale factor variables, adjust layout locks, and download compiled custom sizes.",
    faq: [{ question: "Does this affect format types?", answer: "Original file formats are fully supported, or convertible to basic JPEG specs." }],
    ratingSum: 45,
    ratingCount: 10,
    seoTitle: "Fast Online Image Resizer - Dimensions Modifier",
    seoDescription: "Resize pixel resolutions, crop scale widths, and expand heights easily while retaining aspect ratio.",
    seoKeywords: "image resizer, change photo dimension, scale height width, photo pixel changer",
    adEnabled: true
  },

  // PDF Tools
  {
    id: "pdf-merge",
    name: "PDF Merger",
    slug: "pdf-merger",
    categoryId: "pdf",
    description: "Unify separate files into a cohesive consolidated PDF document safely.",
    howTo: "Drag files, organize catalog sequence structures, and download compiled merged PDF files.",
    faq: [{ question: "Is there a maximum merge count?", answer: "This workspace works optimally with up to 15 PDFs at a single time." }],
    ratingSum: 47,
    ratingCount: 10,
    seoTitle: "Online PDF Merger - Combine Multiple PDF Files",
    seoDescription: "Securely merge separate PDF documents into a single professional file safely in your browser.",
    seoKeywords: "pdf merger, combine pdfs, join pdf documents, pdf compiler",
    adEnabled: true
  },
  {
    id: "pdf-split",
    name: "PDF Splitter",
    slug: "pdf-splitter",
    categoryId: "pdf",
    description: "Isolate individual page numbers or compile specific sequences to yield distinct PDFs.",
    howTo: "Upload PDF documents, input target page rules (e.g. 1-2, 5), and compile distinct downloads.",
    faq: [{ question: "Can I extract all pages singly?", answer: "Yes, you can trigger bulk page splitting events to download everything zipped." }],
    ratingSum: 43,
    ratingCount: 9,
    seoTitle: "Online PDF Splitter - Extract PDF Pages",
    seoDescription: "Split PDF catalog units, isolate page ranges, and download newly divided files instantly.",
    seoKeywords: "pdf splitter, extract pdf pages, divide pdf documents, pdf cutter",
    adEnabled: false
  }
];

// Seed default Blog Posts
const defaultPosts: BlogPost[] = [
  {
    id: "seo-tips-2026",
    title: "10 Growth Hacking SEO Tips for Tools Websites in 2026",
    slug: "seo-tips-tools-websites-2026",
    content: `SEO-focused tools websites represent a massive goldmine for organic traffic generation. To capture top spot on Google searches for keywords like 'free age calculator' or 'secure password builder', you must play by the rulebook of technical and content schema structures.
    
    ### 1. Zero-CLS (Cumulative Layout Shift) Workspaces
    Ensure your input selectors, results dashboard panels, and advertisement containers are statically sized. If ads or calculated grids trigger layout reflow events, Google penalty thresholds will lower your SEO ranking index dramatically.
    
    ### 2. High Density Schema Markups
    Always declare structural metadata. For individual calculated resources, implement the product-focused *SoftwareApplication* schema combined with *FAQPage* elements for your accordion lists. This increases the chance of having structured snippet previews displayed inside Search Engine Page Results (SERPs).
    
    ### 3. Smart Internal Linking Mesh
    Do not let tool widgets stand isolated. Inter-link your conversion utilities with appropriate calculators (e.g., link the BMI widget directly to a calorie analyzer or percentage modifier). Linking adjacent resources establishes context for ranking indexes.`,
    category: "SEO & Growth",
    tags: ["SEO", "Web Traffic", "Tools CMS", "Schema Markups"],
    featuredImage: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&auto=format&fit=crop&q=60",
    createdAt: "2026-05-15T12:00:00Z",
    seoTitle: "SEO Optimization Masterclass for Tools Directories",
    seoDescription: "Examine high-performance tips to secure top rankings for high-volume calculator searches on Google."
  },
  {
    id: "monetization-strategies",
    title: "Monetizing Your Utility CMS: Ads, Memberships, and Affiliates",
    slug: "monetizing-utility-cms-strategies",
    content: `Utility tools directories enjoy some of the highest page-view counts on the web. Once you solve a user's prompt (like converting kilograms or resizing images), you gain a powerful window of active engagement. Here is how you can monetize this traffic elegantly:
    
    ### 1. Optimize AdSense Placement
    Place responsive banner containers directly in the 'Visual Result' periphery. Because the user's focus naturally rests on calculated BMI tables or password boxes, visual banners adjacent to output spaces yield CTR numbers up to 300% higher than traditional sidebars.
    
    ### 2. Affiliate Integration for Complex Calculators
    If a visitor uses a 'Loan Amortization App' or 'Business Yield Margin Solver', they are likely high-intent buyers. Display curated affiliate widgets offering direct links to professional credit, small-business financial suites, or competitive credit terms.
    
    ### 3. Add Premium, Ads-Free tiers
    Offer developers or bulk users a minimal premium membership subscription. Toggling an ad-free interface and supporting extreme programmatic scale parameters forms high customer lifetime value (LTV).`,
    category: "Monetization",
    tags: ["Google AdSense", "Affiliate Programs", "Premium Tiers"],
    featuredImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60",
    createdAt: "2026-06-01T10:30:00Z",
    seoTitle: "Ultimate Monetization Blueprint for Web Directory Tools",
    seoDescription: "Learn monetization methods for utility widgets, tracking best CTR zones for Google AdSense placements."
  }
];

// Seed default Pages
const defaultPages: CMSPage[] = [
  {
    id: "about-page",
    slug: "about",
    title: "About Our Multi-Tools Hub",
    content: `<div class="prose max-w-none text-gray-700">
      <h2 class="text-2xl font-semibold mb-4 text-gray-900">Empowering Daily Problem Solving</h2>
      <p class="mb-4">Welcome to the ultimate directory for high-fidelity interactive calculators, text utilities, secure builders, and conversion suites. We construct professional workspace systems that function entirely inside browser memory, offering fast responses with high private safety indices.</p>
      <p class="mb-4">Our philosophy focuses on high accessibility, modern user experiences, mobile-first optimization, and zero registration barriers. Whether you are validating university marks, organizing system code variables, or preparing graphic resources, our toolkit is here for you.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div class="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <h3 class="font-bold text-slate-800 text-lg mb-2">⚡ Zero Latency</h3>
          <p class="text-sm">90% of our utility tools execute locally inside JavaScript runtimes, loading responses in milliseconds.</p>
        </div>
        <div class="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <h3 class="font-bold text-slate-800 text-lg mb-2">🔒 Private by Design</h3>
          <p class="text-sm">File operations like password generation and image squeezing run completely client-side. We never record your files.</p>
        </div>
        <div class="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <h3 class="font-bold text-slate-800 text-lg mb-2">🤖 AI Integrations</h3>
          <p class="text-sm">Need deep advice? Chat with our integrated Gemini assistant at any spot using the global floating portal.</p>
        </div>
      </div>
    </div>`,
    isDraft: false,
    seoTitle: "About Us - Fast, Secure Multi-Tool CMS Solutions",
    seoDescription: "Discover how we build high-speed browser-side mathematical calculators and file processors safely."
  }
];

// Seed default Menu items
const defaultMenu: MenuItem[] = [
  { id: "m1", label: "Home", url: "/", order: 1 },
  { id: "m2", label: "Calculators", url: "/category/calculators", order: 2 },
  { id: "m3", label: "Text Tools", url: "/category/text-tools", order: 3 },
  { id: "m4", label: "Generators", url: "/category/generators", order: 4 },
  { id: "m5", label: "Converters", url: "/category/converters", order: 5 },
  { id: "m6", label: "Blog", url: "/blog", order: 6 },
  { id: "m7", label: "About", url: "/page/about", order: 7 },
  { id: "m8", label: "Contact", url: "/contact", order: 8 },
  { id: "m9", label: "Test Suites", url: "/test-suites", order: 9 }
];

// Seed default Header & Footer
const defaultHeaderFooter: HeaderFooterConfig = {
  logoUrl: "",
  announcement: "🎉 Update: Integrated new high-performance PDF merger and secure UUID v4 generator!",
  announcementsEnabled: true,
  footerCopyright: "© 2026 Multi-Tools CMS with SEO Analytics. Built for ultimate speed and privacy.",
  footerSections: [
    {
      title: "Popular Categories",
      links: [
        { label: "Calculators", url: "/category/calculators" },
        { label: "Text Tools", url: "/category/text-tools" },
        { label: "Generators", url: "/category/generators" },
        { label: "Converters", url: "/category/converters" }
      ]
    },
    {
      title: "Quick Utilities",
      links: [
        { label: "Age Calculator", url: "/tool/age-calculator" },
        { label: "BMI Health Tracker", url: "/tool/bmi-calculator" },
        { label: "Word Counter", url: "/tool/word-counter" },
        { label: "Password Creator", url: "/tool/password-generator" }
      ]
    },
    {
      title: "Legal & Info",
      links: [
        { label: "About Page", url: "/page/about" },
        { label: "Contact Us", url: "/contact" },
        { label: "XML Sitemap", url: "/sitemap.xml" },
        { label: "Interactive Tests", url: "/test-suites" }
      ]
    }
  ]
};

// Seed authentic Visitor Logs for realistic Analytics graphs
function generateSeedVisitorLogs(): VisitorLog[] {
  const logs: VisitorLog[] = [];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge", "Opera"];
  const osList = ["Windows", "macOS", "Linux", "Android", "iOS"];
  const countries = [
    { country: "United States", city: "New York" },
    { country: "United Kingdom", city: "London" },
    { country: "Canada", city: "Toronto" },
    { country: "Germany", city: "Berlin" },
    { country: "India", city: "Mumbai" },
    { country: "Australia", city: "Sydney" },
    { country: "Pakistan", city: "Lahore" }
  ];
  const paths = [
    "/", "/blog", "/page/about", "/contact",
    "/tool/age-calculator", "/tool/bmi-calculator",
    "/tool/password-calculator", "/tool/word-counter",
    "/category/calculators", "/category/text-tools"
  ];
  const tools = ["age-calc", "bmi-calc", "word-counter", "password-gen", "loan-calc", "percentage-calc", "image-compress"];

  const now = new Date();
  
  // Generate 250 backdated visitor records spanning 14 days
  for (let i = 0; i < 250; i++) {
    const daysAgo = Math.floor(Math.random() * 14);
    const logDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 12 * 60 * 60 * 1000);
    const countryObj = countries[Math.floor(Math.random() * countries.length)];
    const chosenPath = paths[Math.floor(Math.random() * paths.length)];
    const isTool = chosenPath.startsWith("/tool/");
    const toolId = isTool ? tools[Math.floor(Math.random() * tools.length)] : undefined;
    
    logs.push({
      id: `seed-log-${i}`,
      ip: `192.168.1.${10 + Math.floor(Math.random() * 200)}`,
      path: chosenPath,
      toolId: toolId,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      os: osList[Math.floor(Math.random() * osList.length)],
      country: countryObj.country,
      city: countryObj.city,
      timestamp: logDate.toISOString(),
      duration: 10 + Math.floor(Math.random() * 180),
      referrer: Math.random() > 0.4 ? "Google" : Math.random() > 0.5 ? "Direct" : "GitHub",
      isNew: Math.random() > 0.3
    });
  }

  // Sort logs chronologically to make charts smooth
  return logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Seed authentic tool feedbacks
const defaultFeedback: ToolFeedback[] = [
  { id: "f1", toolId: "age-calc", stars: 5, type: "like", comment: "Granular details are super accurate. Finding age down to seconds is amazing!", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 * 24).toISOString() },
  { id: "f2", toolId: "bmi-calc", stars: 4, type: "like", comment: "Perfect layout, very convenient for immediate weight diagnostics.", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 * 24).toISOString() },
  { id: "f3", toolId: "password-gen", stars: 5, type: "like", comment: "The strength tracker guide is really intuitive.", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 * 24).toISOString() }
];

// Core controller for reading and writing JSON DBs
export const db = {
  getUsers: () => readJsonFile<User[]>("users.json", []),
  saveUsers: (data: User[]) => writeJsonFile("users.json", data),

  getCategories: () => readJsonFile<Category[]>("categories.json", defaultCategories),
  saveCategories: (data: Category[]) => writeJsonFile("categories.json", data),

  getTools: () => readJsonFile<ToolCMS[]>("tools.json", defaultTools),
  saveTools: (data: ToolCMS[]) => writeJsonFile("tools.json", data),

  getPages: () => readJsonFile<CMSPage[]>("pages.json", defaultPages),
  savePages: (data: CMSPage[]) => writeJsonFile("pages.json", data),

  getPosts: () => readJsonFile<BlogPost[]>("posts.json", defaultPosts),
  savePosts: (data: BlogPost[]) => writeJsonFile("posts.json", data),

  getMenuItems: () => readJsonFile<MenuItem[]>("menu.json", defaultMenu),
  saveMenuItems: (data: MenuItem[]) => writeJsonFile("menu.json", data),

  getHeaderFooter: () => readJsonFile<HeaderFooterConfig>("headerFooter.json", defaultHeaderFooter),
  saveHeaderFooter: (data: HeaderFooterConfig) => writeJsonFile("headerFooter.json", data),

  getVisitorLogs: () => readJsonFile<VisitorLog[]>("visitor_logs.json", generateSeedVisitorLogs()),
  saveVisitorLogs: (data: VisitorLog[]) => writeJsonFile("visitor_logs.json", data),

  getFeedbacks: () => readJsonFile<ToolFeedback[]>("feedbacks.json", defaultFeedback),
  saveFeedbacks: (data: ToolFeedback[]) => writeJsonFile("feedbacks.json", data),

  getMessages: () => readJsonFile<ContactMessage[]>("messages.json", []),
  saveMessages: (data: ContactMessage[]) => writeJsonFile("messages.json", data),

  getSettings: () => readJsonFile<{ openAiKey?: string; faqEnabled: boolean }>("settings.json", { openAiKey: "", faqEnabled: true }),
  saveSettings: (data: { openAiKey?: string; faqEnabled: boolean }) => writeJsonFile("settings.json", data)
};
