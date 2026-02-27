export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subject, difficulty } = req.body;

    const prompt = `
Generate a debate topic on ${subject} with ${difficulty} difficulty.

Provide:
- 3 points FOR
- 3 points AGAINST

Return strictly in JSON format like this:
{
  "topic": "Debate topic here",
  "pointsFor": ["Point 1", "Point 2", "Point 3"],
  "pointsAgainst": ["Point 1", "Point 2", "Point 3"]
}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "arcee-ai/trinity-large-preview:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "AI Service Error",
        details: errorText
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return res.status(200).json(JSON.parse(jsonMatch[0]));
    } else {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server Error"
    });
  }
}