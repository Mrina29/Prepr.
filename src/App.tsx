/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Zap, Brain, Building2, Mic, AlertTriangle, Network, Trash2, 
  Search, Command, Plus, TrendingUp, ChevronRight, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- MOCK DATA ---

const INITIAL_STATS = {
  dsa: 6,
  companies: 4,
  interviews: 2,
  warnings: 1,
  active: 12,
  pruned: 2
};

const INITIAL_NODES = [
  { id: 1, type: 'dsa', title: "UI Test - Kadane's Algo QA", subtitle: "Kadane / DP" },
  { id: 2, type: 'interview', title: "Microsoft — Recruiter Screen", subtitle: "Microsoft" },
  { id: 3, type: 'interview', title: "WiserStack — Technical Assessment", subtitle: "WiserStack" },
  { id: 4, type: 'company', title: "Google", subtitle: "STEP Intern" },
  { id: 5, type: 'company', title: "WiserStack", subtitle: "Full-Stack Engineer Intern" },
  { id: 6, type: 'company', title: "AutoRABIT", subtitle: "rejected" },
];

const INITIAL_TIMELINE = [
  { id: 1, type: 'RECALL', query: "What resume did I use for Microsoft?", detail: "2 result(s) surfaced.", time: "05 Jul, 10:57 pm", color: "text-blue-400", icon: Search },
  { id: 2, type: 'FORGET', query: "UI QA - Improve/Forget Node", detail: "Pruned: QA cleanup", time: "05 Jul, 10:56 pm", color: "text-red-500", icon: Trash2, badge: 'dsa' },
  { id: 3, type: 'IMPROVE', query: "UI QA - Improve/Forget Node", detail: "Overflow edge case", time: "05 Jul, 10:56 pm", color: "text-yellow-500", icon: TrendingUp, badge: 'dsa' },
  { id: 4, type: 'REMEMBER', query: "UI QA - Improve/Forget Node", detail: "New dsa memory added.", time: "05 Jul, 10:56 pm", color: "text-[#00ff9d]", icon: Plus, badge: 'dsa' },
  { id: 5, type: 'REMEMBER', query: "UI Test - Kadane's Algo QA", detail: "New dsa memory added.", time: "05 Jul, 10:56 pm", color: "text-[#00ff9d]", icon: Plus, badge: 'dsa' },
  { id: 6, type: 'RECALL', query: "Have I solved a sliding window problem before?", detail: "2 result(s) surfaced.", time: "05 Jul, 10:56 pm", color: "text-blue-400", icon: Search },
];

const SUGGESTIONS = [
  "Have I solved a sliding window problem before?",
  "What resume did I use for Microsoft?",
  "What went wrong in the WiserStack interview?",
  "Show me all prefix sum patterns",
  "Which companies are still active?"
];

