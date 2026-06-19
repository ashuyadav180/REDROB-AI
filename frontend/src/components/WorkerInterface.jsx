import React from 'react';
import { Mic, Activity, CheckCircle, FileText, Phone, Settings } from 'lucide-react';

export default function WorkerInterface() {
  return (
    <div className="flex flex-col h-full bg-[#0F172A] items-center justify-center py-8 overflow-y-auto animate-fade-in-up relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 z-0 pointer-events-none"></div>
      
      {/* Glow behind phone */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[700px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-[390px] h-[844px] min-h-[844px] bg-[#EFEAE2] rounded-[55px] shadow-2xl border-[12px] border-slate-900 overflow-hidden flex flex-col relative font-sans shrink-0 z-10 ring-4 ring-slate-800">
        {/* Dynamic Island / Notch Mock */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-50"></div>

        <div className="bg-[#008069] text-white px-5 py-4 pt-12 flex items-center shadow-md z-10 bg-gradient-to-r from-[#008069] to-[#00A884]">
          <div className="flex items-center flex-1">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl shadow-sm border border-white/30">
              🤖
            </div>
            <div className="ml-3.5">
              <h2 className="font-semibold text-lg leading-tight font-heading">VoiceOps AI</h2>
              <p className="text-xs text-emerald-50 font-medium">Always active</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Phone className="w-5 h-5 text-white/90 hover:text-white cursor-pointer" />
            <Settings className="w-5 h-5 text-white/90 hover:text-white cursor-pointer" />
          </div>
        </div>

        <div className="flex-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center p-5 overflow-y-auto flex flex-col space-y-5 scrollbar-hide">
          <div className="flex justify-center mb-2">
            <div className="bg-[#E1F3FB] text-[#4A5E6B] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
              TODAY
            </div>
          </div>

          <div className="flex justify-end transform transition-all hover:-translate-x-1">
            <div className="bg-[#E7FFDB] rounded-2xl rounded-tr-sm p-2 shadow-sm max-w-[80%] border border-[#d2f3c4]">
              <div className="flex items-center space-x-3 pr-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center p-1">
                  <div className="w-full h-full rounded-full bg-[#10B981] flex items-center justify-center shadow-inner">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgNTBRMTAgMjAgMjAgNTBUMzAgNTBUNDAgNTBUNTAgNTBUNjAgNTBUNzAgNTBUODAgNTBUOTAgNTBUMTAwIDUwIiBzdHJva2U9IiM4MDgwODAiIGZpbGw9InRyYW5zcGFyZW50IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-repeat-x opacity-60"></div>
                </div>
                <span className="text-xs text-slate-500 font-medium">0:12</span>
              </div>
              <div className="text-right mt-1">
                <span className="text-[10px] text-slate-500 font-medium">10:42 AM <CheckCircle className="inline w-3 h-3 text-[#53bdeb] ml-1"/></span>
              </div>
            </div>
          </div>

          <div className="flex justify-start transform transition-all hover:translate-x-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm text-slate-700 flex items-center space-x-3 border border-white/50">
              <Activity className="w-5 h-5 text-[#10B981] animate-spin" />
              <span className="italic font-medium">Transcribing in Hindi...</span>
            </div>
          </div>

          <div className="flex justify-start transform transition-all hover:translate-x-1">
            <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[85%] border-l-4 border-[#10B981] relative">
              <p className="text-[#111B21] text-[15px] leading-relaxed">"मुझे आज की डिलीवरी रिपोर्ट फाइल करनी है। कस्टमर रमेश ने पैकेट लेने से मना कर दिया क्योंकि वह डैमेज था।"</p>
              <div className="text-xs text-slate-400 mt-2 flex items-center">
                <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-700 font-semibold border border-slate-200">Intent: DELIVERY_EXCEPTION</span>
              </div>
              <div className="text-right mt-1">
                <span className="text-[10px] text-slate-500 font-medium">10:43 AM</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start transform transition-all hover:translate-x-1">
            <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[85%] w-full">
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <FileText className="w-4 h-4 text-[#10B981]" />
                </div>
                <span className="font-bold text-[15px] text-[#111B21]">Form Auto-filled</span>
              </div>
              <div className="space-y-3 text-sm mb-3">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col hover:bg-slate-100 transition-colors">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Task Type</span>
                  <span className="font-bold text-slate-800">Delivery Exception</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col hover:bg-slate-100 transition-colors">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Customer Name</span>
                  <span className="font-bold text-slate-800">Ramesh</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col hover:bg-slate-100 transition-colors">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Reason</span>
                  <span className="font-bold text-rose-600">Package Damaged</span>
                </div>
              </div>
              <div className="text-right mt-2">
                <span className="text-[10px] text-slate-500 font-medium">10:43 AM</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start transform transition-all hover:translate-x-1">
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-[15px] text-[#111B21] flex items-center space-x-2 border border-slate-100">
              <span className="font-medium">✅ Report filed. Manager notified.</span>
              <div className="text-right inline-block ml-3">
                <span className="text-[10px] text-slate-500 font-medium">10:43 AM</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <div className="text-5xl animate-bounce drop-shadow-md">👍</div>
          </div>
        </div>

        <div className="bg-[#F0F2F5] px-3 py-4 flex flex-col z-10 border-t border-slate-200/50 pb-8">
          <div className="flex justify-center space-x-3 mb-4">
            <button className="text-xs font-bold px-4 py-1.5 bg-[#10B981]/20 text-emerald-800 rounded-full border border-emerald-300 shadow-sm transition-transform hover:scale-105">हिंदी</button>
            <button className="text-xs font-semibold px-4 py-1.5 bg-white text-slate-600 hover:bg-slate-100 rounded-full transition-transform hover:scale-105 shadow-sm border border-slate-200">தமிழ்</button>
            <button className="text-xs font-semibold px-4 py-1.5 bg-white text-slate-600 hover:bg-slate-100 rounded-full transition-transform hover:scale-105 shadow-sm border border-slate-200">मराठी</button>
            <button className="text-xs font-semibold px-4 py-1.5 bg-white text-slate-600 hover:bg-slate-100 rounded-full transition-transform hover:scale-105 shadow-sm border border-slate-200">తెలుగు</button>
          </div>
          
          <div className="flex items-center space-x-3 px-2">
            <div className="flex-1 bg-white rounded-full h-14 flex items-center px-5 shadow-sm border border-slate-200 cursor-text hover:border-emerald-300 transition-colors">
              <span className="text-slate-400 text-[15px] font-medium">Message</span>
            </div>
            <button className="w-14 h-14 bg-[#00A884] rounded-full flex items-center justify-center shadow-lg transform transition-all active:scale-95 hover:bg-[#009272] group relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">🎙️ Hold to speak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
