import React, { useState, useEffect } from 'react';
import { 
  Mic, Activity, CheckCircle, AlertTriangle, Users, Settings, 
  FileText, BarChart2, LayoutDashboard, Clock, 
  Server
} from 'lucide-react';

export default function ManagerDashboard() {
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

  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-200 animate-fade-in-up">
      <header className="flex justify-between items-center px-6 py-4 glass-panel border-b border-white/5 z-20">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <Mic className="text-indigo-400 w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide font-heading">VoiceOps <span className="text-indigo-400">AI</span></h1>
        </div>
        <nav className="flex space-x-8 text-sm font-medium text-slate-400">
          <button className="text-indigo-400 flex items-center space-x-2 transition-colors hover:text-indigo-300">
            <LayoutDashboard className="w-4 h-4"/><span>Dashboard</span>
          </button>
          <button className="hover:text-slate-200 flex items-center space-x-2 transition-colors">
            <Users className="w-4 h-4"/><span>Agents</span>
          </button>
          <button className="hover:text-slate-200 flex items-center space-x-2 transition-colors">
            <FileText className="w-4 h-4"/><span>Reports</span>
          </button>
          <button className="hover:text-slate-200 flex items-center space-x-2 transition-colors">
            <Settings className="w-4 h-4"/><span>Settings</span>
          </button>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>12 tasks today</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-indigo-500/30 cursor-pointer hover:ring-indigo-400 transition-all">
            M
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 z-0 pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
        
        <aside className="w-72 glass-panel border-r border-white/5 p-5 z-10 flex flex-col">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 font-heading">Active Field Agents</h2>
          <div className="space-y-3">
            {workers.map((worker, idx) => (
              <div 
                key={worker.id} 
                className="group flex items-center p-3 rounded-xl bg-slate-800/40 hover:bg-slate-700/50 border border-white/5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center text-lg shadow-inner font-heading font-semibold text-white group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                    {worker.name.charAt(0)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#1E293B] ${
                    worker.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                    worker.status === 'idle' ? 'bg-amber-500' : 'bg-slate-500'
                  }`}></div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold text-slate-200 text-sm">{worker.name}</span>
                    <span className="text-xs text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded-md border border-white/5">{worker.lang}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{worker.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex p-6 space-x-6 z-10 overflow-y-auto">
          <section className="flex flex-col w-[40%] space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2 font-heading">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>Live Task Feed</span>
            </h2>
            <div className="space-y-4">
              {tasks.map((task, idx) => (
                <div 
                  key={task.id} 
                  className={`p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${
                    task.status === 'Processing' 
                      ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_8px_30px_rgba(99,102,241,0.15)]' 
                      : 'glass-panel hover:bg-slate-800/60'
                  }`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-slate-700/80 flex items-center justify-center text-xs font-bold text-slate-300 font-heading">
                        {task.worker.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium text-sm text-slate-200 block">{task.worker}</span>
                        <span className="text-xs text-slate-500">{task.time}</span>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border ${
                      task.intent === 'COMPLAINT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      task.intent === 'DELIVERY' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {task.intent}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm font-medium mb-4 leading-relaxed tracking-wide">"{task.transcript}"</p>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      task.status === 'Processing' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      task.status === 'Routed' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-800/50 text-slate-400 border border-slate-700'
                    }`}>
                      {task.status === 'Processing' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping mr-1"></div>}
                      {task.status === 'Completed' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                      <span>{task.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col w-[35%] space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2 font-heading">
              <Server className="w-5 h-5 text-indigo-400" />
              <span>Pipeline: Task #{tasks[0].id}</span>
            </h2>
            <div className="flex-1 glass-panel rounded-2xl p-8 flex flex-col items-center justify-center relative shadow-lg">
              <div className="flex flex-col items-center space-y-8 w-full">
                {['STT Agent', 'Intent Agent', 'Task Router', 'Action Agent', 'TTS Response'].map((node, i) => (
                  <React.Fragment key={node}>
                    <div className={`w-full max-w-[260px] p-4 rounded-xl border flex items-center justify-between transition-all duration-500 ${
                      activeNode === i ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.5)] text-white scale-110' :
                      activeNode > i ? 'bg-slate-800/80 border-emerald-500/30 text-slate-300' :
                      'bg-slate-800/30 border-white/5 text-slate-500'
                    }`}>
                      <span className="text-sm font-semibold tracking-wide">{node}</span>
                      {activeNode > i && <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
                      {activeNode === i && <Activity className="w-5 h-5 text-white/90 animate-spin" />}
                    </div>
                    {i < 4 && (
                      <div className="h-8 w-0.5 bg-slate-700/50 relative">
                        <div className={`absolute top-0 left-0 w-full transition-all duration-700 ease-out ${
                          activeNode > i ? 'h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                          activeNode === i ? 'h-1/2 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse' : 'h-0'
                        }`}></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col w-[25%] space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2 font-heading">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <span>Metrics</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel hover:bg-slate-800/60 transition-colors rounded-2xl p-5">
                <div className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Tasks Today</div>
                <div className="text-3xl font-bold text-white font-heading">1,284</div>
                <div className="text-emerald-400 text-xs mt-2 font-medium bg-emerald-400/10 inline-block px-2 py-0.5 rounded">↑ 12% vs yday</div>
              </div>
              <div className="glass-panel hover:bg-slate-800/60 transition-colors rounded-2xl p-5">
                <div className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Avg Res Time</div>
                <div className="text-3xl font-bold text-white font-heading">4.2s</div>
                <div className="text-emerald-400 text-xs mt-2 font-medium bg-emerald-400/10 inline-block px-2 py-0.5 rounded">↓ 0.3s vs yday</div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5">
              <div className="text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">Language Distribution</div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <span className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden flex shadow-inner">
                  <span className="bg-indigo-500 w-[45%] h-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                  <span className="bg-blue-500 w-[30%] h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                  <span className="bg-emerald-500 w-[25%] h-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                </span>
              </div>
              <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-3">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></span>Hindi (45%)</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>Tamil (30%)</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>Marathi (25%)</span>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 pt-2 font-heading">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Action Required</span>
            </h2>
            
            <div className="space-y-4">
              <div className="bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 transition-colors rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-rose-600"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-rose-400 tracking-wider">ESCALATION</span>
                  <span className="text-xs text-slate-500 font-medium">2m ago</span>
                </div>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">Mohan reported severe vehicle breakdown on Route 4. Needs immediate assistance.</p>
                <button className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold tracking-wide rounded-lg transition-all border border-rose-500/30 group-hover:border-rose-500/50">
                  Review Issue
                </button>
              </div>
              
              <div className="bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 transition-colors rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-amber-500 tracking-wider">UNRECOGNIZED INTENT</span>
                  <span className="text-xs text-slate-500 font-medium">14m ago</span>
                </div>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">Priya sent audio that could not be confidently mapped to a task schema.</p>
                <button className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold tracking-wide rounded-lg transition-all border border-amber-500/30 group-hover:border-amber-500/50">
                  Manual Label
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
