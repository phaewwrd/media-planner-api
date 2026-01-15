import { db } from '@/app/db';
import { plannerSessions } from '@/app/db/schema';
import { QUESTIONS, MODELS } from '@/app/lib/planner-data';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { clientName, answers } = await request.json();

    if (!clientName || !answers) {
      return NextResponse.json({ error: 'Client name and answers are required' }, { status: 400 });
    }

    // --- Calculation Logic (moved from frontend) ---
    let fbPoints = 0, ggPoints = 0;
    QUESTIONS.forEach(q => {
      const ans = answers[q.id];
      const opt = q.options?.find(o => o.val === ans);
      if (opt?.points) {
        fbPoints += opt.points.fb || 0;
        ggPoints += opt.points.gg || 0;
      }
    });

    const blockerMet = answers.q4 === 'High' || answers.q5 === 'Weak' || answers.q6 === 'No' || answers.q7 === 'Low' || answers.q8 === '45+';
    const canTT = !blockerMet;
    const hero = fbPoints >= ggPoints ? 'FACEBOOK' : 'GOOGLE';
    const heroPoints = hero === 'FACEBOOK' ? fbPoints : ggPoints;
    const efficiency = Math.round((heroPoints / 9) * 100);
    const str = efficiency <= 40 ? "MOD" : efficiency <= 70 ? "STR" : "MAX";

    let classId = hero === 'FACEBOOK' ? (canTT ? "C1" : (str === "MOD" ? "C2" : (str === "STR" ? "C3" : "C4"))) : (canTT ? "C5" : (str === "MOD" ? "C6" : (str === "STR" ? "C7" : "C8")));
    
    if (answers.q10 === 'FACEBOOK') {
      classId = 'C4';
    } else if (answers.q10 === 'GOOGLE') {
      classId = 'C8';
    }

    const model = MODELS[classId];
    const result = { model, efficiency };
    // --- End of Calculation Logic ---

    // --- Save to Database ---
    const newSession = await db.insert(plannerSessions).values({
      // `id` and `createdAt` are auto-generated
      answers: answers,
      recommendation: {
        clientName: clientName,
        ...result
      },
      // userId and totalBudget are nullable, so they can be omitted
    }).returning({ id: plannerSessions.id });

    const sessionId = newSession[0].id;

    // --- Return Result ---
    return NextResponse.json({ ...result, sessionId });

  } catch (error) {
    console.error('Error in planner API:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}