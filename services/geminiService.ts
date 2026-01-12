
import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const MOCK_WEATHER_DATA: WeatherData = {
  location: "서울특별시",
  temperature: 22,
  condition: "맑음",
  high: 25,
  low: 18,
  humidity: 45,
  windSpeed: "12 km/h",
  visibility: "15 km",
  uvIndex: "6",
  forecast: [
    { day: "월", temp: 23, condition: "맑음" },
    { day: "화", temp: 21, condition: "흐림" },
    { day: "수", temp: 19, condition: "비" },
    { day: "목", temp: 22, condition: "구름 조금" },
    { day: "금", temp: 24, condition: "맑음" },
  ],
  aiAnalysis: "공원을 산책하기에 완벽한 날씨입니다. 온화한 기온과 맑은 하늘에 어울리는 가벼운 가디건과 좋아하는 음악을 챙겨보세요. 상쾌한 공기를 즐겨보시길 바랍니다!",
  sources: [{ title: "SkyAI 시뮬레이션", uri: "#" }]
};

export async function fetchWeatherWithGemini(lat: number, lng: number): Promise<WeatherData> {
  const prompt = `Provide current real-time weather and a 5-day forecast for the location at Latitude: ${lat}, Longitude: ${lng}. 
  **CRITICAL: All descriptive text fields (location, condition, aiAnalysis) MUST be in Korean.**
  Format your response as a JSON object with these exact keys: 
  - location (city/neighborhood in Korean)
  - temperature (number, C)
  - condition (Short string in Korean, e.g., "맑음", "흐림", "비")
  - high (number)
  - low (number)
  - humidity (number)
  - windSpeed (string)
  - visibility (string)
  - uvIndex (string)
  - forecast (array of {day: string in Korean, temp: number, condition: string in Korean})
  - aiAnalysis (A sensory, emotional advice about the weather mood in Korean, 2 sentences).
  
  Use Google Search to ensure the data is accurate for today.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "날씨 정보 출처",
      uri: chunk.web?.uri || "#"
    })) || [];

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...parsed, sources };
    }
    throw new Error("Parsing failed");
  } catch (error) {
    console.warn("Gemini Error, using mock data:", error);
    return { ...MOCK_WEATHER_DATA, location: "서울특별시 (시뮬레이션)" };
  }
}

export async function generateWeatherImage(condition: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A soft, blurred, artistic minimalist landscape representing ${condition} weather, top-down view or wide angle, abstract, high quality, no text.` }],
      },
      config: { imageConfig: { aspectRatio: "16:9" } },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch {
    return null;
  }
}
