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
            text: `이 이미지를 분석하여 어떤 음식인지 식별해 주세요.
            보여지는 양을 기준으로 총 칼로리와 다량 영양소(단백질, 탄수화물, 지방)를 추정해 주세요.
            이 음식에 대한 건강 팁을 한 문장으로 제공해 주세요.
            예상되는 주요 재료 목록을 작성해 주세요.
            이미지에 음식이 포함되어 있지 않다면 'isFood'를 false로 설정하고 다른 필드는 null 또는 0으로 설정해 주세요.
            
            중요: foodName, healthTip, ingredients 등 모든 텍스트 값은 반드시 '한국어(Korean)'로 출력해야 합니다.`
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
                protein: { type: Type.NUMBER, description: "단백질 함량 (g)" },
                carbs: { type: Type.NUMBER, description: "탄수화물 함량 (g)" },
                fat: { type: Type.NUMBER, description: "지방 함량 (g)" },
              },
              required: ["protein", "carbs", "fat"],
            },
            healthTip: { type: Type.STRING, description: "음식에 대한 한 문장 건강 팁 (한국어)" },
            ingredients: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "주요 재료 목록 (한국어)"
            },
            isFood: { type: Type.BOOLEAN, description: "음식 감지 여부" },
          },
          required: ["foodName", "totalCalories", "macros", "healthTip", "isFood", "ingredients"],
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
    
    // Check for Quota Exceeded (429) or Service Unavailable (503)
    const errorMessage = error.message || error.toString();
    if (errorMessage.includes('429') || errorMessage.includes('Resource has been exhausted')) {
        throw new Error("QUOTA_EXCEEDED");
    }
    
    throw error;
  }
};