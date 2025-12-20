/**
 * Question Input Component
 * 
 * Input area where users can type and submit questions
 * Features:
 * - Auto-resizing textarea
 * - Submit button with loading state
 * - Placeholder with example questions
 * - Disabled state during loading
 */

'use client';

import { useState, useRef, useEffect } from 'react';

interface QuestionInputProps {
    onSubmit: (question: string) => void;
    isLoading: boolean;
}

export default function QuestionInput({ onSubmit, isLoading }: QuestionInputProps) {
    const [question, setQuestion] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /**
     * Auto-resize textarea based on content
     */
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [question]);

    /**
     * Handle form submission
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (question.trim() && !isLoading) {
            onSubmit(question.trim());
            setQuestion(''); // Clear input after submit

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    /**
     * Handle Enter key (submit) vs Shift+Enter (new line)
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="sticky top-4 z-10 mb-8">
            <form onSubmit={handleSubmit} className="relative">
                {/* Input Container with gradient border effect */}
                <div className="relative bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-cyan-600/30 p-[2px] rounded-2xl">
                    <div className="bg-[#1a0f2e] rounded-2xl">
                        <textarea
                            ref={textareaRef}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            placeholder="ถามคำถามเกี่ยวกับ Media Planning, Campaign Strategy, KPI, Performance...&#10;&#10;ตัวอย่าง: 'วิธีวาง Media Plan สำหรับแคมเปญ Launch สินค้าใหม่' หรือ 'ROAS คืออะไร และควรคำนวณอย่างไร'"
                            rows={3}
                            className="w-full px-6 py-4 bg-transparent text-purple-50 placeholder-purple-400/40 resize-none outline-none text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ minHeight: '120px', maxHeight: '300px' }}
                        />

                        {/* Submit Button */}
                        <div className="px-4 pb-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={!question.trim() || isLoading}
                                className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                            >
                                <span className="flex items-center space-x-2">
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>กำลังคิด...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>ถามคำถาม</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hint text */}
                <p className="text-xs text-purple-400/50 mt-2 text-center">
                    กด Enter เพื่อส่งคำถาม หรือ Shift + Enter เพื่อขึ้นบรรทัดใหม่
                </p>
            </form>
        </div>
    );
}
