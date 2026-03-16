export default async function handler(req, res) {
  // Allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { country } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // This will be set on Vercel

    if (!apiKey) {
      return res.status(500).json({ error: 'API key missing on server' });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Provide travel information about ${country} including: overview, culture, popular foods, historical sites, best time to visit, essential phrases, and average tourist prices. Format as JSON.`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Server function error:', error);
    res.status(500).json({ error: error.message });
  }
}
