/**
 * API Route: /api/map-csv
 * 
 * Handles CSV upload and AI mapping
 */

import { NextRequest, NextResponse } from 'next/server';
import { CsvService } from '@/app/lib/csv.service';
import { MappingService } from '@/app/lib/mapping.service';
import { Platform } from '@/app/types/csv-mapping';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { platform, csvContent, planSummary } = body;

        // 1. Validation
        if (!platform || !csvContent) {
            return NextResponse.json(
                { success: false, error: 'Missing platform or CSV content' },
                { status: 400 }
            );
        }

        const validPlatform = ['facebook', 'google', 'tiktok'].includes(platform);
        if (!validPlatform) {
            return NextResponse.json(
                { success: false, error: 'Invalid platform' },
                { status: 400 }
            );
        }

        const { isValid, error } = CsvService.validate(csvContent);
        if (!isValid) {
            return NextResponse.json(
                { success: false, error },
                { status: 400 }
            );
        }

        // 2. Extract Headers from CSV
        const headers = CsvService.getHeaders(csvContent);
        if (headers.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No headers found in CSV' },
                { status: 400 }
            );
        }

        console.log(`🔍 Mapping ${headers.length} columns for ${platform}...`);

        // 3. Perform AI Mapping
        const result = await MappingService.mapColumns(
            headers,
            platform as Platform,
            planSummary
        );

        console.log('✅ Mapping complete');

        return NextResponse.json({
            success: true,
            result
        });

    } catch (error) {
        console.error('Error in /api/map-csv:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal processing error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
