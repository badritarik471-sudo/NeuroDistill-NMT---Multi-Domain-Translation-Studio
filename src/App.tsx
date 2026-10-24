/**
 * NeuroDistill NMT — 5 Specialized Translation Agents
 * Créé par Tarik Badri — en association avec Larbi Badri
 * Référence scientifique : Mghabbar & Ratnamogan, ECAI 2020
 */

import React, { useState } from 'react';
import { DesktopWindowFrame } from './components/DesktopWindowFrame';
import { Navigation, ActiveTab } from './components/Navigation';
import { TranslationStudio } from './components/TranslationStudio';
import { RetrainingCycleStudio } from './components/RetrainingCycleStudio';
import { EvaluationAndQuality } from './components/EvaluationAndQuality';
import { PromptEngineeringDocs } from './components/PromptEngineeringDocs';
import { ThreeNeuralScene } from './components/ThreeNeuralScene';
import { PythonProjectStudio } from './components/PythonProjectStudio';
import { ResearchPaperDigest } from './components/ResearchPaperDigest';
import { ExportModal } from './components/ExportModal';
import { StrategyStudio } from './components/StrategyStudio';
import { CrossDebateStudio } from './components/CrossDebateStudio';
import { ModuleTrainingStudio } from './components/ModuleTrainingStudio';
import {
  PlatformOS,
  DomainType,
  GlossaryItem,
  TranslationMemoryPair,
  LearnerDocument,
  ModelVersion,
  ConsultingModuleId,
  ModuleCognitiveProfile,
  UploadedStrategicDocument,
} from './types';
import {
  INITIAL_MODULE_PROFILES,
  PRELOADED_CASE_STUDIES,
} from './utils/strategicConsultingEngine';

// Seed initial verified terminology
const INITIAL_GLOSSARY: GlossaryItem[] = [
  {
    id: 'g_fin_1',
    domain: 'finance',
    sourceTerm: 'impairment loss',
    targetTerm: 'perte de valeur pour dépréciation',
    context: 'Normes IFRS 36',
    status: 'approved',
    frequency: 8,
    createdAt: '2026-10-23',
  },
  {
    id: 'g_ban_1',
    domain: 'banque',
    sourceTerm: 'overdraft facility',
    targetTerm: 'facilité de caisse / découvert autorisé',
    context: 'Conditions générales',
    status: 'approved',
    frequency: 12,
    createdAt: '2026-10-23',
  },
  {
    id: 'g_tech_1',
    domain: 'technologie',
    sourceTerm: 'rate limiting',
    targetTerm: 'limitation du débit de requêtes',
    context: 'Architecture API',
    status: 'approved',
    frequency: 15,
    createdAt: '2026-10-23',
  },
  {
    id: 'g_droit_1',
    domain: 'droit',
    sourceTerm: 'force majeure clause',
    targetTerm: 'clause de force majeure',
    context: 'Droit des contrats',
    status: 'approved',
    frequency: 9,
    createdAt: '2026-10-23',
  },
  {
    id: 'g_sante_1',
    domain: 'sante',
    sourceTerm: 'maximum tolerated dose',
    targetTerm: 'dose maximale tolérée (DMT)',
    context: 'Essais cliniques oncologie',
    status: 'approved',
    frequency: 14,
    createdAt: '2026-10-23',
  },
];

// Seed initial translation memory pairs
const INITIAL_TM_PAIRS: TranslationMemoryPair[] = [
  {
    id: 'tm_1',
    domain: 'droit',
    sourceSentence: 'Pursuant to clause 12, each party shall indemnify and hold harmless the other party.',
    targetSentence: 'En application de l’article 12, chacune des parties s’engage à indemniser et garantir l’autre partie.',
    confidenceScore: 0.96,
    isQuarantined: false,
    sourceDocument: 'Contrat Cadre International 2026.docx',
  },
  {
    id: 'tm_2',
    domain: 'sante',
    sourceSentence: 'Administer paracetamol at 1000 mg every 8 hours with maximum 3 g per day.',
    targetSentence: 'Administrer le paracétamol à la dose de 1 000 mg toutes les 8 heures sans excéder 3 g par jour.',
    confidenceScore: 0.98,
    isQuarantined: false,
    sourceDocument: 'Notice Clinique EMEA.pdf',
  },
  {
    id: 'tm_3',
    domain: 'banque',
    sourceSentence: 'The fixed APR of 4.25% is calculated including mandatory insurance charges.',
    targetSentence: 'Le TAEG fixe de 4,25 % est calculé en intégrant les frais d’assurance obligatoire.',
    confidenceScore: 0.95,
    isQuarantined: false,
    sourceDocument: 'Offre Préalable de Crédit.pdf',
  },
];

// Seed initial model version
const INITIAL_MODEL_VERSIONS: ModelVersion[] = [
  {
    versionId: 'v_prod_base',
    hash: '0x7E4A10',
    timestamp: '2026-10-23 14:30',
    domain: 'droit',
    bleuDomainMeasured: 32.0,
    bleuGeneralMeasured: 34.0,
    chrfMeasured: 59.2,
    glossaryAdherenceRate: 98.4,
    numbersPreservationRate: 100.0,
    latencyMedianMs: 15.3,
    status: 'production',
    lambdaUsed: 0.7,
    topKUsed: 8,
    isHardTeacher: true,
    reportSummary: 'Version initiale déployée en production (Hard Teacher ECAI 2020).',
  },
];

