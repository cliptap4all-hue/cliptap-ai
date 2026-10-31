/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './components/Header';
import { Page1Input } from './components/Page1Input';
import { Page2Approval } from './components/Page2Approval';
import { Page3Result } from './components/Page3Result';
import { PaywallModal } from './components/PaywallModal';
import { SettingsModal } from './components/SettingsModal';
import { ReportModal } from './components/ReportModal';
import { SmartFixModal } from './components/SmartFixModal';
import { InstallAppModal } from './components/InstallAppModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  CreditPackage,
  DeveloperProfitStats,
  GenerationResult,
  MediaType,
  PromptSuggestion,
  Resolution,
} from './types';
import { triggerSuccessConfetti } from './utils/confetti';

const STORAGE_KEYS = {
  CREDITS: 'omnistudio_credits',
  FAL_KEY: 'omnistudio_fal_key',
  PROFIT_STATS: 'omnistudio_profit_stats',
  HISTORY: 'omnistudio_history',
};

const DEFAULT_PROFIT_STATS: DeveloperProfitStats = {
  totalRevenueUsd: 0,
  appStoreFeesUsd: 0,
  aiGenerationCostsUsd: 0,
  netProfitUsd: 0,
  totalCreationsGenerated: 0,
  purchasesCount: 0,
};

