import { getSessionById } from '@/app/db/planner.service';
import FinalSummary from '@/app/components/FinalSummary';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSessionById(id);

    if (!session) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Header />
            <FinalSummary recommendation={session.recommendation} />
        </div>
    );
}
