// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const cors=require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const port = 3000;

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  // console.log('Received request:', req.body);
  const input = req.body.prompt;

  try {
    const result = await model.generateContent(input);
    // console.log('Generated result:', result.response.text());
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
