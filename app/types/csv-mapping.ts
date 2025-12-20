/**
 * CSV Mapping Types
 * 
 * Defines structures for AI mapping logic
 */

export interface StandardSchema {
    campaign_name: string;
    channel: 'google' | 'facebook' | 'tiktok';
    objective: string;
    budget: number;
    impressions?: number;
    clicks?: number;
    conversions?: number;
    spend?: number;
    start_date?: string;
    end_date?: string;
}

export type Platform = 'google' | 'facebook' | 'tiktok';

export interface AiMappingResult {
    platform: Platform;
    mapping: Record<string, string>; // standard_field -> csv_header
    missing_fields: string[];
    confidence: Record<string, number>; // standard_field -> score (0-1)
    insight: string[];
}

export interface MapCsvRequest {
    platform: Platform;
    csvContent: string; // Raw CSV string
    planSummary?: any; // Context from decision tree
}

export interface MapCsvResponse {
    success: boolean;
    result?: AiMappingResult;
    error?: string;
}
