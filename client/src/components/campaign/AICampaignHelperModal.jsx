import React, { useState } from 'react';
import aiService from '../../services/aiService.js';
import { Sparkles, X, Wand2, Check, Copy, Loader2, ArrowRight } from 'lucide-react';

export const AICampaignHelperModal = ({ isOpen, onClose, onApplyGenerated, initialCategory = 'Education' }) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [beneficiaries, setBeneficiaries] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await aiService.generateStory({
        title: topic,
        category,
        causeDetails: topic,
        targetBeneficiaries: beneficiaries || 'Vulnerable communities in need'
      });
      if (res.success) {
        setResult(res.generated);
      }
    } catch (err) {
      console.error('AI Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result && onApplyGenerated) {
      onApplyGenerated(result);
      onClose();
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `Title: ${result.title}\n\nTagline: ${result.tagline}\n\nStory:\n${result.description}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                AI Campaign Story & Impact Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Craft compelling, emotionally engaging fundraising narratives in seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cause Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Education">🎓 Education & Youth</option>
                  <option value="Healthcare">🏥 Emergency Healthcare</option>
                  <option value="Food">🍲 Food & Hunger Relief</option>
                  <option value="Environment">🌱 Nature & Clean Water</option>
                  <option value="Animals">🐾 Animal Rescue & Welfare</option>
                  <option value="Disaster Relief">🚨 Rapid Disaster Relief</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Beneficiaries
                </label>
                <input
                  type="text"
                  value={beneficiaries}
                  onChange={(e) => setBeneficiaries(e.target.value)}
                  placeholder="e.g. 150 rural students, 500 flood victims"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Goal / Specific Challenge to Solve
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Setting up solar powered classroom tablets in remote desert schools so kids can study after dark."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating AI Campaign Narrative...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Generate Story & Impact Metrics
                </>
              )}
            </button>
          </form>

          {/* AI Result Card */}
          {result && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-500/30 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles size={14} /> AI Generated Draft
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {result.title}
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium italic mt-0.5">
                  "{result.tagline}"
                </p>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60">
                {result.description}
              </div>

              {result.impactMetrics && (
                <div>
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Predicted Impact Milestones
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {result.impactMetrics.map((m, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                        <div className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">{m.value}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {onApplyGenerated && (
                <button
                  onClick={handleApply}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check size={15} /> Apply to Campaign Form
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICampaignHelperModal;
