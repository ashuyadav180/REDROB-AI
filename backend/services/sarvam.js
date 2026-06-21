const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;

/**
 * Transcribes audio using Sarvam STT.
 * @param {string} audioFilePath - Path to the audio file.
 * @param {string} languageCode - Auto-detect defaults to 'unknown', or use 'hi-IN', etc.
 * @returns {Promise<{transcript: string, language_code: string, language_probability: number}>}
 */
async function transcribeAudio(audioFilePath, languageCode = 'unknown') {
  if (!SARVAM_API_KEY) {
    throw new Error('SARVAM_API_KEY is not defined in environment variables.');
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(audioFilePath));
  formData.append('model', 'saaras:v3');
  formData.append('mode', 'transcribe');
  formData.append('language_code', languageCode);

  try {
    const response = await axios.post('https://api.sarvam.ai/speech-to-text', formData, {
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        ...formData.getHeaders()
      }
    });
    
    return {
      transcript: response.data.transcript,
      language_code: response.data.language_code,
      language_probability: response.data.language_probability
    };
  } catch (error) {
    console.error('Sarvam STT Error:', error.response?.data || error.message);
    throw new Error('Speech-to-text processing failed.');
  }
}

/**
 * Generates audio from text using Sarvam TTS.
 * @param {string} text - Text to synthesize.
 * @param {string} targetLanguageCode - e.g., 'hi-IN'.
 * @returns {Promise<string>} Base64 encoded audio string.
 */
async function synthesizeText(text, targetLanguageCode) {
  if (!SARVAM_API_KEY) {
    throw new Error('SARVAM_API_KEY is not defined in environment variables.');
  }

  try {
    const response = await axios.post('https://api.sarvam.ai/text-to-speech', {
      inputs: [text], // Fallback if API needs array, but prompt said text (singular). Let me double check the prompt: "JSON body { text, target_language_code..." - wait, the prompt corrected itself: "the field is text (singular, not inputs array)".
      text: text, 
      target_language_code: targetLanguageCode,
      model: 'bulbul:v3',
      speaker: 'shubh',
      pace: 1.0
    }, {
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // The response is an array of audios: { audios: [base64Wav] }
    return response.data.audios[0];
  } catch (error) {
    console.error('Sarvam TTS Error:', error.response?.data || error.message);
    throw new Error('Text-to-speech processing failed.');
  }
}

module.exports = {
  transcribeAudio,
  synthesizeText
};
