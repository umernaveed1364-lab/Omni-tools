import React, { useState } from "react";
import { Calculator, Percent, Shield, DollarSign, Calendar, Heart, FileCode, Landmark } from "lucide-react";

// Types
interface GradeRow {
  id: string;
  grade: string;
  credits: number;
}

interface SemRow {
  id: string;
  gpa: number;
  credits: number;
}

export function CalculatorsSuite({ toolId }: { toolId: string }) {
  switch (toolId) {
    case "age-calc":
      return <AgeCalculator />;
    case "bmi-calc":
      return <BmiCalculator />;
    case "gpa-calc":
      return <GpaCalculator />;
    case "cgpa-calc":
      return <CgpaCalculator />;
    case "percentage-calc":
      return <PercentageCalculator />;
    case "loan-emi-calculator":
      return <LoanEmiCalculator />;
    case "discount-calc":
      return <DiscountCalculator />;
    case "profit-calc":
      return <ProfitCalculator />;
    default:
      return <div className="p-4 text-center text-slate-500">Calculator module not identified.</div>;
  }
}

// 1. AGE CALCULATOR
function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("1995-06-15");
  const [targetDate, setTargetDate] = useState("2026-06-06");
  const [result, setResult] = useState<any>(null);

  const calculateAge = () => {
    const dob = new Date(birthDate);
    const target = new Date(targetDate);
    if (isNaN(dob.getTime()) || isNaN(target.getTime())) return;

    let years = target.getFullYear() - dob.getFullYear();
    let months = target.getMonth() - dob.getMonth();
    let days = target.getDate() - dob.getDate();

    if (days < 0) {
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    const totalDays = Math.floor((target.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    setResult({ years, months, days, totalDays, totalWeeks, totalHours });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Calendar className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Exact Age Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Age at Target Date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={calculateAge}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition"
      >
        Calculate Exact Lifespan
      </button>

      {result && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-2xl font-black text-slate-900">{result.years}</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Years</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-2xl font-black text-slate-900">{result.months}</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Months</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-2xl font-black text-slate-900">{result.days}</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Days</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-lg font-black text-slate-900">{result.totalWeeks.toLocaleString()}</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Total Weeks</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 col-span-2">
            <span className="text-xl font-black text-slate-900">{result.totalDays.toLocaleString()}</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Total Days Elapsed</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 col-span-2">
            <span className="text-xl font-black text-slate-900">{result.totalHours.toLocaleString()}</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Total Hours Alive</p>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. BMI CALCULATOR
function BmiCalculator() {
  const [unitMode, setUnitMode] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175); // cm or inches
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");

  const calculateBmi = () => {
    let finalBmi = 0;
    if (unitMode === "metric") {
      const heightInMeters = height / 100;
      finalBmi = weight / (heightInMeters * heightInMeters);
    } else {
      // Imperial index: lbs / in^2 * 703
      finalBmi = (weight / (height * height)) * 703;
    }
    const rounded = parseFloat(finalBmi.toFixed(1));
    setBmi(rounded);

    if (rounded < 18.5) setStatus("Underweight");
    else if (rounded >= 18.5 && rounded < 24.9) setStatus("Healthy Range");
    else if (rounded >= 25 && rounded < 29.9) setStatus("Overweight");
    else setStatus("Obesity Category");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <Heart className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">BMI Health Calculator</h3>
      </div>

      <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl">
        <button
          onClick={() => { setUnitMode("metric"); setWeight(70); setHeight(175); setBmi(null); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${unitMode === "metric" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
        >
          Metric (kg / cm)
        </button>
        <button
          onClick={() => { setUnitMode("imperial"); setWeight(150); setHeight(68); setBmi(null); }}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${unitMode === "imperial" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
        >
          Imperial (lbs / inches)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Weight {unitMode === "metric" ? "(kg)" : "(lbs)"}
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Height {unitMode === "metric" ? "(cm)" : "(inches)"}
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={calculateBmi}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition"
      >
        Evaluate Body Index
      </button>

      {bmi !== null && (
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-3xl font-black text-slate-900">{bmi}</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Calculated BMI Value</p>
            </div>
            <div className="text-right">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                status === "Healthy Range" ? "bg-emerald-100 text-emerald-800" :
                status === "Underweight" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
              }`}>
                {status}
              </span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-2">Weight Threshold</p>
            </div>
          </div>

          <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
            <div
              className={`absolute top-0 bottom-0 left-0 rounded-full transition ${
                bmi < 18.5 ? "bg-amber-400 w-[20%]" :
                bmi < 25 ? "bg-emerald-500 w-[50%]" :
                bmi < 30 ? "bg-orange-500 w-[75%]" : "bg-red-500 w-[100%]"
              }`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-extrabold px-1">
            <span>18.5 Min</span>
            <span>25.0 Normal</span>
            <span>30.0 High</span>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. GPA CALCULATOR
function GpaCalculator() {
  const [courses, setCourses] = useState<GradeRow[]>([
    { id: "1", grade: "A", credits: 3 },
    { id: "2", grade: "B", credits: 4 },
  ]);
  const [gpa, setGpa] = useState<number | null>(null);

  const gradeMap: { [key: string]: number } = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0
  };

  const addRow = () => {
    setCourses([...courses, { id: Date.now().toString(), grade: "A", credits: 3 }]);
  };

  const removeRow = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateRow = (id: string, key: keyof GradeRow, val: any) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [key]: val } : c)));
  };

  const calculateGpa = () => {
    let weightedSum = 0;
    let totalCredits = 0;
    courses.forEach((c) => {
      weightedSum += (gradeMap[c.grade] || 0) * c.credits;
      totalCredits += c.credits;
    });
    if (totalCredits === 0) setGpa(0);
    else setGpa(parseFloat((weightedSum / totalCredits).toFixed(2)));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Calculator className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg font-sans">Semester GPA Calculator</h3>
      </div>

      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c.id} className="flex gap-3 items-center">
            <select
              value={c.grade}
              onChange={(e) => updateRow(c.id, "grade", e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              {Object.keys(gradeMap).map((g) => (
                <option key={g} value={g}>{g} ({gradeMap[g]})</option>
              ))}
            </select>
            <input
              type="number"
              value={c.credits}
              min="1"
              onChange={(e) => updateRow(c.id, "credits", Number(e.target.value))}
              placeholder="Credits"
              className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <button
              onClick={() => removeRow(c.id)}
              className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-bold"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={addRow}
          className="flex-1 py-2 border border-dashed border-slate-300 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold"
        >
          + Add Subject Course
        </button>
        <button
          onClick={calculateGpa}
          className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition"
        >
          Calculate GPA
        </button>
      </div>

      {gpa !== null && (
        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
          <span className="text-3xl font-black text-slate-900">{gpa}</span>
          <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Your Semester GPA (4.0 Scale)</p>
        </div>
      )}
    </div>
  );
}

// 4. CGPA CALCULATOR
function CgpaCalculator() {
  const [sems, setSems] = useState<SemRow[]>([
    { id: "1", gpa: 3.5, credits: 15 },
    { id: "2", gpa: 3.8, credits: 16 },
  ]);
  const [cgpa, setCgpa] = useState<number | null>(null);

  const addRow = () => {
    setSems([...sems, { id: Date.now().toString(), gpa: 3.5, credits: 15 }]);
  };

  const removeRow = (id: string) => {
    setSems(sems.filter((s) => s.id !== id));
  };

  const updateRow = (id: string, key: keyof SemRow, val: any) => {
    setSems(sems.map((s) => (s.id === id ? { ...s, [key]: val } : s)));
  };

  const calculateCgpa = () => {
    let weightedSum = 0;
    let totalCredits = 0;
    sems.forEach((s) => {
      weightedSum += s.gpa * s.credits;
      totalCredits += s.credits;
    });
    if (totalCredits === 0) setCgpa(0);
    else setCgpa(parseFloat((weightedSum / totalCredits).toFixed(2)));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <FileCode className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Cumulative CGPA Calculator</h3>
      </div>

      <div className="space-y-3">
        {sems.map((s, idx) => (
          <div key={s.id} className="flex gap-3 items-center">
            <span className="text-xs text-slate-400 font-bold w-20">Semester {idx + 1}</span>
            <input
              type="number"
              step="0.01"
              value={s.gpa}
              max="4"
              onChange={(e) => updateRow(s.id, "gpa", Number(e.target.value))}
              placeholder="GPA"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <input
              type="number"
              value={s.credits}
              onChange={(e) => updateRow(s.id, "credits", Number(e.target.value))}
              placeholder="Credits"
              className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <button
              onClick={() => removeRow(s.id)}
              className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-bold"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={addRow}
          className="flex-1 py-2 border border-dashed border-slate-300 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold"
        >
          + Add Semester
        </button>
        <button
          onClick={calculateCgpa}
          className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition"
        >
          Calculate CGPA
        </button>
      </div>

      {cgpa !== null && (
        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
          <span className="text-3xl font-black text-slate-900">{cgpa}</span>
          <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Aggregated CGPA (Cumulative)</p>
        </div>
      )}
    </div>
  );
}

// 5. PERCENTAGE CALCULATOR
function PercentageCalculator() {
  const [option, setOption] = useState("mode1");
  const [val1, setVal1] = useState(10);
  const [val2, setVal2] = useState(200);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    let out = 0;
    if (option === "mode1") {
      // What is val1% of val2?
      out = (val1 / 100) * val2;
    } else if (option === "mode2") {
      // val1 is what percentage of val2?
      out = val2 !== 0 ? (val1 / val2) * 100 : 0;
    } else {
      // Percentage change from val1 to val2
      out = val1 !== 0 ? ((val2 - val1) / val1) * 100 : 0;
    }
    setResult(parseFloat(out.toFixed(2)));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Percent className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Percentage Modifier Math</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Calculation Formula</label>
          <select
            value={option}
            onChange={(e) => { setOption(e.target.value); setResult(null); }}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          >
            <option value="mode1">What is X % of Y ?</option>
            <option value="mode2">X is what percentage of Y ?</option>
            <option value="mode3">Percentage change from X to Y ?</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Value X</label>
            <input
              type="number"
              value={val1}
              onChange={(e) => setVal1(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Value Y</label>
            <input
              type="number"
              value={val2}
              onChange={(e) => setVal2(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md"
        >
          Evaluate Formula
        </button>

        {result !== null && (
          <div className="bg-slate-50 p-5 rounded-xl text-center border border-slate-100">
            <span className="text-3xl font-black text-slate-900">
              {result}
              {option !== "mode1" && "%"}
            </span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Calculated Margin Response</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 6. LOAN & EMI CALCULATOR
function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(7.5); // annual interest
  const [months, setMonths] = useState(24);
  const [result, setResult] = useState<any>(null);

  const calculateEmi = () => {
    const monthlyRate = rate / 12 / 100;
    const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    const formattedEmi = parseFloat(emiValue.toFixed(2));
    const totalPayment = parseFloat((emiValue * months).toFixed(2));
    const totalInterest = parseFloat((totalPayment - principal).toFixed(2));

    // Generate lightweight amortized monthly logs
    let balance = principal;
    const records = [];
    for (let i = 1; i <= Math.min(months, 12); i++) {
      const interestPay = balance * monthlyRate;
      const principalPay = emiValue - interestPay;
      balance = Math.max(0, balance - principalPay);
      records.push({
        month: i,
        emi: formattedEmi,
        principal: principalPay.toFixed(2),
        interest: interestPay.toFixed(2),
        balance: balance.toFixed(2)
      });
    }

    setResult({ emi: formattedEmi, totalPayment, totalInterest, records });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Landmark className="w-5 h-5 flex-shrink-0" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Amortized Loan &amp; EMI Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Principal Cash ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Annual Rate (%)</label>
          <input
            type="number"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration (Months)</label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
      </div>

      <button
        onClick={calculateEmi}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl mx-auto shadow-md"
      >
        Analyze Credit Amortization
      </button>

      {result && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-2xl font-black text-indigo-600">${result.emi}</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Monthly EMI</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-2xl font-black text-rose-500">${result.totalInterest}</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Total Interest</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-2xl font-black text-slate-900">${result.totalPayment}</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Total Paid Back</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left text-slate-600 font-sans">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">EMI Amount</th>
                  <th className="px-4 py-3">Interest Payment</th>
                  <th className="px-4 py-3">Principal Repaid</th>
                  <th className="px-4 py-3">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white leading-relaxed">
                {result.records.map((r: any) => (
                  <tr key={r.month}>
                    <td className="px-4 py-3 font-bold text-slate-800">Month {r.month}</td>
                    <td className="px-4 py-3">${r.emi}</td>
                    <td className="px-4 py-3 text-red-500">${r.interest}</td>
                    <td className="px-4 py-3 text-emerald-500">${r.principal}</td>
                    <td className="px-4 py-3 font-semibold">${r.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// 7. DISCOUNT CALCULATOR
function DiscountCalculator() {
  const [price, setPrice] = useState(120);
  const [discount, setDiscount] = useState(25);
  const [tax, setTax] = useState(8);
  const [result, setResult] = useState<any>(null);

  const calculateDiscount = () => {
    const saved = price * (discount / 100);
    const salePrice = price - saved;
    const taxAmount = salePrice * (tax / 100);
    const total = salePrice + taxAmount;

    setResult({
      saved: parseFloat(saved.toFixed(2)),
      salePrice: parseFloat(salePrice.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <DollarSign className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Sales Discount Rate Tracker</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Original Retail Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Discount Rate (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Taxes rate (%)</label>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
      </div>

      <button
        onClick={calculateDiscount}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl"
      >
        Subtract Discounts
      </button>

      {result && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3 rounded-lg border">
            <span className="text-xl font-bold text-red-500">${result.saved}</span>
            <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">Dollars Saved</p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <span className="text-xl font-bold text-slate-800">${result.salePrice}</span>
            <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">Before Taxes</p>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <span className="text-xl font-bold text-amber-500">${result.taxAmount}</span>
            <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">Sales Tax</p>
          </div>
          <div className="bg-white p-3 rounded-lg border bg-emerald-50">
            <span className="text-xl font-extrabold text-emerald-800">${result.total}</span>
            <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-1">Final Purchase Price</p>
          </div>
        </div>
      )}
    </div>
  );
}

// 8. PROFIT MARGIN CALCULATOR
function ProfitCalculator() {
  const [cost, setCost] = useState(80);
  const [revenue, setRevenue] = useState(120);
  const [result, setResult] = useState<any>(null);

  const calculateProfit = () => {
    const profit = revenue - cost;
    const profitMargin = revenue !== 0 ? (profit / revenue) * 100 : 0;
    const markup = cost !== 0 ? (profit / cost) * 100 : 0;

    setResult({
      profit: parseFloat(profit.toFixed(2)),
      margin: parseFloat(profitMargin.toFixed(2)),
      markup: parseFloat(markup.toFixed(2))
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <Shield className="w-5 h-5 flex-shrink-0" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Markup &amp; Margin Profit Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Wholesale Unit Cost ($)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Selling Price ($)</label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
      </div>

      <button
        onClick={calculateProfit}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl"
      >
        Assess Profit Margins
      </button>

      {result && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-2xl font-black text-emerald-600">${result.profit}</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Net Earnings (Profit)</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-2xl font-black text-slate-900">{result.margin}%</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Profit Margin Ratio</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-2xl font-black text-indigo-600">{result.markup}%</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Inventory Markup</p>
          </div>
        </div>
      )}
    </div>
  );
}
