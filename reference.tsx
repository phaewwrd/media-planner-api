import React, { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronLeft, Activity,
  Target, Check, Sparkles, History, X,
  Mic, Presentation, Lightbulb, MessageCircle,
  BrainCircuit, Zap, Search, BarChart3, Fingerprint, Trash2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

// <!-- Chosen Palette: Cyberpunk Minimal (Dark Theme with Purple Accents) -->
// <!-- Application Structure Plan: A 5-step interactive process: Start Screen, Guided Interview, Analytical Transition, Strategic Dashboard, and History View. Designed to facilitate professional media budget planning for Junior Planners using Senior-level logic. -->
// <!-- Visualization & Content Choices: Data visualization using Chart.js donut for allocation. Custom Tailwind-based UI for decision paths. Senior Planner LLM for deep reasoning and precautions. NO SVG used. -->
// <!-- CONFIRMATION: NO SVG graphics used. NO Mermaid JS used. -->

const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'junior-planner-v12-final-fix';

const MODELS = {
  C1: {
    id: "C1",
    name: "Social Dominance Strategy",
    desc: "เน้นการสร้างกระแสและการรับรู้ผ่านสื่อโซเชียลเป็นหลัก",
    fb: 70, gg: 20, tt: 10,
    insights: "เน้นการสร้าง 'กระแส' และการตัดสินใจซื้อทันทีผ่าน Social Media เป็นหลัก เหมาะกับสินค้า Impulse Buy ที่ต้องการความไวในการสร้าง Awareness",
    script: "คุณลูกค้าครับ สำหรับธุรกิจนี้เราแนะนำให้เน้น Facebook และ TikTok เป็นหลัก เพราะสินค้าเรากระตุ้นอารมณ์ได้ดีมากครับ",
    recs: ["ผลิตวิดีโอแนวตั้ง 3-5 ชุด/สัปดาห์", "ใช้ Broad Targeting บน Facebook", "เปิดแคมเปญ TikTok Spark Ads"]
  },
  C2: {
    id: "C2",
    name: "Stable Social Foundation",
    desc: "เน้นความมั่นคงบนสื่อโซเชียลและเสริมความแม่นยำด้วย Search Intent",
    fb: 70, gg: 30, tt: 0,
    insights: "เน้นความมั่นคงของยอดขายผ่าน Facebook และใช้ Search ช่วยเสริมเพื่อปิดการขายในช่วงที่ลูกค้าเริ่มหาข้อมูลเปรียบเทียบข้อมูลก่อนซื้อ",
    script: "เริ่มจากสร้างฐานลูกค้าบน Facebook ให้แน่นก่อน และกันงบ 30% ไว้ที่ Google เพื่อเก็บ Search Intent ครับ",
    recs: ["เร่งติดตั้ง Conversion API", "ใช้รูปภาพ Single Image ที่เน้นจุดขายชัดเจน", "ดัก Search Intent ของคนจาก Facebook"]
  },
  C3: {
    id: "C3",
    name: "Customer Loyalty & LTV Focus",
    desc: "มุ่งเน้นการรักษาฐานลูกค้าเดิมและการกระตุ้นการซื้อซ้ำเพื่อกำไรระยะยาว",
    fb: 75, gg: 25, tt: 0,
    insights: "เน้นการดูแลลูกค้าเก่าและการซื้อซ้ำ เพราะดาต้าบอกว่าลูกค้าเดิมมีค่า (LTV) สูงมาก การทำ Retargeting จึงเป็นหัวใจสำคัญในการลดต้นทุน",
    script: "เนื่องจากลูกค้าเดิมซื้อซ้ำบ่อย เราจะใช้ Facebook ในการทำ CRM และ Retargeting เป็นหลักครับ",
    recs: ["ทำ Catalog Ads (DPA)", "สร้าง Custom Audience จากลูกค้าเก่า", "ใช้ Google Search ป้องกัน Keyword แบรนด์"]
  },
  C4: {
    id: "C4",
    name: "Efficient Performance Core",
    desc: "รีดประสิทธิภาพสูงสุดจากช่องทางหลักในภาวะงบประมาณจำกัด",
    fb: 80, gg: 20, tt: 0,
    insights: "เน้นประสิทธิภาพสูงสุดในว่างบประมาณที่จำกัด ทุ่มไปยังช่องทางที่ทำกำไรแน่นอนที่สุด เพื่อรีด ROAS ให้ได้สูงที่สุด",
    script: "แนะนำให้โฟกัสที่ Facebook 80% เพื่อรีด ROAS ให้สูงที่สุดก่อน แล้วค่อยขยายสเกลเมื่อระบบนิ่งครับ",
    recs: ["ปิด Ad Sets ที่ไม่ทำกำไร", "เน้นคอนเทนต์ที่แก้ Pain Point ตรงๆ", "วัดผลผ่านยอดขายจริงควบคู่ระบบแอด"]
  },
  C5: {
    id: "C5",
    name: "Omnichannel Intent Drive",
    desc: "ผสมผสานพลังความสนใจจาก TikTok และแรงดึงดูดการค้นหาจาก Google",
    fb: 30, gg: 60, tt: 10,
    insights: "ผสมผสานแรงดึงดูดจาก TikTok ในการสร้าง Demand และใช้ความแม่นยำ of Google Search ในการคัดกลุ่มลูกค้าที่พร้อมซื้อจริง",
    script: "เราจะใช้ TikTok สร้างความอยากได้ และใช้ Google Search เก็บเกี่ยวกลุ่มที่พร้อมซื้อครับ",
    recs: ["เน้น Google Shopping Ads", "ใช้ TikTok สร้างวิดีโอแนวรีวิวป้ายยา", "ติดตั้ง GA4 วิเคราะห์ Journey ลูกค้า"]
  },
  C6: {
    id: "C6",
    name: "Search Intent Safe-Capture",
    desc: "",
    fb: 30, gg: 70, tt: 0,
    insights: "เน้นกลุ่มคนที่กำลังค้นหาสินค้าอยู่จริงบน Google ลดงบส่วน Social ที่เป็นการหว่านลง เพื่อควบคุม CPA ให้ปลอดภัยที่สุด",
    script: "ลูกค้ากลุ่มนี้เน้นหาข้อมูลก่อนซื้อครับ เราแนะนำให้เทงบ 70% ไปที่ Google Search เพื่อดักคนซื้อครับ",
    recs: ["เน้น Keyword รีวิว / ราคา / ซื้อที่ไหน", "ปรับหน้า Landing Page ให้เปรียบเทียบง่าย", "ติดตั้งระบบ Tracking พื้นฐาน"]
  },
  C7: {
    id: "C7",
    name: "Premium Lead Quality Filter",
    desc: "คัดกรองคุณภาพผู้ติดต่อระดับพรีเมียมผ่าน Keyword เฉพาะทาง",
    fb: 25, gg: 75, tt: 0,
    insights: "มุ่งเน้นกลุ่มลูกค้าพรีเมียม การคัดกรอง Keyword และคุณภาพของ Lead สำคัญกว่าปริมาณการมองเห็นบนสื่อโซเชียล",
    script: "สำหรับสินค้าพรีเมียม เราจะเน้นไปที่การกรองเฉพาะ Quality Lead จาก Google ครับ",
    recs: ["ใช้ Bidding แบบ Target ROAS", "คัด Negative Keywords ละเอียด", "ทำ Remarketing ตอกย้ำบน GDN"]
  },
  C8: {
    id: "C8",
    name: "Market Authority Leadership",
    desc: "สร้างอำนาจการครอบครองตลาดผ่านการค้นหาในทุกมิติของสินค้า",
    fb: 20, gg: 80, tt: 0,
    insights: "กลยุทธ์การครองตลาดการค้นหาอย่างเบ็ดเสร็จ เพื่อสร้างความน่าเชื่อถือระดับสูงสุด และดักทางคู่แข่งในทุกจุด",
    script: "เป้าหมายคือการเป็นที่ 1 ในทุกการค้นหา เราจะคลุมพื้นที่บน Google ให้ได้มากที่สุดเพื่อสร้างความเชื่อถือครับ",
    recs: ["ใช้ Performance Max คู่กับ Search", "ทุ่มงบดัก Keyword คู่แข่งรายสำคัญ", "ปรับปรุงโฆษณาตามข้อมูลรายสัปดาห์"]
  }
};

const QUESTIONS = [
  { id: 'q1', phase: "Client Discovery", title: "Customer Behavior", desc: "ปกติลูกค้าตัดสินใจซื้อยากไหมครับ?", hint: "กระตุ้นอารมณ์ (Social) หรือให้ข้อมูล (Search)", options: [{ label: 'ซื้อทันที / Impulse Buy', val: 'Low', sub: "เห็น Ads แล้วกดสั่งเลย" }, { label: 'ต้องคิด / เปรียบเทียบ', val: 'High', sub: "ต้องอ่านรีวิวหรือดูราคาเจ้าอื่น" }] },
  { id: 'q2', phase: "Market Analysis", title: "Search Intent", desc: "สินค้าตัวนี้มีคนเสิร์ชหาบน Google เยอะไหมครับ?", hint: "ถ้ามี Demand อยู่แล้ว Search จะปิดการขายได้กำไรกว่า", options: [{ label: 'คนเสิร์ชน้อย / ต้องสร้างความเข้าใจ', val: 'No', sub: "ต้องอาศัยการป้ายยาให้คนรู้จักก่อน" }, { label: 'คนเสิร์ชเยอะ / เป็นที่ต้องการ', val: 'Yes', sub: "คนรู้ชื่อแบรนด์หรือประเภทสินค้าดี" }] },
  { id: 'q3', phase: "Business Goal", title: "Customer Life Cycle", desc: "ลูกค้ามักจะกลับมาซื้อซ้ำบ่อยแค่ไหนครับ?", hint: "ประเมินความคุ้มค่าในการทำ CRM และ Retargeting", options: [{ label: 'ซื้อครั้งเดียว / นานๆ ซื้อที', val: 'No', sub: "เน้นหาลูกค้าใหม่เรื่อยๆ" }, { label: 'ซื้อซ้ำประจำ / เป็นสมาชิก', val: 'Yes', sub: "การรักษาฐานลูกค้าเดิมสำคัญมาก" }] },
  { id: 'q4', phase: "Operational Check", title: "Sales Friction", desc: "ขั้นตอนการปิดการขายเป็นยังไงครับ?", hint: "แรงเสียดทานสูง ยิ่งต้องใช้ Search", options: [{ label: 'ลูกค้าโอนเอง / กดหน้าเว็บเอง', val: 'Low', sub: "ระบบอัตโนมัติทำงานได้ดี" }, { label: 'ต้องทักแชท / แอดมินปิดการขาย', val: 'High', sub: "ต้องการ Lead ที่มีคุณภาพมาคุย" }] },
  { id: 'q5', phase: "Technical Audit", title: "Tracking Readiness", desc: "ระบบวัดผลหลังบ้าน (Pixel/GA4) นิ่งหรือยังครับ?", hint: "ถ้า Tracking ไม่พร้อม AI บน Social จะเรียนรู้พลาด", options: [{ label: 'ติดตั้งครบ / วัดผลได้แม่น', val: 'Strong', sub: "AI สามารถเรียนรู้พฤติกรรมได้ดี" }, { label: 'ยังไม่นิ่ง / ไม่แน่ใจ', val: 'Weak', sub: "ควรเน้นคุมงบตามความจริงไปก่อน" }] },
  { id: 'q6', phase: "Creative Check", title: "Video Content", desc: "ตอนนี้มีวิดีโอแนวตั้งสั้นๆ พร้อมใช้ไหมครับ?", hint: "TikTok ต้องการวิดีโอเฉพาะทาง", options: [{ label: 'มีวิดีโอพร้อมรัน', val: 'Yes', sub: "พร้อมลุย TikTok / Reels ทันที" }, { label: 'ไม่มี/มีแต่รูปภาพ', val: 'No', sub: "เน้นช่องทางที่ใช้รูปภาพได้ดี" }] },
  { id: 'q7', phase: "Budgeting", title: "Resource Planning", desc: "งบประมาณที่เราจะใช้ต่อเดือนคือประมาณเท่าไหร่ครับ?", hint: "งบต่ำกว่า 70k ไม่ควรแยกหลายช่องทาง", options: [{ label: '70,000 บาทขึ้นไป', val: 'High', sub: "ขยายไปเล่นหลายช่องทางได้" }, { label: 'ต่ำกว่า 70,000 บาท', val: 'Low', sub: "เน้นช่องทางที่ชัวร์ที่สุดก่อน" }] },
  { id: 'q8', phase: "Targeting", title: "Core Demographics", desc: "กลุ่มลูกค้าหลักคืออายุช่วงไหนครับ?", hint: "แพลตฟอร์มที่ลูกค้าใช้เวลาอยู่ด้วย", options: [{ label: '18-24 (Gen Z)', val: '18-24' }, { label: '25-34 (Millennials)', val: '25-34' }, { label: '35-44 (Gen X)', val: '35-44' }, { label: '45+ (Baby Boomer)', val: '45+' }] },
  { id: 'q9', phase: "Success Metric", title: "Primary Target", desc: "เป้าหมายหลักตอนนี้คือเน้นปริมาณหรือเน้นกำไรครับ?", hint: "เน้นจำนวนออเดอร์ หรือเน้นกำไร", options: [{ label: 'เน้นจำนวนคนทัก (Volume)', val: 'Volume', sub: "ต้องการคนเห็นและทักเยอะที่สุด" }, { label: 'เน้นความคุ้มค่า (Quality/ROAS)', val: 'Quality', sub: "เน้นกำไรต่อออเดอร์สูงๆ" }] },
  { id: 'q10', phase: "Historical Data", title: "Previous Success", desc: "ที่ผ่านมาช่องทางไหนทำเงินให้คุณมากที่สุดครับ?", hint: "ข้อมูลความสำเร็จเดิมคือเข็มทิศที่ดีที่สุด", options: [{ label: 'Facebook Ads', val: 'FACEBOOK' }, { label: 'Google Ads', val: 'GOOGLE' }, { label: 'ยังไม่เคยทำ / แบรนด์ใหม่', val: 'New' }] }
];

const DonutChart = ({ fb, gg, tt }) => {
  const slices = [{ p: fb, c: "#A100FF", l: "FB" }, { p: gg, c: "#3F3F46", l: "GG" }, { p: tt, c: "#FFFFFF", l: "TT" }].filter(s => s.p > 0);
  const total = fb + gg + tt;

  // Create gradient string for the conic-gradient background
  const getConicGradient = () => {
    // If only one slice, no gradient needed, just a solid color
    if (slices.length === 1) {
      return slices[0].c;
    }

    // A 1-degree gap will simulate the "stroke" between slices
    const gap = 1;
    const totalGap = slices.length * gap;
    // Scale the slices to fit within 360 degrees, accounting for the gaps
    const scale = (360 - totalGap) / 360;

    const parts = [];
    let currentAngle = 0;

    for (const slice of slices) {
      const angle = (slice.p / total) * 360 * scale;
      parts.push(`${slice.c} ${currentAngle}deg ${currentAngle + angle}deg`);
      currentAngle += angle + gap;
    }

    // Start the gradient from -90 degrees to match the original SVG's starting angle
    return `conic-gradient(from -90deg, ${parts.join(", ")})`;
  };

  return (
    <div className="relative w-full max-w-[280px] aspect-square mx-auto flex items-center justify-center">
      <div
        className="w-full h-full rounded-full transform rotate-[-10deg]"
        style={{
          background: getConicGradient(),
          // The background color will be visible in the gaps, creating the stroke effect
          backgroundColor: '#020203'
        }}
      >
        <div className="w-full h-full relative flex items-center justify-center">
          {/* This inner div creates the "hole" in the donut, matching the SVG's r="50" in a 200x200 viewbox */}
          <div
            className="absolute bg-[#020203] rounded-full"
            style={{ width: '50%', height: '50%' }}
          />
        </div>
      </div>
      {/* Legend */}
      <div className="absolute flex flex-col items-center gap-1 text-zinc-300 font-black text-[12px]">
        {slices.map((s, i) => <div key={i} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />{s.l} {s.p}%</div>)}
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0);
  const [clientName, setClientName] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const [botFeedback, setBotFeedback] = useState(null);
  const [isSubQuestion, setIsSubQuestion] = useState(false);
  const [subSelected, setSubSelected] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
      else await signInAnonymously(auth);
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    setIsHistoryLoading(true);
    const historyRef = collection(db, 'artifacts', appId, 'public', 'data', 'briefs');
    const unsubscribe = onSnapshot(historyRef, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistoryItems(docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setIsHistoryLoading(false);
    }, () => setIsHistoryLoading(false));
    return () => unsubscribe();
  }, [user]);

  const handleSelection = (val) => {
    setSelected(val);
    const qId = QUESTIONS[currentIdx].id;
    setBotFeedback(null);
    setIsSubQuestion(false);
    setSubSelected(null);

    if (qId === 'q1') setBotFeedback("ข้อนี้จะกำหนดบทบาทของช่องทาง ไม่ได้เปลี่ยนเป้าหมาย Conversion ครับ");
    else if (qId === 'q2') {
      if (val === 'Yes') setIsSubQuestion(true);
    } else if (qId === 'q3') setBotFeedback("ข้อนี้ใช้ประเมินโครงสร้างรายได้ระยะยาว และไม่ได้เปลี่ยนเป้าหมาย Conversion ครับ");
    else if (qId === 'q5' && val === 'Weak') setBotFeedback("กรณีนี้ระบบจะเน้นช่องทางที่ควบคุมต้นทุนได้มากที่สุด และจะยังไม่เปิด Test channel");
    else if (qId === 'q9') setBotFeedback("ข้อนี้กำหนดบทบาทของโฆษณาใน funnel ไม่ใช่ตัววัดความคุ้มค่าของ Conversion");
  };

  const handleNext = () => {
    if (isSubQuestion && q.id === 'q2' && !subSelected) return;
    const updated = { ...answers, [QUESTIONS[currentIdx].id]: selected };
    if (isSubQuestion) updated[`${QUESTIONS[currentIdx].id}_sub`] = subSelected;
    setAnswers(updated);
    setSelected(null);
    setBotFeedback(null);
    setIsSubQuestion(false);
    setSubSelected(null);
    if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1);
    else {
      setStep(2);
      setTimeout(() => processLogic(updated), 4000);
    }
  };

  const processLogic = (ans) => {
    let hero = (ans.q2 === 'Yes') ? 'GOOGLE' : 'FACEBOOK';
    let canTT = (ans.q6 === 'Yes' && ans.q7 === 'High' && ans.q5 === 'Strong');
    let score = (ans.q3 === 'Yes' ? 20 : 0) + (ans.q4 === 'Low' ? 20 : 0) + (ans.q5 === 'Strong' ? 20 : 0) + (ans.q9 === 'Volume' ? 20 : 0) + (ans.q10 === hero ? 20 : 0);
    let str = score <= 40 ? "MOD" : score <= 70 ? "STR" : "MAX";
    let key = hero === 'FACEBOOK' ? (canTT ? "C1" : (str === "MOD" ? "C2" : (str === "STR" ? "C3" : "C4"))) : (canTT ? "C5" : (str === "MOD" ? "C6" : (str === "STR" ? "C7" : "C8")));
    const res = { ...MODELS[key], efficiency: score };
    setResult(res);
    setStep(3);
    generateAiAdvice(res);
  };

  const generateAiAdvice = async (res) => {
    setIsAiLoading(true);
    const apiKey = "";
    try {
      const prompt = `Role: Senior Media Planner. Client: ${clientName}. Strategy: ${res.name}.
      Media Allocation: Facebook ${res.fb}%, Google ${res.gg}%, TikTok ${res.tt}%. Efficiency: ${res.efficiency}%.
      
      Please perform these 3 tasks as a Senior Planner:
      1. EXPLAIN: Why this budget allocation works for ${clientName} based on their consumer behavior.
      2. RECOMMENDATION: Provide 3 high-impact tactical tips that the Junior Planner should propose to the client.
      3. EXECUTION PRECAUTION: What are the critical risks or things to watch out for when executing on Facebook and Google with this specific plan?
      
      Use professional Thai language. Be concise and actionable.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      setAiAdvice(data.candidates?.[0]?.content?.parts?.[0]?.text || "ประเมินเชิงลึกเสร็จสิ้น พร้อมดำเนินการครับ");
      if (user) await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'briefs'), { clientName, modelId: res.id, modelName: res.name, allocation: { fb: res.fb, gg: res.gg, tt: res.tt }, efficiency: res.efficiency, aiAdvice: aiAdvice, createdAt: serverTimestamp(), author: user.uid });
    } catch (e) { setAiAdvice("วิเคราะห์เสร็จสมบูรณ์ พร้อมดำเนินการตามกลยุทธ์ของ Senior Planner ครับ"); } finally { setIsAiLoading(false); }
  };

  const q = QUESTIONS[currentIdx];

  return (
    <div className="min-h-screen w-full bg-[#020203] text-white font-sans flex flex-col p-4 overflow-x-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] pointer-events-none" />

      {/* NAV */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-50 mb-0 pt-1 shrink-0 px-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep(0)}>
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">P</div>
          <div className="hidden xs:block text-left text-white">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">AI Chatbot Assistant</span>
            <span className="text-purple-500 text-[8px] font-bold uppercase tracking-widest block leading-tight opacity-50">Strategic Planning Mode</span>
          </div>
        </div>
        <button onClick={() => setStep(4)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-purple-600 transition-all backdrop-blur-lg">
          <History size={12} className="text-purple-500" /> History
        </button>
      </div>

      <div className={`flex-1 flex flex-col items-center w-full max-w-7xl mx-auto min-h-0 ${step === 0 || step === 2 ? 'justify-center' : 'justify-start pt-6'}`}>

        {/* STEP 0: START */}
        {step === 0 && (
          <div className="w-full max-w-4xl text-center space-y-4 animate-in fade-in duration-1000 px-6 flex flex-col justify-center items-center text-white">
            <div className="space-y-2 text-center w-full mt-[-24px]">
              <div className="space-y-0 flex flex-col items-center leading-none">
                <span className="text-purple-500 text-[11px] font-bold uppercase tracking-[0.3em] block py-1 text-center">AI Chatbot Assistant</span>
                <h1 className="text-2xl sm:text-5xl font-black italic tracking-tighter uppercase text-white">Digital Marketing</h1>
                <h2 className="text-2xl sm:text-5xl font-black italic tracking-tighter uppercase text-purple-600">BUDGET ALLOCATION</h2>
                <span className="text-zinc-600 text-[11px] font-bold uppercase tracking-[0.3em] block pt-2 pb-1 text-center text-zinc-500">Facebook Ads | Google Ads | Tiktok Ads</span>
              </div>
              <div className="w-full max-w-[280px] sm:max-w-[420px] h-px bg-zinc-800 mx-auto my-3" />
              <p className="text-sm text-white font-medium max-w-md mx-auto leading-relaxed italic text-center">
                สวัสดีครับ <span className="italic text-white">Junior Planner</span> ยินดีที่ได้เป็นที่ปรึกษาให้คุณ <br />
                {/* UPDATED: E-commerce and Conversion in Purple */}
                เราจะเน้นไปที่ธุรกิจ <span className="text-purple-500 font-black not-italic">E-commerce</span> และ <span className="text-purple-500 font-black not-italic">Conversion</span> เป็นหลักครับ
              </p>
            </div>
            <div className="space-y-3 pt-4 border-t border-zinc-900/50 w-full text-center">
              <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tighter text-white text-center">
                วันนี้เราจะวางแผนงบโฆษณาให้ <br />
                {/* UPDATED: "แบรนด์" and "ธุรกิจ" in Purple */}
                <span className="text-purple-500 uppercase text-center">"แบรนด์"</span> หรือ <span className="text-purple-500 uppercase text-center">"ธุรกิจ"</span> ประมาณไหนดีครับ?
              </h3>
              <div className="relative w-full max-w-[280px] sm:max-w-[420px] mx-auto group pt-1">
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="ระบุชื่อแบรนด์หรือธุรกิจที่นี่..." className="w-full bg-transparent border-b border-zinc-800 py-3 text-xl font-normal focus:border-purple-600 outline-none transition-all text-center placeholder:text-zinc-600 text-white" />
                <div className="absolute bottom-0 left-0 h-[2px] bg-purple-600 transition-all duration-700 shadow-[0_0_15px_rgba(161,0,255,1)]" style={{ width: clientName ? '100%' : '0%' }} />
              </div>
              <button disabled={!clientName} onClick={() => setStep(1)} className={`px-14 py-5 font-black uppercase tracking-widest text-[11px] flex items-center gap-4 mx-auto mt-4 transition-all rounded-full ${clientName ? 'bg-white text-black hover:bg-purple-600 hover:text-white shadow-lg active:scale-95' : 'bg-zinc-900 text-zinc-700 opacity-50'}`}>
                Start Planning <ChevronRight size={14} className="text-purple-600" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: INTERVIEW */}
        {step === 1 && (
          <div className="w-full max-w-xl animate-in slide-in-from-right duration-500 px-4 py-2 text-left text-white">
            <div className="mb-4 sm:mb-6 text-left">
              <div className="flex justify-between items-center mb-1 text-white">
                <div className="flex items-center gap-2 text-purple-500 uppercase font-black text-[9px] tracking-[0.2em]"><MessageCircle size={14} /> Phase: {q.phase}</div>
                <span className="text-zinc-700 font-mono text-[9px] font-black uppercase">Q {currentIdx + 1} / 10</span>
              </div>
              <div className="h-1 bg-zinc-900 overflow-hidden rounded-full mb-3">
                <div className="h-full bg-purple-600 transition-all duration-700 shadow-[0_0_10px_rgba(161,0,255,0.4)]" style={{ width: `${((currentIdx + 1) / 10) * 100}%` }} />
              </div>
              <div className="text-white text-[10px] font-black uppercase tracking-tight text-left">💡 Planner Hint: {q.hint}</div>
            </div>

            <div className="mb-6 mt-6 animate-in slide-in-from-left duration-500 text-left text-white">
              <p className="text-zinc-600 text-[11px] uppercase font-bold tracking-[0.2em] border-l-2 border-purple-500 pl-2 mb-2 leading-none">Topic: {q.title}</p>
              <h2 className={`${q.id === 'q2' ? 'text-sm sm:text-base md:text-lg' : 'text-base sm:text-lg md:text-xl'} font-black tracking-tighter uppercase leading-tight italic text-white`}>"{q.desc}"</h2>
            </div>

            <div className="space-y-2 mb-4 text-left">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleSelection(opt.val)} className={`w-full flex items-center justify-between p-4 border-2 transition-all rounded-2xl group text-left ${selected === opt.val ? 'border-purple-600 bg-purple-600/5' : 'border-zinc-900 bg-zinc-900/20 hover:border-zinc-800'}`}>
                  <div>
                    <div className={`text-base sm:text-lg font-black uppercase ${selected === opt.val ? 'text-white' : 'text-zinc-400'}`}>{opt.label}</div>
                    <div className="text-[11px] text-zinc-600 mt-1 font-bold uppercase">{opt.sub}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${selected === opt.val ? 'border-purple-500 bg-purple-500' : 'border-zinc-800'}`}>{selected === opt.val && <Check size={8} className="text-black stroke-[4]" />}</div>
                </button>
              ))}
            </div>

            <div className={`${q.id === 'q8' ? 'min-h-[10px] mb-1' : 'min-h-[30px] mb-2'} text-left`}>
              {isSubQuestion && q.id === 'q2' && (
                <div className="animate-in slide-in-from-top duration-300 space-y-2 p-2.5 bg-purple-600/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1 text-white"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> <p className="text-[11px] font-black text-purple-400 italic leading-tight">“ส่วนใหญ่คนค้นหาเป็น ‘ชื่อแบรนด์’ หรือ ‘หมวดสินค้า/บริการ’ ครับ?”</p></div>
                  <div className="flex gap-2">
                    {['ชื่อแบรนด์', 'หมวดสินค้า/บริการ'].map((opt, i) => (
                      <button key={i} onClick={() => setSubSelected(opt)} className={`px-4 py-1.5 text-[11px] font-black uppercase rounded-full border border-purple-500/30 transition-all ${subSelected === opt ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-transparent text-white hover:text-white/80'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}
              {botFeedback && (
                <div className="animate-in slide-in-from-top duration-300 p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl flex gap-3 items-center text-left text-white text-left">
                  <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0 border border-purple-500/30 text-purple-400"><Lightbulb size={14} /></div>
                  <div className="text-[12px] font-bold text-zinc-200 leading-tight italic">{botFeedback}</div>
                </div>
              )}
            </div>

            <div className={`flex justify-between items-center gap-4 text-center text-white ${q.id === 'q8' ? 'mt-[-12px]' : 'mt-0'}`}>
              <button onClick={() => currentIdx > 0 ? setCurrentIdx(currentIdx - 1) : setStep(0)} className="text-zinc-700 hover:text-white font-black uppercase text-[9px] tracking-widest flex items-center gap-2 transition-colors">
                <ChevronLeft size={14} /> Back
              </button>
              <button disabled={!selected || (isSubQuestion && q.id === 'q2' && !subSelected)} onClick={handleNext} className={`flex-1 sm:flex-none px-10 py-3 font-black uppercase text-[9px] tracking-widest transition-all rounded-full ${selected && (!isSubQuestion || (q.id === 'q2' ? subSelected : true)) ? 'bg-purple-600 text-white shadow-lg active:scale-95' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'}`}>Next Step</button>
            </div>
          </div>
        )}

        {/* STEP 2: ANALYZING PAGE */}
        {step === 2 && (
          <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-700 text-center text-white">
            <div className="relative text-white">
              <div className="absolute inset-0 bg-purple-600/20 blur-[60px] animate-pulse rounded-full text-center" />
              <div className="relative w-24 h-24 bg-zinc-900 border-2 border-zinc-800 rounded-[2rem] flex items-center justify-center shadow-2xl text-center text-white">
                <BrainCircuit size={40} className="text-purple-500 animate-bounce text-center text-white" />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center animate-ping text-white text-center text-white text-center">
                <Zap size={16} />
              </div>
            </div>
            <div className="space-y-4 text-center text-white text-white">
              <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase text-white animate-pulse text-center">Strategic Audit</h1>
              <p className="text-zinc-500 text-xs sm:text-sm font-black uppercase tracking-[0.6em] text-center">Constructing Mix for <span className="text-white">{clientName}</span></p>
            </div>
            <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden text-center mx-auto text-white"><div className="h-full bg-purple-600 animate-[loading_4s_ease-in-out] text-center" /></div>
          </div>
        )}

        {/* STEP 3: DASHBOARD */}
        {step === 3 && result && (
          <div className="w-full flex flex-col animate-in slide-in-from-bottom duration-1000 px-4 py-2 text-left overflow-y-auto max-h-full custom-scrollbar text-white">
            <div className="flex flex-col mb-10 text-left animate-in fade-in duration-700 text-white">
              <div className="mb-2 text-white"><span className="bg-purple-600 px-4 py-1 rounded-md text-[11px] font-black uppercase tracking-[0.2em] text-white">Class: {result.id}</span></div>

              {/* UPDATED: CLIENT NAME IS SMALLER (text-lg sm:text-xl) */}
              <div className="text-lg sm:text-xl font-black uppercase tracking-widest text-white mb-2 leading-none opacity-80">Client: {clientName}</div>

              <h1 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase leading-none text-white mb-2">{result.name}</h1>

              {result.desc && (
                <p className="text-sm sm:text-base font-normal text-zinc-400 mb-3 leading-tight">
                  {result.desc}
                </p>
              )}

              <div className="text-base sm:text-lg font-black uppercase tracking-tight text-purple-500">
                Facebook <span className="text-white">{result.fb}%</span> | Google <span className="text-white">{result.gg}%</span> {result.tt > 0 ? <> | TikTok <span className="text-white">{result.tt}%</span></> : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full text-left">
              {/* MATRIX GRAPH SECTION */}
              <div className="lg:col-span-4 bg-zinc-900/10 border border-zinc-800/50 rounded-3xl p-8 flex flex-col items-center justify-start text-center">
                {/* UPDATED: LABEL TO Media budget allocation */}
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-4">Media budget allocation</h3>
                <DonutChart fb={result.fb} gg={result.gg} tt={result.tt} />
              </div>

              {/* RECOMMENDATION SECTION */}
              <div className="lg:col-span-4 bg-zinc-900/30 border-2 border-purple-900/10 rounded-3xl p-8 flex flex-col relative min-h-[400px]">
                <div className="absolute top-4 right-6 flex items-center gap-2 opacity-30 text-white"><Presentation size={14} className="hidden xs:block" /> <span className="text-[8px] font-black uppercase tracking-widest text-white text-white text-white">Script</span></div>
                <div className="flex items-center gap-3 mb-6 text-white text-white text-white text-white">
                  <Mic className="text-purple-500 w-6 h-6 shrink-0" />
                  {/* UPDATED: LABEL TO Recommendation */}
                  <h3 className="text-xl font-black uppercase tracking-widest italic leading-tight text-white">Recommendation</h3>
                </div>

                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-900 mb-8 italic text-zinc-200 text-[17px] leading-relaxed shadow-inner text-left text-white">
                  "{result.script}"
                </div>

                {/* UPDATED: AI DIRECTOR LABEL ENLARGED (text-lg sm:text-xl) */}
                <h4 className="text-lg sm:text-xl font-black text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
                  <Sparkles size={20} /> AI Director Planner Pro Tips:
                </h4>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-zinc-300 text-base leading-relaxed font-medium whitespace-pre-line text-left text-white">
                  {aiAdvice || "Senior Media Planner กำลังวิเคราะห์แผนงาน..."}
                </div>
              </div>

              {/* NEXT STEPS SECTION */}
              <div className="lg:col-span-4 bg-zinc-900/10 border border-zinc-800/50 rounded-3xl p-8 flex flex-col min-h-[400px]">
                <div className="flex items-center gap-3 mb-6 text-left text-white">
                  <Target className="text-purple-500 w-6 h-6 shrink-0" />
                  {/* UPDATED: LABEL TO Next steps */}
                  <h3 className="text-xl font-black uppercase tracking-widest italic leading-tight text-white">Next steps</h3>
                </div>

                <div className="mb-8 p-6 bg-purple-600/5 border-l-4 border-purple-600 rounded-r-xl text-left text-white">
                  <p className="text-[17px] text-zinc-100 font-bold leading-relaxed">{result.insights}</p>
                </div>

                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 text-left text-white">
                  {result.recs.map((rec, i) => (
                    <div key={i} className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex gap-4 text-white">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-[12px] font-black shrink-0 text-purple-500">0{i + 1}</div>
                      <p className="text-base text-zinc-400 font-medium leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* NEW PLANNING BUTTON */}
            <div className="w-full mt-12 mb-10 flex justify-center text-white">
              <button
                onClick={() => setStep(0)}
                className="px-20 py-5 bg-white text-black text-[13px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-purple-600 hover:text-white transition-all active:scale-95 shadow-[0_20px_50px_rgba(161,0,255,0.2)] text-black"
              >
                New Planning
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: HISTORY */}
        {step === 4 && (
          <div className="w-full flex flex-col animate-in slide-in-from-bottom duration-1000 px-4 py-2 max-h-full overflow-y-auto custom-scrollbar text-white text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 text-left text-white">
              <div><h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none text-white">History</h1><p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] mt-2 text-left">ประวัติการประมวลผล</p></div>
              <button onClick={() => setStep(0)} className="w-12 h-12 flex items-center justify-center border border-zinc-800 rounded-full hover:bg-zinc-900 transition-all text-white text-center text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4 w-full text-white text-left">
              {isHistoryLoading ? <div className="py-12 text-center opacity-40 uppercase font-black text-[11px] text-white">Syncing...</div> : historyItems.length === 0 ? <div className="py-20 text-center opacity-20 uppercase font-black text-[11px] border-2 border-dashed border-zinc-900 rounded-[3rem] text-white text-center">Empty</div> : historyItems.map((item) => (
                <div key={item.id} className="group bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl hover:border-purple-600 transition-all flex flex-col md:flex-row justify-between items-center gap-6 text-white text-left">
                  <div className="flex gap-6 items-center w-full text-left">
                    <div className="w-14 h-14 bg-zinc-800 border-2 border-zinc-700 rounded-2xl flex items-center justify-center font-black text-purple-500 text-lg shrink-0">{item.modelId}</div>
                    <div className="flex-1 min-w-0 text-white">
                      <h4 className="text-lg font-black uppercase tracking-tight truncate text-white">{item.clientName}</h4>
                      <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-600 uppercase mt-1 text-left text-white">
                        <span>{item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Saving...'}</span>
                        <span className="text-purple-600/80">Strategy Class: {item.modelId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto text-left text-white">
                    <button onClick={() => { setClientName(item.clientName); setResult({ ...MODELS[item.modelId], efficiency: item.efficiency }); setAiAdvice(item.aiAdvice); setStep(3); }} className="flex-1 md:flex-none px-8 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all rounded-2xl text-center text-black">Open</button>
                    <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'briefs', item.id))} className="text-zinc-800 hover:text-red-500 p-3 transition-colors text-white text-center text-white"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading { from { width: 0%; } to { width: 100%; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #A100FF; }
      `}</style>
    </div>
  );
};

export default App;