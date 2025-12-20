/**
 * Loading State Component
 * 
 * Displays animated "AI is thinking" indicator
 * Shows while waiting for AI response
 */

export default function LoadingState() {
    return (
        <div className="flex items-center justify-center space-x-3 py-8 animate-fade-in">
            {/* Animated dots */}
            <div className="flex space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>

            {/* Loading text */}
            <p className="text-purple-300/80 text-lg font-medium">
                AI กำลังคิด...
            </p>
        </div>
    );
}
