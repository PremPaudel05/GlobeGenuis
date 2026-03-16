import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // Enable CORS so your frontend can call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { country } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key missing on server' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Use the same model as before
      contents: `Generate a comprehensive travel profile for the country: "${country}".
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
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      return res.status(500).json({ error: "Failed to parse Gemini response" });
    }
  } catch (error) {
    console.error('Server function error:', error);
    res.status(500).json({ error: error.message });
  }
}
