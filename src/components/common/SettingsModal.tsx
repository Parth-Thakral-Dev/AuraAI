import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Database, Cpu, Key, Check, RefreshCw } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    updateSettings,
    models,
    currentModel,
    setCurrentModel,
    systemHealth,
    refreshHealth,
  } = useChat();

  const [activeTab, setActiveTab] = useState<'model' | 'persona' | 'database'>('model');
  const [newApiKey, setNewApiKey] = useState('');
  const [keySaving, setKeySaving] = useState(false);
  const [keySuccess, setKeySuccess] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleUpdateApiKey = async () => {
    if (!newApiKey.trim()) return;
    setKeySaving(true);
    try {
      const res = await fetch('/api/config/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newApiKey.trim() }),
      });
      if (res.ok) {
        setKeySuccess(true);
        setNewApiKey('');
        await refreshHealth();
        setTimeout(() => setKeySuccess(false), 3000);
      }
    } catch (e) {
      console.error('Failed to update key:', e);
    } finally {
      setKeySaving(false);
    }
  };

  const handleSave = () => {
    updateSettings({
      systemInstruction: instruction,
      temperature,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshHealth();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const applyPreset = (presetText: string) => {
    setInstruction(presetText);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-zinc-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Sliders className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Configuration & Engine</h3>
                  <p className="text-xs text-zinc-500">Fine-tune model parameters and architecture</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/[0.06] bg-black/20 text-xs font-medium">
              <button
                onClick={() => setActiveTab('model')}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
                  activeTab === 'model'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Model & Engine</span>
              </button>

              <button
                onClick={() => setActiveTab('persona')}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
                  activeTab === 'persona'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>System Instruction</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
                  activeTab === 'database'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Storage & Security</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {activeTab === 'model' && (
                <div className="space-y-5">
                  {/* Model Selector Cards */}
                  <div>
                    <label className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-400 block mb-2.5">
                      Select Neural Model Tier
                    </label>
                    <div className="space-y-2.5">
                      {models.map((m) => {
                        const isSelected = currentModel === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => setCurrentModel(m.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-white/[0.08] border-white/30 shadow-md'
                                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white text-sm">{m.name}</span>
                                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                                  {m.tag}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400">{m.description}</p>
                              <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-zinc-500">
                                <span>Context: {m.contextWindow}</span>
                                <span>•</span>
                                <span>Latency: {m.speed}</span>
                              </div>
                            </div>

                            <div
                              className={`w-4 h-4 rounded-full mt-1 border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-white bg-white text-black' : 'border-zinc-600'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Temperature slider */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-400">
                        Creativity (Temperature)
                      </label>
                      <span className="font-mono text-xs text-zinc-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {temperature}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-zinc-500 font-mono mt-1">
                      <span>0.0 (Precise & Deterministic)</span>
                      <span>1.0 (Creative & Varied)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'persona' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-400 block mb-2">
                      System Instructions & Guidance
                    </label>
                    <textarea
                      rows={5}
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      placeholder="Define the behavior, tone, and operational boundaries of the AI..."
                      className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono leading-relaxed resize-none"
                    />
                  </div>

                  {/* Preset buttons */}
                  <div>
                    <span className="text-xs text-zinc-400 block mb-2">Quick Presets:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          applyPreset(
                            'You are a Principal Software Architect. You provide concise, production-ready code with strict typing, zero bloat, and architectural rationale.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors"
                      >
                        Software Architect
                      </button>
                      <button
                        onClick={() =>
                          applyPreset(
                            'You are an expert researcher. Synthesize concepts rigorously, cite logical derivations, and highlight trade-offs with structured bullet points.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors"
                      >
                        Research Analyst
                      </button>
                      <button
                        onClick={() =>
                          applyPreset(
                            'You are a minimalist AI assistant. Answer directly in as few words as possible without introductions or boilerplate summaries.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors"
                      >
                        Minimalist
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'database' && (
                <div className="space-y-4">
                  {/* Storage Status */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono font-semibold tracking-wider text-zinc-400">
                        Active Storage Architecture
                      </span>
                      <button
                        onClick={handleRefresh}
                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="Refresh connection status"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          systemHealth?.supabaseConfigured ? 'bg-emerald-400' : 'bg-sky-400'
                        }`}
                      ></div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {systemHealth?.supabaseConfigured
                            ? 'Supabase PostgreSQL (Cloud Active)'
                            : 'Local Persistent Store (Zero-Config Active)'}
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          {systemHealth?.supabaseConfigured
                            ? 'Conversations and messages are encrypted and synced to your Supabase PostgreSQL cluster with Row Level Security.'
                            : 'Conversations and messages are persistently saved to the backend disk store and survive reloads and browser restarts.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Neural Engine Key status */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold font-mono uppercase text-zinc-400">
                        <Key className="w-3.5 h-3.5" />
                        <span>AURA Neural Engine Key</span>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                          systemHealth?.engineConfigured
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {systemHealth?.engineConfigured ? 'Active & Ready' : 'Key Needed'}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Enter your Google Gemini API key below. Valid keys start with <code className="text-emerald-300 font-mono bg-white/5 px-1 py-0.5 rounded">AIzaSy...</code>:
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showKey ? 'text' : 'password'}
                          value={newApiKey}
                          onChange={(e) => setNewApiKey(e.target.value)}
                          placeholder="Paste AIzaSy... key here"
                          className="w-full px-3 py-2 pr-12 rounded-xl bg-black/50 border border-white/10 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300"
                        >
                          {showKey ? 'Hide' : 'Show'}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleUpdateApiKey}
                        disabled={!newApiKey.trim() || keySaving}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          newApiKey.trim()
                            ? 'bg-white text-black hover:bg-zinc-200 active:scale-95'
                            : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        {keySaving ? 'Saving...' : 'Save Key'}
                      </button>
                    </div>

                    {keySuccess && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>API key updated in .env and loaded successfully!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                {savedToast && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Configuration saved</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-all font-sans shadow-md"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
