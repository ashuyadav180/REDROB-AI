import React, { useState, useEffect } from 'react';
import { 
  Mic, Activity, CheckCircle, AlertTriangle, Users, Settings, 
  FileText, BarChart2, MessageSquare, LayoutDashboard, Clock, 
  Server, Database, Smartphone, Phone, ArrowRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('manager');
  
  const workers = [
    { id: 1, name: 'Raju', lang: '🇮🇳 Hindi', status: 'active', lastActive: 'Just now' },
    { id: 2, name: 'Priya', lang: '🇮🇳 Tamil', status: 'idle', lastActive: '5m ago' },
    { id: 3, name: 'Mohan', lang: '🇮🇳 Marathi', status: 'offline', lastActive: '1h ago' }
  ];

  const initialTasks = [
    { id: 101, worker: 'Raju', transcript: 'मुझे आज की डिलीवरी रिपोर्ट फाइल करनी है...', intent: 'REPORT', status: 'Processing', time: '10:42 AM' },
    { id: 102, worker: 'Priya', transcript: 'வாடிக்கையாளர் பார்சலை நிராகரித்தார்...', intent: 'COMPLAINT', status: 'Routed', time: '10:40 AM' },
    { id: 103, worker: 'Mohan', transcript: 'नवीन स्टॉक आला आहे...', intent: 'DELIVERY', status: 'Completed', time: '10:35 AM' },
    { id: 104, worker: 'Raju', transcript: 'कस्टमर ने रिटर्न रिक्वेस्ट डाली है...', intent: 'COMPLAINT', status: 'Completed', time: '10:20 AM' },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(currentTasks => {
        return currentTasks.map(task => {
          if (task.id === 101) {
            const nextStatus = task.status === 'Processing' ? 'Routed' : 
                               task.status === 'Routed' ? 'Completed' : 'Processing';
            return { ...task, status: nextStatus };
          }
          return task;
        });
      });
      
      setActiveNode(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderManagerView = () => (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-200 font-sans">
      <header className="flex justify-between items-center px-6 py-4 bg-[#0F172A] border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#6366F1]/20 rounded-lg">
            <Mic className="text-[#6366F1] w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">VoiceOps AI</h1>
        </div>
        <nav className="flex space-x-6 text-sm font-medium text-slate-400">
          <button className="text-[#6366F1] flex items-center space-x-2"><LayoutDashboard className="w-4 h-4"/><span>Dashboard</span></button>
          <button className="hover:text-slate-200 flex items-center space-x-2"><Users className="w-4 h-4"/><span>Agents</span></button>
          <button className="hover:text-slate-200 flex items-center space-x-2"><FileText className="w-4 h-4"/><span>Reports</span></button>
          <button className="hover:text-slate-200 flex items-center space-x-2"><Settings className="w-4 h-4"/><span>Settings</span></button>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs font-semibold border border-[#10B981]/20">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>12 tasks processed today</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-sm">
            M
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 z-0"></div>
        
        <aside className="w-64 bg-[#1E293B] border-r border-slate-700 p-4 z-10 flex flex-col">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Active Field Agents</h2>
          <div className="space-y-3">
            {workers.map(worker => (
              <div key={worker.id} className="flex items-center p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg shadow-inner">
                    {worker.name.charAt(0)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1E293B] ${
                    worker.status === 'active' ? 'bg-[#10B981]' : 
                    worker.status === 'idle' ? 'bg-[#F59E0B]' : 'bg-slate-500'
                  }`}></div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200 text-sm">{worker.name}</span>
                    <span className="text-xs">{worker.lang}</span>
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
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-[#6366F1]" />
              <span>Live Task Feed</span>
            </h2>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className={`p-4 rounded-xl border ${
                  task.status === 'Processing' ? 'bg-[#6366F1]/10 border-[#6366F1]/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 
                  'bg-[#1E293B] border-slate-700'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        {task.worker.charAt(0)}
                      </div>
                      <span className="font-medium text-sm text-slate-200">{task.worker}</span>
                      <span className="text-xs text-slate-500">• {task.time}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${
                      task.intent === 'COMPLAINT' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                      task.intent === 'DELIVERY' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                    }`}>
                      {task.intent}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm font-medium mb-3 leading-relaxed">"{task.transcript}"</p>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                      task.status === 'Processing' ? 'bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30' :
                      task.status === 'Routed' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {task.status === 'Processing' && <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-ping mr-1"></div>}
                      {task.status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      <span>{task.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col w-[35%] space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Server className="w-5 h-5 text-[#6366F1]" />
              <span>Pipeline: Task #{tasks[0].id}</span>
            </h2>
            <div className="flex-1 bg-[#1E293B] border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center relative">
              <div className="flex flex-col items-center space-y-6 w-full">
                {['STT Agent', 'Intent Agent', 'Task Router', 'Action Agent', 'TTS Response'].map((node, i) => (
                  <React.Fragment key={node}>
                    <div className={`w-full max-w-[240px] p-3 rounded-lg border flex items-center justify-between transition-all duration-300 ${
                      activeNode === i ? 'bg-[#6366F1] border-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white scale-105' :
                      activeNode > i ? 'bg-slate-800 border-[#10B981]/30 text-slate-300' :
                      'bg-slate-800/50 border-slate-700 text-slate-500'
                    }`}>
                      <span className="text-sm font-semibold">{node}</span>
                      {activeNode > i && <CheckCircle className="w-4 h-4 text-[#10B981]" />}
                      {activeNode === i && <Activity className="w-4 h-4 text-white/70 animate-spin" />}
                    </div>
                    {i < 4 && (
                      <div className="h-6 w-0.5 bg-slate-700 relative">
                        <div className={`absolute top-0 left-0 w-full bg-[#6366F1] transition-all duration-500 ${
                          activeNode > i ? 'h-full' : activeNode === i ? 'h-1/2 animate-pulse' : 'h-0'
                        }`}></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col w-[25%] space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-[#6366F1]" />
              <span>Metrics</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-4">
                <div className="text-slate-400 text-xs font-medium mb-1">Tasks Today</div>
                <div className="text-2xl font-bold text-white">1,284</div>
                <div className="text-[#10B981] text-xs mt-1">↑ 12% vs yday</div>
              </div>
              <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-4">
                <div className="text-slate-400 text-xs font-medium mb-1">Avg Res Time</div>
                <div className="text-2xl font-bold text-white">4.2s</div>
                <div className="text-[#10B981] text-xs mt-1">↓ 0.3s vs yday</div>
              </div>
            </div>

            <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-4 mb-2">
              <div className="text-slate-400 text-xs font-medium mb-2">Language Distribution</div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <span className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <span className="bg-[#6366F1] w-[45%] h-full"></span>
                  <span className="bg-blue-500 w-[30%] h-full"></span>
                  <span className="bg-[#10B981] w-[25%] h-full"></span>
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                <span>Hindi (45%)</span>
                <span>Tamil (30%)</span>
                <span>Marathi (25%)</span>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 mt-4 pt-2">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              <span>Action Required</span>
            </h2>
            
            <div className="space-y-3">
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#EF4444]"></div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-[#EF4444]">ESCALATION</span>
                  <span className="text-xs text-slate-500">2m ago</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">Mohan reported severe vehicle breakdown on Route 4. Needs immediate assistance.</p>
                <button className="w-full py-1.5 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] text-xs font-semibold rounded transition-colors border border-[#EF4444]/30">
                  Review Issue
                </button>
              </div>
              
              <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#F59E0B]"></div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-[#F59E0B]">UNRECOGNIZED INTENT</span>
                  <span className="text-xs text-slate-500">14m ago</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">Priya sent audio that could not be confidently mapped to a task schema.</p>
                <button className="w-full py-1.5 bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-[#F59E0B] text-xs font-semibold rounded transition-colors border border-[#F59E0B]/30">
                  Manual Label
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );

  const renderWorkerView = () => (
    <div className="flex flex-col h-full bg-slate-900 items-center justify-center py-8 overflow-y-auto">
      <div className="w-[375px] h-[812px] min-h-[812px] bg-[#EFEAE2] rounded-[40px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col relative font-sans shrink-0">
        <div className="bg-[#008069] text-white px-4 py-3 flex items-center shadow-md z-10">
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
              🤖
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-base leading-tight">VoiceOps AI</h2>
              <p className="text-xs text-white/80">Always active</p>
            </div>
          </div>
          <Phone className="w-5 h-5 mr-4" />
          <Settings className="w-5 h-5" />
        </div>

        <div className="flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center p-4 overflow-y-auto flex flex-col space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-[#E1F3FB] text-[#4A5E6B] text-xs px-3 py-1.5 rounded-lg shadow-sm">
              TODAY
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-[#E7FFDB] rounded-lg rounded-tr-none p-2 shadow-sm max-w-[80%]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgNTBRMTAgMjAgMjAgNTBUMzAgNTBUNDAgNTBUNTAgNTBUNjAgNTBUNzAgNTBUODAgNTBUOTAgNTBUMTAwIDUwIiBzdHJva2U9IiM4MDgwODAiIGZpbGw9InRyYW5zcGFyZW50IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-repeat-x opacity-60"></div>
                </div>
                <span className="text-xs text-slate-500">0:12</span>
              </div>
              <div className="text-right mt-1">
                <span className="text-[10px] text-slate-500">10:42 AM <CheckCircle className="inline w-3 h-3 text-[#53bdeb] ml-1"/></span>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm text-sm text-slate-600 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#10B981] animate-spin" />
              <span className="italic">Transcribing in Hindi...</span>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%] border-l-4 border-[#10B981]">
              <p className="text-[#111B21] text-sm">"मुझे आज की डिलीवरी रिपोर्ट फाइल करनी है। कस्टमर रमेश ने पैकेट लेने से मना कर दिया क्योंकि वह डैमेज था।"</p>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">Intent: DELIVERY_EXCEPTION</span>
              </div>
              <div className="text-right mt-1">
                <span className="text-[10px] text-slate-500">10:43 AM</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%] w-full">
              <div className="flex items-center space-x-2 mb-3 border-b pb-2">
                <FileText className="w-4 h-4 text-[#10B981]" />
                <span className="font-semibold text-sm text-[#111B21]">Form Auto-filled</span>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-0.5">Task Type</span>
                  <span className="font-medium text-slate-800">Delivery Exception</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-0.5">Customer Name</span>
                  <span className="font-medium text-slate-800">Ramesh</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-0.5">Reason</span>
                  <span className="font-medium text-slate-800">Package Damaged</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500">10:43 AM</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm text-sm text-[#111B21] flex items-center space-x-2">
              <span>✅ Report filed. Manager notified.</span>
              <div className="text-right mt-1 inline-block ml-2">
                <span className="text-[10px] text-slate-500">10:43 AM</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="text-4xl">👍</div>
          </div>
        </div>

        <div className="bg-[#F0F2F5] px-2 py-2 flex flex-col z-10">
          <div className="flex justify-center space-x-4 mb-3 py-1">
            <button className="text-xs font-semibold px-3 py-1 bg-[#10B981]/20 text-emerald-800 rounded-full border border-emerald-200">हिंदी</button>
            <button className="text-xs font-medium px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-full transition">தமிழ்</button>
            <button className="text-xs font-medium px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-full transition">मराठी</button>
            <button className="text-xs font-medium px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-full transition">తెలుగు</button>
          </div>
          
          <div className="flex items-center space-x-2 px-2">
            <div className="flex-1 bg-white rounded-full h-12 flex items-center px-4 shadow-sm border border-slate-200">
              <span className="text-slate-400 text-sm">Message</span>
            </div>
            <button className="w-12 h-12 bg-[#00A884] rounded-full flex items-center justify-center shadow-md transform transition active:scale-95 group relative overflow-hidden">
              <div className="absolute inset-0 bg-[#10B981] opacity-0 group-hover:opacity-20 transition-opacity"></div>
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

  const renderArchitectureView = () => (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-200 font-sans p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full relative">
        <h2 className="text-2xl font-bold text-white mb-12 text-center tracking-wide">VoiceOps AI System Architecture</h2>
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwaGF0IGQ9Ik0wIDM5LjVoNDBWMHItMS41IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center space-y-12 pb-20">
          <div className="w-full relative">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-full text-xs font-bold text-slate-500 tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>INPUT LAYER</div>
            
            <div className="flex justify-center space-x-8">
              {[
                { icon: MessageSquare, name: 'WhatsApp Business API', desc: 'Primary delivery channel' },
                { icon: Smartphone, name: 'Web App (PWA)', desc: 'Lightweight mobile access' },
                { icon: Phone, name: 'IVR / Phone', desc: 'Feature phone support' }
              ].map((item) => (
                <div key={item.name} className="group relative w-48 bg-[#1E293B] border-2 border-blue-500/40 hover:border-blue-400 rounded-xl p-4 flex flex-col items-center text-center transition-all shadow-[0_4px_20px_rgba(59,130,246,0.1)] hover:-translate-y-1 cursor-help">
                  <item.icon className="w-8 h-8 text-blue-400 mb-2" />
                  <span className="font-semibold text-sm text-blue-100">{item.name}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-800 text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-600">
                    <div className="font-bold text-blue-300 mb-1">{item.name}</div>
                    <div className="text-slate-300">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <div className="flex flex-col items-center opacity-70">
                <div className="h-8 w-px bg-blue-400/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-blue-400 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400/80 rotate-90 -mt-1" />
                <span className="text-[10px] text-slate-400 mt-1 bg-[#0F172A] px-2">audio/wav</span>
              </div>
            </div>
          </div>

          <div className="w-full relative border border-slate-700/50 bg-slate-800/20 rounded-3xl p-8 shadow-inner">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-full text-xs font-bold text-slate-500 tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>PROCESSING LAYER</div>
            
            <div className="flex flex-col items-center space-y-8 relative">
              <div className="flex justify-center items-center space-x-4 bg-[#1E293B] border-2 border-[#6366F1]/40 p-4 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.1)] w-full max-w-2xl">
                <Mic className="w-6 h-6 text-[#6366F1]" />
                <div className="flex-1 text-center font-semibold text-indigo-100 flex items-center justify-center space-x-3 text-sm">
                  <span>Sarvam AI STT</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span>Language Detector</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span className="text-indigo-300">Claude Intent Agent</span>
                </div>
              </div>

              <div className="flex flex-col items-center opacity-80">
                <div className="h-6 w-px bg-[#6366F1]/50 relative"></div>
                <ArrowRight className="w-4 h-4 text-[#6366F1]/80 rotate-90 -mt-1" />
                <span className="text-[10px] text-slate-400 mt-1 absolute z-10 translate-x-20">JSON intent + context</span>
              </div>

              <div className="bg-[#1E293B] border border-[#6366F1]/30 p-3 rounded-lg w-64 text-center font-bold text-slate-200 text-sm shadow-lg z-10 relative">
                Task Decomposition Engine
                <svg className="absolute top-full left-1/2 -translate-x-1/2 w-96 h-16 mt-1 pointer-events-none" viewBox="0 0 400 64" fill="none">
                  <path d="M200 0 L200 10 L50 30 L50 64" stroke="rgba(99,102,241,0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
                  <path d="M200 0 L200 64" stroke="rgba(99,102,241,0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
                  <path d="M200 0 L200 10 L350 30 L350 64" stroke="rgba(99,102,241,0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
                  <circle cx="50" cy="60" r="3" fill="#6366F1" />
                  <circle cx="200" cy="60" r="3" fill="#6366F1" />
                  <circle cx="350" cy="60" r="3" fill="#6366F1" />
                  <style>{`@keyframes dash { to { stroke-dashoffset: -20; } }`}</style>
                </svg>
              </div>

              <div className="flex justify-between w-full max-w-3xl pt-10 relative z-10">
                {['Form Agent', 'Report Agent', 'Escalation Agent'].map(agent => (
                  <div key={agent} className="bg-[#1E293B] border border-slate-600 hover:border-[#6366F1] p-3 rounded-lg w-40 text-center font-semibold text-xs text-slate-300 transition-colors shadow-md group relative cursor-help">
                    {agent}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-slate-800 text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-600 font-normal">
                      Resolves specific sub-tasks dynamically.
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 flex flex-col items-center relative z-10 w-full">
                <svg className="absolute bottom-[calc(100%-2rem)] left-1/2 -translate-x-1/2 w-96 h-16 pointer-events-none -z-10" viewBox="0 0 400 64" fill="none">
                  <path d="M50 0 L50 30 L200 50 L200 64" stroke="rgba(99,102,241,0.4)" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M200 0 L200 64" stroke="rgba(99,102,241,0.4)" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M350 0 L350 30 L200 50 L200 64" stroke="rgba(99,102,241,0.4)" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                <div className="bg-[#1E293B] border border-slate-500 p-2 rounded-lg w-48 text-center text-xs font-semibold text-slate-400 mb-6 mt-4">
                  Action Aggregator
                </div>
                
                <div className="flex flex-col items-center opacity-80 mb-6">
                  <div className="h-6 w-px bg-[#6366F1]/50"></div>
                  <ArrowRight className="w-4 h-4 text-[#6366F1]/80 rotate-90 -mt-1" />
                  <span className="text-[10px] text-slate-400 mt-1 absolute translate-x-20">Aggregated task object</span>
                </div>

                <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-orange-500/40 p-4 rounded-xl w-64 text-center font-bold text-orange-200 text-sm shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                  Gemini Flash Layer
                  <div className="text-[10px] font-normal text-orange-300/80 mt-1">Speed-sensitive reasoning</div>
                </div>

                <div className="flex flex-col items-center opacity-80 mt-6">
                  <div className="h-6 w-px bg-[#6366F1]/50"></div>
                  <ArrowRight className="w-4 h-4 text-[#6366F1]/80 rotate-90 -mt-1" />
                </div>

                <div className="bg-[#1E293B] border-2 border-[#6366F1]/40 p-3 mt-6 rounded-xl w-48 text-center font-semibold text-indigo-200 text-sm">
                  Sarvam AI TTS
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between px-48 relative">
            <div className="flex flex-col items-center opacity-70">
               <div className="h-10 w-px bg-teal-400/50 border-l border-dashed border-teal-400/50"></div>
               <ArrowRight className="w-4 h-4 text-teal-400/80 rotate-90 -mt-1" />
               <span className="text-[10px] text-slate-400 absolute -translate-x-12 top-4">Save State</span>
            </div>
            <div className="flex flex-col items-center opacity-70">
               <div className="h-10 w-px bg-[#10B981]/50"></div>
               <ArrowRight className="w-4 h-4 text-[#10B981]/80 rotate-90 -mt-1" />
               <span className="text-[10px] text-slate-400 absolute translate-x-12 top-4">Execution</span>
            </div>
          </div>

          <div className="w-full flex space-x-12">
            <div className="flex-1 relative">
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-full text-xs font-bold text-slate-500 tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>DATA LAYER</div>
              <div className="flex flex-col space-y-4">
                <div className="bg-[#1E293B] border-2 border-teal-500/40 p-4 rounded-xl flex items-center space-x-4 shadow-[0_4px_15px_rgba(20,184,166,0.1)]">
                  <Database className="w-6 h-6 text-teal-400" />
                  <div>
                    <div className="font-semibold text-sm text-teal-100">PostgreSQL + Redis</div>
                    <div className="text-xs text-slate-400">Task history & session state</div>
                  </div>
                </div>
                <div className="bg-[#1E293B] border-2 border-teal-500/40 p-4 rounded-xl flex items-center space-x-4 shadow-[0_4px_15px_rgba(20,184,166,0.1)]">
                  <Server className="w-6 h-6 text-teal-400" />
                  <div>
                    <div className="font-semibold text-sm text-teal-100">AWS S3</div>
                    <div className="text-xs text-slate-400">Audio blob storage</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-[2] relative">
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 translate-x-full text-xs font-bold text-slate-500 tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>OUTPUT LAYER</div>
              <div className="grid grid-cols-2 gap-4 h-full">
                {[
                  { name: 'WhatsApp Reply', desc: 'Audio/Text to Worker' },
                  { name: 'Manager Dashboard', desc: 'Websocket Feed' },
                  { name: 'CRM Update', desc: 'REST API Webhook' },
                  { name: 'PDF Report', desc: 'Email / Download' }
                ].map(item => (
                  <div key={item.name} className="bg-[#1E293B] border-2 border-[#10B981]/40 p-4 rounded-xl flex flex-col justify-center shadow-[0_4px_15px_rgba(16,185,129,0.1)]">
                    <div className="font-semibold text-sm text-emerald-100 mb-1">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-[#0F172A] flex flex-col overflow-hidden font-sans">
      <div className="bg-[#1E293B] border-b border-slate-700 p-4 flex justify-center space-x-4 z-50 shadow-md">
        <button 
          onClick={() => setActiveTab('manager')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'manager' 
            ? 'bg-[#6366F1] text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
          }`}
        >
          Manager Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('worker')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'worker' 
            ? 'bg-[#10B981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
          }`}
        >
          Worker Interface
        </button>
        <button 
          onClick={() => setActiveTab('architecture')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'architecture' 
            ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
          }`}
        >
          System Architecture
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'manager' && renderManagerView()}
        {activeTab === 'worker' && renderWorkerView()}
        {activeTab === 'architecture' && renderArchitectureView()}
      </div>
    </div>
  );
}
