const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 1,
    responseMimeType: 'application/json',
    thinkingConfig: { thinkingBudget: 0 },
  },
});

module.exports = { getModel };
