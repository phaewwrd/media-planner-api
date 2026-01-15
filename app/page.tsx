"use client";

import { useState } from "react";
import { AllocationChart } from "./components/AllocationChart";
import { Model, QUESTIONS } from "./lib/planner-data";

type Step = "start" | "wizard" | "processing" | "result";
type Answers = { [key: string]: string };

export default function PlannerPage() {
  const [currentStep, setCurrentStep] = useState<Step>("start");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [clientName, setClientName] = useState("");
  const [result, setResult] = useState<{ model: Model; efficiency: number; sessionId?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);


  const startWizard = () => {
    if (!clientName.trim()) return;
    setCurrentStep("wizard");
  };

  const selectOption = (val: string) => {
    setAnswers((prev) => ({ ...prev, [QUESTIONS[currentIdx].id]: val }));
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      processAnalysis();
    }
  };

  const processAnalysis = async () => {
    setCurrentStep("processing");
    setError(null);
    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientName, answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to get result from server.');
      }

      const data = await response.json();
      setResult(data);
      setCurrentStep("result");

    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      // Optional: switch to an error view or show a toast
      setCurrentStep("start"); // Go back to start on error for now
    }
  };


  const currentQuestion = QUESTIONS[currentIdx];
  const selectedValue = answers[currentQuestion.id];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="w-full bg-[#050505]/90 backdrop-blur-md border-b border-zinc-800 py-5 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              P
            </div>
            <div>
              <h1 className="text-base font-extrabold uppercase tracking-widest text-white leading-tight">
                Media Planner
              </h1>
              <p className="text-[9px] text-purple-400 font-black uppercase tracking-[0.2em]">
                Business Logic v2.0 | Ecommerce
              </p>
            </div>
          </div>
          {currentStep === "wizard" && (
            <div className="hidden sm:flex flex-col items-end gap-1.5">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                Analysis in Progress: {Math.round(((currentIdx + 1) / QUESTIONS.length) * 100)}%
              </span>
              <div className="w-40 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-700"
                  style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {currentStep === "start" && (
          <div className="w-full max-w-4xl text-center space-y-12 animate-slide-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Conversion Intelligence Model Activated
                </span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
                Precision <br />
                <span className="text-purple-600">Allocation</span>
              </h2>
              <p className="text-lg text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed">
                วิเคราะห์จัดสรรงบประมาณสื่อด้วยตรรกะระดับ Senior Planner <br />
                เพื่อเป้าหมาย{" "}
                <span className="text-white">Ecommerce Conversion</span> ที่วัดผลได้จริง
              </p>
            </div>

            <div className="bg-[#0f0f0f] p-10 rounded-[3rem] border border-zinc-800 shadow-2xl space-y-8 max-w-xl mx-auto">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">
                  Client Identification
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="ระบุชื่อแบรนด์หรือธุรกิจที่นี่..."
                  className="w-full bg-transparent border-b border-zinc-800 py-4 text-center text-2xl font-bold text-white focus:border-purple-600 focus:outline-none transition-all"
                />
              </div>
              <button
                onClick={startWizard}
                className="w-full py-6 bg-white text-black font-black rounded-2xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 shadow-xl uppercase tracking-[0.2em] text-xs"
              >
                Initialize Analysis
              </button>
            </div>
          </div>
        )}

        {currentStep === "wizard" && (
          <div className="w-full max-w-2xl animate-slide-up">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-[1px] bg-purple-600"></span>
                <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em]">
                  {currentQuestion.topic}
                </span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight italic">
                &quot;{currentQuestion.desc}&quot;
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-10">
              {currentQuestion.options.map((opt) => (
                <div
                  key={opt.val}
                  onClick={() => selectOption(opt.val)}
                  className={`option-card p-6 rounded-[2rem] flex items-center justify-between ${selectedValue === opt.val ? 'selected' : ''}`}
                >
                  <div className="space-y-1">
                    <p className="font-extrabold text-white uppercase tracking-tight">{opt.label}</p>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{opt.sub || ''}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-zinc-800 flex items-center justify-center shrink-0">
                    <div className={`w-3 h-3 rounded-full ${selectedValue === opt.val ? 'bg-purple-600 shadow-[0_0_10px_#a855f7]' : 'bg-transparent'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            {selectedValue && currentQuestion.feedback && (
              <div className="mb-12 p-8 bg-zinc-900/50 border border-purple-500/20 rounded-[2.5rem] flex gap-6 items-center animate-slide-up shadow-inner">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  💡
                </div>
                <p className="text-sm text-purple-100 font-medium italic leading-relaxed">{currentQuestion.feedback}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
              <button
                onClick={prevQuestion}
                className={`text-zinc-600 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${currentIdx === 0 ? 'invisible' : 'visible'}`}
              >
                ← Previous
              </button>
              <div className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">
                Step {String(currentIdx + 1).padStart(2, '0')} / {QUESTIONS.length}
              </div>
              <button
                onClick={nextQuestion}
                disabled={!selectedValue}
                className={`px-14 py-4 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all ${!selectedValue ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-white text-black'}`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === "processing" && (
          <div className="w-full max-w-lg text-center space-y-12 animate-slide-up">
            <div className="flex justify-center">
              <div
                className="w-36 h-36 bg-zinc-900 border border-zinc-800 rounded-[3.5rem] flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-600/10 animate-pulse"></div>
                <span className="text-5xl relative z-10">🧠</span>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Compiling Data</h2>
              <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">
                Implementing Senior Logic v2.0 for {clientName}
              </p>
            </div>
            <div className="max-w-xs mx-auto w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 w-full transition-all duration-[3s]"></div>
            </div>
          </div>
        )}

        {currentStep === "result" && result && (
          <div className="w-full max-w-7xl animate-slide-up space-y-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-zinc-800 pb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black rounded uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    Class ID: {result.model.id}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                    Strategy Optimized
                  </span>
                </div>
                <div className="text-sm font-black text-zinc-600 uppercase tracking-[0.3em] italic leading-none">
                  Client: {clientName}
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] italic">
                  {result.model.name}
                </h2>
                <div className="text-2xl font-black text-purple-500 uppercase tracking-tight flex gap-6">
                  FB <span className="text-white">{result.model.fb}%</span> |
                  GG <span className="text-white">{result.model.gg}%</span>
                  {result.model.tt > 0 ? `| TT <span className="text-white">{result.model.tt}%</span>` : ''}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-12 py-5 bg-zinc-900 border border-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-widest text-[11px]"
                >
                  New Planning
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 bg-[#0f0f0f] p-10 rounded-[3rem] border border-zinc-800 flex flex-col items-center">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-12">
                  Media budget allocation
                </h3>
                <div className="chart-container">
                  <AllocationChart fb={result.model.fb} gg={result.model.gg} tt={result.model.tt} />
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#0f0f0f] p-10 rounded-[3rem] border border-zinc-800 flex flex-col min-h-[500px]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-purple-900/50 text-purple-400 rounded-2xl flex items-center justify-center text-xl border border-purple-500/20">
                    📢
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest italic">
                    Recommendation
                  </h3>
                </div>
                <div className="bg-black/40 p-8 rounded-3xl mb-10 italic text-zinc-300 font-medium leading-relaxed text-base border-l-4 border-purple-600 shadow-inner">
                  &quot;{result.model.script}&quot;
                </div>
                <h4 className="text-sm font-black text-purple-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                  <span>✨</span> AI Director Planner Pro Tips:
                </h4>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 text-[14px] text-zinc-400 font-medium leading-loose whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: `
                📌 **Strategy Rationale (Explain):**
                จากการประเมินด้วย Logic v2.0 แบรนด์ของคุณมีความแข็งแกร่งทางยุทธศาสตร์ที่ ${result.efficiency}% โดยเหมาะสมกับ ${result.model.fb > result.model.gg ? 'Facebook' : 'Google'} Hero เป็นหลัก เนื่องจากพฤติกรรมลูกค้าเน้น ${answers.q1 === 'Low' ? 'Impulse Buy' : 'Research-driven'}

                💡 **Strategic Advisor:**
                1. รันแคมเปญที่มุ่งเน้น ${answers.q4 === 'Low' ? 'Self-checkout Conversion' : 'Qualified Lead Generation'} เพื่อประสิทธิภาพสูงสุด
                2. ขยายสเกลโดยใช้ Bidding แบบ ${result.efficiency > 70 ? 'Target ROAS' : 'Maximize Conversions'} เพื่อเร่งการเรียนรู้ของ Algorithm
                3. พัฒนา Creative ที่ตอบโจทย์ช่วงอายุ Gen ${answers.q8.includes('18') ? 'Z' : 'Millennials/X'}

                ⚠️ **Execution Precautions:**
                - ${result.model.fb > 50 ? 'ระวัง Ad Fatigue บน Facebook ชุดโฆษณาเดิมควรเปลี่ยนทุก 10-14 วัน' : 'ระวัง Bidding War บน Google Keyword ที่มีการแข่งขันสูงจน CPC พุ่ง'}
                - ${answers.q5 === 'Weak' ? 'คำเตือน: ระบบ Tracking ยังไม่สมบูรณ์ การเทงบปริมาณมากอาจสูญเปล่า' : 'หมั่นตรวจสอบ Deduplication ของ Conversion ระหว่าง Pixel และ API'}
            `.replace(/\n/g, '<br>')
                  }}
                >
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#0f0f0f] p-10 rounded-[3rem] border border-zinc-800 flex flex-col min-h-[500px]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-zinc-800 text-zinc-400 rounded-2xl flex items-center justify-center text-xl">
                    🎯
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Next steps</h3>
                </div>
                <div className="mb-10 p-8 bg-white text-black rounded-[2.5rem] text-xs font-black leading-relaxed shadow-xl">
                  <p>{result.model.insights}</p>
                </div>
                <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1">
                  {result.model.recs.map((rec, i) => (
                    <div key={i} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex gap-4">
                      <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center text-[10px] font-black shrink-0">0{i + 1}</div>
                      <p className="text-[13px] font-bold text-zinc-400">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-10 text-center text-[10px] text-zinc-800 font-black uppercase tracking-[0.5em]">
        &copy; 2026 Strategy Intelligence Engine &bull; Enterprise Framework
      </footer>
    </div>
  );
}
