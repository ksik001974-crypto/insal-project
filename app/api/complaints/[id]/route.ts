import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const complaint = await prisma.complaint.update({
      where: {
        id: Number(id),
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(complaint);
  } catch (error) {
    console.error("상태 변경 오류:", error);

    return NextResponse.json(
      { error: "상태 변경 실패" },
      { status: 500 }
    );
  }
}