// --- COMPONENTS ---

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'dsa' | 'company' | 'interview'>('dsa');
  const [nodeFilter, setNodeFilter] = useState<'ALL' | 'DSA' | 'COMPANY' | 'INTERVIEW'>('ALL');
  
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [stats, setStats] = useState(INITIAL_STATS);

  // Form State
  const [problem, setProblem] = useState("");
  const [pattern, setPattern] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [approach, setApproach] = useState("");
  const [edgeCases, setEdgeCases] = useState("");

  const handleRecall = () => {
    if (!query.trim()) return;
    const newEvent = {
      id: Date.now(),
      type: 'RECALL',
      query: query,
      detail: `${Math.floor(Math.random() * 3) + 1} result(s) surfaced.`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(),
      color: "text-blue-400",
      icon: Search
    };
    setTimeline([newEvent, ...timeline]);
    setQuery("");
  };

  const handleRemember = () => {
    if (!problem.trim()) return;
    
    const newNode = {
      id: Date.now(),
      type: activeTab,
      title: problem,
      subtitle: pattern || "New memory"
    };
    
    const newEvent = {
      id: Date.now() + 1,
      type: 'REMEMBER',
      query: problem,
      detail: `New ${activeTab} memory added.`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(),
      color: "text-[#00ff9d]",
      icon: Plus,
      badge: activeTab
    };

    setNodes([newNode, ...nodes]);
    setTimeline([newEvent, ...timeline]);
    
    setStats(prev => ({
      ...prev,
      [activeTab === 'dsa' ? 'dsa' : activeTab === 'company' ? 'companies' : 'interviews']: prev[activeTab === 'dsa' ? 'dsa' : activeTab === 'company' ? 'companies' : 'interviews'] + 1,
      active: prev.active + 1
    }));

    setProblem("");
    setPattern("");
    setTimeComplexity("");
    setApproach("");
    setEdgeCases("");
  };

  const filteredNodes = nodes.filter(n => nodeFilter === 'ALL' || n.type.toUpperCase() === nodeFilter);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-mono selection:bg-[#00ff9d]/30">
      {/* Navbar */}
      <nav className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border border-zinc-700 rounded flex items-center justify-center bg-zinc-900/50">
              <span className="text-[#00ff9d] text-lg font-bold">≥</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                prepr<span className="text-[#00ff9d]">.</span>
              </h1>
              <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase">Persistent Memory Copilot · Placement Prep</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-zinc-800 rounded-md bg-zinc-900/30 text-xs text-zinc-400">
            <Zap className="w-3.5 h-3.5 text-[#00ff9d]" />
            <span>COGNEE-GRAPH · GPT-4O-MINI</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
            <span className="text-zinc-400 tracking-widest uppercase">Graph Online — {stats.active} Active Nodes</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">stop losing context.</h2>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-[#00ff9d]">recall</span> <span className="text-white">everything.</span>
            </h2>
          </div>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl leading-relaxed font-sans">
            a career knowledge graph for the placement grind. remember DSA patterns, resume versions 
            and interview feedback — recall them by natural language when it matters.
          </p>
        </section>

        {/* Recall Search */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 tracking-widest uppercase">
            <ChevronRight className="w-3 h-3 text-[#00ff9d]" />
            <span>RECALL( ) — SEMANTIC QUERY ACROSS YOUR GRAPH</span>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#00ff9d]" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRecall()}
              className="w-full bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 rounded-lg pl-12 pr-32 py-5 text-lg focus:outline-none focus:border-[#00ff9d]/50 focus:ring-1 focus:ring-[#00ff9d]/50 transition-all font-mono"
              placeholder="have i solved something like this before?"
            />
            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded border border-zinc-700 bg-zinc-800 text-xs text-zinc-400">
                <Command className="w-3 h-3" /> K
              </kbd>
              <button 
                onClick={handleRecall}
                className="px-4 py-2 bg-transparent border border-[#00ff9d]/30 text-[#00ff9d] hover:bg-[#00ff9d]/10 rounded flex items-center gap-2 text-sm transition-colors"
              >
                RECALL <ArrowRight />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i} 
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon={<Brain className="w-4 h-4 text-[#00ff9d]" />} label="DSA PATTERNS" value={String(stats.dsa).padStart(2, '0')} />
          <StatCard icon={<Building2 className="w-4 h-4 text-blue-400" />} label="COMPANIES" value={String(stats.companies).padStart(2, '0')} />
          <StatCard icon={<Mic className="w-4 h-4 text-yellow-400" />} label="INTERVIEWS" value={String(stats.interviews).padStart(2, '0')} />
          <StatCard icon={<AlertTriangle className="w-4 h-4 text-orange-400" />} label="WARNINGS" value={String(stats.warnings).padStart(2, '0')} />
          <StatCard icon={<Network className="w-4 h-4 text-purple-400" />} label="ACTIVE NODES" value={String(stats.active).padStart(2, '0')} />
          <StatCard icon={<Trash2 className="w-4 h-4 text-zinc-500" />} label="PRUNED" value={String(stats.pruned).padStart(2, '0')} />
        </section>

        {/* Main 3-Column Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
          
          {/* Col 1: REMEMBER */}
          <div className="lg:col-span-4 border border-zinc-800 bg-zinc-900/20 rounded-xl p-5 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#00ff9d] text-sm tracking-widest font-bold flex items-center gap-2">
                <span className="text-zinc-500">$</span> REMEMBER( )
              </h3>
              <span className="text-xs text-zinc-600">ingest new memory</span>
            </div>

            <div className="flex p-1 bg-zinc-900 rounded-lg border border-zinc-800 mb-6">
              {(['dsa', 'company', 'interview'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-colors ${
                    activeTab === tab ? 'bg-zinc-800 text-[#00ff9d]' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab === 'dsa' && <Brain className="w-3.5 h-3.5" />}
                  {tab === 'company' && <Building2 className="w-3.5 h-3.5" />}
                  {tab === 'interview' && <Mic className="w-3.5 h-3.5" />}
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-5 flex-1">
              {/* Dynamic form based on activeTab. Showing DSA as default */}
              <div className="space-y-4">
                <FormGroup label={activeTab === 'dsa' ? 'PROBLEM' : activeTab === 'company' ? 'COMPANY NAME' : 'COMPANY & ROUND'}>
                  <input 
                    type="text" 
                    value={problem}
                    onChange={e => setProblem(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm focus:border-[#00ff9d]/50 focus:outline-none" 
                    placeholder={activeTab === 'dsa' ? 'e.g. Kth largest element' : '...'} 
                  />
                </FormGroup>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormGroup label={activeTab === 'dsa' ? 'PATTERN' : 'KEYWORD/ROLE'}>
                    <input 
                      type="text" 
                      value={pattern}
                      onChange={e => setPattern(e.target.value)}
                      className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm focus:border-[#00ff9d]/50 focus:outline-none" 
                      placeholder={activeTab === 'dsa' ? 'Heap / DP / Slid' : '...'} 
                    />
                  </FormGroup>
                  <FormGroup label={activeTab === 'dsa' ? 'TIME_COMPLEXITY' : 'STATUS'}>
                    <input 
                      type="text" 
                      value={timeComplexity}
                      onChange={e => setTimeComplexity(e.target.value)}
                      className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm focus:border-[#00ff9d]/50 focus:outline-none" 
                      placeholder={activeTab === 'dsa' ? 'O(n log k)' : '...'} 
                    />
                  </FormGroup>
                </div>

                <FormGroup label={activeTab === 'dsa' ? 'APPROACH' : 'NOTES'}>
                  <textarea 
                    value={approach}
                    onChange={e => setApproach(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm focus:border-[#00ff9d]/50 focus:outline-none h-24 resize-none"
                    placeholder={activeTab === 'dsa' ? 'Min-heap of size k, push and pop when size > k...' : '...'}
                  />
                </FormGroup>

                <FormGroup label={activeTab === 'dsa' ? 'EDGE CASES' : 'WARNINGS'}>
                  <input 
                    type="text" 
                    value={edgeCases}
                    onChange={e => setEdgeCases(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded p-3 text-sm focus:border-[#00ff9d]/50 focus:outline-none" 
                    placeholder={activeTab === 'dsa' ? 'k > n; duplicates; negatives' : '...'} 
                  />
                </FormGroup>
              </div>
            </div>

            <button 
              onClick={handleRemember}
              className="mt-6 w-full py-3 bg-transparent border border-[#00ff9d]/30 text-[#00ff9d] hover:bg-[#00ff9d]/10 rounded flex items-center justify-center gap-2 text-sm font-bold tracking-widest transition-colors"
            >
              <Plus className="w-4 h-4" /> REMEMBER
            </button>
          </div>

          {/* Col 2: GRAPH.NODES */}
          <div className="lg:col-span-4 border border-zinc-800 bg-zinc-900/20 rounded-xl p-5 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-sm tracking-widest font-bold flex items-center gap-2">
                <span className="text-[#00ff9d]">$</span> GRAPH.NODES
              </h3>
              <div className="flex gap-2">
                {(['ALL', 'DSA', 'COMPANY', 'INTERVIEW'] as const).map(f => (
                  <button 
                    key={f}
                    onClick={() => setNodeFilter(f)}
                    className={`text-[10px] px-2 py-1 rounded border ${nodeFilter === f ? 'border-[#00ff9d]/50 text-[#00ff9d] bg-[#00ff9d]/10' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {filteredNodes.map(node => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={node.id} 
                    className="p-4 bg-zinc-900/80 border border-zinc-800/80 rounded-lg hover:border-zinc-700 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-xs tracking-wider uppercase font-bold">
                        {node.type === 'dsa' && <Brain className="w-3.5 h-3.5 text-[#00ff9d]" />}
                        {node.type === 'company' && <Building2 className="w-3.5 h-3.5 text-blue-400" />}
                        {node.type === 'interview' && <Mic className="w-3.5 h-3.5 text-yellow-400" />}
                        <span className={
                          node.type === 'dsa' ? 'text-[#00ff9d]' : 
                          node.type === 'company' ? 'text-blue-400' : 'text-yellow-400'
                        }>{node.type}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-yellow-400 transition-colors">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1 leading-snug">{node.title}</h4>
                    <p className="text-zinc-500 text-xs truncate">{node.subtitle}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Col 3: MEMORY.TIMELINE */}
          <div className="lg:col-span-4 border border-zinc-800 bg-zinc-900/20 rounded-xl p-5 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-sm tracking-widest font-bold flex items-center gap-2">
                <span className="text-[#00ff9d]">$</span> MEMORY.TIMELINE
              </h3>
              <span className="text-xs text-zinc-600">{timeline.length} event(s)</span>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
              {timeline.map((event, i) => (
                <div key={event.id} className="relative flex items-start gap-4">
                  <div className={`mt-1 p-1.5 rounded-full border border-zinc-800 bg-zinc-900 shrink-0 z-10 ${event.color}`}>
                    <event.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold tracking-wider uppercase ${event.color}`}>
                          {event.type}
                        </span>
                        {event.badge && (
                          <span className="text-[9px] px-1.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                            · {event.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-600 whitespace-nowrap">{event.time}</span>
                    </div>
                    <p className="text-sm text-zinc-200 mb-1 leading-snug">{event.query}</p>
                    <p className="text-xs text-zinc-500">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>
      
      {/* Custom Scrollbar Styles embedded */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}} />
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-semibold">{label}</span>
      </div>
      <span className="text-3xl font-bold text-white tracking-tighter">{value}</span>
    </div>
  );
}

function FormGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] tracking-widest text-zinc-500 uppercase block">
        {label}
      </label>
      {children}
    </div>
  );
}

