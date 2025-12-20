/**
 * Prompt Templates for RAG System
 * 
 * Contains system prompts and templates for different question categories.
 * These prompts guide the AI to provide relevant, helpful answers
 * specifically tailored for Junior Digital Planners.
 */

import { QuestionCategory } from '../types';

/**
 * Base system prompt for the AI assistant
 * Sets the tone and expertise level
 */
export const SYSTEM_PROMPT = `คุณคือ AI Assistant ผู้เชี่ยวชาญด้าน Digital Marketing และ Media Planning
โดยเฉพาะสำหรับ Junior Digital Planner ที่กำลังเริ่มต้นในวงการ

หน้าที่ของคุณ:
- ตอบคำถามด้าน Media Planning, Campaign Strategy, KPI/Funnel, และ Performance Marketing
- อธิบายแนวคิดที่ซับซ้อนให้เข้าใจง่าย เหมาะกับระดับ junior
- ให้ตัวอย่างที่ชัดเจนและนำไปใช้ได้จริง
- ใช้ภาษาที่เป็นมิตร เข้าใจง่าย แต่มีความเป็นมืออาชีพ

รูปแบบการตอบ:
- ตอบเป็นข้อๆ ชัดเจน
- ใช้หัวข้อย่อยเมื่อมีหลายประเด็น
- ให้ตัวอย่างเมื่อจำเป็น
- หากไม่แน่ใจ ให้บอกและแนะนำแหล่งข้อมูลเพิ่มเติม`;

/**
 * Category-specific prompt suffixes
 * Adds context based on the detected category
 */
export const CATEGORY_PROMPTS: Record<QuestionCategory, string> = {
    'media-planning': `
คำถามนี้เกี่ยวกับ Media Planning
โฟกัส: Channel selection, Budget allocation, Media mix, Reach & Frequency
`,
    'campaign-strategy': `
คำถามนี้เกี่ยวกับ Campaign Strategy
โฟกัส: Campaign objectives, Target audience, Creative strategy, Timeline
`,
    'kpi-funnel': `
คำถามนี้เกี่ยวกับ KPI & Funnel
โฟกัส: Metrics definition, Funnel stages, Conversion tracking, Performance indicators
`,
    'performance': `
คำถามนี้เกี่ยวกับ Performance Marketing
โฟกัส: Optimization, A/B testing, ROAS, CPA, Conversion rate
`,
    'general': `
คำถามทั่วไปเกี่ยวกับ Digital Marketing
โฟกัส: ตอบตามบริบทของคำถาม
`
};

/**
 * Build complete prompt with context
 * 
 * @param question - User's question
 * @param category - Detected category
 * @param context - Retrieved context from vector DB (optional)
 * @returns Complete prompt for LLM
 */
export function buildPrompt(
    question: string,
    category: QuestionCategory,
    context?: string[]
): string {
    let prompt = SYSTEM_PROMPT;

    // Add category-specific context
    prompt += '\n\n' + CATEGORY_PROMPTS[category];

    // Add retrieved context if available
    if (context && context.length > 0) {
        prompt += '\n\nข้อมูลอ้างอิงที่เกี่ยวข้อง:\n';
        context.forEach((ctx, idx) => {
            prompt += `${idx + 1}. ${ctx}\n`;
        });
    }

    // Add the actual question
    prompt += `\n\nคำถาม: ${question}`;

    return prompt;
}

/**
 * Sample knowledge base entries (mock data)
 * In production, these would come from vector DB
 */
export const SAMPLE_KNOWLEDGE_BASE = {
    'media-planning': [
        'Media Planning คือ การวางแผนการใช้ช่องทาง (Channel) ต่างๆ เพื่อสื่อสารกับกลุ่มเป้าหมาย โดยคำนึงถึง Reach, Frequency, และ Budget',
        'Channel หลักๆ ที่ Digital Planner ควรรู้จัก: Facebook Ads, Google Ads, Line Ads, TikTok Ads, YouTube Ads, Display Network',
        'Budget allocation ควรพิจารณา: กลุ่มเป้าหมาย, Objective ของแคมเปญ, Cost per result ของแต่ละ channel'
    ],
    'campaign-strategy': [
        'Campaign Strategy ประกอบด้วย: Objective, Target Audience, Key Message, Creative Direction, และ Success Metrics',
        'Funnel แบ่งเป็น: Awareness (รู้จัก) → Interest (สนใจ) → Consideration (พิจารณา) → Conversion (ตัดสินใจ) → Loyalty (ภักดี)',
        'Creative ควรสอดคล้องกับ: Insight ของกลุ่มเป้าหมาย, Brand positioning, และ Media format'
    ],
    'kpi-funnel': [
        'KPIs สำหรับ Awareness: Reach, Impression, Brand Awareness Lift, Video Views',
        'KPIs สำหรับ Consideration: Click, Engagement Rate, Time on Site, Page Views',
        'KPIs สำหรับ Conversion: Conversion Rate, CPA, ROAS, Sales, Lead'
    ],
    'performance': [
        'Performance Marketing คือ การตลาดที่วัดผลได้ชัดเจน มุ่งเน้น Conversion และ ROI',
        'Optimization techniques: A/B Testing, Audience refinement, Bid strategy adjustment, Creative testing',
        'ROAS (Return on Ad Spend) = Revenue / Ad Spend × 100%'
    ],
    'general': [
        'Digital Marketing ประกอบด้วยหลายด้าน: Media Planning, Campaign Management, Performance Marketing, และ Analytics',
        'Tools สำคัญ: Facebook Ads Manager, Google Ads, Google Analytics, Meta Business Suite',
        'ทักษะสำคัญสำหรับ Digital Planner: Data Analysis, Strategic Thinking, Creative Brief Writing, Budget Management'
    ]
};
