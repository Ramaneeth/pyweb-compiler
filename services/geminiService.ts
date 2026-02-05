
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const explainError = async (code: string, error: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I'm writing Python code and got an error.
      
      Code:
      \`\`\`python
      ${code}
      \`\`\`
      
      Error:
      ${error}
      
      Please explain what went wrong and how to fix it in a concise way.`,
      config: {
        systemInstruction: "You are a senior Python developer. Provide clear, concise explanations and code fixes."
      }
    });
    return response.text;
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Failed to get AI assistance. Please check your network or try again.";
  }
};

export const suggestOptimizations = async (code: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this Python code and suggest 2-3 optimizations or best practice improvements:
      
      \`\`\`python
      ${code}
      \`\`\``,
      config: {
        systemInstruction: "You are an expert Python performance engineer. Focus on readability, efficiency, and Pythonic patterns."
      }
    });
    return response.text;
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Failed to get AI suggestions.";
  }
};
