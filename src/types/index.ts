/**
 * Types for NeuroDistill NMT — 5 Specialized Translation Agents
 * Created by Tarik Badri — in association with Larbi Badri
 * Scientific Reference: Mghabbar & Ratnamogan, ECAI 2020
 */

export type DomainType =
  | 'finance'
  | 'banque'
  | 'technologie'
  | 'droit'
  | 'sante'
  | 'general';

export type LegacyDomainType = DomainType | 'legal' | 'medical' | 'technology';

export interface TrainingLogEntry {
  epoch: number;
  step: number;
  ceLoss: number;
  kdLoss: number;
  totalLoss: number;
  learningRate: number;
  bleuFinance: number;
  bleuLegal: number;
  bleuMedical: number;
  bleuTech: number;
  bleuOverall: number;
}

export type TranslationModel =
  | 'generic_student'
  | 'distilled_student'
  | 'domain_teacher'
  | 'teacher_ensemble';

export type PlatformOS = 'macos' | 'windows';

export type ConfidenceLevel = 'eleve' | 'moyen' | 'faible';

export interface DomainMeta {
  id: DomainType;
  name: string;
  icon: string;
  badge: string;
  description: string;
  warning: string;
  sampleSourceText: string;
  targetKeywords: string[];
  systemPrompt: string;
}

export interface SensitiveTermChoice {
  original: string;
  translated: string;
  reason: string;
  fromGlossary?: boolean;
}

export interface VerificationNote {
  passage: string;
  reason: string;
}

export interface TranslationResponse {
  sourceText: string;
  detectedDomain: DomainType;
  primaryTranslation: string;
  modelUsed: TranslationModel;
  bleuDelta: number; // e.g. +2.0 BLEU from ECAI 2020
  latencyMs: number;
  confidenceLevel: ConfidenceLevel;
  confidenceReason: string;
  sensitiveTerms: SensitiveTermChoice[];
  verificationNotes: VerificationNote[];
  disclaimer: string;
  comparisons: ModelComparisonMetrics[];
  glossaryAppliedCount: number;
  tmMatchScore?: number;
}

export interface ModelComparisonMetrics {
  modelId: TranslationModel;
  modelName: string;
  isDistilled: boolean;
  isInferenceOptimized: boolean;
  bleuScore: number;
  latencyMs: number;
  memoryMb: number;
  output: string;
  provenance: 'mesure' | 'recherche_ecai2020';
}

// Mechanism 1: Knowledge Memory (Glossary + TM + Document Ingestion)
export interface GlossaryItem {
  id: string;
  domain: DomainType;
  sourceTerm: string;
  targetTerm: string;
  context?: string;
  status: 'pending' | 'approved' | 'rejected';
  frequency: number;
  sourceDocumentTitle?: string;
  createdAt: string;
}

export interface TranslationMemoryPair {
  id: string;
  domain: DomainType;
  sourceSentence: string;
  targetSentence: string;
  confidenceScore: number; // 0 to 1
  isQuarantined: boolean;
  sourceDocument: string;
}

export interface LearnerDocument {
  id: string;
  title: string;
  domain: DomainType;
  sourceType: 'pdf' | 'docx' | 'txt' | 'scan';
  pageCount: number;
  charCount: number;
  isBilingual: boolean;
  anonymized: boolean;
  anonymizedEntitiesCount: number;
  termsExtractedCount: number;
  pairsAlignedCount: number;
  uploadedAt: string;
  rawText: string;
}

// Mechanism 2: Teacher Re-training & Student Distillation Cycle (ECAI 2020)
export interface ModelVersion {
  versionId: string;
  hash: string;
  timestamp: string;
  domain: DomainType;
  bleuDomainMeasured: number;
  bleuGeneralMeasured: number;
  chrfMeasured: number;
  glossaryAdherenceRate: number; // percentage
  numbersPreservationRate: number; // percentage
  latencyMedianMs: number;
  status: 'production' | 'candidate' | 'rolled_back';
  lambdaUsed: number; // e.g. 0.7
  topKUsed: number; // e.g. 8
  isHardTeacher: boolean; // Without label smoothing per paper §4.6
  reportSummary: string;
}

