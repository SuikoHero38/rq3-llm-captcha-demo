const fs = require('fs');
const path = require('path');
const axios = require('axios');

// OpenAI API Key - You can use mine so you do not have to pay
const apiKey = "<API_KEY>";  // Ganti dengan API Key Anda

// Function to convert image to base64
function encodeImage(imagePath) {
  const image = fs.readFileSync(imagePath);
  return Buffer.from(image).toString('base64');
}

// Path to your image
const imagePath = path.join(__dirname, 'captcha.png');  // change if necessary

// Obtain string base64 from image
const base64Image = encodeImage(imagePath);

// Headers for request
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
};

// Payload for request
const payload = {
  model: "gpt-4o-mini",  // Adjust the model if necessary
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
            url: `data:image/png;base64,${base64Image}`
          }
        }
      ]
    }
  ],
  max_tokens: 300
};

// Function to send request to OpenAI API
async function getGPT4VisionResponse() {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
    console.log(response.data.choices[0]);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

// Run function
getGPT4VisionResponse();
