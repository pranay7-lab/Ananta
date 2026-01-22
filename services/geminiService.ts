import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

export const initializeChatSession = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key not found.");
  }

  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Use gemini-3-flash-preview for responsive text chat
  chatSession = genAI.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Slightly creative but grounded
    },
  });

  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  if (!chatSession) {
    initializeChatSession();
  }

  if (!chatSession) {
      throw new Error("Failed to initialize chat session");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

export const resetSession = () => {
  chatSession = null;
  initializeChatSession();
};