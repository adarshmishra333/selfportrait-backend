const express = require('express');
const router = express.Router();

// In-memory storage (for demo - in production use a database)
let conversationHistory = [];

// Get all history
router.get('/', (req, res) => {
  res.json(conversationHistory);
});

// Save a conversation
router.post('/', (req, res) => {
  try {
    const { conversation, portrait, date } = req.body;
    const entry = {
      id: Date.now(),
      conversation,
      portrait,
      date: date || new Date().toISOString()
    };
    conversationHistory.unshift(entry);
    // Keep only last 30 entries
    if (conversationHistory.length > 30) {
      conversationHistory = conversationHistory.slice(0, 30);
    }
    res.json(entry);
  } catch (error) {
    console.error('Save history error:', error);
    res.status(500).json({ error: 'Failed to save conversation' });
  }
});

// Delete an entry
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  conversationHistory = conversationHistory.filter(entry => entry.id !== id);
  res.json({ success: true });
});

module.exports = router;
