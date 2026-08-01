import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { ResultsSection } from './components/ResultsSection';
import { ActionableTipsModal } from './components/ActionableTipsModal';
import { RoastHistoryModal } from './components/RoastHistoryModal';
import { Footer } from './components/Footer';
import { RoastIntensity, RoastResult } from './types';

export default function App() {
  const [result, setResult] = useState<RoastResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Analyzing the mediocrity...');
  const [isTipsOpen, setIsTipsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<RoastResult[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('resume_roaster_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newResult: RoastResult) => {
    try {
      const updated = [newResult, ...history.filter(item => item.id !== newResult.id)].slice(0, 15);
      setHistory(updated);
      localStorage.setItem('resume_roaster_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('resume_roaster_history');
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  const handleRoast = async (payload: {
    resumeText?: string;
    fileData?: { base64: string; mimeType: string; filename: string };
    intensity: RoastIntensity;
    targetRole: string;
  }) => {
    setIsLoading(true);

    // Rotating loading messages
    const phrases = [
      'Analyzing the mediocrity...',
      'Counting the buzzwords...',
      'Preparing the burn unit...',
      'Measuring synergy levels...',
      'Consulting ATS algorithms...',
      'Drafting sarcastic commentary...'
    ];
    let phraseIdx = 0;
    setLoadingMessage(phrases[0]);

    const interval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setLoadingMessage(phrases[phraseIdx]);
    }, 800);

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: RoastResult = await response.json();
      const enrichedResult: RoastResult = {
        ...data,
        id: Date.now().toString(),
        timestamp: Date.now(),
        filename: payload.fileData?.filename,
      };

      setResult(enrichedResult);
      saveToHistory(enrichedResult);

      // Scroll smoothly to results after state updates
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);

    } catch (err) {
      console.error('Roast generation error:', err);
      alert('An error occurred while generating your roast. Please try again.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleScrollToUpload = () => {
    const uploadElement = document.getElementById('upload-section');
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans animated-bg relative selection:bg-orange-500 selection:text-white">
      {/* Top Bar */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTips={() => setIsTipsOpen(true)}
        onScrollToUpload={handleScrollToUpload}
        hasResults={!!result}
      />

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-start pb-16">
        <UploadSection
          onRoast={handleRoast}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />

        {result && (
          <ResultsSection
            result={result}
            onOpenTips={() => setIsTipsOpen(true)}
            onReset={() => {
              setResult(null);
              handleScrollToUpload();
            }}
          />
        )}
      </main>

      {/* Modals */}
      {result && (
        <ActionableTipsModal
          result={result}
          isOpen={isTipsOpen}
          onClose={() => setIsTipsOpen(false)}
        />
      )}

      <RoastHistoryModal
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectResult={(selected) => {
          setResult(selected);
          setTimeout(() => {
            const resultsElement = document.getElementById('results-section');
            if (resultsElement) {
              resultsElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200);
        }}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
