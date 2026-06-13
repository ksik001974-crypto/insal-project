import { prisma } from "@/lib/prisma";
import StatusButtons from "./StatusButtons";

export const dynamic = "force-dynamic";
export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const complaint = await prisma.complaint.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!complaint) {
    return (
      <main className="min-h-screen bg-black p-10">
        <h1 className="text-2xl font-bold text-white">
          존재하지 않는 민원입니다.
        </h1>
      </main>
    );
  }

  const riskLevel =
    complaint.violated === "도배/무의미"
      ? "도배/무의미"
      : complaint.riskScore == null
      ? "분석값 없음"
      : complaint.riskScore >= 81
      ? "고위험 민원"
      : complaint.riskScore >= 61
      ? "검토 필요"
      : complaint.riskScore >= 31
      ? "주의 민원"
      : "정상 민원";

  const riskColor =
    complaint.violated === "도배/무의미"
      ? "text-purple-400"
      : complaint.riskScore == null
      ? "text-gray-400"
      : complaint.riskScore >= 81
      ? "text-red-400"
      : complaint.riskScore >= 61
      ? "text-orange-400"
      : complaint.riskScore >= 31
      ? "text-yellow-400"
      : "text-green-400";

  const statusColor =
    complaint.status === "처리완료"
      ? "text-green-400"
      : complaint.status === "검토중"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <main className="min-h-screen bg-black p-10">
      <h1 className="text-4xl font-bold mb-4 text-white">
        {complaint.title}
      </h1>

      <p className="text-gray-400 mb-6">
        {new Date(complaint.createdAt).toLocaleString()}
      </p>

      {/* 민원 내용 */}
      <div className="border-2 border-gray-700 bg-gray-900 shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          민원 내용
        </h2>

        <p className="text-lg text-gray-100 whitespace-pre-wrap">
          {complaint.content}
        </p>
      </div>

      {/* AI 분석 결과 */}
      <div className="border-2 border-blue-700 bg-gray-900 shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-blue-400 mb-5">
          인살 AI 분석 결과
        </h2>

        <p className="text-lg font-semibold text-gray-100">
          <strong>위반 기준:</strong>{" "}
          {complaint.violated ?? "분석값 없음"}
        </p>

        <p className="mt-3 text-lg font-semibold text-gray-100">
          <strong>위험도:</strong>{" "}
          {complaint.riskScore ?? "분석값 없음"}점
        </p>

        <p className={`mt-3 text-xl font-bold ${riskColor}`}>
          위험 등급: {riskLevel}
        </p>

        <p className="mt-3 text-lg font-semibold text-gray-100">
          <strong>분석 결과:</strong>{" "}
          {complaint.reason ?? "분석값 없음"}
        </p>

        <p className="mt-3 text-lg font-semibold text-gray-100">
          <strong>문제 문장:</strong>{" "}
          {complaint.problemPart ?? "없음"}
        </p>

        <p className={`mt-4 text-xl font-bold ${statusColor}`}>
          현재 상태: {complaint.status}
        </p>

        <StatusButtons id={complaint.id} />
      </div>
    </main>
  );
}