'use client';

import { useState, useRef } from 'react';
import { Platform, AiMappingResult } from '../../types/csv-mapping';
import { FinalRecommendation } from '../../types';

interface CsvMappingSectionProps {
    recommendation: FinalRecommendation;
}

export default function CsvMappingSection({ recommendation }: CsvMappingSectionProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
    const [mappingResult, setMappingResult] = useState<AiMappingResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hidden file input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    const platforms: { id: Platform; name: string; icon: string; color: string }[] = [
        { id: 'google', name: 'Google Ads', icon: '🔍', color: 'from-blue-500 to-blue-600' },
        { id: 'facebook', name: 'Facebook Ads', icon: 'meta', color: 'from-blue-600 to-indigo-700' },
        { id: 'tiktok', name: 'TikTok Ads', icon: '🎵', color: 'from-black to-gray-800' }
    ];

    const handlePlatformSelect = (platform: Platform) => {
        setSelectedPlatform(platform);
        setMappingResult(null);
        setError(null);
        // Trigger file input click
        setTimeout(() => fileInputRef.current?.click(), 100);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedPlatform) return;

        // Validate CSV
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Read file content
            const text = await file.text();

            // Call API
            const response = await fetch('/api/map-csv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: selectedPlatform,
                    csvContent: text,
                    planSummary: recommendation
                })
            });

            const data = await response.json();

            if (data.success && data.result) {
                setMappingResult(data.result);
            } else {
                throw new Error(data.error || 'Failed to map CSV');
            }

        } catch (err) {
            console.error('Upload error:', err);
            setError('Error processing file. Please try again.');
        } finally {
            setIsLoading(false);
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent mb-2">
                📂 Apply Plan to Real Data
            </h3>
            <p className="text-gray-400 mb-6">
                Upload CSV report from your ad platform to get AI-powered insights mapped to your plan.
            </p>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
                    🚫 {error}
                </div>
            )}

            {/* Platform Selection Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {platforms.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => handlePlatformSelect(p.id)}
                        disabled={isLoading}
                        className={`
                            relative group overflow-hidden rounded-xl p-6 transition-all duration-300
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'}
                            ${selectedPlatform === p.id
                                ? `bg-gradient-to-br ${p.color} ring-2 ring-white/50`
                                : 'bg-white/5 border border-white/10 hover:border-purple-500/30'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{p.id === 'facebook' ? '∞' : p.icon}</span>
                            <span className="font-semibold text-white">{p.name}</span>
                        </div>
                        {selectedPlatform === p.id && isLoading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* AI Analysis Result */}
            {mappingResult && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-xs">
                                AI
                            </div>
                            <h4 className="text-xl font-semibold text-white">AI Planning Insight</h4>
                        </div>

                        {/* Insights List */}
                        <div className="space-y-3 mb-8">
                            {mappingResult.insight.map((insight, idx) => (
                                <div key={idx} className="flex gap-3 text-gray-300 bg-white/5 p-4 rounded-xl">
                                    <span className="mt-1 block h-2 w-2 rounded-full bg-purple-400 shrink-0"></span>
                                    {/* Parse basic markdown like **bold** */}
                                    <span dangerouslySetInnerHTML={{
                                        __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                    }} />
                                </div>
                            ))}
                        </div>

                        {/* Mapping Table */}
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/5 text-gray-400">
                                    <tr>
                                        <th className="p-4 font-medium">Standard Field</th>
                                        <th className="p-4 font-medium">CSV Column</th>
                                        <th className="p-4 font-medium text-right">Confident</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {Object.entries(mappingResult.mapping).map(([std, csv]) => (
                                        <tr key={std} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-purple-300 font-mono">{std}</td>
                                            <td className="p-4 text-white">{csv}</td>
                                            <td className="p-4 text-right">
                                                <span className={`
                                                    px-2 py-1 rounded text-xs font-medium
                                                    ${mappingResult.confidence[std] > 0.8 ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}
                                                `}>
                                                    {(mappingResult.confidence[std] * 100).toFixed(0)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Missing Fields Warning */}
                        {mappingResult.missing_fields.length > 0 && (
                            <div className="mt-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                <h5 className="text-orange-300 font-semibold mb-2 text-sm flex items-center gap-2">
                                    ⚠️ Missing Columns
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {mappingResult.missing_fields.map(field => (
                                        <span key={field} className="px-2 py-1 bg-black/30 rounded text-xs text-orange-200/70 border border-orange-500/10">
                                            {field}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
