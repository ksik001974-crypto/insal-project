"use client";

import { useState } from "react";

export default function HomePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        alert("민원 제출 실패");
        return;
      }

      alert("민원이 접수되었습니다.");
      setTitle("");
      setContent("");
    } catch (error) {
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          국원고 민원 사이트
        </h1>

        <p className="text-center text-gray-700 mb-8">
          인살(AI) 기반 민원 분석 시스템
        </p>

        <label className="block mb-2 font-bold text-gray-900">
          민원 제목
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="민원 제목을 입력하세요"
          className="w-full border-2 border-gray-500 bg-white text-black placeholder-gray-500 p-3 rounded mb-6"
        />

        <label className="block mb-2 font-bold text-gray-900">
          민원 내용
        </label>

        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="민원 내용을 입력하세요"
          className="w-full border-2 border-gray-500 bg-white text-black placeholder-gray-500 p-3 rounded mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold p-4 rounded"
        >
          {loading ? "민원 제출 중..." : "민원 제출"}
        </button>
      </div>
    </main>
  );
}