export default function App() {
  const [platform, setPlatform] = useState<PlatformOS>('macos');
  const [activeTab, setActiveTab] = useState<ActiveTab>('strategy_studio');
  const [fontScalePx, setFontScalePx] = useState<number>(18); // Default 18px, adjustable for senior/15-80+ comfort
  const [isExportOpen, setIsExportOpen] = useState(true);

  // Strategic Multi-Module Engine State (McKinsey / PwC / Capgemini)
  const [moduleProfiles, setModuleProfiles] = useState<Record<ConsultingModuleId, ModuleCognitiveProfile>>(
    INITIAL_MODULE_PROFILES
  );
  const [activeStrategicDoc, setActiveStrategicDoc] = useState<UploadedStrategicDocument>(
    PRELOADED_CASE_STUDIES[0]
  );
  const [strategicDocuments, setStrategicDocuments] = useState<UploadedStrategicDocument[]>(
    PRELOADED_CASE_STUDIES
  );

  // Learning Engine State (NMT Translation & Memory)
  const [glossary, setGlossary] = useState<GlossaryItem[]>(INITIAL_GLOSSARY);
  const [translationMemory, setTranslationMemory] = useState<TranslationMemoryPair[]>(INITIAL_TM_PAIRS);
  const [learnedDocuments, setLearnedDocuments] = useState<LearnerDocument[]>([]);
  const [modelVersions, setModelVersions] = useState<ModelVersion[]>(INITIAL_MODEL_VERSIONS);

  // Handlers for Knowledge Memory (Mécanisme 1)
  const handleSaveGlossaryItem = (item: GlossaryItem) => {
    setGlossary((prev) => {
      const idx = prev.findIndex((g) => g.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = item;
        return updated;
      }
      return [item, ...prev];
    });
  };

  const handleDeleteGlossaryItem = (id: string) => {
    setGlossary((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddTranslationMemoryPairs = (pairs: TranslationMemoryPair[]) => {
    setTranslationMemory((prev) => [...pairs, ...prev]);
  };

  const handleDocumentLearned = (doc: LearnerDocument) => {
    setLearnedDocuments((prev) => [doc, ...prev]);
  };

  const handleAdjustFontScale = (delta: number) => {
    setFontScalePx((s) => Math.min(24, Math.max(16, s + delta)));
  };

  // Average cognitive mastery of the 5 modules
  const masteryAvg = Math.round(
    Object.values(moduleProfiles).reduce((acc, p) => acc + p.masteryLevel, 0) /
      Object.values(moduleProfiles).length
  );

  return (
    <DesktopWindowFrame
      platform={platform}
      onTogglePlatform={setPlatform}
      onExportApp={() => setIsExportOpen(true)}
      fontScalePx={fontScalePx}
      onAdjustFontScale={handleAdjustFontScale}
    >
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        masteryAverage={masteryAvg}
        documentsCount={strategicDocuments.length}
      />

      <div className="flex-1 flex flex-col overflow-auto bg-slate-950">
        {/* Tab 1 (Principal): Cabinet d'Analyse Stratégique & Croisement (McKinsey/PwC Tier) */}
        {activeTab === 'strategy_studio' && (
          <StrategyStudio
            currentProfiles={moduleProfiles}
            onProfilesUpdated={setModuleProfiles}
            activeDocument={activeStrategicDoc}
            onSelectDocument={setActiveStrategicDoc}
            onOpenDebate={() => setActiveTab('cross_debate')}
          />
        )}

        {/* Tab 2: Arène de Débat Autonome en Direct */}
        {activeTab === 'cross_debate' && (
          <CrossDebateStudio
            currentProfiles={moduleProfiles}
            activeDocument={activeStrategicDoc}
            onBackToStudio={() => setActiveTab('strategy_studio')}
          />
        )}

        {/* Tab 3: Cockpit d'Entraînement des Modules par Documents */}
        {activeTab === 'module_training' && (
          <ModuleTrainingStudio
            currentProfiles={moduleProfiles}
            onProfilesUpdated={setModuleProfiles}
            onGoToStudio={() => setActiveTab('strategy_studio')}
          />
        )}

        {/* Tab 4: Moteur Python & Scripts pour macOS / Windows */}
        {activeTab === 'python_engine' && <PythonProjectStudio />}

        {/* Tab 5: Traduction Spécialisée NMT (Module Historique C1) */}
        {activeTab === 'translation_studio' && (
          <TranslationStudio
            glossary={glossary}
            translationMemory={translationMemory}
            onSaveGlossaryItem={handleSaveGlossaryItem}
            onDeleteGlossaryItem={handleDeleteGlossaryItem}
            onAddTranslationMemoryPairs={handleAddTranslationMemoryPairs}
            onDocumentLearned={handleDocumentLearned}
          />
        )}

        {/* Tab 6: Référence Scientifique & Digest de Recherche ECAI 2020 */}
        {activeTab === 'research_digest' && <ResearchPaperDigest />}
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        platform={platform}
      />
    </DesktopWindowFrame>
  );
}
