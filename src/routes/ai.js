const express = require('express');
const aiRoute = express.Router();

const API_KEY = process.env.API_KEY;

aiRoute.post('/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await apiResponse.json();
    const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No response";

    res.status(200).json({ response: geminiText });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = aiRoute;
