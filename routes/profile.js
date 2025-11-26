const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/', async (req, res) => {
  try {
    const { history } = req.body;
    
    const prompt = `Based on this collection of self-reflection sessions, create a comprehensive personality profile:

${JSON.stringify(history, null, 2)}

Provide a thoughtful profile in JSON format:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "growthAreas": ["area1", "area2"],
  "coreValues": ["value1", "value2", "value3"],
  "emotionalPatterns": "brief description of emotional patterns",
  "recommendation": "personalized recommendation for continued growth"
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 600,
    });

    const responseText = completion.choices[0].message.content;
    let profile;
    try {
      profile = JSON.parse(responseText);
    } catch {
      profile = {
        strengths: ['Self-awareness', 'Reflective thinking'],
        growthAreas: ['Continue building self-knowledge'],
        coreValues: ['Personal growth', 'Self-understanding'],
        emotionalPatterns: responseText.substring(0, 200),
        recommendation: 'Keep up your reflection practice'
      };
    }

    res.json(profile);
  } catch (error) {
    console.error('Profile generation error:', error);
    res.status(500).json({ error: 'Failed to generate profile' });
  }
});

module.exports = router;
