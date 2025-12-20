/**
 * RAG (Retrieval-Augmented Generation) Service
 * 
 * Handles the core RAG logic:
 * 1. Question preprocessing
 * 2. Vector search (mock for now)
 * 3. Context retrieval
 * 4. LLM response generation (mock for now)
 * 
 * This service is designed to be easily integrated with:
 * - Pinecone / Chroma for vector database
 * - OpenAI / Anthropic / Vertex AI for LLM
 */

import { QuestionCategory, ChatResponse } from '../types';
import { buildPrompt, SAMPLE_KNOWLEDGE_BASE } from './prompts';

/**
 * Detect question category based on keywords
 * 
 * In production, this could use:
 * - A classification model
 * - Semantic similarity with category descriptions
 * - LLM-based classification
 */
export function detectCategory(question: string): QuestionCategory {
    const lowerQuestion = question.toLowerCase();

    // Media planning keywords
    if (
        lowerQuestion.includes('media') ||
        lowerQuestion.includes('channel') ||
        lowerQuestion.includes('budget') ||
        lowerQuestion.includes('reach') ||
        lowerQuestion.includes('frequency')
    ) {
        return 'media-planning';
    }

    // Campaign strategy keywords
    if (
        lowerQuestion.includes('campaign') ||
        lowerQuestion.includes('กลยุทธ์') ||
        lowerQuestion.includes('แคมเปญ') ||
        lowerQuestion.includes('strategy') ||
        lowerQuestion.includes('creative')
    ) {
        return 'campaign-strategy';
    }

    // KPI/Funnel keywords
    if (
        lowerQuestion.includes('kpi') ||
        lowerQuestion.includes('funnel') ||
        lowerQuestion.includes('metric') ||
        lowerQuestion.includes('conversion') ||
        lowerQuestion.includes('วัดผล')
    ) {
        return 'kpi-funnel';
    }

    // Performance keywords
    if (
        lowerQuestion.includes('performance') ||
        lowerQuestion.includes('optimization') ||
        lowerQuestion.includes('roas') ||
        lowerQuestion.includes('cpa') ||
        lowerQuestion.includes('a/b test')
    ) {
        return 'performance';
    }

    return 'general';
}

/**
 * Vector Search (MOCK)
 * 
 * In production, replace with actual vector DB query:
 * 
 * // Example with Pinecone:
 * const embedding = await getEmbedding(question);
 * const results = await pinecone.query({
 *   vector: embedding,
 *   topK: 5,
 *   includeMetadata: true
 * });
 * return results.matches.map(m => m.metadata.text);
 * 
 * // Example with Chroma:
 * const results = await chromaClient.query({
 *   queryTexts: [question],
 *   nResults: 5
 * });
 * return results.documents[0];
 */
export async function vectorSearch(
    question: string,
    category: QuestionCategory
): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock knowledge base entries based on category
    const knowledgeBase = SAMPLE_KNOWLEDGE_BASE[category] || SAMPLE_KNOWLEDGE_BASE['general'];

    // In real implementation, this would return semantically similar docs
    return knowledgeBase || [];
}

/**
 * Generate AI Response (MOCK)
 * 
 * In production, replace with actual LLM API call:
 * 
 * // Example with OpenAI:
 * const response = await openai.chat.completions.create({
 *   model: "gpt-4",
 *   messages: [
 *     { role: "system", content: systemPrompt },
 *     { role: "user", content: question }
 *   ]
 * });
 * return response.choices[0].message.content;
 * 
 * // Example with Anthropic Claude:
 * const response = await anthropic.messages.create({
 *   model: "claude-3-opus-20240229",
 *   messages: [{ role: "user", content: prompt }]
 * });
 * return response.content[0].text;
 */
