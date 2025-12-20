/**
 * Decision Tree Knowledge Base
 * 
 * Contains the complete 9-step decision tree logic for Digital Media Planning.
 * This serves as the "knowledge base" for the RAG system.
 * 
 * In a production RAG system, this data would be:
 * - Stored in a vector database (Pinecone, Chroma, etc.)
 * - Retrieved based on semantic similarity
 * - Enhanced with embeddings for better matching
 * 
 * For now, we use direct lookups, but the structure is designed
 * to be compatible with future vector DB integration.
 */

import { StepDefinition } from '../types';

/**
 * Complete Decision Tree
 * Maps step IDs to their definitions
 * 
 * Flow logic:
 * - STEP_1: Objective → branches to STEP_1A (Awareness) or STEP_2 (Conversion)
 * - STEP_1A: Awareness-specific flow (only for awareness objective)
 * - STEP_2-9: Common steps for all paths
 */
export const DECISION_TREE: Record<string, StepDefinition> = {

    // ========================================================================
    // STEP 1: Campaign Objective
    // ========================================================================
    STEP_1: {
        id: 'STEP_1',
        stepNumber: 1,
        question: 'เป้าหมายหลักของแคมเปญคืออะไร?',
        insight: 'Senior Planner Tip: Objective เป็นตัวกำหนดทิศทางของ Media Mix ทั้งหมด - Awareness ใช้ช่องทางกว้าง, Conversion ใช้ช่องทางที่มี Intent',
        options: [
            {
                id: 'awareness',
                label: 'Awareness / Reach / View',
                description: 'เน้นสร้างการรับรู้แบรนด์ เข้าถึงคนให้ได้มากที่สุด',
                nextStepId: 'STEP_1A',
                metadata: { objective: 'awareness', funnel: 'top' }
            },
            {
                id: 'conversion',
                label: 'Lead / Sales / Conversion',
                description: 'เน้นผลลัพธ์ที่วัดได้ เช่น ยอดขาย, ลีด, สมัครสมาชิก',
                nextStepId: 'STEP_2',
                metadata: { objective: 'conversion', funnel: 'bottom' }
            }
        ]
    },

    // ========================================================================
    // STEP 1A: Awareness Flow (Conditional - only if user selected Awareness)
    // ========================================================================
    STEP_1A: {
        id: 'STEP_1A',
        stepNumber: 1.5, // Sub-step
        question: 'กลุ่มเป้าหมายหลักของคุณคือใคร?',
        insight: 'Senior Planner Tip: สำหรับ Awareness คุณต้องเลือกช่องทางที่กลุ่มเป้าหมายใช้เยอะที่สุด - Gen Z อยู่ที่ TikTok, ผู้ใหญ่อยู่ที่ Facebook',
        options: [
            {
                id: 'genz',
                label: 'Gen Z / Mass / Viral',
                description: 'อายุ 18-24 ปี ชอบคอนเทนต์สั้น viral-able',
                nextStepId: 'STEP_2',
                metadata: {
                    audience: 'genz',
                    // Allocation logic for awareness + Gen Z
                    allocation: {
                        TikTok: { min: 40, max: 60, role: 'Hero' },
                        Facebook: { min: 30, max: 40, role: 'Support' },
                        Google: { min: 0, max: 20, role: 'Test' }
                    }
                }
            },
            {
                id: 'adult',
                label: 'ผู้ใหญ่ / Branding',
                description: 'อายุ 25+ ปี เน้น Brand Image และความน่าเชื่อถือ',
                nextStepId: 'STEP_2',
                metadata: {
                    audience: 'adult',
                    // Allocation logic for awareness + Adult
                    allocation: {
                        Facebook: { min: 50, max: 60, role: 'Hero' },
                        TikTok: { min: 20, max: 30, role: 'Support' },
                        Google: { min: 0, max: 20, role: 'Test' }
                    }
                }
            }
        ]
    },

    // ========================================================================
    // STEP 2: Product Involvement
    // ========================================================================
    STEP_2: {
        id: 'STEP_2',
        stepNumber: 2,
        question: 'ระดับราคาสินค้า/บริการของคุณอยู่ในช่วงไหน?',
        insight: 'Senior Planner Tip: สินค้า High Ticket ต้องการ Intent สูง → เน้น Google Search, สินค้า Low Ticket ใช้ Social เพื่อ Volume',
        options: [
            {
                id: 'high_ticket',
                label: 'High Ticket (> 10,000 บาท)',
                description: 'สินค้าราคาสูง ต้องการการตัดสินใจนานขึ้น',
                nextStepId: 'STEP_3A',
                metadata: { priceRange: 'high', involvement: 'high' }
            },
            {
                id: 'low_ticket',
                label: 'Low Ticket (< 1,000 บาท)',
                description: 'สินค้าราคาถูก ตัดสินใจเร็ว ซื้อง่าย',
                nextStepId: 'STEP_3B',
                metadata: { priceRange: 'low', involvement: 'low' }
            }
        ]
    },

    // ========================================================================
    // STEP 3A: High Involvement (Quality Focus)
    // ========================================================================
    STEP_3A: {
        id: 'STEP_3A',
        stepNumber: 3,
        question: 'KPI หลักที่คุณต้องการคืออะไร?',
        insight: 'Senior Planner Tip: High Ticket = เน้น Quality ของ Lead มากกว่า Quantity → Google Search คือ Hero Channel',
        options: [
            {
                id: 'quality',
                label: 'Quality (ลีดคุณภาพสูง)',
                description: 'ลดจำนวน แต่เพิ่มโอกาสปิดการขาย',
                nextStepId: 'STEP_4',
                metadata: {
                    kpi: 'quality',
                    // High involvement + Quality focus
                    allocation: {
                        Google: { min: 50, max: 70, role: 'Hero' },
                        Facebook: { min: 30, max: 50, role: 'Support' },
                        TikTok: { min: 0, max: 10, role: 'Test' }
                    }
                }
            }
        ]
    },

    // ========================================================================
    // STEP 3B: Low Involvement (Volume Focus)
    // ========================================================================
    STEP_3B: {
        id: 'STEP_3B',
        stepNumber: 3,
        question: 'KPI หลักที่คุณต้องการคืออะไร?',
        insight: 'Senior Planner Tip: Low Ticket = เน้น Volume และ ROAS → Facebook/TikTok เป็น Hero เพราะ Scale ง่าย',
        options: [
            {
                id: 'volume',
                label: 'Volume / ROAS (ยอดขายเยอะ)',
                description: 'เพิ่มจำนวน conversion ให้ได้มากที่สุด',
                nextStepId: 'STEP_4',
                metadata: {
                    kpi: 'volume',
                    // Low involvement + Volume focus
                    allocation: {
                        Facebook: { min: 40, max: 50, role: 'Hero' },
                        TikTok: { min: 30, max: 40, role: 'Support' },
                        Google: { min: 10, max: 20, role: 'Test' }
                    }
                }
            }
        ]
    },

    // ========================================================================
    // STEP 4: Monthly Budget
    // ========================================================================
    STEP_4: {
        id: 'STEP_4',
        stepNumber: 4,
        question: 'งบประมาณรายเดือนของคุณอยู่ในช่วงไหน?',
        insight: 'Senior Planner Tip: งบน้อย = Focus ช่องทางเดียวให้ดี, งบเยอะ = กระจายได้ (Hero/Support/Test Model)',
        options: [
            {
                id: 'low_budget',
                label: '< 100,000 บาท',
                description: 'งบจำกัด ควรโฟกัส 1-2 ช่องทาง',
                nextStepId: 'STEP_5',
                metadata: {
                    budget: 'low',
                    maxChannels: 2,
                    note: 'ใช้ไม่เกิน 2 ช่องทาง - เน้นช่องทางที่แน่ใจว่าจะ perform'
                }
            },
            {
                id: 'high_budget',
                label: '≥ 100,000 บาท',
                description: 'งบพอ สามารถทดสอบได้หลายช่องทาง',
                nextStepId: 'STEP_5',
                metadata: {
                    budget: 'high',
                    maxChannels: 3,
                    note: 'ใช้ 2-3 ช่องทาง - แบ่งเป็น Hero / Support / Test'
                }
            }
        ]
    },

    // ========================================================================
    // STEP 5: KPI Focus (Adjustment)
    // ========================================================================
    STEP_5: {
        id: 'STEP_5',
        stepNumber: 5,
        question: 'คุณต้องการเน้นอะไรมากกว่ากัน?',
        insight: 'Senior Planner Tip: Volume = เพิ่ม Facebook, Quality = เพิ่ม Google - ใช้ปรับ allocation จาก STEP ก่อนหน้า',
        options: [
            {
                id: 'prefer_volume',
                label: 'Volume (ยอดเยอะ)',
                description: 'ต้องการ Conversion เยอะที่สุด',
                nextStepId: 'STEP_6',
                metadata: {
                    adjustment: 'increase_facebook_tiktok',
                    note: 'เพิ่ม Facebook / TikTok, ลด Google'
                }
            },
            {
                id: 'prefer_quality',
                label: 'Quality (คุณภาพ)',
                description: 'ต้องการลีดที่มีโอกาสซื้อสูง',
                nextStepId: 'STEP_6',
                metadata: {
                    adjustment: 'increase_google',
                    note: 'เพิ่ม Google Search, ลด Facebook'
                }
            }
        ]
    },

    // ========================================================================
    // STEP 6: Campaign Duration
    // ========================================================================
    STEP_6: {
        id: 'STEP_6',
        stepNumber: 6,
        question: 'ระยะเวลาของแคมเปญเป็นแบบไหน?',
        insight: 'Senior Planner Tip: Burst Campaign = Social Hero (Viral ง่าย), Always-on = Google Hero (Intent ต่อเนื่อง)',
        options: [
            {
                id: 'burst',
                label: 'Burst (ระยะสั้น 1-3 เดือน)',
                description: 'โปรโมชั่นพิเศษ, Launch สินค้าใหม่',
                nextStepId: 'STEP_7',
                metadata: {
                    duration: 'burst',
                    channelPreference: 'Facebook Hero + TikTok Support',
                    note: 'Social มี momentum เร็วกว่า Search'
                }
            },
            {
                id: 'always_on',
                label: 'Always-on (ยาวต่อเนื่อง)',
                description: 'วิ่งแคมเปญตลอดทั้งปี',
                nextStepId: 'STEP_7',
                metadata: {
                    duration: 'always_on',
                    channelPreference: 'Google Hero + Facebook Retarget',
                    note: 'Google เสถียรกว่าในระยะยาว'
                }
            }
        ]
    },

    // ========================================================================
    // STEP 7: Historical Data
    // ========================================================================
    STEP_7: {
        id: 'STEP_7',
        stepNumber: 7,
        question: 'คุณมีข้อมูลการทำแคมเปญในอดีตหรือไม่?',
        insight: 'Senior Planner Tip: มีข้อมูล = เอางบส่วนใหญ่ไป Winner Channel, ไม่มีข้อมูล = แบ่งงบให้เท่า ๆ กันก่อน',
        options: [
            {
                id: 'has_data',
                label: 'มีข้อมูล',
                description: 'เคยวิ่งแคมเปญมาแล้ว รู้ว่าช่องทางไหน perform',
                nextStepId: 'STEP_8',
                metadata: {
                    historicalData: true,
                    allocationStrategy: 'Winner 60-70% / Test 20-30%',
                    note: 'เอางบส่วนใหญ่ไปช่องทางที่ perform ดีที่สุดจากข้อมูลเก่า'
                }
            },
            {
                id: 'no_data',
                label: 'ไม่มีข้อมูล',
                description: 'เริ่มต้นใหม่ ยังไม่แน่ใจว่าช่องทางไหนดี',
                nextStepId: 'STEP_8',
                metadata: {
                    historicalData: false,
                    allocationStrategy: 'Facebook Base + Google Intent',
                    note: 'เริ่มจาก Facebook (Base) + Google (Intent) แล้วค่อยปรับตามข้อมูล'
                }
            }
        ]
    },

    // ========================================================================
    // STEP 8: Client Preference
    // ========================================================================
    STEP_8: {
        id: 'STEP_8',
        stepNumber: 8,
        question: 'Client มี preference ช่องทางเฉพาะหรือไม่?',
        insight: 'Senior Planner Tip: ถ้า Client insist ช่องทางใดช่องทางหนึ่ง ควรกันงบไว้ทดสอบ 10-20% แม้คุณจะไม่แนะนำก็ตาม',
        options: [
            {
                id: 'client_insist',
                label: 'Client insist ช่องทางเฉพาะ',
                description: 'Client ต้องการใช้ช่องทางที่ระบุเอาไว้',
                nextStepId: 'STEP_9',
                metadata: {
                    clientPreference: true,
                    note: 'กันงบ 10-20% เป็น Test budget ให้ช่องทางที่ Client ต้องการ'
                }
            },
            {
                id: 'no_preference',
                label: 'ไม่มี preference',
                description: 'Client ไว้ใจให้ Planner ตัดสินใจเอง',
                nextStepId: 'STEP_9',
                metadata: {
                    clientPreference: false,
                    note: 'เต็มที่ตามกลยุทธ์ที่วางไว้'
                }
            }
        ]
    },

    // ========================================================================
    // STEP 9: Tracking Capability (Final Step)
    // ========================================================================
    STEP_9: {
        id: 'STEP_9',
        stepNumber: 9,
        question: 'ความสามารถในการติดตาม Conversion ของคุณแข็งแรงแค่ไหน?',
        insight: 'Senior Planner Tip: Tracking ดี = กระจายงบได้หลายช่องทาง, Tracking อ่อน = เน้น Facebook (Pixel แม่นกว่า)',
        options: [
            {
                id: 'good_tracking',
                label: 'Tracking ดี',
                description: 'มี Pixel, GA4, Conversion API ครบ',
                nextStepId: null, // End of tree
                metadata: {
                    tracking: 'good',
                    note: 'กระจาย Google / TikTok ได้ เพราะ track conversion แม่น',
                    canUseMultiChannel: true
                }
            },
            {
                id: 'weak_tracking',
                label: 'Tracking อ่อน',
                description: 'Tracking ยังไม่แม่น หรือพึ่ง Pixel อย่างเดียว',
                nextStepId: null, // End of tree
                metadata: {
                    tracking: 'weak',
                    note: 'Facebook Hero เพราะ track conversion ได้ดีกว่าช่องทางอื่น',
                    preferFacebook: true
                }
            }
        ]
    }
};

/**
 * Get step definition by ID
 * Simulates RAG retrieval from vector DB
 * 
 * In production RAG:
 * - This would query a vector database
 * - Use semantic similarity to find relevant step
 * - Return enhanced context from embeddings
 */
export function getStepById(stepId: string): StepDefinition | null {
    return DECISION_TREE[stepId] || null;
}

/**
 * Get the first step (entry point)
 */
export function getInitialStep(): StepDefinition {
    return DECISION_TREE.STEP_1;
}

/**
 * Get all step IDs
 * Useful for validation and debugging
 */
export function getAllStepIds(): string[] {
    return Object.keys(DECISION_TREE);
}
