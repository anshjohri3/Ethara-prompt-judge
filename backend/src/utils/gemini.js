import 'dotenv/config';
import Groq from 'groq-sdk';

let groq = null;

const getGroqClient = () => {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

export const generateResponses = async (prompt) => {
  const client = getGroqClient();

  // Response A: Factual (lower temperature)
  const completionA = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.4,
    max_tokens: 1024
  });

  // Response B: Creative (higher temperature)
  const completionB = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.9,
    max_tokens: 1024
  });

  const responseA = completionA.choices[0]?.message?.content || '';
  const responseB = completionB.choices[0]?.message?.content || '';

  return { responseA, responseB };
};