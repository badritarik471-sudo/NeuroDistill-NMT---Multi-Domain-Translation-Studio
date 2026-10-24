/**
 * STRAT-INTELLIGENCE — Cabinet Virtuel d'Analyse Stratégique & Croisement de Données
 * Standards Direction Générale : McKinsey & Company, PwC Advisory, Capgemini Invent
 * Conçu par Tarik Badri — en association avec Larbi Badri
 */

import React, { useState, useRef } from 'react';
import {
  Briefcase,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Upload,
  Play,
  Download,
  Share2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Layers,
  ArrowRight,
  DollarSign,
  Clock,
  Compass,
  FileCheck,
  Building2,
  Zap,
} from 'lucide-react';
import {
  UploadedStrategicDocument,
  StrategicExecutiveSynthesis,
  ConsultingModuleId,
  ModuleCognitiveProfile,
} from '../types';
import {
  PRELOADED_CASE_STUDIES,
  generateExecutiveSynthesis,
  trainModulesWithDocument,
  parseUploadedDocumentText,
} from '../utils/strategicConsultingEngine';

interface StrategyStudioProps {
  currentProfiles: Record<ConsultingModuleId, ModuleCognitiveProfile>;
  onProfilesUpdated: (profiles: Record<ConsultingModuleId, ModuleCognitiveProfile>) => void;
  activeDocument: UploadedStrategicDocument;
  onSelectDocument: (doc: UploadedStrategicDocument) => void;
  onOpenDebate: () => void;
}

