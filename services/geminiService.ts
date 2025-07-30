
import { GoogleGenAI, Type } from "@google/genai";
import { ExampleSentence } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function getExampleSentence(hanja: string): Promise<ExampleSentence> {
  if (!API_KEY) {
    // Return a mock response or throw an error if the key is not available
    return {
      sentence: "API 키가 설정되지 않았습니다.",
      translation: "API key is not configured."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `"${hanja}" 한자가 들어간, 배우기 쉬운 한국어 예문과 그에 대한 자연스러운 영어 번역을 만들어줘.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence: {
              type: Type.STRING,
              description: "The generated Korean sentence containing the Hanja.",
            },
            translation: {
              type: Type.STRING,
              description: "The English translation of the Korean sentence.",
            },
          },
          required: ["sentence", "translation"],
        },
      },
    });

    const jsonString = response.text;
    const parsedResponse = JSON.parse(jsonString);

    if (typeof parsedResponse.sentence === 'string' && typeof parsedResponse.translation === 'string') {
        return parsedResponse as ExampleSentence;
    } else {
        throw new Error("Invalid JSON structure from API response.");
    }
    
  } catch (error) {
    console.error("Error fetching example sentence from Gemini API:", error);
    throw new Error("Failed to generate example sentence.");
  }
}
