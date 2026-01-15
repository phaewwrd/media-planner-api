/**
 * ChatUI Component (Main Orchestrator)
 * 
 * This component:
 * - Manages the Q&A state
 * - Handles question submissions
 * - Calls the API endpoint
 * - Displays answers in cards
 * - Shows loading states
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Header from './Header';
import QuestionInput from './QuestionInput';
import AnswerCard from './AnswerCard';
import LoadingState from './LoadingState';
import { QAPair, ChatResponse } from '../types';

export default function ChatUI() {
    const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const answersEndRef = useRef<HTMLDivElement>(null);

    /**
     * Auto-scroll to latest answer when new answer is added
     */
    useEffect(() => {
        if (answersEndRef.current) {
            answersEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [qaPairs]);

    /**
     * Submit question to API and get answer
     */
    const handleQuestionSubmit = async (question: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // Call API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    // Optionally send previous questions for context
                    context: qaPairs.slice(-3).map(qa => qa.question)
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from API');
            }

            const data: ChatResponse = await response.json();

            // Create new Q&A pair
            const newQAPair: QAPair = {
                id: Date.now().toString(),
                question,
                answer: data.answer,
                category: data.category,
                timestamp: new Date(),
            };

            // Add to list (newest at top)
            setQAPairs(prev => [newQAPair, ...prev]);

        } catch (err) {
            console.error('Error submitting question:', err);
            setError('เกิดข้อผิดพลาดในการส่งคำถาม กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-background relative">
            {/* Animated radial gradient background */}
            <div className="fixed inset-0 z-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-tl from-accent/10 via-transparent to-transparent animate-pulse-slow" />
            </div>

            {/* Main Container */}
            <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl relative z-10">
                {/* Header */}
                <Header />

                {/* Question Input (Sticky) */}
                <QuestionInput
                    onSubmit={handleQuestionSubmit}
                    isLoading={isLoading}
                />

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 animate-fade-in">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && <LoadingState />}

                {/* Q&A List */}
                <div className="space-y-6">
                    {qaPairs.map((qaPair, index) => (
                        <AnswerCard
                            key={qaPair.id}
                            qaPair={qaPair}
                            index={index}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {qaPairs.length === 0 && !isLoading && (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="mb-6">
                            <svg className="w-20 h-20 mx-auto text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-accent/80 mb-3">
                            เริ่มต้นถามคำถามได้เลย!
                        </h3>
                        <p className="text-accent/60 max-w-md mx-auto">
                            AI Assistant พร้อมช่วยตอบคำถามเกี่ยวกับ Digital Marketing, Media Planning, และเรื่องอื่นๆ สำหรับ Junior Digital Planner
                        </p>
                    </div>
                )}

                {/* Scroll anchor */}
                <div ref={answersEndRef} />
            </div>
        </div>
    );
}
