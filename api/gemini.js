import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST requests from your frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Initialize Gemini using your hidden Vercel environment variable
    // Notice there is NO 'VITE_' prefix here.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Grab the country/destination the user searched for
    const { destination } = req.body;

    // You can customize this prompt to match what you had in AI Studio
    const prompt = `Provide travel insights, culture highlights, and attractions for ${destination}. Format it nicely.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Send the travel data back to your React frontend
    res.status(200).json({ data: text });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch travel data' });
  }
}
