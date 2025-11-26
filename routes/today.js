const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/', async (req, res) => {
  try {
    const { conversation } = req.body;
    
    const prompt = `Based on this self-reflection conversation, create a brief "Today's Portrait" summary. Extract:
1. The main emotion or mood expressed
2. Key insight or realization
3. One thing they're grateful for or looking forward to

Conversation:
${conversation}

Respond in JSON format:
{
  "mood": "brief mood description",
  "insight": "key insight in one sentence",
  "highlight": "one positive thing mentioned"
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 300,
    });

    const responseText = completion.choices[0].message.content;
    let portrait;
    try {
      portrait = JSON.parse(responseText);
    } catch {
      portrait = {
        mood: 'Reflective',
        insight: responseText.substring(0, 100),
        highlight: 'Taking time for self-reflection'
      };
    }

    res.json(portrait);
  } catch (error) {
    console.error('Today portrait error:', error);
    res.status(500).json({ error: 'Failed to generate today\'s portrait' });
  }
});

module.exports = router;
