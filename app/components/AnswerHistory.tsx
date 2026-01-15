/**
 * AnswerHistory Component
 * 
 * Displays all previous answers in a locked, read-only format
 * Allows users to review their choices without editing
 */

'use client';

import { UserAnswer } from '../types';

interface AnswerHistoryProps {
    answers: UserAnswer[];
}

export default function AnswerHistory({ answers }: AnswerHistoryProps) {
    if (answers.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-accent mb-4 flex items-center gap-2">
                <span>📋</span>
                <span>คำตอบที่เลือกไว้แล้ว</span>
                <span className="text-sm text-accent/60">(ล็อกแล้ว)</span>
            </h3>

            <div className="space-y-2">
                {answers.map((answer, index) => (
                    <div
                        key={answer.stepId}
                        className="bg-surface/40 border border-primary/20 rounded-lg p-4 flex items-center gap-4 opacity-80"
                    >
                        {/* Step indicator */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold text-accent">
                            {index + 1}
                        </div>

                        {/* Answer content */}
                        <div className="flex-1">
                            <p className="text-sm text-accent/70 mb-1">
                                {answer.stepId}
                            </p>
                            <p className="text-base font-medium text-foreground">
                                {answer.selectedLabel}
                            </p>
                        </div>

                        {/* Lock icon */}
                        <div className="flex-shrink-0 text-accent/50">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
