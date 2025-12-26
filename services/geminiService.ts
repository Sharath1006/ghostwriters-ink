
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResponse } from "../types";

// Helper to get a client instance with the provided key
const getClient = (apiKey: string) => new GoogleGenAI({ apiKey });

// Utility to decode base64
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Utility to decode raw PCM audio data from Gemini TTS
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const analyzeImageAndWrite = async (base64Image: string, apiKey: string): Promise<AnalysisResponse> => {
  const client = getClient(apiKey);
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1],
          },
        },
        {
          text: "Analyze this image and write a compelling opening paragraph for a story set in this scene. Return the response in a structured JSON format with: 'mood', 'setting', 'keyDetails' (array), and 'paragraph'.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mood: { type: Type.STRING },
          setting: { type: Type.STRING },
          keyDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
          paragraph: { type: Type.STRING },
        },
        required: ["mood", "setting", "keyDetails", "paragraph"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
};

export const generateSpeech = async (text: string, apiKey: string): Promise<AudioBuffer> => {
  const client = getClient(apiKey);
  const response = await client.models.generateContent({
    model: "gemini-2.0-flash", // Updated to flash for speed/availability in free tier if needed, or stick to preview
    contents: [{ parts: [{ text: `Narrate this story opening with deep emotion and atmosphere: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioData = decodeBase64(base64Audio);
  return await decodeAudioData(audioData, audioContext, 24000, 1);
};

export const chatWithGemini = async (message: string, context: string, history: { role: 'user' | 'model', content: string }[], apiKey: string) => {
  const client = getClient(apiKey);
  const chat = client.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: `You are an expert ghostwriter and world-builder. Use the following story context to answer the user's questions or help them expand their story: ${context}`,
    },
  });

  // Reconstruct history if needed, but for now specific call:
  const response = await chat.sendMessage({ message });
  return response.text || '';
};
