import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const complaints = await prisma.complaint.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-black p-10">
      <h1 className="text-4xl font-bold mb-8 text-white">
        관리자 페이지
      </h1>

      {complaints.map((item) => {
        const riskScore = item.riskScore ?? 0;

        const riskLevel =
          item.violated === "도배/무의미"
            ? "도배/무의미"
            : item.riskScore == null
            ? "분석값 없음"
            : riskScore >= 81
            ? "고위험 민원"
            : riskScore >= 61
            ? "검토 필요"
            : riskScore >= 31
            ? "주의 민원"
            : "정상 민원";

        const riskColor =
          item.violated === "도배/무의미"
            ? "text-purple-400"
            : item.riskScore == null
            ? "text-gray-400"
            : riskScore >= 81
            ? "text-red-400"
            : riskScore >= 61
            ? "text-orange-400"
            : riskScore >= 31
            ? "text-yellow-400"
            : "text-green-400";

        const statusColor =
          item.status === "처리완료"
            ? "text-green-400"
            : item.status === "검토중"
            ? "text-yellow-400"
            : "text-red-400";

        return (
          <div
            key={item.id}
            className="border-2 border-gray-700 p-5 mb-5 rounded-xl shadow bg-gray-900"
          >
            <Link
              href={`/admin/${item.id}`}
              className="text-xl font-bold text-blue-400 underline"
            >
              {item.title}
            </Link>

            <p className="text-sm text-gray-400 mt-2">
              {new Date(item.createdAt).toLocaleString()}
            </p>

            <p className="mt-3 font-semibold text-gray-100">
              위반 기준: {item.violated ?? "분석값 없음"}
            </p>

            <p className="font-semibold text-gray-100">
              위험도: {item.riskScore ?? "분석값 없음"}점
            </p>

            <p className={`font-bold ${riskColor}`}>
              위험 등급: {riskLevel}
            </p>

            <p className={`font-bold mt-2 ${statusColor}`}>
              {item.status}
            </p>
          </div>
        );
      })}
    </main>
  );
}