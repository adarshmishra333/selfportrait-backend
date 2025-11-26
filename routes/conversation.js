const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `You are an introspective AI that helps people understand themselves better through thoughtful questions and reflections. Your role is to:
1. Ask one meaningful question at a time about the person's thoughts, feelings, or experiences
2. Listen carefully to their responses and build on them
3. Help them discover patterns in their thinking and behavior
4. Be warm, non-judgmental, and supportive
5. Keep responses concise but meaningful

Start by introducing yourself briefly and asking an opening question about what's on their mind today.`;

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({
      message: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Conversation error:', error);
    res.status(500).json({ error: 'Failed to process conversation' });
  }
});

module.exports = router;
