/**
 * ProgressBar Component
 * 
 * Displays visual progress through the 9-step planning flow
 * Shows current step number and percentage completion
 */

'use client';

interface ProgressBarProps {
    current: number;    // Current step number (1-9)
    total: number;      // Total number of steps (9)
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = Math.round((current / total) * 100);

    return (
        <div className="w-full mb-8">
            {/* Step counter */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-purple-300">
                    STEP {current} of {total}
                </span>
                <span className="text-sm font-medium text-purple-300">
                    {percentage}% Complete
                </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between mt-2">
                {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
                    <div
                        key={step}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step <= current
                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                : 'bg-surface-light text-purple-300/40'
                            }`}
                    >
                        {step}
                    </div>
                ))}
            </div>
        </div>
    );
}
