/**
 * FinalSummary Component
 * 
 * Displays the final media planning recommendation after completing all steps
 * Shows Hero/Support/Test channels with budget allocations and reasoning
 */

'use client';

import { FinalRecommendation } from '../types';
import CsvMappingSection from './CsvMapping/CsvMappingSection';

interface FinalSummaryProps {
    recommendation: FinalRecommendation;
    onRestart: () => void;
}

export default function FinalSummary({ recommendation, onRestart }: FinalSummaryProps) {
    const { allocations, reasoning, summary } = recommendation;

    // Sort allocations by percentage (descending)
    const sortedAllocations = [...allocations].sort((a, b) => b.percentage - a.percentage);

    // Role colors
    const roleColors = {
        Hero: 'from-purple-500 to-blue-500',
        Support: 'from-blue-500 to-cyan-500',
        Test: 'from-cyan-500 to-teal-500'
    };

    // Role icons
    const roleIcons = {
        Hero: '🎯',
        Support: '🛡️',
        Test: '🧪'
    };

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

            {/* Channel Allocations */}
            <div className="bg-gradient-to-br from-surface/80 to-surface-light/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 shadow-xl mb-8">
                <h3 className="text-2xl font-bold text-purple-200 mb-6 flex items-center gap-2">
                    <span>📊</span>
                    <span>การจัดสรรช่องทาง</span>
                </h3>

                <div className="space-y-6">
                    {sortedAllocations.map((allocation) => (
                        <div key={allocation.channel} className="group">
                            {/* Channel header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{roleIcons[allocation.role]}</span>
                                    <div>
                                        <h4 className="text-xl font-bold text-purple-100">
                                            {allocation.channel}
                                        </h4>
                                        <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${roleColors[allocation.role]} text-white`}>
                                            {allocation.role} Channel
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                                        {allocation.percentage}%
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-3 bg-surface-light rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${roleColors[allocation.role]} transition-all duration-1000 ease-out`}
                                    style={{ width: `${allocation.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reasoning */}
            <div className="bg-gradient-to-br from-surface/80 to-surface-light/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 shadow-xl mb-8">
                <h3 className="text-2xl font-bold text-purple-200 mb-6 flex items-center gap-2">
                    <span>🧠</span>
                    <span>เหตุผลเชิง Logic</span>
                </h3>

                <div className="space-y-3">
                    {reasoning.map((reason, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-lg"
                        >
                            <span className="flex-shrink-0 text-purple-400 font-bold">
                                {index + 1}.
                            </span>
                            <p className="text-purple-200/90 leading-relaxed">
                                {reason}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-8">
                <h4 className="text-lg font-bold text-purple-200 mb-4">💡 สรุปแนะนำ</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    {sortedAllocations.map((allocation) => (
                        <div key={allocation.channel} className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                                {allocation.channel}
                            </div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-1">
                                {allocation.percentage}%
                            </div>
                            <div className="text-sm text-purple-300/70">
                                {allocation.role} Channel
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={onRestart}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
                >
                    🔄 สร้างแผนใหม่
                </button>

                <button
                    onClick={() => {
                        // Copy summary to clipboard
                        const text = `${summary}\n\nChannel Allocation:\n${allocations.map(a => `- ${a.channel}: ${a.percentage}% (${a.role})`).join('\n')}`;
                        navigator.clipboard.writeText(text);
                        alert('คัดลอกแผนไปยัง Clipboard แล้ว!');
                    }}
                    className="px-8 py-4 bg-surface-light hover:bg-surface text-purple-200 font-bold rounded-xl border-2 border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
                >
                    📋 คัดลอกแผน
                </button>
            </div>

            {/* New Feature: AI CSV Mapping */}
            <CsvMappingSection recommendation={recommendation} />

            {/* Timestamp */}
            <p className="text-center text-sm text-purple-300/50 mt-6">
                สร้างเมื่อ: {recommendation.generatedAt.toLocaleString('th-TH')}
            </p>
        </div>
    );
}
