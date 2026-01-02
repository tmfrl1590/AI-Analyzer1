import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult } from "../types";

const modelId = "gemini-3-flash-preview";

// Helper function to safely get API Key from various environment configurations
const getApiKey = (): string | undefined => {
  // 1. Try Vite standard (import.meta.env.VITE_API_KEY)
  if ((import.meta as any).env?.VITE_API_KEY) {
    return (import.meta as any).env.VITE_API_KEY;
  }
  
  // 2. Try Standard/Legacy (process.env.API_KEY)
  if (typeof process !== 'undefined' && process.env?.API_KEY) {
    return process.env.API_KEY;
  }

  return undefined;
};

export const analyzeImage = async (base64Image: string): Promise<FoodAnalysisResult> => {
  // Initialize Gemini Client inside the function
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("API Key Missing. Checked VITE_API_KEY and API_KEY.");
    throw new Error(
      "API Key가 설정되지 않았습니다.\n\n" +
      "Vercel 배포 시 해결 방법:\n" +
      "1. Vercel 대시보드 > Settings > Environment Variables 이동\n" +
      "2. Key 이름을 'VITE_API_KEY'로 변경 (또는 새로 추가)\n" +
      "3. Value에 API 키 입력\n" +
      "4. Deployments 탭에서 최신 배포 'Redeploy' 실행"
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
  const base64Data = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", 
              data: base64Data
            }
          },
          {
            text: `이 이미지를 분석하여 다음 정보를 제공해주세요:
            1. 음식 이름과 추정 칼로리, 탄단지(g)
            2. 건강 팁 (한 문장)
            3. 주요 재료
            4. **건강 점수**: 영양 균형을 고려하여 100점 만점 기준으로 점수를 매겨주세요. (예: 샐러드 90점, 피자 40점)
            5. **스마트 태그**: 음식의 특징을 나타내는 태그 3~5개 (예: #고단백, #다이어트, #나트륨주의, #치팅데이)
            6. **운동 환산**: 이 칼로리를 소모하기 위해 필요한 운동 시간(분)을 계산해주세요. (걷기, 달리기, 자전거 타기)
            
            이미지에 음식이 없다면 isFood: false로 반환하세요.
            모든 텍스트는 한국어로 출력하세요.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "음식 이름 (한국어)" },
            totalCalories: { type: Type.NUMBER, description: "추정 총 칼로리 (kcal)" },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER, description: "단백질 (g)" },
                carbs: { type: Type.NUMBER, description: "탄수화물 (g)" },
                fat: { type: Type.NUMBER, description: "지방 (g)" },
              },
              required: ["protein", "carbs", "fat"],
            },
            healthTip: { type: Type.STRING, description: "건강 팁" },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            isFood: { type: Type.BOOLEAN },
            healthScore: { type: Type.NUMBER, description: "0~100 사이의 건강 점수" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "음식 특징 태그 (예: #고단백)" },
            exercise: {
              type: Type.OBJECT,
              properties: {
                walking: { type: Type.NUMBER, description: "걷기 소요 시간 (분)" },
                running: { type: Type.NUMBER, description: "달리기 소요 시간 (분)" },
                cycling: { type: Type.NUMBER, description: "자전거 타기 소요 시간 (분)" },
              },
              required: ["walking", "running", "cycling"]
            }
          },
          required: ["foodName", "totalCalories", "macros", "healthTip", "isFood", "ingredients", "healthScore", "tags", "exercise"],
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(resultText) as FoodAnalysisResult;
    return data;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    const errorMessage = error.message || error.toString();
    if (errorMessage.includes('429') || errorMessage.includes('Resource has been exhausted')) {
        throw new Error("QUOTA_EXCEEDED");
    }
    
    throw error;
  }
};