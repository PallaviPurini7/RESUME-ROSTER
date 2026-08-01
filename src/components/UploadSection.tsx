import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Flame, Sparkles, RefreshCw, Zap, Check, ShieldAlert } from 'lucide-react';
import { RoastIntensity, SampleResume } from '../types';
import { SAMPLE_RESUMES } from '../data/sampleResumes';

interface UploadSectionProps {
  onRoast: (payload: { resumeText?: string; fileData?: { base64: string; mimeType: string; filename: string }; intensity: RoastIntensity; targetRole: string }) => void;
  isLoading: boolean;
  loadingMessage: string;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onRoast,
  isLoading,
  loadingMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'samples'>('upload');
  const [resumeText, setResumeText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<RoastIntensity>('savage');
  const [targetRole, setTargetRole] = useState<string>('Software Engineer');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setSelectedSampleId(null);
    const reader = new FileReader();

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (e) => {
        setResumeText(e.target?.result as string || '');
        setFileBase64(null);
      };
      reader.readAsText(file);
    } else {
      // PDF or DOCX binary base64 reading
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const base64Data = result.split(',')[1] || result;
          setFileBase64(base64Data);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleResume) => {
    setSelectedSampleId(sample.id);
    setResumeText(sample.text);
    setSelectedFile(null);
    setFileBase64(null);
    setTargetRole(sample.role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeText.trim() && !selectedFile && !fileBase64) {
      alert('Please upload a file, paste resume text, or select a sample resume!');
      return;
    }

    onRoast({
      resumeText: resumeText.trim() || undefined,
      fileData: selectedFile && fileBase64 ? {
        base64: fileBase64,
        mimeType: selectedFile.type || 'application/pdf',
        filename: selectedFile.name
      } : undefined,
      intensity,
      targetRole: targetRole || 'General Professional'
    });
  };

  return (
    <section id="upload-section" className="w-full max-w-4xl mx-auto pt-28 pb-12 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Glassmorphism AI Burn Unit
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white font-display leading-tight">
          UPLOAD YOUR RÉSUMÉ &amp;<br />
          PREPARE FOR THE <span class="fire-gradient-text">ROAST!</span>
        </h1>
        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
          Get brutally honest feedback, hilarious satirical critiques, and actionable tips to transform your resume from corporate filler to job offer machine.
        </p>
      </div>

      {/* Main Glass Panel Card */}
      <div className="w-full glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl border border-white/15">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Input Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Upload PDF/DOCX
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 ${
                activeTab === 'text'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Paste Text
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 ${
                activeTab === 'samples'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Sample Resumes
            </button>
          </div>

          {/* Target Role Input */}
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs w-full sm:w-auto">
            <span className="text-slate-400 font-medium">Target Role:</span>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. React Developer"
              className="bg-transparent text-white font-semibold outline-none focus:text-orange-400 w-36"
            />
          </div>
        </div>

        {/* Tab 1: File Upload Dropzone */}
        {activeTab === 'upload' && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`glass-dropzone rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center gap-4 cursor-pointer text-center relative ${
              dragActive ? 'drag-active' : ''
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.doc"
              onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  <Check className="w-3.5 h-3.5" /> File Loaded: {selectedFile.name}
                </span>
                <p className="text-xs text-slate-400">Click or drag another file to replace</p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider font-display">
                  DRAG &amp; DROP YOUR RÉSUMÉ
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Drag your PDF or DOCX file here, or click to browse files on your device.
                </p>
                <span className="text-xs text-slate-400 tracking-wide block">
                  Supported Formats: PDF, DOCX, TXT
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Text Area */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Paste Resume Content:
            </label>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setSelectedSampleId(null);
              }}
              placeholder="Paste work experience, bullet points, skills, and summary here..."
              className="w-full bg-slate-950/70 text-slate-100 p-4 rounded-2xl border border-white/10 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm font-mono placeholder:text-slate-500"
            />
          </div>
        )}

        {/* Tab 3: Sample Resumes */}
        {activeTab === 'samples' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-300 font-medium">Select a pre-loaded resume archetype to test instantly:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SAMPLE_RESUMES.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                    selectedSampleId === sample.id
                      ? 'bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/20'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/30 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{sample.name}</span>
                      {selectedSampleId === sample.id && (
                        <Check className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                    <span className="text-[11px] text-amber-300 font-semibold block">{sample.badge}</span>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 italic">"{sample.text.slice(0, 90)}..."</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 pt-2 border-t border-white/5">
                    Click to load &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Intensity Level Picker */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Select Roast Intensity:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIntensity('gentle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  intensity === 'gentle'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md'
                    : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                Gentle Toast 🍞
              </button>
              <button
                type="button"
                onClick={() => setIntensity('medium')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  intensity === 'medium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                    : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                Medium Sear 🥩
              </button>
              <button
                type="button"
                onClick={() => setIntensity('savage')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  intensity === 'savage'
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500 shadow-md'
                    : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                Savage Roast 🔥
              </button>
              <button
                type="button"
                onClick={() => setIntensity('nuclear')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  intensity === 'nuclear'
                    ? 'bg-red-500/20 text-red-300 border-red-500 shadow-md'
                    : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                Nuclear Obliteration 💥
              </button>
            </div>
          </div>

          {/* Submit Roast Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto glow-button-flame text-white font-extrabold px-8 py-4 rounded-full text-sm uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{loadingMessage || 'Analyzing the mediocrity...'}</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 animate-flame" />
                <span>UNLEASH THE ROASTER</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
