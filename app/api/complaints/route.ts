import { prisma } from "@/lib/prisma";
import { analyzeComplaint } from "@/lib/analysis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const analysis = await analyzeComplaint(
      body.title + "\n" + body.content
    );

    const complaint = await prisma.complaint.create({
      data: {
        title: body.title,
        content: body.content,

        violated: analysis.violated,
        reason: analysis.reason,
        analysis: analysis.reason,
        problemPart: analysis.problemPart,
        riskScore: analysis.riskScore,
      },
    });

    return NextResponse.json(complaint);
  } catch (error) {
    console.error("민원 저장 오류:", error);

    return NextResponse.json(
      {
        error: "저장 실패",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}