export const StrategyStudio: React.FC<StrategyStudioProps> = ({
  currentProfiles,
  onProfilesUpdated,
  activeDocument,
  onSelectDocument,
  onOpenDebate,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [synthesis, setSynthesis] = useState<StrategicExecutiveSynthesis>(() =>
    generateExecutiveSynthesis(activeDocument)
  );
  const [activeTabSub, setActiveTabSub] = useState<'synthesis' | 'modules' | 'cross_data' | 'matrix' | 'roadmap'>('synthesis');
  const [customText, setCustomText] = useState<string>('');
  const [isUploadingCustom, setIsUploadingCustom] = useState<boolean>(false);
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exécution de l'analyse stratégique
  const handleRunAnalysis = (docToAnalyze: UploadedStrategicDocument = activeDocument) => {
    setIsAnalyzing(true);
    setAnalysisStep('Étape 1/4 : Ingestion des documents et extraction des ratios & covenants...');

    setTimeout(() => {
      setAnalysisStep('Étape 2/4 : Entraînement autonome des 5 modules cognitifs sur les données...');
      const { updatedProfiles } = trainModulesWithDocument(docToAnalyze, currentProfiles);
      onProfilesUpdated(updatedProfiles);
    }, 600);

    setTimeout(() => {
      setAnalysisStep('Étape 3/4 : Détection contradictoire des incohérences et croisement des angles...');
    }, 1200);

    setTimeout(() => {
      setAnalysisStep('Étape 4/4 : Synthèse Exécutive ComEx selon le Principe de la Pyramide de Minto...');
      const result = generateExecutiveSynthesis(docToAnalyze);
      setSynthesis(result);
      setIsAnalyzing(false);
      setAnalysisStep('');
    }, 1800);
  };

  // Sélection d'un cas d'entreprise préchargé
  const handleSelectPreloadedCase = (caseItem: UploadedStrategicDocument) => {
    onSelectDocument(caseItem);
    handleRunAnalysis(caseItem);
  };

  // Traitement du téléversement de fichier
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsedDoc = parseUploadedDocumentText(file.name, content);
      onSelectDocument(parsedDoc);
      handleRunAnalysis(parsedDoc);
    };
    reader.readAsText(file);
  };

  // Traitement de texte personnalisé collé
  const handleProcessPastedText = () => {
    if (!customText.trim()) return;
    const parsedDoc = parseUploadedDocumentText('Document_Strategique_ComEx.txt', customText);
    onSelectDocument(parsedDoc);
    setIsUploadingCustom(false);
    setCustomText('');
    handleRunAnalysis(parsedDoc);
  };

  // Copie de la synthèse
  const handleCopySummary = () => {
    const textToCopy = `=== ${synthesis.dossierTitle} ===
Contexte : ${synthesis.clientContext}
Valeur débloquée estimée : ${synthesis.netValueUnlockedEstimate}

SYNTHÈSE EXÉCUTIVE COMEX (MCKINSEY / PWC TIER) :
${synthesis.executiveSummary}

PYRAMIDE DE MINTO :
- Situation : ${synthesis.mintoPyramid.situation}
- Complication : ${synthesis.mintoPyramid.complication}
- Question Décisionnelle : ${synthesis.mintoPyramid.question}
- Réponse Stratégique : ${synthesis.mintoPyramid.reponse}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2500);
  };

  // Export Word / Doc
  const handleDownloadDoc = () => {
    const content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${synthesis.dossierTitle}</title></head><body>
      <h1>${synthesis.dossierTitle}</h1>
      <p><strong>Contexte :</strong> ${synthesis.clientContext}</p>
      <p><strong>Impact Net Estimé :</strong> ${synthesis.netValueUnlockedEstimate}</p>
      <hr/>
      <h2>Synthèse Exécutive Conseil d'Administration</h2>
      <p>${synthesis.executiveSummary}</p>
      <h2>Pyramide de Barbara Minto</h2>
      <p><strong>Situation :</strong> ${synthesis.mintoPyramid.situation}</p>
      <p><strong>Complication :</strong> ${synthesis.mintoPyramid.complication}</p>
      <p><strong>Question Clé :</strong> ${synthesis.mintoPyramid.question}</p>
      <p><strong>Réponse Stratégique :</strong> ${synthesis.mintoPyramid.reponse}</p>
      <hr/>
      <h2>Confrontation & Croisement des Données</h2>
      ${synthesis.crossDataInsights.map((c) => `<h3>${c.title}</h3><p><strong>Preuve chiffrée :</strong> ${c.dataEvidence}</p><p><strong>Recommandation :</strong> ${c.executiveRecommendation}</p><p><strong>Impact :</strong> ${c.financialImpactEstimate}</p>`).join('')}
      <hr/>
      <p><em>Rapport généré par le Cabinet Virtuel d'Analyse Stratégique — Conception : Tarik Badri & Larbi Badri</em></p>
    </body></html>`;
    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Synthese_Strategique_ComEx_${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex-1 flex flex-col p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. HEADER EXÉCUTIF & ATTRIBUTION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950/40 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Intelligence Stratégique & Croisement de Données
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Standards McKinsey & Company · PwC Advisory · Capgemini
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Cabinet Virtuel d'Analyse Décisionnelle & Multi-Modules Autonomes
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
              Vos documents entraînent 5 modules spécialisés qui réfléchissent de leur propre gré, croisent leurs angles d'analyse (Finance, Banque, Tech, Droit, Opérations) et livrent des synthèses d'impact pour Conseil d'Administration et ComEx.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenDebate}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Voir le Débat en Direct</span>
            </button>
            <button
              type="button"
              onClick={() => handleRunAnalysis(activeDocument)}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isAnalyzing ? 'Analyse en cours...' : 'Relancer le Croisement'}</span>
            </button>
          </div>
        </div>

        {/* Attribution d'honneur */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div>
            <strong className="text-slate-300">Conception originale :</strong> Tarik Badri — <strong className="text-slate-300">en association avec :</strong> Larbi Badri
          </div>
          <div className="hidden sm:block text-slate-500 font-mono">
            Moteur Autonome v4.2 · Architecture 5 Cerveaux Spécialistes
          </div>
        </div>
      </div>

      {/* 2. SÉLECTION RAPIDE DE DOSSIER OU DÉPÔT DE DOCUMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Colonne Cas 1 : Due Diligence M&A */}
        {PRELOADED_CASE_STUDIES.map((c) => {
          const isSelected = activeDocument.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => handleSelectPreloadedCase(c)}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-blue-950/30 border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
              <div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Cas Préchargé d'Entreprise</span>
                  <span className="text-slate-600">•</span>
                  <span>{c.pages} pages</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {c.contentSnippet}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold font-mono">
                  {c.keyFigures[0]?.amount}
                </span>
                <span className="text-blue-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  {isSelected ? 'Actif · Analysé' : 'Charger ce dossier'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dépôt de document utilisateur direct (simplification maximale) */}
      <div className="bg-slate-900/40 border border-dashed border-slate-800 hover:border-blue-500/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-semibold text-white">
              Téléversez vos propres documents (PDF, Word, Bilan, Contrat, CSV, TXT)
            </h4>
            <p className="text-xs text-slate-400">
              Les 5 modules extraient automatiquement les ratios financiers, les risques cachés et les engagements juridiques.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.pdf,.docx,.doc,.csv,.json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            Choisir un Fichier
          </button>
          <button
            type="button"
            onClick={() => setIsUploadingCustom(!isUploadingCustom)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition cursor-pointer"
          >
            {isUploadingCustom ? 'Fermer la saisie' : 'Coller du Texte Brut'}
          </button>
        </div>
      </div>

      {/* Saisie de texte personnalisé dépliable */}
      {isUploadingCustom && (
        <div className="bg-slate-900 border border-blue-500/40 rounded-xl p-4 space-y-3">
          <label className="text-xs font-semibold text-slate-200 block">
            Collez le contenu textuel de votre rapport ou audit (chiffres, dettes, contrats, litiges) :
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={5}
            placeholder="Exemple : Bilan 2025 consolidé : Chiffre d'affaires de 48M€, EBITDA en baisse à 3.2M€, dette bancaire de 15M€ avec clause de covenant à 3.5x..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadingCustom(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleProcessPastedText}
              disabled={!customText.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
            >
              Analyser ce document
            </button>
          </div>
        </div>
      )}

      {/* Animation d'analyse en cours */}
      {isAnalyzing && (
        <div className="bg-blue-950/40 border border-blue-500/50 rounded-xl p-5 text-center space-y-3 animate-pulse">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-white">{analysisStep}</h3>
          <p className="text-xs text-blue-300">
            Confrontation des perspectives : Finance d'Entreprise, Trésorerie Bancaire, Architecture SI, Droit & Opérations...
          </p>
        </div>
      )}

      {/* 3. DOSSIER STRATÉGIQUE COMEX : RÉSULTATS PROBANTS (MINTO PYRAMID & CROSS-DATA) */}
      {!isAnalyzing && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
          {/* Bannière de Synthèse Chiffrée */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Livrable Conseil d'Administration / ComEx
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">
                {synthesis.dossierTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {synthesis.clientContext}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                <div className="text-[10px] text-emerald-400 uppercase font-semibold">Valeur Nette Débloquée</div>
                <div className="text-sm font-bold font-mono">{synthesis.netValueUnlockedEstimate}</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs">
                <div className="text-[10px] text-blue-400 uppercase font-semibold">Indice de Confiance</div>
                <div className="text-sm font-bold font-mono">{synthesis.confidenceScore}% (Audit MECE)</div>
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="Copier la synthèse"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedStatus ? 'Copié !' : 'Partager'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDoc}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  title="Exporter sous format Word/Doc"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export ComEx (.doc)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation secondaire interne aux résultats */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTabSub('synthesis')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTabSub === 'synthesis'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              1. Synthèse Exécutive & Pyramide Minto
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('cross_data')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTabSub === 'cross_data'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              2. Croisement Contradictoire des Données
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('modules')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTabSub === 'modules'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              3. Analyse des 5 Modules Autonomes
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('matrix')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTabSub === 'matrix'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              4. Matrice de Priorités (Impact vs Effort)
            </button>
            <button
              type="button"
              onClick={() => setActiveTabSub('roadmap')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTabSub === 'roadmap'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              5. Feuille de Route 30 - 90 - 180j
            </button>
          </div>

          {/* CONTENU ONGLET 1 : SYNTHÈSE EXÉCUTIVE & MINTO */}
          {activeTabSub === 'synthesis' && (
            <div className="space-y-6">
              {/* Message Clé pour le Conseil */}
              <div className="bg-slate-950 border-l-4 border-l-blue-500 border border-slate-800 rounded-xl p-4 md:p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wide mb-2">
                  <Compass className="w-4 h-4" />
                  Message Stratégique Clé (Executive Takeaway)
                </div>
                <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
                  {synthesis.executiveSummary}
                </p>
              </div>

              {/* Principe de la Pyramide de Minto (McKinsey Standard) */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Structure de Raisonnement — Pyramide de Barbara Minto (MECE)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded">
                      1. Situation
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {synthesis.mintoPyramid.situation}
                    </p>
                  </div>
                  <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded">
                      2. Complication
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {synthesis.mintoPyramid.complication}
                    </p>
                  </div>
                  <div className="bg-slate-950/70 border border-purple-500/30 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded">
                      3. Question Clé
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {synthesis.mintoPyramid.question}
                    </p>
                  </div>
                  <div className="bg-slate-950/70 border border-emerald-500/40 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                      4. Réponse Décisive
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                      {synthesis.mintoPyramid.reponse}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ratios Financiers & Alertes Détectées dans le Document */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase">
                      Ratios Financiers Extraits & Benchmarkés
                    </span>
                    <span className="text-[10px] text-slate-500">Normalisation d'audit</span>
                  </div>
                  <div className="space-y-2.5">
                    {activeDocument.ratios.map((r, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-200">{r.name}</div>
                          <div className="text-[11px] text-slate-400">{r.impactExplanation}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`font-mono font-bold ${r.status === 'critical' ? 'text-red-400' : r.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {r.value}
                          </div>
                          <div className="text-[10px] text-slate-500">{r.benchmark}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase">
                      Risques Stratégiques & Passifs Latents
                    </span>
                    <span className="text-[10px] text-slate-500">Exposition maximale</span>
                  </div>
                  <div className="space-y-2.5">
                    {activeDocument.risks.map((risk) => (
                      <div key={risk.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <AlertTriangle className={`w-3.5 h-3.5 ${risk.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                            {risk.description}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-red-400 shrink-0">
                            {risk.potentialLossEstimate}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-400/90 pl-5">
                          <strong>Mitigation recommandée :</strong> {risk.mitigation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENU ONGLET 2 : CROISEMENT CONTRADICTOIRE DES DONNÉES */}
          {activeTabSub === 'cross_data' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Confrontation Directe des Angles d'Attaque (Cross-Examination)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Où les départements s'opposent et comment la décision ComEx réconcilie les chiffres avec la réalité légale et opérationnelle.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenDebate}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ouvrir l'Arène de Débat Interactive</span>
                </button>
              </div>

              <div className="space-y-3">
                {synthesis.crossDataInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-3 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        {insight.title}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        {insight.modulesInvolved.map((m) => {
                          const prof = currentProfiles[m];
                          return (
                            <span
                              key={m}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold"
                              style={{ backgroundColor: prof?.bgLight, color: prof?.color }}
                            >
                              {prof?.avatar} {prof?.name.split(':')[0]}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                          Conflit ou Synergie Identifié
                        </span>
                        <p className="text-slate-300">{insight.conflictOrSynergy}</p>
                      </div>

                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                          Preuve Chiffrée dans le Document
                        </span>
                        <p className="text-amber-200/90 font-mono text-[11px]">{insight.dataEvidence}</p>
                      </div>

                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                          Impact Financier Net
                        </span>
                        <p className="text-emerald-300 font-bold font-mono">{insight.financialImpactEstimate}</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200">
                      <strong>Directive ComEx :</strong> {insight.executiveRecommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTENU ONGLET 3 : LES 5 MODULES EXPERTS AUTONOMES */}
          {activeTabSub === 'modules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(['finance', 'banque', 'technologie', 'droit', 'operations'] as ConsultingModuleId[]).map((modId) => {
                const profile = currentProfiles[modId];
                return (
                  <div
                    key={modId}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{profile.avatar}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-blue-400 border border-slate-800">
                          Maturité {profile.masteryLevel}%
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{profile.name}</h4>
                      <p className="text-[11px] text-slate-400">{profile.firmBenchmark}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                          Hypothèse de réflexion autonome :
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {profile.autonomousHypotheses[0] || 'Modélisation en cours...'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                          Levier d'action recommandé :
                        </span>
                        <p className="text-emerald-300/90 text-[11px] leading-relaxed">
                          {profile.recommendedLevers[0] || 'Optimisation en attente.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{profile.metricsExtracted} ratios indexés</span>
                      <span>{profile.inferredRulesCount} règles déduites</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CONTENU ONGLET 4 : MATRICE DE PRIORISATION (IMPACT VS EFFORT) */}
          {activeTabSub === 'matrix' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Matrice MECE de Priorisation Stratégique
                </h3>
                <p className="text-xs text-slate-400">
                  Classement rigoureux des chantiers pour maximiser le retour sur investissement sous contrainte de temps et de capital.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quick Wins */}
                <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 uppercase">
                      Quick Wins (Impact Élevé · Effort Faible)
                    </span>
                    <span className="text-xs text-slate-400">0 à 30 jours</span>
                  </div>
                  <div className="space-y-2">
                    {synthesis.prioritizationMatrix
                      .filter((p) => p.category === 'quick_win')
                      .map((p) => (
                        <div key={p.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                          <div className="font-semibold text-slate-200">{p.initiative}</div>
                          <div className="text-slate-400 text-[11px]">{p.description}</div>
                          <div className="text-emerald-400 font-mono font-bold pt-1">{p.financialValue}</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Projets Majeurs */}
                <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 uppercase">
                      Projets Majeurs Structurants
                    </span>
                    <span className="text-xs text-slate-400">30 à 90 jours</span>
                  </div>
                  <div className="space-y-2">
                    {synthesis.prioritizationMatrix
                      .filter((p) => p.category === 'major_project')
                      .map((p) => (
                        <div key={p.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                          <div className="font-semibold text-slate-200">{p.initiative}</div>
                          <div className="text-slate-400 text-[11px]">{p.description}</div>
                          <div className="text-blue-400 font-mono font-bold pt-1">{p.financialValue}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENU ONGLET 5 : FEUILLE DE ROUTE COMEX 30 - 90 - 180J */}
          {activeTabSub === 'roadmap' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Feuille de Route Décisionnelle ComEx (30 · 90 · 180 Jours)
                </h3>
                <p className="text-xs text-slate-400">
                  Plan d'exécution opérationnel et financier avec désignation des porteurs de chantiers et KPIs mesurables.
                </p>
              </div>

              <div className="space-y-4">
                {synthesis.actionPlan.map((horizon, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-xs md:text-sm font-bold text-white">{horizon.horizon}</span>
                      </div>
                      <span className="text-xs text-blue-300 font-medium">{horizon.focus}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {horizon.milestones.map((milestone, mIdx) => (
                        <div key={mIdx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                          <div className="font-bold text-slate-200">{milestone.task}</div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span><strong>Responsable :</strong> {milestone.responsible}</span>
                          </div>
                          <div className="text-[11px] text-blue-300">
                            <strong>Livrable :</strong> {milestone.deliverable}
                          </div>
                          <div className="text-[11px] text-emerald-400 font-mono">
                            <strong>KPI Cible :</strong> {milestone.kpiTarget}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
