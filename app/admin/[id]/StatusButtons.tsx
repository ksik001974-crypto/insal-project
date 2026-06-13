"use client";

import { useRouter } from "next/navigation";

export default function StatusButtons({
  id,
}: {
  id: number;
}) {
  const router = useRouter();

  const changeStatus = async (status: string) => {
    const response = await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      alert("상태 변경에 실패했습니다.");
      return;
    }

    router.refresh();
  };

  return (
    <div className="mt-5 flex gap-3">
      <button
        onClick={() => changeStatus("미처리")}
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        미처리
      </button>

      <button
        onClick={() => changeStatus("검토중")}
        className="bg-yellow-500 text-black px-4 py-2 rounded"
      >
        검토중
      </button>

      <button
        onClick={() => changeStatus("처리완료")}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        처리완료
      </button>
    </div>
  );
}