import { CountryData } from '../types';

export async function generateCountryProfile(countryName: string): Promise<CountryData> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryName })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data as CountryData;
  } catch (error) {
    console.error("Failed to fetch from API, using demo data:", error);
    // Dynamically import demo data as fallback
    const { demoCountryData } = await import('../data/demoCountry');
    return demoCountryData as CountryData;
  }
}

// Image functions – placeholders
export async function generateAttractionImage(prompt: string): Promise<string> {
  console.warn("Image generation is not available in this version");
  return "https://via.placeholder.com/400x300?text=Image+Unavailable";
}

export async function editAttractionImage(base64Data: string, mimeType: string, prompt: string): Promise<string> {
  console.warn("Image editing is not available in this version");
  return "https://via.placeholder.com/400x300?text=Editing+Unavailable";
}
