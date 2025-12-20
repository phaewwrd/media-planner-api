/**
 * OptionSelector Component
 * 
 * Displays answer options as interactive cards
 * User selects one to proceed to the next step
 */

'use client';

import { AnswerOption } from '../types';

interface OptionSelectorProps {
    options: AnswerOption[];
    onSelect: (optionId: string) => void;
}

export default function OptionSelector({ options, onSelect }: OptionSelectorProps) {
    return (
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-lg font-semibold text-purple-200 mb-4">
                เลือกคำตอบที่ตรงกับสถานการณ์ของคุณ:
            </p>

            <div className="grid gap-4">
                {options.map((option, index) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className="group relative bg-gradient-to-br from-surface/60 to-surface-light/60 backdrop-blur-sm border-2 border-purple-500/30 rounded-xl p-6 text-left transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background"
                        style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                    >
                        {/* Hover gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 rounded-xl transition-all duration-300" />

                        <div className="relative z-10">
                            {/* Option label */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <h3 className="text-xl font-bold text-purple-100 group-hover:text-white transition-colors duration-300">
                                    {option.label}
                                </h3>
                            </div>

                            {/* Option description (if available) */}
                            {option.description && (
                                <p className="text-sm text-purple-300/70 ml-11 group-hover:text-purple-200/90 transition-colors duration-300">
                                    {option.description}
                                </p>
                            )}
                        </div>

                        {/* Arrow indicator */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-purple-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