export interface RetrainingCycleStep {
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details?: string;
}

export interface PythonProjectFile {
  path: string;
  name: string;
  category: 'config' | 'models' | 'training' | 'data' | 'api' | 'utils' | 'root' | 'desktop' | 'scripts' | 'prompts';
  description: string;
  content: string;
}

// =========================================================================
// STRAT-INTELLIGENCE: AUTONOMOUS DATA ANALYSIS & STRATEGY ENGINE (McKinsey / PwC / Capgemini)
// =========================================================================

export type ConsultingModuleId =
  | 'finance'
  | 'banque'
  | 'technologie'
  | 'droit'
  | 'operations'
  | 'strategie';

export interface ModuleCognitiveProfile {
  id: ConsultingModuleId;
  name: string;
  firmBenchmark: string; // e.g. "McKinsey Corporate Finance / PwC Deals"
  roleTitle: string;
  avatar: string;
  color: string;
  bgLight: string;
  borderColor: string;
  masteryLevel: number; // 0 to 100%
  learnedDocumentsCount: number;
  metricsExtracted: number;
  inferredRulesCount: number;
  autonomousHypotheses: string[];
  criticalAlerts: string[];
  recommendedLevers: string[];
}

export interface ExtractedFinancialRatio {
  name: string;
  value: string;
  benchmark: string;
  status: 'good' | 'warning' | 'critical';
  impactExplanation: string;
}

export interface ExtractedStrategicRisk {
  id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  moduleOwner: ConsultingModuleId;
  potentialLossEstimate: string;
  mitigation: string;
}

export interface UploadedStrategicDocument {
  id: string;
  title: string;
  size: string;
  pages: number;
  type: 'financial_report' | 'audit_due_diligence' | 'contract' | 'operational_plan' | 'tech_architecture' | 'general_doc';
  ingestedAt: string;
  status: 'ready' | 'analyzing' | 'trained';
  contentSnippet: string;
  rawContent?: string;
  ratios: ExtractedFinancialRatio[];
  risks: ExtractedStrategicRisk[];
  keyFigures: Array<{ label: string; amount: string; context: string }>;
  coreTheses: string[];
}

export interface CrossModuleDebateMessage {
  id: string;
  moduleId: ConsultingModuleId;
  authorTitle: string;
  timestamp: string;
  statement: string;
  dataPointReferenced: string;
  challengeTargetModuleId?: ConsultingModuleId;
  sentiment: 'alert' | 'challenge' | 'validation' | 'synthesis';
}

export interface PrioritizationInitiative {
  id: string;
  initiative: string;
  category: 'quick_win' | 'major_project' | 'watch_out' | 'low_priority';
  impact: 'high' | 'medium' | 'low';
  complexity: 'low' | 'medium' | 'high';
  timeframe: '30_jours' | '90_jours' | '180_jours';
  financialValue: string;
  ownerModule: ConsultingModuleId;
  description: string;
}

export interface StrategicExecutiveSynthesis {
  id: string;
  dossierTitle: string;
  clientContext: string;
  executiveSummary: string; // Message d'impact pour Conseil d'Administration / ComEx
  mintoPyramid: {
    situation: string;
    complication: string;
    question: string;
    reponse: string;
  };
  crossDataInsights: Array<{
    id: string;
    title: string;
    modulesInvolved: ConsultingModuleId[];
    conflictOrSynergy: string;
    dataEvidence: string;
    executiveRecommendation: string;
    financialImpactEstimate: string;
  }>;
  prioritizationMatrix: PrioritizationInitiative[];
  actionPlan: Array<{
    horizon: 'Immédiat (0-30j)' | 'Moyen terme (30-90j)' | 'Transformation (90-180j)';
    focus: string;
    milestones: Array<{ task: string; responsible: string; deliverable: string; kpiTarget: string }>;
  }>;
  confidenceScore: number;
  netValueUnlockedEstimate: string; // e.g. "+3.8M€ à 12 mois"
  generatedAt: string;
}
