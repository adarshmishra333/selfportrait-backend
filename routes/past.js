const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/', async (req, res) => {
  try {
    const { portraits } = req.body;
    
    const prompt = `Analyze these past self-portrait summaries and identify patterns, growth, or recurring themes:

${JSON.stringify(portraits, null, 2)}

Provide a brief analysis in JSON format:
{
  "patterns": ["pattern1", "pattern2"],
  "growth": "observation about personal growth",
  "suggestion": "one actionable suggestion based on the patterns"
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 400,
    });

    const responseText = completion.choices[0].message.content;
    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch {
      analysis = {
        patterns: ['Self-reflection'],
        growth: responseText.substring(0, 150),
        suggestion: 'Continue your reflection practice'
      };
    }

    res.json(analysis);
  } catch (error) {
    console.error('Past analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze past portraits' });
  }
});

module.exports = router;
