import { getSessionById } from '@/app/db/planner.service';
import CsvDataCollector from '@/app/components/CsvDataCollector';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header';

export default async function UploadCsvPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSessionById(id);

    if (!session) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Header />
            <CsvDataCollector sessionId={session.id} recommendation={session.recommendation} />
        </div>
    );
}
