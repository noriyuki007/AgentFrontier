
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = 'AIzaSyBw1VFoLcsjun9TRLADi6Hcoi_8wlhFpks';
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    console.log('Testing Gemini API...');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const result = await model.generateContent('Hi, just say "OK"');
        console.log('Response:', result.response.text());
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
