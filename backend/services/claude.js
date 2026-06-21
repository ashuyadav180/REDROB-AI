const { Anthropic } = require('@anthropic-ai/sdk');
const dotenv = require('dotenv');

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const EXTRACT_TOOL_SCHEMA = {
  name: "extract_task_details",
  description: "Extracts intent, task type, customer name, reason, summary, and analyzes code-switching boundaries.",
  input_schema: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        enum: ["COMPLAINT", "DELIVERY", "REPORT", "DELIVERY_EXCEPTION", "UNKNOWN"],
        description: "The primary intent of the transcript."
      },
      taskType: {
        type: "string",
        description: "A short, readable description of the task."
      },
      customerName: {
        type: "string",
        description: "The name of the customer mentioned, if any."
      },
      reason: {
        type: "string",
        description: "The reason or issue described."
      },
      summary: {
        type: "string",
        description: "A 1-2 sentence summary of the transcript."
      },
      isEscalation: {
        type: "boolean",
        description: "True if the issue is severe, urgent, or needs immediate manager assistance."
      },
      confidence: {
        type: "number",
        description: "Confidence score of the extraction from 0.0 to 1.0."
      },
      needsManualReview: {
        type: "boolean",
        description: "True if the transcript is ambiguous, incomplete, or intent is UNKNOWN."
      },
      codeSwitchSpans: {
        type: "array",
        description: "List of spans where the speaker switched from the primary language to English or another language mid-sentence.",
        items: {
          type: "object",
          properties: {
            text: { type: "string", description: "The exact text span that was switched." },
            startCharIndex: { type: "number", description: "Start character index of the switch in the transcript." },
            endCharIndex: { type: "number", description: "End character index of the switch." },
            switchedToLanguage: { type: "string", description: "Language the speaker switched to (e.g., 'English')." }
          },
          required: ["text", "startCharIndex", "endCharIndex", "switchedToLanguage"]
        }
      },
      boundaryConfidence: {
        type: "number",
        description: "Confidence score (0.0 to 1.0) specifically around code-switch boundaries. Lower this if code-switching density is high or confusing."
      }
    },
    required: ["intent", "taskType", "summary", "isEscalation", "confidence", "needsManualReview", "codeSwitchSpans", "boundaryConfidence"]
  }
};

const CLASSIFY_COMPLEXITY_SCHEMA = {
  name: "classify_complexity",
  description: "Determines the complexity of a transcript to suggest a model routing tier.",
  input_schema: {
    type: "object",
    properties: {
      complexityScore: { type: "number", description: "Score from 0.0 to 1.0 representing transcript complexity." },
      suggestedTier: { type: "string", enum: ["simple", "standard", "complex"], description: "Simple for short/clear tasks. Complex for emotionally charged or multi-entity content." }
    },
    required: ["complexityScore", "suggestedTier"]
  }
};

/**
 * Pre-classifies the task complexity using Haiku.
 * @param {string} transcript 
 * @returns {Promise<Object>} { complexityScore, suggestedTier }
 */
async function preClassifyTask(transcript) {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not defined.');

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 512,
      system: "Analyze the transcript complexity. Simple = short, single intent, no strong emotion. Complex = long, multiple entities, complaints, escalations, or heavily code-switched.",
      messages: [{ role: "user", content: `Transcript: "${transcript}"` }],
      tools: [CLASSIFY_COMPLEXITY_SCHEMA],
      tool_choice: { type: "tool", name: "classify_complexity" }
    });

    const toolUse = response.content.find(block => block.type === 'tool_use');
    if (toolUse && toolUse.name === 'classify_complexity') {
      return toolUse.input;
    } else {
      return { complexityScore: 0.5, suggestedTier: "standard" }; // Fallback
    }
  } catch (error) {
    console.error('Haiku Complexity Error:', error);
    return { complexityScore: 0.5, suggestedTier: "standard" }; // Fallback on error
  }
}

/**
 * Uses Claude Sonnet (or Haiku if forced) to extract structured details, applying few-shot corrections if provided.
 * @param {string} transcript 
 * @param {Array} pastCorrections - Array of Correction objects
 * @param {string} model - "claude-sonnet-4-6" or "claude-3-haiku-20240307"
 * @returns {Promise<Object>} Extracted fields including codeSwitchSpans.
 */
async function extractIntentAndFields(transcript, pastCorrections = [], model = "claude-sonnet-4-6") {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not defined.');

  let systemPrompt = "You are an AI assistant analyzing voice transcripts from delivery and field workers in India. Extract the relevant task details, intent, and determine if an escalation is needed. Default to UNKNOWN intent if unclear. Pay close attention to intra-sentential code-switching (Hinglish, Tanglish, etc.) and flag the exact spans where the language switches.";

  if (pastCorrections.length > 0) {
    systemPrompt += "\n\nNote: Pay attention to these past human corrections for this language/worker pattern:\n";
    pastCorrections.forEach(c => {
      systemPrompt += `- A transcript was originally classified as [${c.originalIntent}], but should be [${c.correctedIntent}]. Avoid repeating this mistake.\n`;
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: model, 
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: "user", content: `Please analyze the following transcript and extract the details using the extract_task_details tool:\n\nTranscript: "${transcript}"` }
      ],
      tools: [EXTRACT_TOOL_SCHEMA],
      tool_choice: { type: "tool", name: "extract_task_details" }
    });

    const toolUse = response.content.find(block => block.type === 'tool_use');
    
    if (toolUse && toolUse.name === 'extract_task_details') {
      return toolUse.input;
    } else {
      throw new Error('Claude did not return the expected tool call.');
    }
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to extract intent and fields.');
  }
}

module.exports = {
  preClassifyTask,
  extractIntentAndFields
};
