/**
 * CSV Service
 * 
 * Handles CSV parsing and validation
 */

import { parse } from 'csv-parse/sync';

export class CsvService {
    /**
     * Parse CSV string to array of objects
     */
    static parse(csvContent: string): any[] {
        try {
            return parse(csvContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });
        } catch (error) {
            throw new Error('Invalid CSV format');
        }
    }

    /**
     * Extract headers from CSV string
     */
    static getHeaders(csvContent: string): string[] {
        const records = this.parse(csvContent);
        if (records.length === 0) return [];
        return Object.keys(records[0]);
    }

    /**
     * Validate CSV structure
     */
    static validate(csvContent: string): { isValid: boolean; error?: string } {
        try {
            const records = this.parse(csvContent);
            if (records.length === 0) {
                return { isValid: false, error: 'CSV file is empty' };
            }
            return { isValid: true };
        } catch (error) {
            return { isValid: false, error: 'Invalid CSV format' };
        }
    }
}
