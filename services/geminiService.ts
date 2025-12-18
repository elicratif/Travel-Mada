import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBlogContent = async (topic: string, tone: string = 'inspiring'): Promise<string> => {
  const client = getClient();
  if (!client) return "API Key missing. Cannot generate content.";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a clear, engaging travel blog section about "${topic}". Tone: ${tone}. Keep it under 300 words. Format with Markdown.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating content. Please try again.";
  }
};

export const generatePostTitles = async (topic: string): Promise<string[]> => {
    const client = getClient();
    if (!client) return [];

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate 5 catchy, SEO-friendly travel blog titles for the topic: "${topic}". Return as a JSON array of strings.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const text = response.text;
        return text ? JSON.parse(text) : [];
    } catch (error) {
        console.error("Gemini Title Error", error);
        return [];
    }
};

export const generatePostOutline = async (topic: string): Promise<string> => {
    const client = getClient();
    if (!client) return "";

    try {
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Create a detailed blog post outline for "${topic}". Use Markdown format with Introduction, H2 headings, and bullet points for sub-topics.`,
        });
        return response.text || "";
    } catch (error) {
        console.error("Gemini Outline Error", error);
        return "";
    }
}

export const generateLogo = async (prompt: string): Promise<string | null> => {
    const client = getClient();
    if(!client) return null;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `Design a modern, minimalist logo for a travel brand named 'Travel Mada'. Concept: ${prompt}. Simple vector style, flat colors, white background.` }]
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Gemini Logo Error", error);
        return null;
    }
}

export const generateSEO = async (content: string): Promise<{ title: string; description: string }> => {
  const client = getClient();
  if (!client) return { title: "", description: "" };

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following blog content, generate an SEO-friendly Title (max 60 chars) and Meta Description (max 160 chars). Return STRICT JSON format: { "title": "...", "description": "..." } \n\n Content: ${content.substring(0, 1000)}...`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
            }
        }
      }
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini SEO Error:", error);
    return { title: "", description: "" };
  }
};