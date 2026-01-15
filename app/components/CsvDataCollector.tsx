'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FinalRecommendation } from '../types';
import CsvMappingSection from './CsvMapping/CsvMappingSection';

interface CsvDataCollectorProps {
    sessionId: string;
    recommendation: FinalRecommendation;
}

export default function CsvDataCollector({ sessionId, recommendation }: CsvDataCollectorProps) {
    const router = useRouter();
    const [hasHistoricData, setHasHistoricData] = useState<boolean | null>(null);

    const handleSkip = () => {
        router.push(`/summary/${sessionId}`);
    };

    return (
        <div className="max-w-4xl mx-auto animate-slide-up">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
                    Historic Data Input
                </h2>
                <p className="text-lg text-accent/80 max-w-2xl mx-auto">
                    เพื่อให้แผนมีความแม่นยำยิ่งขึ้น:
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-4">
                    "คุณมีข้อมูลการทำแคมเปญในอดีต (Historic Data) หรือไม่?"
                </h3>
            </div>

            {hasHistoricData === null ? (
                // Choice Buttons
                <div className="flex gap-6 justify-center mt-8">
                    <button
                        onClick={() => setHasHistoricData(true)}
                        className="group relative px-8 py-5 bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-1"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">✅</span>
                            <span className="text-xl font-bold text-green-200">มีข้อมูล / ต้องการ Upload CSV</span>
                        </div>
                    </button>

                    <button
                        onClick={handleSkip}
                        className="group relative px-8 py-5 bg-gradient-to-br from-gray-500/20 to-slate-500/20 hover:from-gray-500/30 hover:to-slate-500/30 border border-foreground/20 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">➡️</span>
                            <span className="text-xl font-bold text-gray-200">ไม่มีข้อมูล / ข้ามขั้นตอนนี้</span>
                        </div>
                    </button>
                </div>
            ) : (
                // Upload Section
                <div className="animate-fade-in">
                    <button
                        onClick={() => setHasHistoricData(null)}
                        className="mb-4 text-sm text-accent hover:text-foreground flex items-center gap-2"
                    >
                        ← ย้อนกลับ
                    </button>

                    <CsvMappingSection recommendation={recommendation} />

                    <div className="mt-8 text-center border-t border-foreground/10 pt-8">
                        <p className="text-accent/60 mb-4">เมื่อตรวจสอบข้อมูลเสร็จแล้ว กดปุ่มด้านล่างเพื่อดูแผนสรุป</p>
                        <button
                            onClick={handleSkip}
                            className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-foreground font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
                        >
                            🚀 ดูแผนสรุป (Go to Summary)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
