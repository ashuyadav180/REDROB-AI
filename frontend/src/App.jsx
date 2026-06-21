import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Activity, CheckCircle, AlertTriangle, Users, Settings, 
  FileText, BarChart2, MessageSquare, LayoutDashboard, Clock, 
  Server, Database, Smartphone, Phone, ArrowRight, BrainCircuit, Zap
} from 'lucide-react';
import { io } from 'socket.io-client';
import { get, set } from 'idb-keyval';

export default function App() {
  const [activeTab, setActiveTab] = useState('manager');
  const [workers, setWorkers] = useState([
    { id: '6675e89a2a9e3d0012345678', name: 'Raju', lang: '🇮🇳 Hindi', status: 'active', lastActive: 'Just now' }
  ]);
  const [tasks, setTasks] = useState([]);
  const [activeNode, setActiveNode] = useState(0);
  
  // Real-time State
  const [socket, setSocket] = useState(null);
  const [totalCorrections, setTotalCorrections] = useState(0);

  // Feature 4: Offline State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('task:update', (updatedTask) => {
      setTasks(current => {
        const idx = current.findIndex(t => t.id === updatedTask.id);
        if (idx >= 0) {
          const newTasks = [...current];
          newTasks[idx] = updatedTask;
          return newTasks;
        }
        return [updatedTask, ...current];
      });
    });

    newSocket.on('pipeline:stage', ({ taskId, stage }) => {
      setTasks(current => {
        if (current.length > 0 && current[0].id === taskId) {
          setActiveNode(stage);
        }
        return current;
      });
    });

    newSocket.on('metrics:update', ({ totalCorrections }) => {
      setTotalCorrections(totalCorrections);
    });

    fetch('http://localhost:5000/api/tasks')
      .then(r => r.json())
      .then(data => setTasks(data))
      .catch(console.error);

    fetch('http://localhost:5000/api/tasks/metrics/summary')
      .then(r => r.json())
      .then(data => setTotalCorrections(data.totalCorrections || 0))
      .catch(console.error);

    fetch('http://localhost:5000/api/workers')
      .then(r => r.json())
      .then(data => { if(data.length > 0) setWorkers(data); })
      .catch(console.error);

    const handleOnline = () => {
      setIsOnline(true);
      processSyncQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    get('syncQueue').then(q => setSyncQueue(q || []));

    return () => {
      newSocket.disconnect();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const processSyncQueue = async () => {
    const queue = await get('syncQueue') || [];
    if (queue.length === 0) return;

    const remainingQueue = [];
    for (const item of queue) {
      try {
        const formData = new FormData();
        formData.append('audio', item.blob, 'audio.webm');
        formData.append('workerId', workers[0].id); // Defaulting to first worker for demo

        await fetch('http://localhost:5000/api/voice/process', {
          method: 'POST',
          body: formData
        });
      } catch (e) {
        remainingQueue.push(item);
      }
    }
    await set('syncQueue', remainingQueue);
    setSyncQueue(remainingQueue);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (isOnline) {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'audio.webm');
          formData.append('workerId', workers[0].id); // Defaulting to first worker for demo
          
          fetch('http://localhost:5000/api/voice/process', {
            method: 'POST',
            body: formData
          }).catch(console.error);
        } else {
          // Feature 4: Offline deferred sync
          const newItem = { id: Date.now(), blob: audioBlob, timestamp: new Date().toISOString() };
          const newQueue = [...syncQueue, newItem];
          await set('syncQueue', newQueue);
          setSyncQueue(newQueue);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Feature 3: Manual Label Feedback Loop
  const handleManualLabel = async (taskId) => {
    const correctedIntent = prompt('Enter corrected intent (e.g., DELIVERY, COMPLAINT, REPORT):');
    if (!correctedIntent) return;

    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}/correct`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correctedIntent })
      });
      // Metric update will come via Socket.IO
    } catch (e) {
      console.error('Correction failed:', e);
    }
  };

  // Feature 1: Code-Switch Spans UI
  const renderTranscript = (task) => {
    if (!task.codeSwitchSpans || task.codeSwitchSpans.length === 0) {
      return <p className="text-slate-300 text-sm font-medium mb-4 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-700/30">"{task.transcript}"</p>;
    }

    let lastIndex = 0;
    const elements = [];
    const sortedSpans = [...task.codeSwitchSpans].sort((a, b) => a.startCharIndex - b.startCharIndex);

    sortedSpans.forEach((span, i) => {
      if (span.startCharIndex > lastIndex) {
        elements.push(<span key={`text-${i}`}>{task.transcript.substring(lastIndex, span.startCharIndex)}</span>);
      }
      elements.push(
        <span key={`span-${i}`} className="relative group underline decoration-amber-500 decoration-2 underline-offset-4 cursor-help bg-amber-500/10 rounded px-0.5 mx-0.5">
          {task.transcript.substring(span.startCharIndex, span.endCharIndex)}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-800 text-xs text-amber-300 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-amber-500/30">
            Switched to: {span.switchedToLanguage}
          </span>
        </span>
      );
      lastIndex = span.endCharIndex;
    });

    if (lastIndex < task.transcript.length) {
      elements.push(<span key="end">{task.transcript.substring(lastIndex)}</span>);
    }

    return (
      <p className="text-slate-300 text-sm font-medium mb-4 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-700/30">
        "{elements}"
        {task.boundaryConfidence < 0.6 && (
          <span className="block mt-2 text-[10px] text-amber-400 font-bold tracking-wider flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" /> LOW BOUNDARY CONFIDENCE
          </span>
        )}
      </p>
    );
  };

  const renderManagerView = () => (
    <div className="flex flex-col h-full bg-transparent text-slate-200 font-sans relative">
      <header className="flex justify-between items-center px-6 py-4 glass-panel border-b border-slate-700/50 z-20">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-[#6366F1] to-[#A855F7] rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Mic className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-gradient tracking-wide">VoiceOps AI</h1>
        </div>
        <div className="flex items-center space-x-4">
          {!isOnline && (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold border border-amber-500/30">
              <Activity className="w-3 h-3" />
              <span>Offline Mode</span>
            </div>
          )}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366F1] to-[#A855F7] text-white flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(99,102,241,0.4)] border border-white/20">
            M
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 z-0"></div>
        
        <aside className="w-64 glass-panel border-r border-slate-700/50 p-4 z-10 flex flex-col">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-heading">Active Field Agents</h2>
          <div className="space-y-3">
            {workers.map(worker => (
              <div key={worker.id} className="flex items-center p-3 rounded-xl glass-card cursor-pointer group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-lg shadow-inner border border-slate-600/50 group-hover:border-[#6366F1]/50 transition-colors">
                    {worker.name.charAt(0)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#1E293B] ${
                    worker.status === 'active' ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 
                    worker.status === 'idle' ? 'bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-slate-500'
                  }`}></div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">{worker.name}</span>
                    <span className="text-xs text-slate-400">{worker.lang}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{worker.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex p-6 space-x-6 z-10 overflow-y-auto">
          <section className="flex flex-col w-[40%] space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2 font-heading">
              <div className="p-1.5 rounded-md bg-[#6366F1]/20 border border-[#6366F1]/30">
                <Activity className="w-4 h-4 text-[#818CF8]" />
              </div>
              <span>Live Task Feed</span>
            </h2>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={task.id} style={{animationDelay: `${index * 50}ms`}} className={`p-4 rounded-xl border transition-all duration-300 animate-slide-in-right ${
                  task.status === 'Processing' ? 'glass-card border-[#6366F1]/50 shadow-[0_0_20px_rgba(99,102,241,0.2)] transform scale-[1.02]' : 
                  'glass-card border-slate-700/50 opacity-90'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600/50">
                        {task.worker.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-slate-200 leading-none">{task.worker}</span>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                          {task.time}
                          {/* Feature 4: Offline sync recorded time display */}
                          {task.recordedAt && new Date(task.recordedAt).getTime() < new Date(task.createdAt).getTime() - 60000 && (
                            <span className="ml-2 text-amber-400/80 italic">(Delayed Sync)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 items-center">
                      {/* Feature 2: Tier Badge */}
                      {task.modelTier === 'simple' && (
                        <div className="px-1.5 py-0.5 rounded flex items-center bg-teal-500/10 text-teal-400 text-[9px] font-bold border border-teal-500/20">
                          <Zap className="w-2.5 h-2.5 mr-0.5" /> FAST-TIER
                        </div>
                      )}
                      {['standard', 'complex'].includes(task.modelTier) && (
                        <div className="px-1.5 py-0.5 rounded flex items-center bg-purple-500/10 text-purple-400 text-[9px] font-bold border border-purple-500/20">
                          <BrainCircuit className="w-2.5 h-2.5 mr-0.5" /> DEEP-TIER
                        </div>
                      )}
                      
                      <div className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border shadow-sm ${
                        ['COMPLAINT', 'DELIVERY_EXCEPTION'].includes(task.intent) ? 'bg-[#EF4444]/10 text-[#F87171] border-[#EF4444]/30' :
                        task.intent === 'DELIVERY' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        'bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30'
                      }`}>
                        {task.intent}
                      </div>
                    </div>
                  </div>
                  
                  {renderTranscript(task)}
                  
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
                      task.status === 'Processing' ? 'bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40' :
                      task.status === 'Routed' ? 'bg-[#F59E0B]/10 text-[#FBBF24] border border-[#F59E0B]/30' :
                      'bg-slate-800/60 text-slate-400 border border-slate-700/50'
                    }`}>
                      {task.status === 'Processing' && <div className="w-1.5 h-1.5 rounded-full bg-[#818CF8] animate-ping mr-1"></div>}
                      {task.status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      <span>{task.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col w-[35%] space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2 font-heading">
              <div className="p-1.5 rounded-md bg-[#8B5CF6]/20 border border-[#8B5CF6]/30">
                <Server className="w-4 h-4 text-[#A855F7]" />
              </div>
              <span>Pipeline Visualizer</span>
            </h2>
            <div className="flex-1 glass-card border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-[80px] -z-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A855F7]/10 rounded-full blur-[80px] -z-10"></div>
              
              <div className="flex flex-col items-center space-y-6 w-full relative z-10">
                {['STT Agent', 'Intent Agent', 'Task Router', 'Action Agent', 'TTS Response'].map((node, i) => (
                  <React.Fragment key={node}>
                    <div className={`w-full max-w-[240px] p-3.5 rounded-xl border flex items-center justify-between transition-all duration-500 ${
                      activeNode === i ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] border-[#8B5CF6] shadow-[0_0_25px_rgba(139,92,246,0.5)] text-white scale-[1.05]' :
                      activeNode > i ? 'glass-panel border-[#10B981]/40 text-slate-200' :
                      'glass-panel opacity-60 border-slate-700/50 text-slate-400'
                    }`}>
                      <span className="text-sm font-semibold tracking-wide">{node}</span>
                      {activeNode > i && <CheckCircle className="w-4 h-4 text-[#34D399]" />}
                      {activeNode === i && <Activity className="w-4 h-4 text-white/90 animate-spin" />}
                    </div>
                    {i < 4 && (
                      <div className="h-6 w-0.5 bg-slate-700/50 relative">
                        <div className={`absolute top-0 left-0 w-full bg-gradient-to-b from-[#6366F1] to-[#8B5CF6] transition-all duration-700 ${
                          activeNode > i ? 'h-full shadow-[0_0_10px_rgba(139,92,246,0.6)]' : activeNode === i ? 'h-1/2 animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.4)]' : 'h-0'
                        }`}></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col w-[25%] space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2 font-heading">
              <div className="p-1.5 rounded-md bg-[#10B981]/20 border border-[#10B981]/30">
                <BarChart2 className="w-4 h-4 text-[#34D399]" />
              </div>
              <span>Metrics & Feedback</span>
            </h2>
            
            {/* Feature 3: Corrections Learning Counter */}
            <div className="glass-card rounded-xl p-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)] mb-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 group-hover:opacity-100 transition-opacity opacity-50"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-[10px] font-bold tracking-wider mb-1 uppercase">Continuous Learning</div>
                  <div className="text-xl font-bold text-white font-heading">{totalCorrections} <span className="text-sm text-indigo-300">corrections injected</span></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 mt-4 pt-2 font-heading">
              <div className="p-1 rounded-md bg-[#EF4444]/20">
                <AlertTriangle className="w-4 h-4 text-[#F87171]" />
              </div>
              <span>Action Required</span>
            </h2>
            
            <div className="space-y-3">
              {tasks.filter(t => t.needsManualReview || t.intent === 'UNKNOWN').slice(0, 3).map(task => (
                <div key={task.id} className="glass-panel border-l-4 border-l-[#F59E0B] rounded-xl p-4 relative overflow-hidden group hover:bg-[#F59E0B]/5 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-[#FBBF24]">UNRECOGNIZED INTENT</span>
                    <span className="text-xs text-slate-400">{task.time}</span>
                  </div>
                  <p className="text-slate-300 text-sm mb-3 leading-relaxed truncate">"{task.transcript}"</p>
                  <button onClick={() => handleManualLabel(task.id)} className="w-full py-2 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#FBBF24] text-xs font-semibold rounded-lg transition-colors border border-[#F59E0B]/30 shadow-sm">
                    Manual Label
                  </button>
                </div>
              ))}
              {tasks.filter(t => t.needsManualReview).length === 0 && (
                <div className="text-xs text-slate-500 text-center py-4">No pending reviews.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );

  const renderWorkerView = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#0B1121] via-[#0F172A] to-[#1E1B4B] items-center justify-center py-8 overflow-y-auto relative">
      <div className="w-[375px] h-[812px] min-h-[812px] bg-[#EFEAE2] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[8px] border-slate-800 overflow-hidden flex flex-col relative font-sans shrink-0 z-10">
        
        {/* Connection Status Header */}
        {!isOnline && (
          <div className="bg-red-500 text-white text-[10px] font-bold text-center py-0.5 animate-pulse">
            NO INTERNET CONNECTION
          </div>
        )}

        <div className="bg-[#008069] text-white px-4 py-3 flex items-center shadow-md z-10">
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">🤖</div>
            <div className="ml-3">
              <h2 className="font-semibold text-base leading-tight">VoiceOps AI</h2>
              <p className="text-xs text-white/80">Always active</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center p-4 overflow-y-auto flex flex-col space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-[#E1F3FB] text-[#4A5E6B] text-xs px-3 py-1.5 rounded-lg shadow-sm">TODAY</div>
          </div>

          {/* Sync Queue Visualization */}
          {syncQueue.map((item) => (
             <div key={item.id} className="flex justify-end opacity-70">
                <div className="bg-[#E7FFDB] rounded-lg rounded-tr-none p-2 shadow-sm max-w-[80%] border-2 border-dashed border-slate-400">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-600 font-semibold italic">⏳ Saved locally</span>
                  </div>
                </div>
             </div>
          ))}

          {isRecording && (
            <div className="flex justify-end">
              <div className="bg-[#E7FFDB] rounded-lg rounded-tr-none p-3 shadow-sm max-w-[80%] animate-pulse">
                Recording...
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#F0F2F5] px-2 py-2 flex flex-col z-10">
          <div className="flex items-center space-x-2 px-2">
            <div className="flex-1 bg-white rounded-full h-12 flex items-center px-4 shadow-sm border border-slate-200">
              <span className="text-slate-400 text-sm">Message</span>
            </div>
            <button 
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transform transition active:scale-95 group relative overflow-hidden ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#00A884]'}`}
            >
              <Mic className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="text-center mt-2 mb-1">
            <span className="text-[10px] font-medium text-slate-500">🎙️ Hold to speak</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0B1121] via-[#0F172A] to-[#1E1B4B] flex flex-col overflow-hidden font-sans relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
      
      <div className="glass-panel border-b border-slate-700/50 p-4 flex justify-center space-x-4 z-50 shadow-lg">
        <button 
          onClick={() => setActiveTab('manager')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'manager' ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105' : 'glass-button text-slate-400 hover:text-white hover:bg-slate-800/80'}`}
        >
          Manager Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('worker')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'worker' ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105' : 'glass-button text-slate-400 hover:text-white hover:bg-slate-800/80'}`}
        >
          Worker Interface
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'manager' && renderManagerView()}
        {activeTab === 'worker' && renderWorkerView()}
      </div>
    </div>
  );
}
