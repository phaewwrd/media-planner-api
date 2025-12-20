/**
 * Header Component
 * 
 * Displays the website title and subtitle
 * Features gradient text effect for modern SaaS look
 */

export default function Header() {
    return (
        <header className="text-center mb-12 animate-fade-in">
            {/* Main Title with gradient effect */}
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Digital Media Planner
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-purple-200/80 max-w-2xl mx-auto">
                Decision-Based RAG Planner สำหรับ Junior Digital Planner
            </p>

            {/* Description */}
            <p className="text-sm md:text-base text-purple-300/60 mt-3 max-w-xl mx-auto">
                ตอบคำถาม 9 ข้อ แบบ Step-by-Step เพื่อรับคำแนะนำการจัดสรรงบโฆษณาที่ดีที่สุด
            </p>

            {/* Decorative line */}
            <div className="mt-6 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </header>
    );
}
