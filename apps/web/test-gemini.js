const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyBYoe_Jd0kF2xmpvpTpBM0eBZbdpPVDfYM');

async function testGemini() {
  try {
    console.log('Testing Gemini API...');

    // Try different models
    const models = [
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.0-flash',
      'gemini-2.5-flash-lite'
    ];

    for (const modelName of models) {
      console.log(`\nTrying model: ${modelName}`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello in Korean');
        const response = await result.response;
        console.log(`✓ ${modelName} works! Response: ${response.text()}`);
        return; // Exit if successful
      } catch (error) {
        console.log(`✗ ${modelName} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error('General error:', error);
  }
}

testGemini();