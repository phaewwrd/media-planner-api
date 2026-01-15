export type Question = {
  id: string;
  topic: string;
  desc: string;
  hint: string;
  options: {
    label: string;
    val: string;
    sub?: string;
    points?: { fb: number; gg: number };
  }[];
  feedback?: string;
};

export type Model = {
  id: string;
  name: string;
  fb: number;
  gg: number;
  tt: number;
  insights: string;
  recs: string[];
  script: string;
};

export const QUESTIONS: Question[] = [
  {
    id: 'q1', topic: "Strategic Context", desc: "โดยทั่วไป ลูกค้าซื้อสินค้าหรือบริการนี้แบบไหนมากกว่าครับ?", hint: "Planner Hint: สะท้อนพฤติกรรมการตัดสินใจจริง ไม่ใช่แค่ราคา",
    options: [
      { label: 'ตัดสินใจเร็ว / เห็นแล้วซื้อเลย', val: 'Low', sub: 'Low involvement / FB +3 Points', points: { fb: 3, gg: 0 } },
      { label: 'ต้องคิด / เทียบ / อ่านรีวิวก่อน', val: 'High', sub: 'High involvement / GG +3 Points', points: { fb: 0, gg: 3 } }
    ],
    feedback: "ข้อนี้จะกำหนดบทบาทของช่องทาง ไม่ได้เปลี่ยนเป้าหมาย Conversion ครับ"
  },
  {
    id: 'q2', topic: "Strategic Context", desc: "ปัจจุบัน ลูกค้ามีการค้นหาสินค้าหรือบริการนี้บน Google อยู่แล้วไหมครับ?", hint: "Search Volume Presence",
    options: [
      { label: 'มีการค้นหาชัดเจน', val: 'Yes', sub: 'Existing Demand / GG +2 Points', points: { fb: 0, gg: 2 } },
      { label: 'แทบไม่มี / สินค้าใหม่ ต้องสร้างการรับรู้ก่อน', val: 'No', sub: 'Need Awareness / FB +2 Points', points: { fb: 2, gg: 0 } }
    ]
  },
  {
    id: 'q3', topic: "Strategic Context", desc: "ลูกค้าของคุณมีแนวโน้ม “ซื้อซ้ำ” มากแค่ไหนครับ?", hint: "LTV / Retention Structure",
    options: [
      { label: 'ซื้อครั้งเดียว หรือซื้อนาน ๆ ครั้ง (One-off)', val: 'No', sub: 'One-off Model / GG +1 Point', points: { fb: 0, gg: 1 } },
      { label: 'ใช้แล้วต้องซื้อซ้ำเป็นรอบ (Repeat)', val: 'Yes', sub: 'Repeat Purchase / FB +1 Point', points: { fb: 1, gg: 0 } }
    ],
    feedback: "ข้อนี้ใช้ประเมินโครงสร้างรายได้ระยะยาว และจะช่วยปรับน้ำหนักช่องทางให้เหมาะกับการเติบโตของธุรกิจ, ข้อนี้สะท้อนโครงรายได้ ไม่ได้เปลี่ยนเป้าหมาย Conversion"
  },
  {
    id: 'q4', topic: "Operational Flow", desc: "โดยปกติ ลูกค้าซื้อสินค้าของคุณผ่านช่องทางไหนเป็นหลักครับ?", hint: "Friction Check (TikTok Blocker if B)",
    options: [
      { label: 'ซื้อออนไลน์ได้ทันที จบภายในแชทเดียว (Website / Marketplace / Social commerce)', val: 'Low', sub: 'Low Friction / FB +1 Point', points: { fb: 1, gg: 0 } },
      { label: 'ต้องให้ทีม Follow-up / โทร / เสนอราคา', val: 'High', sub: 'High Friction / GG +1 Point', points: { fb: 0, gg: 1 } }
    ]
  },
  {
    id: 'q5', topic: "Operational Flow", desc: "ตอนนี้ระบบวัดผลโฆษณา (Pixel / Conversion) พร้อมแค่ไหนครับ?", hint: "Data Health (TikTok Blocker if B)",
    options: [
      { label: 'ติดตั้งครบ วัดผลได้ถึงจุดปิดการขาย', val: 'Strong', sub: 'Full Funnel / GG +1 Point', points: { fb: 0, gg: 1 } },
      { label: 'ยังไม่ครบ / วัดได้แค่คลิกหรือแชท วัดได้แค่คลิก/แชท ยังวัดถึงยอดขายไม่ได้', val: 'Weak', sub: 'Partial Tracking / FB +1 Point', points: { fb: 1, gg: 0 } }
    ],
    feedback: "กรณีนี้ระบบจะเน้นช่องทางที่ควบคุมต้นทุนได้มากที่สุด และจะยังไม่เปิด Test channel"
  },
  { id: 'q6', topic: "Content & Resources", desc: "ตอนนี้มี 'วิดีโอแนวตั้ง' ที่พร้อมใช้ยิงโฆษณาไหมครับ?", hint: "Creative Block (TikTok Blocker if B)", options: [{ label: 'มีวิดีโอที่เหมาะกับโซเชียล', val: 'Yes', sub: '' }, { label: 'ยังไม่มี asset พร้อมใช้', val: 'No', sub: '' }] },
  { id: 'q7', topic: "Content & Resources", desc: "งบโฆษณาที่วางไว้ต่อเดือนประมาณเท่าไหร่ครับ?", hint: "Budget Block (TikTok Blocker if < 70k)", options: [{ label: '70,000 บาทขึ้นไป', val: 'High', sub: '' }, { label: 'ต่ำกว่า 70,000 บาท', val: 'Low', sub: '' }] },
  { id: 'q8', topic: "Audience & Strategy", desc: "กลุ่มลูกค้าเป้าหมายหลักคือช่วงอายุไหนครับ?", hint: "Age Blocker (TikTok Blocker if 45+)", options: [{ label: '18–24 (Gen Z)', val: '18-24', sub: '' }, { label: '25–34', val: '25-34', sub: '' }, { label: '35–44', val: '35-44', sub: '' }, { label: '45+', val: '45+', sub: '' }] },
  {
    id: 'q9', topic: "Audience & Strategy", desc: "เป้าหมายหลักของแคมเปญนี้คือแบบไหนครับ?", hint: "Volume vs Quality",
    options: [
      { label: 'อยากได้จำนวน Lead / Order ให้มากที่สุด (CPL ต่ำ)', val: 'Volume', points: { fb: 1, gg: 0 } },
      { label: 'อยากได้ลูกค้า/Lead ที่คุณภาพสูง มีโอกาสปิดจริง เช่น ROAS สูงขึ้น / order มาร์จิ้นดี / cancel rate ต่ำ', val: 'Quality', points: { fb: 0, gg: 1 } }
    ],
    feedback: "ข้อนี้กำหนดบทบาทของโฆษณาใน funnel ไม่ใช่ตัววัดความคุ้มค่าของ Conversion"
  },
  { id: 'q10', topic: "Audience & Strategy", desc: "ที่ผ่านมาเคยยิงโฆษณาแล้วมีช่องทางที่เห็นผลชัดเจนไหมครับ?", hint: "Proof of Concept Context", options: [{ label: 'มีข้อมูลย้อนหลัง 3–6 เดือน และ winner channel คือ Facebook', val: 'FACEBOOK', sub: '' }, { label: 'มีข้อมูลย้อนหลัง 3–6 เดือน และ winner channel คือ Google', val: 'GOOGLE', sub: '' }, { label: 'ยังไม่มี / เพิ่งเริ่มต้นใหม่', val: 'New', sub: '' }] }
];