export async function generateAnswer(
    question: string,
    category: QuestionCategory,
    context: string[]
): Promise<string> {
    // Simulate LLM API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Build full prompt (this would be sent to LLM)
    const prompt = buildPrompt(question, category, context);
    console.log('Prompt for LLM:', prompt); // For debugging

    // Mock responses based on category
    const mockAnswers: Record<QuestionCategory, string> = {
        'media-planning': `
## คำตอบเกี่ยวกับ Media Planning

สำหรับคำถามของคุณ "${question}" นี่คือแนวทางที่แนะนำ:

### 1. การเลือก Channel
- **Facebook/Instagram**: เหมาะกับการสร้าง Awareness และ Engagement กับกลุ่มเป้าหมายทั่วไป
- **Google Ads**: เหมาะสำหรับคนที่มี Intent ชัดเจน (Search Ads) และ Retargeting (Display)
- **TikTok**: เหมาะกับกลุ่ม Gen Z และ Content ที่ต้องการ Virality

### 2. Budget Allocation แนะนำ
- เริ่มต้นทดสอบในสัดส่วน 40:30:30 (ช่องทางหลัก:ช่องทางรอง:ทดสอบช่องใหม่)
- Monitor ผลลัพธ์ทุก 3-5 วัน แล้ว optimize

### 3. Tips สำหรับ Junior
- เริ่มจากช่องทางที่คุ้นเคย 1-2 ช่องก่อน
- ศึกษา Audience insights จาก Platform
- ทดสอบ creative หลายๆ รูปแบบ

**หมายเหตุ:** การวาง Media Plan ที่ดีต้องคำนึงถึง Objective, Budget, และ Timeline ควบคู่กันเสมอ
`,
        'campaign-strategy': `
## คำตอบเกี่ยวกับ Campaign Strategy

สำหรับคำถาม "${question}" ขอแนะนำดังนี้:

### 1. การวางกลยุทธ์แคมเปญ
**STEP 1: กำหนด Objective**
- Awareness, Consideration, หรือ Conversion?
- ต้องการผลลัพธ์อะไรเป็นหลัก?

**STEP 2: เข้าใจกลุ่มเป้าหมาย**
- Demographics: อายุ, เพศ, ที่อยู่
- Psychographics: ความสนใจ, พฤติกรรม, ปัญหา
- Media consumption: ใช้ช่องทางไหนบ้าง

**STEP 3: สร้าง Key Message**
- ต้องตอบโจทย์ pain point ของกลุ่มเป้าหมาย
- สื่อสาร benefit ที่ชัดเจน
- แตกต่างจากคู่แข่ง

### 2. Funnel Mapping
- **Top Funnel**: สร้างการรับรู้ → ใช้ Video, Display
- **Mid Funnel**: ดึงความสนใจ → ใช้ Content, Engagement
- **Bottom Funnel**: กระตุ้นการตัดสินใจ → ใช้ Retargeting, Promotion

### 3. Success Metrics
กำหนด KPI ที่ชัดเจนตั้งแต่เริ่มต้น เช่น:
- Awareness: Reach, Impression
- Consideration: Click, Engagement
- Conversion: Lead, Sale, ROAS
`,
        'kpi-funnel': `
## คำตอบเกี่ยวกับ KPI & Funnel

คำถาม: "${question}"

### 1. KPIs ตามแต่ละ Stage

**Awareness Stage (รู้จักแบรนด์)**
- Reach: จำนวนคนที่เห็นโฆษณา
- Impression: จำนวนครั้งที่แสดงโฆษณา
- Video Views: จำนวนคนดูวิดีโอ
- Brand Lift: การเพิ่มขึ้นของการจดจำแบรนด์

**Consideration Stage (พิจารณา)**
- Click-Through Rate (CTR)
- Engagement Rate: Like, Comment, Share
- Landing Page Views
- Time on Site

**Conversion Stage (ตัดสินใจซื้อ)**
- Conversion Rate
- Cost Per Acquisition (CPA)
- Return on Ad Spend (ROAS)
- Revenue

### 2. วิธีคำนวณ

**ROAS** = (Revenue from Ads / Ad Cost) × 100
ตัวอย่าง: ถ้าลงโฆษณา 10,000 บาท ได้ยอดขาย 50,000 บาท
ROAS = (50,000 / 10,000) × 100 = 500% หรือ 5:1

**Conversion Rate** = (Conversions / Clicks) × 100
ตัวอย่าง: คลิก 1,000 ครั้ง มี conversion 50 ครั้ง
Conversion Rate = (50 / 1,000) × 100 = 5%

### 3. Tips การตั้ง KPI
- ตั้ง KPI ที่เหมาะกับ objective
- ทำ Benchmark จากแคมเปญเก่าหรือ Industry Standard
- Review และ adjust KPI ตาม stage ของแคมเปญ
`,
        'performance': `
## คำตอบเกี่ยวกับ Performance Marketing

คำถาม: "${question}"

### 1. Performance Optimization แนวทาง

**A. Audience Optimization**
- แบ่งกลุ่ม audience ให้ละเอียด
- ทดสอบ Lookalike Audience
- ตัด audience ที่ perform ไม่ดีออก

**B. Creative Optimization**
- ทดสอบ creative หลายรูปแบบ (A/B Testing)
- ดู creative fatigue (เมื่อ frequency สูงเกินไป)
- Refresh creative ทุก 7-14 วัน

**C. Bidding Optimization**
- เริ่มจาก Auto bidding ก่อน
- เมื่อมี data พอ เปลี่ยนเป็น Manual bidding
- ปรับ bid ตาม performance ของแต่ละ placement

### 2. การวัดผล Performance

**ตัวชี้วัดหลัก:**
- **CPA (Cost Per Acquisition)**: ค่าใช้จ่ายต่อ conversion 1 ครั้ง
- **ROAS**: ผลตอบแทนจากค่าโฆษณา
- **CTR**: % ของคนที่คลิกจากคนที่เห็น
- **Conversion Rate**: % ของคนที่ซื้อจากคนที่คลิก

**สูตรคำนวณ:**
- CPA = Total Ad Spend / Total Conversions
- ROAS = Revenue / Ad Spend
- CTR = (Clicks / Impressions) × 100

### 3. Best Practices
✅ ทดสอบ audience และ creative อย่างสม่ำเสมอ
✅ ให้ campaign มี data พอก่อน optimize (อย่างน้อย 3-7 วัน)
✅ Monitor performance รายวัน แต่ optimize รายสัปดาห์
✅ เก็บ report เพื่อ learn และ improve ต่อไป
`,
        'general': `
## คำตอบทั่วไปเกี่ยวกับ Digital Marketing

คำถาม: "${question}"

ขอบคุณสำหรับคำถาม! นี่คือข้อมูลที่อาจเป็นประโยชน์:

### สำหรับ Junior Digital Planner

**หลักการทำงานพื้นฐาน:**
1. **เข้าใจ Business Objective** ก่อนวาง Plan
2. **รู้จักกลุ่มเป้าหมาย** ให้ลึก
3. **เลือก Channel ที่เหมาะสม** กับ objective และ audience
4. **กำหนด KPI ที่วัดได้** และตรงกับเป้าหมาย
5. **Monitor & Optimize** อย่างต่อเนื่อง

**Tools ที่ควรรู้จัก:**
- Facebook Ads Manager
- Google Ads
- Google Analytics
- Meta Business Suite

**ทักษะที่ควรพัฒนา:**
- Data Analysis
- Campaign Planning
- Creative Brief Writing
- Budget Management
- Performance Reporting

หากต้องการคำแนะนำเฉพาะด้าน Media Planning, Campaign Strategy, KPI, หรือ Performance Marketing สามารถถามเพิ่มเติมได้เลยครับ!
`
    };

    return mockAnswers[category] || mockAnswers['general'];
}

