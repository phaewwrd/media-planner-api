/**
 * Database Seed Script
 * 
 * Populates database with decision tree data
 * Usage: npm run db:seed
 */

import { db } from './index';
import { plannerSteps, plannerOptions, plannerRules } from './schema';

async function seed() {
    console.log('🌱 Seeding database...\n');

    try {
        // ============================================================================
        // Seed Steps
        // ============================================================================
        console.log('📝 Inserting steps...');

        await db.insert(plannerSteps).values([
            {
                id: 'STEP_1',
                stepNumber: '1',
                question: 'เป้าหมายหลักของแคมเปญคืออะไร?',
                insight: 'Senior Planner Tip: Objective เป็นตัวกำหนดทิศทางของ Media Mix ทั้งหมด - Awareness ใช้ช่องทางกว้าง, Conversion ใช้ช่องทางที่มี Intent',
                category: 'objective'
            },
            {
                id: 'STEP_1A',
                stepNumber: '1.5',
                question: 'กลุ่มเป้าหมายหลักของคุณคือใคร?',
                insight: 'Senior Planner Tip: สำหรับ Awareness คุณต้องเลือกช่องทางที่กลุ่มเป้าหมายใช้เยอะที่สุด - Gen Z อยู่ที่ TikTok, ผู้ใหญ่อยู่ที่ Facebook',
                category: 'audience'
            },
            {
                id: 'STEP_2',
                stepNumber: '2',
                question: 'ระดับราคาสินค้า/บริการของคุณอยู่ในช่วงไหน?',
                insight: 'Senior Planner Tip: สินค้า High Ticket ต้องการ Intent สูง → เน้น Google Search, สินค้า Low Ticket ใช้ Social เพื่อ Volume',
                category: 'pricing'
            },
            {
                id: 'STEP_3A',
                stepNumber: '3',
                question: 'KPI หลักที่คุณต้องการคืออะไร?',
                insight: 'Senior Planner Tip: High Ticket = เน้น Quality ของ Lead มากกว่า Quantity → Google Search คือ Hero Channel',
                category: 'kpi_quality'
            },
            {
                id: 'STEP_3B',
                stepNumber: '3',
                question: 'KPI หลักที่คุณต้องการคืออะไร?',
                insight: 'Senior Planner Tip: Low Ticket = เน้น Volume และ ROAS → Facebook/TikTok เป็น Hero เพราะ Scale ง่าย',
                category: 'kpi_volume'
            },
            {
                id: 'STEP_4',
                stepNumber: '4',
                question: 'งบประมาณรายเดือนของคุณอยู่ในช่วงไหน?',
                insight: 'Senior Planner Tip: งบน้อย = Focus ช่องทางเดียวให้ดี, งบเยอะ = กระจายได้ (Hero/Support/Test Model)',
                category: 'budget'
            },
            {
                id: 'STEP_5',
                stepNumber: '5',
                question: 'คุณต้องการเน้นอะไรมากกว่ากัน?',
                insight: 'Senior Planner Tip: Volume = เพิ่ม Facebook, Quality = เพิ่ม Google - ใช้ปรับ allocation จาก STEP ก่อนหน้า',
                category: 'adjustment'
            },
            {
                id: 'STEP_6',
                stepNumber: '6',
                question: 'ระยะเวลาของแคมเปญเป็นแบบไหน?',
                insight: 'Senior Planner Tip: Burst Campaign = Social Hero (Viral ง่าย), Always-on = Google Hero (Intent ต่อเนื่อง)',
                category: 'duration'
            },
            {
                id: 'STEP_7',
                stepNumber: '7',
                question: 'คุณมีข้อมูลการทำแคมเปญในอดีตหรือไม่?',
                insight: 'Senior Planner Tip: มีข้อมูล = เอางบส่วนใหญ่ไป Winner Channel, ไม่มีข้อมูล = แบ่งงบให้เท่า ๆ กันก่อน',
                category: 'data'
            },
            {
                id: 'STEP_8',
                stepNumber: '8',
                question: 'Client มี preference ช่องทางเฉพาะหรือไม่?',
                insight: 'Senior Planner Tip: ถ้า Client insist ช่องทางใดช่องทางหนึ่ง ควรกันงบไว้ทดสอบ 10-20% แม้คุณจะไม่แนะนำก็ตาม',
                category: 'client'
            },
            {
                id: 'STEP_9',
                stepNumber: '9',
                question: 'ความสามารถในการติดตาม Conversion ของคุณแข็งแรงแค่ไหน?',
                insight: 'Senior Planner Tip: Tracking ดี = กระจายงบได้หลายช่องทาง, Tracking อ่อน = เน้น Facebook (Pixel แม่นกว่า)',
                category: 'tracking'
            },
        ]);

        console.log('✅ Inserted 9 steps\n');

        // ============================================================================
        // Seed Options
        // ============================================================================
        console.log('📝 Inserting options...');

        await db.insert(plannerOptions).values([
            // STEP_1 Options
            {
                id: 'awareness',
                stepId: 'STEP_1',
                label: 'Awareness / Reach / View',
                description: 'เน้นสร้างการรับรู้แบรนด์ เข้าถึงคนให้ได้มากที่สุด',
                nextStepId: 'STEP_1A',
                metadata: { objective: 'awareness', funnel: 'top' },
                displayOrder: 1
            },
            {
                id: 'conversion',
                stepId: 'STEP_1',
                label: 'Lead / Sales / Conversion',
                description: 'เน้นผลลัพธ์ที่วัดได้ เช่น ยอดขาย, ลีด, สมัครสมาชิก',
                nextStepId: 'STEP_2',
                metadata: { objective: 'conversion', funnel: 'bottom' },
                displayOrder: 2
            },

            // STEP_1A Options
            {
                id: 'genz',
                stepId: 'STEP_1A',
                label: 'Gen Z / Mass / Viral',
                description: 'อายุ 18-24 ปี ชอบคอนเทนต์สั้น viral-able',
                nextStepId: 'STEP_2',
                metadata: {
                    audience: 'genz',
                    allocation: {
                        TikTok: { min: 40, max: 60, role: 'Hero' },
                        Facebook: { min: 30, max: 40, role: 'Support' },
                        Google: { min: 0, max: 20, role: 'Test' }
                    }
                },
                displayOrder: 1
            },
            {
                id: 'adult',
                stepId: 'STEP_1A',
                label: 'ผู้ใหญ่ / Branding',
                description: 'อายุ 25+ ปี เน้น Brand Image และความน่าเชื่อถือ',
                nextStepId: 'STEP_2',
                metadata: {
                    audience: 'adult',
                    allocation: {
                        Facebook: { min: 50, max: 60, role: 'Hero' },
                        TikTok: { min: 20, max: 30, role: 'Support' },
                        Google: { min: 0, max: 20, role: 'Test' }
                    }
                },
                displayOrder: 2
            },

            // STEP_2 Options
            {
                id: 'high_ticket',
                stepId: 'STEP_2',
                label: 'High Ticket (> 10,000 บาท)',
                description: 'สินค้าราคาสูง ต้องการการตัดสินใจนานขึ้น',
                nextStepId: 'STEP_3A',
                metadata: { priceRange: 'high', involvement: 'high' },
                displayOrder: 1
            },
            {
                id: 'low_ticket',
                stepId: 'STEP_2',
                label: 'Low Ticket (< 1,000 บาท)',
                description: 'สินค้าราคาถูก ตัดสินใจเร็ว ซื้อง่าย',
                nextStepId: 'STEP_3B',
                metadata: { priceRange: 'low', involvement: 'low' },
                displayOrder: 2
            },

            // STEP_3A Option
            {
                id: 'quality',
                stepId: 'STEP_3A',
                label: 'Quality (ลีดคุณภาพสูง)',
                description: 'ลดจำนวน แต่เพิ่มโอกาสปิดการขาย',
                nextStepId: 'STEP_4',
                metadata: {
                    kpi: 'quality',
                    allocation: {
                        Google: { min: 50, max: 70, role: 'Hero' },
                        Facebook: { min: 30, max: 50, role: 'Support' },
                        TikTok: { min: 0, max: 10, role: 'Test' }
                    }
                },
                displayOrder: 1
            },

            // STEP_3B Option
            {
                id: 'volume',
                stepId: 'STEP_3B',
                label: 'Volume / ROAS (ยอดขายเยอะ)',
                description: 'เพิ่มจำนวน conversion ให้ได้มากที่สุด',
                nextStepId: 'STEP_4',
                metadata: {
                    kpi: 'volume',
                    allocation: {
                        Facebook: { min: 40, max: 50, role: 'Hero' },
                        TikTok: { min: 30, max: 40, role: 'Support' },
                        Google: { min: 10, max: 20, role: 'Test' }
                    }
                },
                displayOrder: 1
            },

            // STEP_4 Options
            {
                id: 'low_budget',
                stepId: 'STEP_4',
                label: '< 100,000 บาท',
                description: 'งบจำกัด ควรโฟกัส 1-2 ช่องทาง',
                nextStepId: 'STEP_5',
                metadata: { budget: 'low', maxChannels: 2 },
                displayOrder: 1
            },
            {
                id: 'high_budget',
                stepId: 'STEP_4',
                label: '≥ 100,000 บาท',
                description: 'งบพอ สามารถทดสอบได้หลายช่องทาง',
                nextStepId: 'STEP_5',
                metadata: { budget: 'high', maxChannels: 3 },
                displayOrder: 2
            },

            // STEP_5 Options
            {
                id: 'prefer_volume',
                stepId: 'STEP_5',
                label: 'Volume (ยอดเยอะ)',
                description: 'ต้องการ Conversion เยอะที่สุด',
                nextStepId: 'STEP_6',
                metadata: { adjustment: 'increase_facebook_tiktok' },
                displayOrder: 1
            },
            {
                id: 'prefer_quality',
                stepId: 'STEP_5',
                label: 'Quality (คุณภาพ)',
                description: 'ต้องการลีดที่มีโอกาสซื้อสูง',
                nextStepId: 'STEP_6',
                metadata: { adjustment: 'increase_google' },
                displayOrder: 2
            },

            // STEP_6 Options
            {
                id: 'burst',
                stepId: 'STEP_6',
                label: 'Burst (ระยะสั้น 1-3 เดือน)',
                description: 'โปรโมชั่นพิเศษ, Launch สินค้าใหม่',
                nextStepId: 'STEP_7',
                metadata: { duration: 'burst' },
                displayOrder: 1
            },
            {
                id: 'always_on',
                stepId: 'STEP_6',
                label: 'Always-on (ยาวต่อเนื่อง)',
                description: 'วิ่งแคมเปญตลอดทั้งปี',
                nextStepId: 'STEP_7',
                metadata: { duration: 'always_on' },
                displayOrder: 2
            },

            // STEP_7 Options
            {
                id: 'has_data',
                stepId: 'STEP_7',
                label: 'มีข้อมูล',
                description: 'เคยวิ่งแคมเปญมาแล้ว รู้ว่าช่องทางไหน perform',
                nextStepId: 'STEP_8',
                metadata: { historicalData: true },
                displayOrder: 1
            },
            {
                id: 'no_data',
                stepId: 'STEP_7',
                label: 'ไม่มีข้อมูล',
                description: 'เริ่มต้นใหม่ ยังไม่แน่ใจว่าช่องทางไหนดี',
                nextStepId: 'STEP_8',
                metadata: { historicalData: false },
                displayOrder: 2
            },

            // STEP_8 Options
            {
                id: 'client_insist',
                stepId: 'STEP_8',
                label: 'Client insist ช่องทางเฉพาะ',
                description: 'Client ต้องการใช้ช่องทางที่ระบุเอาไว้',
                nextStepId: 'STEP_9',
                metadata: { clientPreference: true },
                displayOrder: 1
            },
            {
                id: 'no_preference',
                stepId: 'STEP_8',
                label: 'ไม่มี preference',
                description: 'Client ไว้ใจให้ Planner ตัดสินใจเอง',
                nextStepId: 'STEP_9',
                metadata: { clientPreference: false },
                displayOrder: 2
            },

            // STEP_9 Options (final)
            {
                id: 'good_tracking',
                stepId: 'STEP_9',
                label: 'Tracking ดี',
                description: 'มี Pixel, GA4, Conversion API ครบ',
                nextStepId: null,
                metadata: { tracking: 'good', canUseMultiChannel: true },
                displayOrder: 1
            },
            {
                id: 'weak_tracking',
                stepId: 'STEP_9',
                label: 'Tracking อ่อน',
                description: 'Tracking ยังไม่แม่น หรือพึ่ง Pixel อย่างเดียว',
                nextStepId: null,
                metadata: { tracking: 'weak', preferFacebook: true },
                displayOrder: 2
            },
        ]);

        console.log('✅ Inserted 20+ options\n');

        // ============================================================================
        // Seed Rules
        // ============================================================================
        console.log('📝 Inserting rules...');

        await db.insert(plannerRules).values([
            {
                ruleName: 'Awareness + Gen Z → TikTok Hero',
                priority: 100,
                conditions: { objective: 'awareness', audience: 'genz' },
                result: {
                    allocations: [
                        { channel: 'TikTok', percentage: 50, role: 'Hero' },
                        { channel: 'Facebook', percentage: 35, role: 'Support' },
                        { channel: 'Google', percentage: 15, role: 'Test' }
                    ]
                },
                explanation: 'กลุ่มเป้าหมาย Gen Z ใช้เวลาบน TikTok มากที่สุด → TikTok เป็น Hero Channel สำหรับ Awareness'
            },
            {
                ruleName: 'Awareness + Adult → Facebook Hero',
                priority: 100,
                conditions: { objective: 'awareness', audience: 'adult' },
                result: {
                    allocations: [
                        { channel: 'Facebook', percentage: 55, role: 'Hero' },
                        { channel: 'TikTok', percentage: 25, role: 'Support' },
                        { channel: 'Google', percentage: 20, role: 'Test' }
                    ]
                },
                explanation: 'กลุ่มเป้าหมายผู้ใหญ่ใช้ Facebook เป็นหลัก → Facebook เป็น Hero Channel สำหรับ Brand Awareness'
            },
            {
                ruleName: 'Conversion + High Ticket + Quality → Google Hero',
                priority: 100,
                conditions: { objective: 'conversion', priceRange: 'high', kpi: 'quality' },
                result: {
                    allocations: [
                        { channel: 'Google', percentage: 60, role: 'Hero' },
                        { channel: 'Facebook', percentage: 30, role: 'Support' },
                        { channel: 'TikTok', percentage: 10, role: 'Test' }
                    ]
                },
                explanation: 'สินค้า High Ticket ต้องการ Intent สูง → Google Search เป็น Hero Channel เพื่อได้ลีดคุณภาพ'
            },
            {
                ruleName: 'Conversion + Low Ticket + Volume → Facebook Hero',
                priority: 100,
                conditions: { objective: 'conversion', priceRange: 'low', kpi: 'volume' },
                result: {
                    allocations: [
                        { channel: 'Facebook', percentage: 45, role: 'Hero' },
                        { channel: 'TikTok', percentage: 35, role: 'Support' },
                        { channel: 'Google', percentage: 20, role: 'Test' }
                    ]
                },
                explanation: 'สินค้า Low Ticket เน้น Volume → Facebook/TikTok Scale ง่าย เหมาะกับ Volume KPI'
            },
            {
                ruleName: 'Low Budget → Max 2 Channels',
                priority: 50,
                conditions: { budget: 'low' },
                result: {
                    constraint: 'maxChannels',
                    value: 2,
                    note: 'เอา Test channel ออก เน้นแค่ Hero + Support'
                },
                explanation: 'งบประมาณน้อยกว่า 100k → Focus แค่ 2 ช่องทาง (Hero + Support) เพื่อไม่กระจายงบเกินไป'
            },
            {
                ruleName: 'Default Fallback → Balanced Mix',
                priority: 1,
                conditions: {},
                result: {
                    allocations: [
                        { channel: 'Facebook', percentage: 50, role: 'Hero' },
                        { channel: 'Google', percentage: 30, role: 'Support' },
                        { channel: 'TikTok', percentage: 20, role: 'Test' }
                    ]
                },
                explanation: 'Default recommendation: Facebook Hero (50%) + Google Support (30%) + TikTok Test (20%)'
            }
        ]);

        console.log('✅ Inserted 6 rules\n');

        console.log('✅ Seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
