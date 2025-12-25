/**
 * FinalSummary Component
 * 
 * Displays the final media planning recommendation after completing all steps
 * Keeps only AI Executive Summary and Actions as requested
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FinalRecommendation } from '../types';

interface FinalSummaryProps {
    recommendation: FinalRecommendation;
    onRestart?: () => void;
}

export default function FinalSummary({ recommendation, onRestart }: FinalSummaryProps) {
    const { allocations, reasoning, summary } = recommendation;
    const router = useRouter();

    const handleRestart = () => {
        if (onRestart) {
            onRestart();
        } else {
            router.push('/');
        }
    };

    // AI Summary State
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const fetchAiSummary = async () => {
        setIsAiLoading(true);
        try {
            const prompt = `
You are a Senior Digital Media Planner. Analyze the following media plan and provide a concise, professional executive summary (in Thai) for a junior planner. Focus on explaining WHY this mix is effective given the context.

Plan Data:
- Summary: ${summary}
- Allocations: ${JSON.stringify(allocations)}
- Reasoning: ${JSON.stringify(reasoning)}

Format:
- Start with a strong 1-sentence strategic overview.
- Bullet points for key strengths of this plan.
- One "Pro Tip" for execution.
            `.trim();

            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText);
            }
            const data = await res.json();
            setAiSummary(data.text);
        } catch (err) {
            console.error('AI Summary failed:', err);
            setAiSummary(null);
        } finally {
            setIsAiLoading(false);
        }
    };

    useEffect(() => {
        fetchAiSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [summary]);

    return (
        <div className="max-w-4xl mx-auto animate-slide-up">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
                    <span className="text-lg font-bold text-white">✅ แผนเสร็จสมบูรณ์</span>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                    แผนการจัดสรรงบโฆษณา
                </h2>
                <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
                    {summary}
                </p>
            </div>

            {/* AI Executive Summary - ONLY THIS SECTION REMAINS */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/30 shadow-xl mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <svg className="w-16 h-16 text-indigo-500/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-indigo-200 mb-6 flex items-center gap-2 relative z-10">
                    <span>🤖</span>
                    <span>AI Executive Summary</span>
                </h3>

                <div className="relative z-10">
                    {isAiLoading ? (
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-400 mb-3"></div>
                            <p className="text-indigo-300/60 text-sm animate-pulse">กำลังวิเคราะห์แผน...</p>
                        </div>
                    ) : aiSummary ? (
                        <div className="prose prose-invert prose-p:text-indigo-100/90 max-w-none">
                            <p className="whitespace-pre-line leading-relaxed">{aiSummary}</p>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-indigo-300/60 mb-3">ไม่สามารถสร้างสรุปได้</p>
                            <button
                                onClick={fetchAiSummary}
                                className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-lg text-sm transition-colors"
                            >
                                ลองอีกครั้ง
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={handleRestart}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
                >
                    🔄 สร้างแผนใหม่
                </button>

                <button
                    onClick={() => {
                        // Copy summary to clipboard
                        const text = `${summary}\n\nAI Summary:\n${aiSummary || 'Loading...'}`;
                        navigator.clipboard.writeText(text);
                        alert('คัดลอกแผนไปยัง Clipboard แล้ว!');
                    }}
                    className="px-8 py-4 bg-surface-light hover:bg-surface text-purple-200 font-bold rounded-xl border-2 border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
                >
                    📋 คัดลอกแผน
                </button>
            </div>

            {/* Timestamp */}
            <p className="text-center text-sm text-purple-300/50 mt-6">
                สร้างเมื่อ: {recommendation.generatedAt ? new Date(recommendation.generatedAt).toLocaleString('th-TH') : 'N/A'}
            </p>
        </div>
    );
}
