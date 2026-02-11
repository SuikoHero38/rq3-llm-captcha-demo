const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const genAI = new GoogleGenerativeAI("GOOGLE_API_KEY");

async function run() {
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
const result = await model.generateContent([
"Please solve the captcha in the image",
{inlineData: {data: Buffer.from(fs.readFileSync('captcha.png')).toString("base64"),
mimeType: 'image/png'}}]
);
console.log(result.response.text());
}
run();