export const MODELS: { [key: string]: Model } = {
  C1: { id: "C1", name: "Social Dominance", fb: 70, gg: 20, tt: 10, insights: "สร้างกระแสผ่านวิดีโอสั้นและโซเชียลเป็นหัวหอกเพื่อสร้างความต้องการซื้อแบบทันที", recs: ["รันแคมเปญวิดีโอว่อน TikTok", "ใช้ Broad Targeting บน FB", "ทำ TikTok Spark Ads"], script: "เราเน้นสร้างกระแสบน Facebook และ TikTok เป็นหลักครับ เพราะสินค้าเน้นอารมณ์" },
  C2: { id: "C2", name: "Stable Social Foundation", fb: 70, gg: 30, tt: 0, insights: "สร้างรากฐานบน Facebook ให้แข็งแรง และใช้ Search เก็บกลุ่ม Intent ตกหล่น", recs: ["ติดตั้ง Conversions API", "ทำ Single Image Ads สวยๆ", "ดัก Search Keyword ชื่อแบรนด์"], script: "เริ่มจากสร้างฐานแฟนบนโซเชียลและใช้ Google Search เก็บงานครับ" },
  C3: { id: "C3", name: "Customer Loyalty Focus", fb: 75, gg: 25, tt: 0, insights: "เน้นกระตุ้นการซื้อซ้ำจากฐานลูกค้าเดิมผ่าน Retargeting เพราะดาต้าบ่งชี้ว่า LTV สูง", recs: ["ทำ Facebook Catalog Ads", "สร้าง Custom Audience จากเบอร์โทร", "กันงบ Search สำหรับ Brand Key"], script: "แผนนี้เน้นรีดประสิทธิภาพจากลูกค้าเก่าเพื่อผลกำไรที่มั่นคงครับ" },
  C4: { id: "C4", name: "Efficient Performance", fb: 80, gg: 20, tt: 0, insights: "ทุ่มงบไปจุดที่ทำกำไรสูงสุด (Winning Channel) เพื่อรีด ROAS ให้ถึงขีดสุด", recs: ["ปิด Ad Set ที่ไม่มีกำไรรายวัน", "ใช้คอนเทนต์แก้ Pain Point เจาะจง", "รันแคมเปญ Pmax ควบคู่"], script: "เราจะเทงบไปที่ Facebook 80% เพื่อสเกลออเดอร์ให้ได้มากที่สุดครับ" },
  C5: { id: "C5", name: "Omnichannel Intent Drive", fb: 30, gg: 60, tt: 10, insights: "ใช้ Google Search ปิดการขายกลุ่มที่มีความต้องการสูง และใช้ TikTok ช่วยโน้มน้าว", recs: ["เน้น Google Shopping Ads", "ทำคลิปรีวิวป้ายยาลง TikTok", "วิเคราะห์ Journey ผ่าน GA4"], script: "ใช้พลังการค้นหาคู่กับการป้ายยาวิดีโอเพื่อปิดยอดขายระดับสูงครับ" },
  C6: { id: "C6", name: "Search Intent Capture", fb: 30, gg: 70, tt: 0, insights: "ดักจับกลุ่มลูกค้าที่มีความต้องการชัดเจนบน Search เพื่อความปลอดภัยของ CPA", recs: ["เน้น Keyword ซื้อ/ราคา/รีวิว", "ปรับ Landing Page ให้เปรียบเทียบง่าย", "ทำ Remarketing ตอกย้ำ"], script: "แผนนี้ดักคนที่มีความต้องการซื้อชัดเจนอยู่แล้วบน Google เป็นหลักครับ" },
  C7: { id: "C7", name: "Premium Lead Quality Filter", fb: 25, gg: 75, tt: 0, insights: "มุ่งเน้นกรองคุณภาพผู้ติดต่อระดับพรีเมียมผ่าน Keyword กรองกลุ่มเป้าหมาย", recs: ["ใช้ Bidding Target ROAS", "คัด Negative Keywords ละเอียด", "ทำ Remarketing เฉพาะคนเข้าเว็บ"], script: "เน้นคัดเฉพาะ Lead คุณภาพสูงเพื่อให้ทีมขายปิดงานได้ง่ายและแม่นยำครับ" },
  C8: { id: "C8", name: "Market Authority Leadership", fb: 20, gg: 80, tt: 0, insights: "ครอบครองพื้นที่การค้นหาในทุกมิติ ยึดอันดับ 1 ในทุก Keyword สำคัญของตลาด", recs: ["รัน Search คลุมคู่แข่งทุกราย", "ใช้ Pmax เก็บตกทุกช่องทาง", "ทำ GDN ตอกย้ำความเป็นเบอร์ 1"], script: "เป้าหมายคือการเป็นที่หนึ่งในใจลูกค้าทุกครั้งที่มีการเสิร์ชหาแบรนด์ครับ" }
};