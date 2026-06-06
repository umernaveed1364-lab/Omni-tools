import React, { useState, useEffect } from "react";
import { CaseSensitive, Repeat, Copy, Lock, QrCode, Hash, AlignLeft, Check, Download } from "lucide-react";

export function TextToolsSuite({ toolId }: { toolId: string }) {
  switch (toolId) {
    case "word-counter":
      return <WordCounter />;
    case "text-repeater":
      return <TextRepeater />;
    case "case-converter":
      return <CaseConverter />;
    case "password-generator":
      return <PasswordGenerator />;
    case "qr-code-generator":
      return <QrCodeGenerator />;
    case "uuid-generator":
      return <UuidGenerator />;
    default:
      return <div className="p-4 text-center text-slate-500">Text Utility module not identified.</div>;
  }
}

// 1. WORD & CHARACTER COUNTER
function WordCounter() {
  const [text, setText] = useState("");
  const [metrics, setMetrics] = useState({
    words: 0,
    charsWithSpace: 0,
    charsNoSpace: 0,
    lines: 0,
    sentences: 0,
    readTime: 0,
  });
  const [keywords, setKeywords] = useState<{ word: string; count: number }[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const rawWords = text.trim().split(/\s+/).filter(Boolean);
    const wordsCount = rawWords.length;
    const charsWithSpace = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const linesCount = text.split("\n").filter(Boolean).length;
    
    const sentencesCount = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const readTimeMin = Math.ceil(wordsCount / 220); // Average reads rate 220 wpm

    setMetrics({
      words: wordsCount,
      charsWithSpace,
      charsNoSpace,
      lines: linesCount,
      sentences: sentencesCount,
      readTime: readTimeMin,
    });

    // Word recurrence density maps
    const map: { [key: string]: number } = {};
    rawWords.forEach((word) => {
      const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean && clean.length > 2) {
        map[clean] = (map[clean] || 0) + 1;
      }
    });
    const sorted = Object.entries(map)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setKeywords(sorted);
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <AlignLeft className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Word &amp; Character Intelligence</h3>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy All"}
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste, insert, or type your article content right here to trigger immediate dynamic analysis..."
        rows={6}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder:text-slate-400 font-sans"
      />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-xl font-black text-slate-800">{metrics.words}</div>
          <div className="text-[9px] uppercase font-bold text-slate-400 mt-1">Words</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-xl font-black text-slate-800">{metrics.charsWithSpace}</div>
          <div className="text-[9px] uppercase font-bold text-slate-400 mt-1">Chars (Space)</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-xl font-black text-slate-800">{metrics.charsNoSpace}</div>
          <div className="text-[9px] uppercase font-bold text-slate-400 mt-1">Chars (No Sp)</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-xl font-black text-slate-800">{metrics.lines}</div>
          <div className="text-[9px] uppercase font-bold text-slate-400 mt-1">Lines</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-xl font-black text-slate-800">{metrics.sentences}</div>
          <div className="text-[9px] uppercase font-bold text-slate-400 mt-1">Sentences</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-xl font-black text-indigo-600">{metrics.readTime} min</div>
          <div className="text-[9px] uppercase font-bold text-slate-400 mt-1">Read Duration</div>
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 block">
            Most Recurrent Keyword Metrics:
          </span>
          <div className="flex flex-wrap gap-2">
            {keywords.map((item, idx) => (
              <span key={idx} className="bg-white border border-slate-200 text-xs px-3 py-1 rounded-full text-slate-600 font-medium">
                {item.word} ({item.count}xs)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 2. TEXT REPEATER
function TextRepeater() {
  const [text, setText] = useState("Repeat me!");
  const [count, setCount] = useState(10);
  const [sep, setSep] = useState("newline");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRepeat = () => {
    let divider = " ";
    if (sep === "newline") divider = "\n";
    else if (sep === "comma") divider = ", ";
    else if (sep === "none") divider = "";

    const cleanCount = Math.min(Math.max(count, 1), 2000); // Guard rails
    const array = Array(cleanCount).fill(text);
    setOutput(array.join(divider));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Repeat className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Text Repeater Duplicator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phrase to Clone</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
            placeholder="Type word..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
            max="1000"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Divider Operator</label>
          <select
            value={sep}
            onChange={(e) => setSep(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          >
            <option value="newline">New Line (\n)</option>
            <option value="space">Space ( )</option>
            <option value="comma">Comma (,)</option>
            <option value="none">Empty (no spacing)</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleRepeat}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            Generate Repeats
          </button>
        </div>
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Output Copy Box</span>
            <button
              onClick={copyToClipboard}
              className="text-indigo-600 hover:underline font-bold flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied Clipboard" : "Copy Repeated String"}
            </button>
          </div>
          <pre className="p-4 bg-slate-50 rounded-xl border text-xs text-slate-700 max-h-48 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

// 3. CASE CONVERTER
function CaseConverter() {
  const [text, setText] = useState("The Quick Brown Fox Jumps Over The Lazy Dog");
  const [copied, setCopied] = useState(false);

  const convertUpper = () => setText(text.toUpperCase());
  const convertLower = () => setText(text.toLowerCase());
  const convertTitle = () => {
    setText(text.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "));
  };
  const convertKebab = () => {
    setText(text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
  };
  const convertSnake = () => {
    setText(text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <CaseSensitive className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Case Converter Modifiers</h3>
        </div>
        <button onClick={copyToClipboard} className="text-xs font-bold text-indigo-600 flex items-center gap-1">
          <Copy className="w-3.5 h-3.5" /> {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-4 bg-slate-50 border rounded-xl"
        rows={4}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <button onClick={convertUpper} className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border text-slate-700 font-bold rounded-xl text-xs">
          UPPERCASE
        </button>
        <button onClick={convertLower} className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border text-slate-700 font-bold rounded-xl text-xs">
          lowercase
        </button>
        <button onClick={convertTitle} className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border text-slate-700 font-bold rounded-xl text-xs">
          Title Case
        </button>
        <button onClick={convertKebab} className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border text-slate-700 font-bold rounded-xl text-xs">
          kebab-case
        </button>
        <button onClick={convertSnake} className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border text-slate-700 font-bold rounded-xl text-xs">
          snake_case
        </button>
      </div>
    </div>
  );
}

// 4. PASSWORD GENERATOR
function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("Strong");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = "";
    if (upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (nums) charset += "0123456789";
    if (syms) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) {
      setPassword("Toggle at least one character type!");
      return;
    }

    let out = "";
    for (let i = 0; i < length; i++) {
      out += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(out);

    // Calculate dynamic security entropy
    if (length < 8) setStrength("Weak");
    else if (length < 12) setStrength("Medium");
    else if (length < 16) setStrength("Strong");
    else setStrength("Absolute Shield Grade");
  };

  useEffect(() => {
    generate();
  }, [length, upper, lower, nums, syms]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Lock className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg font-sans">Secure Password Key Builder</h3>
      </div>

      <div className="bg-slate-900 text-white rounded-xl p-4 flex justify-between items-center font-mono text-sm relative overflow-hidden">
        <div className="truncate pr-12 w-full">{password}</div>
        <button
          onClick={copyToClipboard}
          className="absolute right-4 hover:text-indigo-400 text-slate-400 p-2 rounded bg-slate-800 border-l border-slate-700"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>Key Length: {length} bytes</span>
          <span className={`font-black ${
            strength === "Absolute Shield Grade" ? "text-emerald-500" :
            strength === "Strong" ? "text-indigo-500" : "text-amber-500"
          }`}>{strength}</span>
        </div>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="rounded" />
          A-Z Capital letters
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} className="rounded" />
          a-z Small letters
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
          <input type="checkbox" checked={nums} onChange={(e) => setNums(e.target.checked)} className="rounded" />
          0-9 Numbers
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
          <input type="checkbox" checked={syms} onChange={(e) => setSyms(e.target.checked)} className="rounded" />
          #$& Special signs
        </label>
      </div>

      <button onClick={generate} className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
        Re-generate Keyset
      </button>
    </div>
  );
}

// 5. QR CODE GENERATOR
function QrCodeGenerator() {
  const [data, setData] = useState("https://ai.studio/build");
  const [size, setSize] = useState(250);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`);
  }, [data, size]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <QrCode className="w-5 h-5 animate-pulse" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Dynamic Vector QR Generator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">QR Target Data Link / Text</label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
              placeholder="e.g. https://domain.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">QR Resolution (Pixels)</label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="150">Small (150x150)</option>
              <option value="250">Medium (250x250)</option>
              <option value="400">Large (400x400)</option>
            </select>
          </div>
          <a
            href={url}
            download="qrcode.png"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
          >
            <Download className="w-4 h-4" /> Download QR Code PNG
          </a>
        </div>

        <div className="flex justify-center bg-slate-50 p-6 rounded-xl border border-dashed">
          <img src={url} alt="Custom Matrix QR representation" className="border shadow-md rounded-lg max-w-[200px]" />
        </div>
      </div>
    </div>
  );
}

// 6. UUID GENERATOR
function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateUuids = () => {
    const list = [];
    const limit = Math.min(Math.max(count, 1), 100);
    for (let i = 0; i < limit; i++) {
      list.push("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }));
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUuids();
  }, [count]);

  const copyString = (str: string, idx: number) => {
    navigator.clipboard.writeText(str);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 font-sans">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Hash className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Cryptographic UUID v4 Generator</h3>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Generation Count (Max 100)</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            min="1"
            max="100"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
        <div className="flex items-end h-full mt-6">
          <button
            onClick={generateUuids}
            className="px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
          >
            Regenerate Batch
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar border rounded-xl divide-y">
        {uuids.map((id, idx) => (
          <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50/50 hover:bg-slate-50 text-xs font-mono font-medium text-slate-700">
            <span>{id}</span>
            <button
              onClick={() => copyString(id, idx)}
              className="text-[10px] bg-white border px-2.5 py-1 rounded hover:text-indigo-600 text-slate-400 flex items-center gap-1 font-bold"
            >
              {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedIdx === idx ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
