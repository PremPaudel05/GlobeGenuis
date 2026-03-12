import { GoogleGenAI } from '@google/genai';
import { CountryData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCountryProfile(countryName: string): Promise<CountryData> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate a comprehensive travel profile for the country: "${countryName}".
You MUST use the googleMaps tool to get accurate, up-to-date information about the country, its capital, and top attractions.
Return ONLY a valid JSON object matching this exact structure (no markdown formatting, no backticks, just the raw JSON):
{
  "isValidCountry": boolean,
  "overview": { "flagEmoji": "", "capital": "", "population": "", "currency": "", "currencyCode": "", "exchangeRateToUSD": 1.0, "timeZone": "" },
  "geography": { "climate": "", "landscape": "", "majorCities": [""], "naturalLandmarks": [""] },
  "culture": { "traditions": [""], "socialNorms": [""], "religionOverview": "", "etiquetteTips": [""] },
  "foods": [ { "name": "", "description": "", "famousFor": "" } ],
  "attractions": [ { "name": "", "city": "", "famousFor": "", "interestingFact": "", "imageSearchQuery": "" } ],
  "phrases": [ { "english": "", "local": "", "phonetic": "" } ],
  "prices": { "hotel": "", "meal": "", "streetFood": "", "coffee": "", "transport": "", "taxi": "" },
  "bestTimeToVisit": { "bestMonths": "", "rainySeason": "", "cheapestSeason": "", "majorFestivals": [""] },
  "funFacts": [""],
  "mapData": { "countryQuery": "", "cities": [ { "name": "", "query": "", "highlights": [""] } ], "bestBeaches": [""], "bestFoodAreas": [""], "nightlifeZones": [""], "instagrammableSpots": [""], "areasToAvoid": [""] }
}`,
    config: {
      tools: [{ googleMaps: {} }],
      temperature: 0.2
    },
  });

  let text = response.text || "";
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  
  try {
    return JSON.parse(text) as CountryData;
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to generate structured data");
  }
}

export async function generateAttractionImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
}

export async function editAttractionImage(base64Data: string, mimeType: string, prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to edit image");
}
