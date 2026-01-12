
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question } from "./types";

// Helper function to get AI instance ensuring key is present
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuiz = async (params: {
  topic: string,
  numQuestions: number,
  numOptions: number,
  difficulty: Difficulty
}): Promise<Question[]> => {
  const { topic, numQuestions, numOptions, difficulty } = params;
  const ai = getAiClient();

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a high-quality quiz about "${topic}". Difficulty: ${difficulty}. Exactly ${numQuestions} questions. Exactly ${numOptions} options per question.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
          },
          required: ["text", "options", "correctAnswerIndex"],
        },
      },
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  const questions: any[] = JSON.parse(rawText);
  return questions.map((q, idx) => ({
    id: `q-${idx}-${Date.now()}`,
    text: q.text,
    options: q.options,
    correctAnswerIndex: q.correctAnswerIndex,
  }));
};