/**
 * Main RAG Pipeline
 * Orchestrates the complete RAG flow
 * 
 * Steps:
 * 1. Detect question category
 * 2. Perform vector search to get relevant context
 * 3. Generate answer using LLM with context
 * 4. Return structured response
 */
export async function processQuestion(question: string): Promise<ChatResponse> {
    try {
        // Step 1: Detect category
        const category = detectCategory(question);

        // Step 2: Vector search for relevant context
        // TODO: Replace with actual vector DB query (Pinecone/Chroma)
        const context = await vectorSearch(question, category);

        // Step 3: Generate answer with LLM
        // TODO: Replace with actual LLM API call (OpenAI/Claude/Gemini)
        const answer = await generateAnswer(question, category, context);

        // Step 4: Return response
        return {
            answer,
            category,
            retrievedContext: context // Optional: for debugging/transparency
        };

    } catch (error) {
        console.error('Error in RAG pipeline:', error);
        return {
            answer: 'ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง',
            category: 'general',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// ============================================================================
// Decision Tree RAG Integration
// ============================================================================

/**
 * Retrieve decision logic from knowledge base (RAG-ready)
 * 
 * This function simulates RAG retrieval for the decision tree.
 * In production, this would:
 * 1. Create embedding of current step + user answer
 * 2. Query vector database for relevant next steps
 * 3. Return semantically similar decision paths
 * 4. Include metadata for allocation calculations
 * 
 * Example production implementation:
 * 
 * // 1. Create embedding
 * const embedding = await openai.embeddings.create({
 *   model: "text-embedding-ada-002",
 *   input: `Step: ${stepId}, Answer: ${selectedAnswer}`
 * });
 * 
 * // 2. Query vector DB
 * const results = await pinecone.query({
 *   vector: embedding.data[0].embedding,
 *   topK: 5,
 *   filter: { stepId: stepId }
 * });
 * 
 * // 3. Return decision context
 * return results.matches.map(m => m.metadata);
 */
export async function retrieveDecisionLogic(
    stepId: string,
    selectedAnswer: string
): Promise<any> {
    // Simulate API delay (would be vector DB query)
    await new Promise(resolve => setTimeout(resolve, 300));

    // In production, this would return:
    // - Next step recommendation
    // - Allocation metadata
    // - Senior planner insights
    // - Confidence scores

    console.log(`[RAG] Retrieving decision logic for step ${stepId} with answer ${selectedAnswer}`);

    // Mock response (in production, from vector DB)
    return {
        nextStepId: null, // Would be determined by semantic similarity
        confidence: 0.95,
        retrievedFromVectorDB: false,
        message: 'Using local decision tree (replace with vector DB in production)'
    };
}

/**
 * NOTE: The decision tree logic is currently in decision-tree.ts
 * To integrate with a real vector database:
 * 
 * 1. Convert all step definitions to embeddings
 * 2. Store in Pinecone/Chroma with metadata
 * 3. Replace getStepById() calls with semantic search
 * 4. Use retrieveDecisionLogic() for context-aware navigation
 * 5. Enable dynamic step generation based on user context
 */
