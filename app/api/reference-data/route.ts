import { NextResponse } from 'next/server';
import { db } from '../../db';
import { refQuestions, refModels } from '../../db/schema';

export async function GET() {
  try {
    const questions = await db.select().from(refQuestions);
    const models = await db.select().from(refModels);

    return NextResponse.json({ questions, models });
  } catch (error) {
    console.error('Error fetching reference data:', error);
    return NextResponse.json({ error: 'Failed to fetch reference data' }, { status: 500 });
  }
}
