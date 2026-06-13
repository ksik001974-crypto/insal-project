import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function analyzeComplaint(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
너는 학교 민원 윤리 분류 AI '인살'이다.

분류 기준:
기준1: 교육을 통한 배움에 방해가 되는 내용
기준2: 개인의 이익만을 추구하는 내용
기준3: 본교 교육이념을 위배하는 내용
도배/무의미: 민원과 관련 없는 반복 문자, 의미 없는 글자 나열, 장난성 메시지
없음: 문제가 없는 정상 민원

규칙:
- 욕설, 비속어, 조롱, 비하, 모욕 표현은 반드시 기준3
- 특정 학생만의 점수, 성적, 특혜 요구는 기준2
- 수업, 시험, 과제 자체를 부당하게 거부하는 내용은 기준1
- 도배/무의미한 글은 정상 민원이 아니라 반드시 "도배/무의미"로 분류

반드시 JSON만 출력한다.

{
  "violated": "기준1 또는 기준2 또는 기준3 또는 도배/무의미 또는 없음",
  "reason": "판단 이유",
  "problemPart": "문제가 되는 표현",
  "riskScore": 숫자
}

민원:
${text}
`,
    });

    const output = response.text ?? "";

    return JSON.parse(
      output.replace(/```json/g, "").replace(/```/g, "").trim()
    );
  } catch {
    return fallbackAnalyze(text);
  }
}

function fallbackAnalyze(text: string) {
  const normalized = text.replace(/\s/g, "");

  const isSpam =
    text.length < 5 ||
    /(.)\1{5,}/.test(text) ||
    /^[ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]+$/.test(text);

  if (isSpam) {
    return {
      violated: "도배/무의미",
      reason: "민원 내용과 관련 없는 반복 문자 또는 의미 없는 메시지",
      problemPart: text,
      riskScore: 40,
    };
  }

  if (
    normalized.includes("바보") ||
    normalized.includes("멍청") ||
    normalized.includes("무능") ||
    normalized.includes("꺼져") ||
    normalized.includes("씨발") ||
    normalized.includes("시발") ||
    normalized.includes("새끼") ||
    normalized.includes("병신") ||
    normalized.includes("미친") ||
    normalized.includes("존나")
  ) {
    return {
      violated: "기준3",
      reason: "욕설 또는 인격 비하 표현 포함",
      problemPart: text,
      riskScore: 95,
    };
  }

  if (
    normalized.includes("점수올려") ||
    normalized.includes("성적올려") ||
    normalized.includes("우리아이만") ||
    normalized.includes("특혜")
  ) {
    return {
      violated: "기준2",
      reason: "개인의 이익만을 추구하는 표현 포함",
      problemPart: text,
      riskScore: 70,
    };
  }

  if (
    normalized.includes("시험취소") ||
    normalized.includes("수행평가없애") ||
    normalized.includes("과제하지마") ||
    normalized.includes("수업하지마")
  ) {
    return {
      violated: "기준1",
      reason: "교육 활동을 방해하는 표현 포함",
      problemPart: text,
      riskScore: 60,
    };
  }

  return {
    violated: "없음",
    reason: "위험 표현이 감지되지 않음",
    problemPart: "없음",
    riskScore: 5,
  };
}