export default function App() {
  // Page navigation: 1 = Input, 2 = Prompt Approval, 3 = Result
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  // User input states
  const [mediaType, setMediaType] = React.useState<MediaType>('video');
  const [resolution, setResolution] = React.useState<Resolution>('480p');
  const [idea, setIdea] = React.useState<string>('');
  const [referenceImage, setReferenceImage] = React.useState<string | null>(null);

  // Step 1 Prompts generated
  const [prompts, setPrompts] = React.useState<PromptSuggestion[]>([]);
  const [selectedPromptIndex, setSelectedPromptIndex] = React.useState<number>(0);
  const [editedPromptText, setEditedPromptText] = React.useState<string>('');
  const [isLoadingPrompts, setIsLoadingPrompts] = React.useState<boolean>(false);

  // Step 2 Media generation & Result
  const [isGeneratingMedia, setIsGeneratingMedia] = React.useState<boolean>(false);
  const [currentResult, setCurrentResult] = React.useState<GenerationResult | null>(null);

  // Locked Concept Retake (תיקון ממוקד חינם - 1/1) & Download states
  const [hasUsedRetake, setHasUsedRetake] = React.useState<boolean>(false);
  const [hasDownloaded, setHasDownloaded] = React.useState<boolean>(false);
  const [isSmartFixOpen, setIsSmartFixOpen] = React.useState<boolean>(false);
  const [isFixingMedia, setIsFixingMedia] = React.useState<boolean>(false);

  // PWA & iOS Home Screen Install
  const { isInstallable, isInstalled, install: installPWA } = usePWAInstall();
  const [isInstallModalOpen, setIsInstallModalOpen] = React.useState<boolean>(false);

  // Credits & Monetization (defaults to 3 free test credits)
  const [credits, setCredits] = React.useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CREDITS);
    return saved !== null ? Number(saved) : 3;
  });

  // Fal.ai API key from Settings
  const [falApiKey, setFalApiKey] = React.useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.FAL_KEY) || '';
  });

  // Developer Profit Tracker stats
  const [profitStats, setProfitStats] = React.useState<DeveloperProfitStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFIT_STATS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFIT_STATS;
      }
    }
    return DEFAULT_PROFIT_STATS;
  });

  // Creations History
  const [history, setHistory] = React.useState<GenerationResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Modals
  const [isPaywallOpen, setIsPaywallOpen] = React.useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false);
  const [reportMediaId, setReportMediaId] = React.useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist credits
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREDITS, String(credits));
  }, [credits]);

  // Persist profit stats
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFIT_STATS, JSON.stringify(profitStats));
  }, [profitStats]);

  // Persist history
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  // Save Fal API key
  const handleSaveFalApiKey = (key: string) => {
    setFalApiKey(key);
    localStorage.setItem(STORAGE_KEYS.FAL_KEY, key);
  };

  // STEP 1: GENERATE PROMPTS (Gemini Free Engine)
  const handleGeneratePrompts = async () => {
    if (!idea.trim()) return;
    setIsLoadingPrompts(true);

    try {
      const response = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, mediaType }),
      });

      const data = await response.json();
      if (data.prompts && data.prompts.length > 0) {
        setPrompts(data.prompts);
        setSelectedPromptIndex(0);
        setEditedPromptText(data.prompts[0].prompt);
        setCurrentPage(2);
      } else {
        throw new Error(data.error || 'לא התקבלו פרומפטים');
      }
    } catch (err: unknown) {
      console.error('Error fetching prompts:', err);
      showToast('התרחשה שגיאה בניסוח הפרומפטים, נסה שוב');
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  // STEP 2: APPROVE AND GENERATE MEDIA
  const handleApproveAndGenerate = async () => {
    // Hard Paywall Gate: If credits < 1, open Paywall
    if (credits < 1) {
      setIsPaywallOpen(true);
      return;
    }

    // Deduct 1 credit
    const newCredits = credits - 1;
    setCredits(newCredits);

    // Reset Retake & Download states for the new paid creation
    setHasUsedRetake(false);
    setHasDownloaded(false);

    // Transition to Page 3 in loading mode
    setCurrentPage(3);
    setIsGeneratingMedia(true);

    try {
      const response = await fetch('/api/generate-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType,
          prompt: editedPromptText,
          referenceImage,
          falApiKey,
          resolution,
        }),
      });

      const data = await response.json();

      if (data.success && data.mediaUrl) {
        const selectedStyle = prompts[selectedPromptIndex] || prompts[0];
        const newResult: GenerationResult = {
          id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          mediaType,
          mediaUrl: data.mediaUrl,
          prompt: editedPromptText,
          originalIdea: idea,
          styleTitleHe: selectedStyle?.titleHe || 'סגנון מותאם',
          engine: data.engine || 'ClipTap Engine',
          costEstimate: data.costEstimate || 0,
          simulated: Boolean(data.simulated),
          createdAt: Date.now(),
          sampleTitle: data.sampleTitle,
          resolution: data.resolution || resolution,
        };

        setCurrentResult(newResult);
        setHistory((prev) => [newResult, ...prev]);

        // Update developer profit tracking with generation cost
        const aiCost = data.costEstimate || (mediaType === 'video' ? 0.015 : mediaType === 'music' ? 0.01 : 0);
        setProfitStats((prev) => {
          const totalCost = prev.aiGenerationCostsUsd + aiCost;
          const net = prev.totalRevenueUsd - prev.appStoreFeesUsd - totalCost;
          return {
            ...prev,
            aiGenerationCostsUsd: totalCost,
            netProfitUsd: net,
            totalCreationsGenerated: prev.totalCreationsGenerated + 1,
          };
        });

        triggerSuccessConfetti();
        showToast('היצירה הופקה בהצלחה! 🚀');
      } else {
        throw new Error(data.error || 'שגיאה ביצירת המדיה');
      }
    } catch (err: unknown) {
      console.error('Media generation error:', err);
      // Refund credit on total failure
      setCredits((prev) => prev + 1);
      showToast('שגיאה ביצירה - הקרדיט הוחזר לחשבונך');
    } finally {
      setIsGeneratingMedia(false);
    }
  };

  // LOCKED CONCEPT RETAKE (תיקון ממוקד חינם - 1/1)
  const handleApplySmartFix = async (userFixRequest: string) => {
    if (!currentResult) return;
    setIsFixingMedia(true);

    try {
      // Step A: Call Gemini Guardrail to refine the locked prompt
      const refineRes = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrompt: currentResult.prompt,
          userFixRequest,
          mediaType: currentResult.mediaType,
        }),
      });

      const refineData = await refineRes.json();
      const refinedPrompt = refineData.refinedPrompt || currentResult.prompt;

      // Step B: Re-generate media with refined prompt (No credit deducted!)
      const genRes = await fetch('/api/generate-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: currentResult.mediaType,
          prompt: refinedPrompt,
          referenceImage,
          falApiKey,
          resolution: currentResult.resolution || resolution,
        }),
      });

      const genData = await genRes.json();

      if (genData.success && genData.mediaUrl) {
        const updatedResult: GenerationResult = {
          ...currentResult,
          mediaUrl: genData.mediaUrl,
          prompt: refinedPrompt,
          engine: genData.engine || currentResult.engine,
          simulated: Boolean(genData.simulated),
          costEstimate: currentResult.costEstimate + (genData.costEstimate || 0),
          sampleTitle: genData.sampleTitle || currentResult.sampleTitle,
        };

        // Trade-in: replace previous result with updated one
        setCurrentResult(updatedResult);
        setHistory((prev) => [updatedResult, ...prev.filter((item) => item.id !== currentResult.id)]);
        setHasUsedRetake(true);
        setIsSmartFixOpen(false);

        // Update developer profit tracking with extra AI cost
        const extraAiCost = genData.costEstimate || (currentResult.mediaType === 'video' ? 0.015 : currentResult.mediaType === 'music' ? 0.01 : 0);
        setProfitStats((prev) => {
          const totalCost = prev.aiGenerationCostsUsd + extraAiCost;
          const net = prev.totalRevenueUsd - prev.appStoreFeesUsd - totalCost;
          return {
            ...prev,
            aiGenerationCostsUsd: totalCost,
            netProfitUsd: net,
          };
        });

        triggerSuccessConfetti();
        showToast('התוצאה תוקנה ודויקה בחינם! 🚀 (1/1)');
      } else {
        throw new Error(genData.error || 'שגיאה ביצירת התיקון');
      }
    } catch (err: unknown) {
      console.error('Smart fix error:', err);
      showToast('שגיאה במהלך ביצוע התיקון, נסה שוב');
    } finally {
      setIsFixingMedia(false);
    }
  };

  // MONETIZATION: PURCHASE PACKAGE
  const handleSelectPackage = (pkg: CreditPackage) => {
    // Add credits to balance
    setCredits((prev) => prev + pkg.credits);

    // Update Developer Profit Stats
    // 15% Apple Small Business fee
    const gross = pkg.priceUsd;
    const storeFee = gross * 0.15;

    setProfitStats((prev) => {
      const newGross = prev.totalRevenueUsd + gross;
      const newStoreFees = prev.appStoreFeesUsd + storeFee;
      const newNet = newGross - newStoreFees - prev.aiGenerationCostsUsd;
      return {
        ...prev,
        totalRevenueUsd: newGross,
        appStoreFeesUsd: newStoreFees,
        netProfitUsd: newNet,
        purchasesCount: prev.purchasesCount + 1,
      };
    });

    showToast(`נוספו ${pkg.credits} קרדיטים בהצלחה! 🎉`);
  };

  // Simulate a custom purchase from Settings Developer Tracker
  const handleSimulatePurchase = (amountUsd: number, creditsCount: number) => {
    setCredits((prev) => prev + creditsCount);
    const storeFee = amountUsd * 0.15;
    setProfitStats((prev) => {
      const newGross = prev.totalRevenueUsd + amountUsd;
      const newStoreFees = prev.appStoreFeesUsd + storeFee;
      const newNet = newGross - newStoreFees - prev.aiGenerationCostsUsd;
      return {
        ...prev,
        totalRevenueUsd: newGross,
        appStoreFeesUsd: newStoreFees,
        netProfitUsd: newNet,
        purchasesCount: prev.purchasesCount + 1,
      };
    });
    showToast(`סימולציה: +${creditsCount} קרדיטים ($${amountUsd}) נרשמו!`);
  };

  // Compliance: Reset all local data
  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CREDITS);
    setHistory([]);
    setCredits(3);
    setCurrentResult(null);
    setCurrentPage(1);
    showToast('הנתונים המקומיים וההיסטוריה נמחקו');
  };

  // Reset profit stats
  const handleResetProfitStats = () => {
    setProfitStats(DEFAULT_PROFIT_STATS);
    localStorage.removeItem(STORAGE_KEYS.PROFIT_STATS);
    showToast('מחשבון הרווחים אופס');
  };

  // Delete single history item
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
    showToast('הפריט הוסר מההיסטוריה');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Mobile-Frame Wrapper (max-w-md mx-auto) */}
      <div className="max-w-md mx-auto min-h-screen bg-zinc-950 border-x border-zinc-900 shadow-2xl relative flex flex-col">
        {/* Sticky Header */}
        <Header
          credits={credits}
          onOpenPaywall={() => setIsPaywallOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onGoHome={() => setCurrentPage(1)}
          currentPage={currentPage}
          isInstalled={isInstalled}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
        />

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-zinc-900/95 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
            {toastMessage}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4">
          {/* PAGE 1: Input & Mode Selection */}
          {currentPage === 1 && (
            <Page1Input
              mediaType={mediaType}
              onSelectMediaType={setMediaType}
              resolution={resolution}
              onSelectResolution={setResolution}
              idea={idea}
              onChangeIdea={setIdea}
              referenceImage={referenceImage}
              onSetReferenceImage={setReferenceImage}
              onSubmit={handleGeneratePrompts}
              isLoading={isLoadingPrompts}
            />
          )}

          {/* PAGE 2: Prompt Approval & Tweaking */}
          {currentPage === 2 && (
            <Page2Approval
              originalIdea={idea}
              mediaType={mediaType}
              resolution={resolution}
              prompts={prompts}
              selectedPromptIndex={selectedPromptIndex}
              onSelectPromptIndex={setSelectedPromptIndex}
              editedPromptText={editedPromptText}
              onChangeEditedPrompt={setEditedPromptText}
              onBackToPage1={() => setCurrentPage(1)}
              onApproveAndGenerate={handleApproveAndGenerate}
              credits={credits}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              isGeneratingMedia={isGeneratingMedia}
            />
          )}

          {/* PAGE 3: Dedicated Player & History */}
          {currentPage === 3 && (
            <Page3Result
              isGenerating={isGeneratingMedia}
              result={currentResult}
              history={history}
              onSelectFromHistory={(item) => setCurrentResult(item)}
              onDeleteFromHistory={handleDeleteHistoryItem}
              onNewCreation={() => setCurrentPage(1)}
              onOpenReportModal={(id) => setReportMediaId(id)}
              hasUsedRetake={hasUsedRetake}
              hasDownloaded={hasDownloaded}
              onOpenSmartFix={() => setIsSmartFixOpen(true)}
              onDownloadClicked={() => setHasDownloaded(true)}
            />
          )}
        </main>

        {/* Smart Fix Modal (Locked Concept Retake) */}
        {currentResult && (
          <SmartFixModal
            isOpen={isSmartFixOpen}
            onClose={() => setIsSmartFixOpen(false)}
            result={currentResult}
            referenceImage={referenceImage}
            onApplyFix={handleApplySmartFix}
            isFixing={isFixingMedia}
          />
        )}

        {/* Paywall Modal */}
        <PaywallModal
          isOpen={isPaywallOpen}
          onClose={() => setIsPaywallOpen(false)}
          onSelectPackage={handleSelectPackage}
          currentCredits={credits}
        />

        {/* Developer Settings & Profit Tracker Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          falApiKey={falApiKey}
          onSaveFalApiKey={handleSaveFalApiKey}
          profitStats={profitStats}
          onSimulatePurchase={handleSimulatePurchase}
          onResetData={handleResetData}
          onResetProfitStats={handleResetProfitStats}
          credits={credits}
          onSetCredits={setCredits}
        />

        {/* Report Content Modal (Compliance) */}
        <ReportModal
          isOpen={Boolean(reportMediaId)}
          onClose={() => setReportMediaId(null)}
          mediaId={reportMediaId || ''}
        />

        {/* Install on iPhone / Mobile Modal */}
        <InstallAppModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          isInstallable={isInstallable}
          onInstallNative={installPWA}
        />
      </div>
    </div>
  );
}
