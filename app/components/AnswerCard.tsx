/**
 * Answer Card Component
 * 
 * Displays a single Q&A pair with:
 * - Question
 * - AI Answer (markdown formatted)
 * - Category tag
 * - Copy to clipboard functionality
 */

'use client';

import { QAPair, CATEGORY_LABELS, CATEGORY_COLORS } from '../types';
import { useState } from 'react';

interface AnswerCardProps {
    qaPair: QAPair;
    index: number; // For staggered animation
}

export default function AnswerCard({ qaPair, index }: AnswerCardProps) {
    const [copied, setCopied] = useState(false);

    /**
     * Copy answer to clipboard
     */
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(qaPair.answer);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div
            className="group relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-purple-400/50 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Category Tag */}
            <div className="flex items-center justify-between mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[qaPair.category]}`}>
                    {CATEGORY_LABELS[qaPair.category]}
                </span>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className="text-purple-300/60 hover:text-purple-300 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Question */}
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-purple-300/70 mb-2">คำถาม:</h3>
                <p className="text-purple-100 text-lg font-medium">{qaPair.question}</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-4"></div>

            {/* Answer */}
            <div className="mb-3">
                <h3 className="text-sm font-semibold text-blue-300/70 mb-3">คำตอบ:</h3>
                <div className="text-purple-50/90 leading-relaxed prose prose-invert prose-purple max-w-none">
                    {/* Simple markdown rendering - split by paragraphs and handle basic formatting */}
                    {qaPair.answer.split('\n').map((line, idx) => {
                        // Headers
                        if (line.startsWith('### ')) {
                            return <h3 key={idx} className="text-blue-300 font-semibold text-lg mt-4 mb-2">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('## ')) {
                            return <h2 key={idx} className="text-purple-300 font-bold text-xl mt-5 mb-3">{line.replace('## ', '')}</h2>;
                        }
                        // Bold text (simple pattern)
                        if (line.includes('**')) {
                            const parts = line.split('**');
                            return (
                                <p key={idx} className="mb-2">
                                    {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-cyan-300 font-semibold">{part}</strong> : part)}
                                </p>
                            );
                        }
                        // List items
                        if (line.startsWith('- ') || line.startsWith('✅ ')) {
                            return <li key={idx} className="ml-4 mb-1 text-purple-100/80">{line.replace(/^- |^✅ /, '')}</li>;
                        }
                        // Empty line
                        if (line.trim() === '') {
                            return <div key={idx} className="h-2"></div>;
                        }
                        // Regular paragraph
                        return <p key={idx} className="mb-2 text-purple-100/80">{line}</p>;
                    })}
                </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-purple-400/50 mt-4">
                {qaPair.timestamp.toLocaleString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
        </div>
    );
}
