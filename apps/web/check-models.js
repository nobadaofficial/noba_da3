const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyBYoe_Jd0kF2xmpvpTpBM0eBZbdpPVDfYM');

async function listModels() {
  try {
    console.log('Fetching available models...\n');

    // List all models
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBYoe_Jd0kF2xmpvpTpBM0eBZbdpPVDfYM');
    const data = await response.json();

    if (data.models) {
      console.log('Available models:');
      data.models.forEach(model => {
        console.log(`- ${model.name}`);
        if (model.supportedGenerationMethods) {
          console.log(`  Supports: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
    } else {
      console.log('No models found or error:', data);
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();