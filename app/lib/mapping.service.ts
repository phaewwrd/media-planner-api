/**
 * AI Mapping Service
 * 
 * Simulates AI logic to map CSV columns to standard schema
 * and generate insights based on planner context
 */

import { Platform, AiMappingResult, StandardSchema } from '../types/csv-mapping';

// Standard fields we look for
const TARGET_FIELDS: (keyof StandardSchema)[] = [
    'campaign_name',
    'objective',
    'budget',
    'impressions',
    'clicks',
    'conversions',
    'spend',
    'start_date',
    'end_date'
];

export class MappingService {
    /**
     * Map CSV headers to standard schema using heuristic matching (Simulating AI)
     */
    static async mapColumns(
        headers: string[],
        platform: Platform,
        planSummary: any
    ): Promise<AiMappingResult> {

        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mapping: Record<string, string> = {};
        const confidence: Record<string, number> = {};
        const missing: string[] = [];

        // Helper to find best match
        const findMatch = (keywords: string[]): { header: string, score: number } | null => {
            let bestMatch = null;
            let maxScore = 0;

            for (const header of headers) {
                const h = header.toLowerCase().replace(/_/g, ' ');
                for (const keyword of keywords) {
                    if (h === keyword) return { header, score: 1.0 }; // Exact match
                    if (h.includes(keyword)) {
                        const score = 0.8 + (keyword.length / h.length) * 0.1;
                        if (score > maxScore) {
                            maxScore = score;
                            bestMatch = header;
                        }
                    }
                }
            }
            return bestMatch ? { header: bestMatch, score: maxScore } : null;
        };

        // Mapping Logic
        for (const field of TARGET_FIELDS) {
            const keywords = this.getKeywordsForField(field, platform);
            const match = findMatch(keywords);

            if (match) {
                mapping[field] = match.header;
                confidence[field] = parseFloat(match.score.toFixed(2));
            } else {
                missing.push(field);
            }
        }

        // Generate Insights
        const insight = this.generateInsights(planSummary, platform, missing);

        return {
            platform,
            mapping,
            missing_fields: missing,
            confidence,
            insight
        };
    }

    /**
     * Get keywords for different platforms (Knowledge Base)
     */
    private static getKeywordsForField(field: string, platform: Platform): string[] {
        const common = {
            campaign_name: ['campaign name', 'campaign'],
            budget: ['budget', 'daily budget', 'amount'],
            start_date: ['start', 'start date', 'starts'],
            end_date: ['end', 'end date', 'ends']
        };

        const specific: Record<Platform, Record<string, string[]>> = {
            facebook: {
                objective: ['objective', 'campaign objective'],
                impressions: ['impressions'],
                clicks: ['link clicks', 'clicks (all)', 'clicks'],
                conversions: ['results', 'website purchases', 'leads'],
                spend: ['amount spent', 'cost', 'spend']
            },
            google: {
                objective: ['campaign type', 'opt score'],
                impressions: ['impr.', 'impressions'],
                clicks: ['clicks'],
                conversions: ['conversions', 'conv.'],
                spend: ['cost', 'total cost']
            },
            tiktok: {
                objective: ['objective_type'],
                impressions: ['impressions'],
                clicks: ['clicks'],
                conversions: ['conversions', 'conversion'],
                spend: ['cost', 'total_cost']
            }
        };

        const platformKeywords = specific[platform][field] || [];
        const commonKeywords = (common as any)[field] || [];

        return [...platformKeywords, ...commonKeywords];
    }

    /**
     * Generate "AI" Insights
     */
    private static generateInsights(
        plan: any,
        platform: Platform,
        missing: string[]
    ): string[] {
        const insights: string[] = [];

        // 1. Check Platform Alignment
        const recommendedChannels = plan?.allocations?.map((a: any) => a.channel.toLowerCase()) || [];
        const isRecommended = recommendedChannels.some((c: string) => c.includes(platform));

        if (isRecommended) {
            insights.push(`✅ **${this.capitalize(platform)}** ตรงกับแผนที่คุณวางไว้ (Hero/Support Channel)`);
        } else {
            insights.push(`⚠️ **${this.capitalize(platform)}** ไม่ได้อยู่ในแผนหลักที่แนะนำ (อาจจะเป็น Test Channel)`);
        }

        // 2. Check Data Completeness
        if (missing.includes('conversions') || missing.includes('spend')) {
            insights.push(`⚠️ **Missing Critical Data**: ไม่พบข้อมูล Cost หรือ Conversion ซึ่งจำเป็นสำหรับการวัดผล ROI`);
        } else {
            insights.push(`📊 **Data Readiness**: ข้อมูลสำคัญครบถ้วน พร้อมสำหรับการวิเคราะห์ ROAS`);
        }

        // 3. KPI Check
        if (plan?.summary?.toLowerCase().includes('volume') && platform === 'facebook') {
            insights.push(`💡 **Optimization Tip**: สำหรับ KPI Volume ให้โฟกัสที่ "Link Clicks" และ "Results"`);
        }

        return insights;
    }

    private static capitalize(s: string) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}
