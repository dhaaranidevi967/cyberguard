import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface WebsiteAnalysis {
  status: 'Safe' | 'Suspicious' | 'Fake';
  riskScore: number;
  reasons: string[];
  details: string;
}

export interface AudioAnalysis {
  scamProbability: number;
  isScam: boolean;
  alerts: string[];
  explanation: string;
  transcript?: string;
}

export const analyzeWebsite = async (url: string): Promise<WebsiteAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this website URL for potential phishing or scam indicators: ${url}. 
    Consider URL structure, common phishing keywords, and typical malicious patterns.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ['Safe', 'Suspicious', 'Fake'] },
          riskScore: { type: Type.NUMBER, description: "Risk score from 0 to 100" },
          reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
          details: { type: Type.STRING }
        },
        required: ["status", "riskScore", "reasons", "details"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeAudioContent = async (text: string): Promise<AudioAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this transcript of an audio call for scam indicators: "${text}". 
    Look for urgency, manipulation, requests for sensitive info, or known scam scripts (e.g., tech support, bank fraud, lottery).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scamProbability: { type: Type.NUMBER },
          isScam: { type: Type.BOOLEAN },
          alerts: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING }
        },
        required: ["scamProbability", "isScam", "alerts", "explanation"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const getChatbotResponse = async (message: string, history: { role: string, content: string }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are CyberGuard Support, an empathetic and calm AI assistant for cybercrime victims. 
      Your goal is to reduce panic, provide step-by-step practical advice, and encourage reporting to official channels. 
      You are NOT a lawyer or a therapist, but a supportive guidance assistant. 
      Keep a professional yet warm tone. 
      If the user is in immediate distress, guide them to the nearest police station or official helpline.`,
    }
  });

  // Convert history to Gemini format if needed, but sendMessage handles simple strings.
  // For simplicity in this demo, we'll just send the message.
  const response = await chat.sendMessage({ message });
  return response.text;
};
