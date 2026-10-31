export type MediaType = 'video' | 'image' | 'music';

export type Resolution = '480p' | '720p' | '1080p';

export interface PromptSuggestion {
  id: string;
  styleKey: 'realistic' | 'dramatic' | 'vintage';
  titleHe: string;
  styleName: string;
  prompt: string;
  reasoningHe: string;
  tags: string[];
}

export interface GenerationResult {
  id: string;
  mediaType: MediaType;
  mediaUrl: string;
  prompt: string;
  originalIdea: string;
  styleTitleHe: string;
  engine: string;
  costEstimate: number;
  simulated: boolean;
  createdAt: number;
  sampleTitle?: string;
  resolution?: Resolution;
}

export interface DeveloperProfitStats {
  totalRevenueUsd: number;
  appStoreFeesUsd: number;
  aiGenerationCostsUsd: number;
  netProfitUsd: number;
  totalCreationsGenerated: number;
  purchasesCount: number;
}

export interface CreditPackage {
  id: string;
  titleHe: string;
  subtitleHe: string;
  credits: number;
  priceUsd: number;
  priceDisplay: string;
  popular?: boolean;
  badge?: string;
  unitPriceDisplay: string;
}
