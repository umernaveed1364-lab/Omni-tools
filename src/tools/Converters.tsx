import React, { useState, useEffect } from "react";
import { Compass, Coins, Thermometer, RefreshCw } from "lucide-react";

export function ConvertersSuite({ toolId }: { toolId: string }) {
  switch (toolId) {
    case "unit-converter":
      return <UnitConverter />;
    case "currency-converter":
      return <CurrencyConverter />;
    case "temperature-converter":
      return <TemperatureConverter />;
    default:
      return <div className="p-4 text-center text-slate-500">Converter module not identified.</div>;
  }
}

// 1. MEASUREMENT UNIT CONVERTER
function UnitConverter() {
  const [val, setVal] = useState(1);
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [result, setResult] = useState<number | null>(null);

  const unitsMap: { [key: string]: { [key: string]: number } } = {
    length: {
      m: 1,
      ft: 3.28084,
      in: 39.3701,
      cm: 100,
      km: 0.001,
      miles: 0.000621371,
    },
    weight: {
      kg: 1,
      lbs: 2.20462,
      g: 1000,
      oz: 35.274,
    },
    volume: {
      liters: 1,
      gallons: 0.264172,
      milliliters: 1000,
      cups: 4.16667,
    }
  };

  useEffect(() => {
    // Reset units when category shifts
    const keys = Object.keys(unitsMap[category]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  }, [category]);

  const handleConvert = () => {
    const list = unitsMap[category];
    const baseVal = val / list[fromUnit]; // Convert to base unit ratio
    const out = baseVal * list[toUnit]; // Convert to target unit ratio
    setResult(parseFloat(out.toFixed(5)));
  };

  useEffect(() => {
    handleConvert();
  }, [val, category, fromUnit, toUnit]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Universal Dimension Converter</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dimension category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          >
            <option value="length">Length metrics (Meters, Feet, Miles...)</option>
            <option value="weight">Mass weights (Kilograms, Pounds, Ounces...)</option>
            <option value="volume">Volumetric liquids (Liters, Gallons, Cups...)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Original value</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl uppercase tracking-widest text-xs font-bold"
            >
              {Object.keys(unitsMap[category]).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl uppercase tracking-widest text-xs font-bold"
            >
              {Object.keys(unitsMap[category]).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {result !== null && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 uppercase">Conversion Output</span>
            <span className="text-xl font-black text-slate-900">
              {val} <span className="uppercase text-xs text-slate-400">{fromUnit}</span> = {result} <span className="uppercase text-xs text-indigo-500 font-bold">{toUnit}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. CURRENCY CONVERTER
function CurrencyConverter() {
  const [val, setVal] = useState(100);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("EUR");
  const [result, setResult] = useState<number | null>(null);

  // Simulated exchange matrix updated Daily
  const exchangeRates: { [key: string]: { [key: string]: number } } = {
    USD: { USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.36, INR: 83.2, AUD: 1.51, PKR: 278.4, JPY: 156.4, CNY: 7.24 },
    EUR: { USD: 1.09, EUR: 1, GBP: 0.85, CAD: 1.48, INR: 90.4, AUD: 1.64, PKR: 302.6, JPY: 170.0, CNY: 7.87 },
    GBP: { USD: 1.28, EUR: 1.18, GBP: 1, CAD: 1.74, INR: 106.6, AUD: 1.93, PKR: 356.9, JPY: 200.5, CNY: 9.28 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0094, CAD: 0.016, INR: 1, AUD: 0.018, PKR: 3.34, JPY: 1.88, CNY: 0.087 }
  };

  const handleConvert = () => {
    // If rate defined directly, map it, otherwise route through USD base index
    const fromRates = exchangeRates[fromCurr];
    if (fromRates && fromRates[toCurr]) {
      setResult(parseFloat((val * fromRates[toCurr]).toFixed(2)));
    } else {
      // Fallback cross math through USD base units
      const baseToUsd = 1 / (exchangeRates["USD"][fromCurr] || 1);
      const usdToTarget = exchangeRates["USD"][toCurr] || 1;
      const rate = baseToUsd * usdToTarget;
      setResult(parseFloat((val * rate).toFixed(2)));
    }
  };

  useEffect(() => {
    handleConvert();
  }, [val, fromCurr, toCurr]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <Coins className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Currencies Exchange Rate Converter</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Capital cash amount</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Original Base Currency</label>
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Destination Currency</label>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="PKR">PKR - Pakistan Rupee</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CNY">CNY - Chinese Yuan</option>
            </select>
          </div>
        </div>

        {result !== null && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xl font-black text-slate-900">{val} {fromCurr}</span>
              <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">Given Amount</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-600">{result} {toCurr}</span>
              <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">Exchanged Output payout</p>
            </div>
          </div>
        )}

        <div className="text-[10px] text-slate-400 font-bold bg-slate-50 border p-3 rounded-lg flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Note: Exchange ratings are simulated index coordinates updated in daily intervals. Not viable for automated arbitrage trading.</span>
        </div>
      </div>
    </div>
  );
}

// 3. TEMPERATURE CONVERTER
function TemperatureConverter() {
  const [celsius, setCelsius] = useState<string>("25");
  const [fahrenheit, setFahrenheit] = useState<string>("77");
  const [kelvin, setKelvin] = useState<string>("298.15");

  const handleCelsius = (val: string) => {
    setCelsius(val);
    if (val === "" || isNaN(Number(val))) {
      setFahrenheit("");
      setKelvin("");
      return;
    }
    const c = Number(val);
    setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
    setKelvin((c + 273.15).toFixed(2));
  };

  const handleFahrenheit = (val: string) => {
    setFahrenheit(val);
    if (val === "" || isNaN(Number(val))) {
      setCelsius("");
      setKelvin("");
      return;
    }
    const f = Number(val);
    const c = ((f - 32) * 5) / 9;
    setCelsius(c.toFixed(2));
    setKelvin((c + 273.15).toFixed(2));
  };

  const handleKelvin = (val: string) => {
    setKelvin(val);
    if (val === "" || isNaN(Number(val))) {
      setCelsius("");
      setFahrenheit("");
      return;
    }
    const k = Number(val);
    const c = k - 273.15;
    setCelsius(c.toFixed(2));
    setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Thermometer className="w-5 h-5 animate-bounce" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg font-sans">Absolute Thermal Index Converter</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Celsius (°C)</label>
          <input
            type="number"
            value={celsius}
            onChange={(e) => handleCelsius(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-lg"
          />
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fahrenheit (°F)</label>
          <input
            type="number"
            value={fahrenheit}
            onChange={(e) => handleFahrenheit(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-lg"
          />
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kelvin (K)</label>
          <input
            type="number"
            value={kelvin}
            onChange={(e) => handleKelvin(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-lg"
          />
        </div>
      </div>
    </div>
  );
}
