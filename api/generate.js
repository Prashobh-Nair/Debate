import fs from 'fs';

export default async function handler(req, res) {
  const log = (msg) => {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync('api_debug.log', line);
    console.log(msg);
  };

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subject, difficulty } = req.body;
    log(`Incoming Request - Subject: ${subject}, Difficulty: ${difficulty}`);

    const prompt = `Generate a debate topic on ${subject} with ${difficulty} difficulty. Provide 3 points for and 3 points against. 
    Output the result in a strict JSON format with the following keys:
    "topic": "The debate topic string",
    "pointsFor": ["point 1", "point 2", "point 3"],
    "pointsAgainst": ["point 1", "point 2", "point 3"]`;

    const key = process.env.OPENROUTER_API_KEY;

    log(`Calling OpenRouter with model: arcee-ai/trinity-large-preview:free`);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        "User-Agent": "curl/7.81.0",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI Debate Generator",
        "Origin": "http://localhost:5173"
      },
      body: JSON.stringify({
        model: "arcee-ai/trinity-large-preview:free",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const responseStatus = response.status;
    const responseText = await response.text();
    log(`OpenRouter Response Status: ${responseStatus}`);

    if (!response.ok) {
      log(`OpenRouter Error: ${responseText}`);
      return res.status(responseStatus).json({ error: "AI Service Error", details: responseText });
    }

    const data = JSON.parse(responseText);
    const content = data.choices[0].message.content;

    // Attempt to extract JSON from content
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.status(200).json(JSON.parse(jsonMatch[0]));
    } else {
      log('No JSON found in AI response');
      res.status(500).json({ error: "Invalid response from AI" });
    }

  } catch (error) {
    log(`Generation Error: ${error.message}`);
    res.status(500).json({ error: error.message || "Server Error" });
  }
}