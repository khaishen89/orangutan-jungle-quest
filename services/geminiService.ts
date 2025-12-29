
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, FunFact } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuiz = async (): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate 5 ultra-simple visual quiz questions for toddlers (aged 3-5) about orangutans. Each question should be about identifying a color, a fruit, or a body part (like 'Where is the long arm?'). Use plenty of emojis in the options. Keep text very short.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 simple options, each with an emoji"
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING, description: "A one-sentence super happy explanation" }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Failed to parse quiz JSON", error);
    return [];
  }
};

export const generateFunFacts = async (): Promise<FunFact[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate 6 super cute 'Did you know?' cards for 3-year-olds about orangutans. Focus on fun things like 'They sleep in nests!' or 'They love swings!'. Use simple words and big emojis.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            fact: { type: Type.STRING },
            emoji: { type: Type.STRING }
          },
          required: ["title", "fact", "emoji"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Failed to parse facts JSON", error);
    return [];
  }
};
