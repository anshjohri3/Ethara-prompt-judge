import { Router } from 'express';
import { generateResponses } from '../utils/gemini.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/generate', authenticate, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const responses = await generateResponses(prompt);
    res.json(responses);
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ message: 'Error generating responses' });
  }
});

export default router;