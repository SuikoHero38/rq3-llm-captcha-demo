const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');

const app = express();
app.use(cors()); // Activate CORS
app.use(bodyParser.json()); // Middleware to parsing JSON from request body

// API key for OpenAI GPT-4 (Feel free to use mine)
const gpt4ApiKey = "<API_KEY>";  // Ganti dengan API Key OpenAI Anda

const genAI = new GoogleGenerativeAI("GOOGLE_API_KEY");

// Function to solve CAPTCHA using Gemini
async function solveCaptchaWithGemini(imageData) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
        "Please solve the captcha in the image",
        { inlineData: { data: imageData, mimeType: 'image/png' } }
    ]);
    return result.response.text(); // Assume there is a property called text on response
}

// Function to solve CAPTCHA using GPT-4
async function solveCaptchaWithGPT4(imageData) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gpt4ApiKey}`
    };

    const payload = {
        model: "gpt-4o-mini",  // Sesuaikan model jika diperlukan
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Text is in the image"
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/png;base64,${imageData}`
                        }
                    }
                ]
            }
        ],
        max_tokens: 300
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error in GPT-4 processing:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Endpoint to process CAPTCHA
app.post('/api/process-data', async (req, res) => {
    const { imageData } = req.body; // imageData must be sent from frontend in base64 format

    try {
        // Run both LLMs in parallel
        const [geminiResult, gpt4Result] = await Promise.all([
            solveCaptchaWithGemini(imageData),
            solveCaptchaWithGPT4(imageData)
        ]);

        // Send response with both results from both LLMs
        res.json({
            captchaSolutionGemini: geminiResult,
            captchaSolutionGPT4: gpt4Result
        });
    } catch (error) {
        console.error("Error processing the data:", error);
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
