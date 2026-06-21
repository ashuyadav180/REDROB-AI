const Task = require('../models/Task');
const Worker = require('../models/Worker');
const Correction = require('../models/Correction');
const { transcribeAudio, synthesizeText } = require('../services/sarvam');
const { preClassifyTask, extractIntentAndFields } = require('../services/claude');
const fs = require('fs');
const path = require('path');

async function runVoicePipeline({ audioFilePath, workerId, io }) {
  let task;
  const startTime = Date.now();
  const audioUrl = `/uploads/${path.basename(audioFilePath)}`; 

  try {
    const worker = await Worker.findById(workerId);
    if (!worker) throw new Error('Worker not found.');

    task = new Task({
      workerId: worker._id,
      workerName: worker.name,
      audioUrl: audioUrl,
      status: 'Processing',
      pipelineStage: 0
    });
    await task.save();

    io.emit('task:update', task.toFrontendShape());
    io.emit('pipeline:stage', { taskId: task._id, stage: 0 });

    let targetLangCode = worker.langCode;
    const langMap = { 'hi': 'hi-IN', 'ta': 'ta-IN', 'mr': 'mr-IN', 'te': 'te-IN' };
    const sarvamLang = langMap[targetLangCode] || 'unknown';

    const sttResult = await transcribeAudio(audioFilePath, sarvamLang);
    
    task.transcript = sttResult.transcript;
    task.detectedLangCode = sttResult.language_code;
    await task.save();

    io.emit('task:update', task.toFrontendShape());

    // Stage 1: Intent Agent
    task.pipelineStage = 1;
    await task.save();
    io.emit('pipeline:stage', { taskId: task._id, stage: 1 });

    // Feature 3: Fetch recent corrections for few-shot learning
    const recentCorrections = await Correction.find({ langCode: targetLangCode })
      .sort({ createdAt: -1 })
      .limit(3);

    // Feature 2: Pre-classify for Tiered Routing
    const classification = await preClassifyTask(task.transcript);
    task.modelTier = classification.suggestedTier;

    const modelToUse = task.modelTier === 'simple' ? 'claude-3-haiku-20240307' : 'claude-sonnet-4-6';
    
    // Extract using the routed model and few-shot corrections
    const extraction = await extractIntentAndFields(task.transcript, recentCorrections, modelToUse);
    
    task.intent = extraction.intent;
    task.extractedFields = {
      taskType: extraction.taskType,
      customerName: extraction.customerName,
      reason: extraction.reason,
      summary: extraction.summary
    };
    task.isEscalation = extraction.isEscalation;
    task.confidence = extraction.confidence;
    task.needsManualReview = extraction.needsManualReview;
    
    // Feature 1: Store code switch spans and boundary confidence
    task.codeSwitchSpans = extraction.codeSwitchSpans || [];
    task.boundaryConfidence = extraction.boundaryConfidence || extraction.confidence;

    await task.save();
    io.emit('task:update', task.toFrontendShape());

    // Stage 2: Task Router
    task.pipelineStage = 2;
    task.status = 'Routed';
    await task.save();
    io.emit('pipeline:stage', { taskId: task._id, stage: 2 });
    io.emit('task:update', task.toFrontendShape());

    if (task.isEscalation) {
      io.emit('escalation:new', task.toFrontendShape());
    }
    if (task.intent === 'UNKNOWN' || task.needsManualReview || task.boundaryConfidence < 0.6) {
      io.emit('alert:unrecognized_intent', task.toFrontendShape());
    }

    // Stage 3: Action Agent
    task.pipelineStage = 3;
    await task.save();
    io.emit('pipeline:stage', { taskId: task._id, stage: 3 });

    // Stage 4: TTS Response
    task.pipelineStage = 4;
    await task.save();
    io.emit('pipeline:stage', { taskId: task._id, stage: 4 });

    const responseMsg = `Task received. Intent identified as ${task.intent}. Form filed successfully.`;
    
    try {
      const base64Audio = await synthesizeText(responseMsg, sarvamLang === 'unknown' ? 'hi-IN' : sarvamLang);
      const ttsFilename = `tts_${Date.now()}.wav`;
      const ttsPath = path.join(path.dirname(audioFilePath), ttsFilename);
      fs.writeFileSync(ttsPath, Buffer.from(base64Audio, 'base64'));
      task.ttsAudioUrl = `/uploads/${ttsFilename}`;
    } catch (ttsError) {
      console.warn('TTS failed', ttsError.message);
    }

    task.status = 'Completed';
    task.processingTimeMs = Date.now() - startTime;
    await task.save();

    io.emit('pipeline:stage', { taskId: task._id, stage: 5 }); 
    io.emit('task:update', task.toFrontendShape());
    io.emit('worker:confirmation', { 
        taskId: task._id, 
        message: responseMsg,
        audioUrl: task.ttsAudioUrl
    });

  } catch (error) {
    console.error('Pipeline Error:', error);
    if (task) {
      task.needsManualReview = true;
      task.processingTimeMs = Date.now() - startTime;
      await task.save();
      io.emit('pipeline:error', { taskId: task._id, error: error.message });
      io.emit('task:update', task.toFrontendShape());
    }
  }
}

module.exports = {
  runVoicePipeline
};
