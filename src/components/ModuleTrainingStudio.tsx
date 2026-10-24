/**
 * STRAT-INTELLIGENCE — Cockpit d'Entraînement Autonome des 5 Modules Spécialistes
 * Permet aux 5 cerveaux d'apprendre des documents réels pour réfléchir de leur propre gré
 * Conçu par Tarik Badri — en association avec Larbi Badri
 */

import React, { useState, useRef } from 'react';
import {
  Brain,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileText,
  RotateCcw,
  Zap,
  Building,
  Scale,
  Cpu,
  Coins,
  Factory,
} from 'lucide-react';
import {
  UploadedStrategicDocument,
  ConsultingModuleId,
  ModuleCognitiveProfile,
} from '../types';
import {
  trainModulesWithDocument,
  parseUploadedDocumentText,
  PRELOADED_CASE_STUDIES,
} from '../utils/strategicConsultingEngine';

interface ModuleTrainingStudioProps {
  currentProfiles: Record<ConsultingModuleId, ModuleCognitiveProfile>;
  onProfilesUpdated: (profiles: Record<ConsultingModuleId, ModuleCognitiveProfile>) => void;
  onGoToStudio: () => void;
}

export const ModuleTrainingStudio: React.FC<ModuleTrainingStudioProps> = ({
  currentProfiles,
  onProfilesUpdated,
  onGoToStudio,
}) => {
  const [trainingLogs, setTrainingLogs] = useState<string[]>([
    'Initialisation du réseau cognitif des 5 modules experts...',
    'Standards de référence chargés : McKinsey Corporate Finance, PwC Legal, Capgemini Invent.',
    'Modules en attente de nouveaux documents ou prêts sur les cas préchargés.',
  ]);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Entraînement avec un cas existant
  const handleTrainWithCase = (caseDoc: UploadedStrategicDocument) => {
    setIsTraining(true);
    setTimeout(() => {
      const { updatedProfiles, log } = trainModulesWithDocument(caseDoc, currentProfiles);
      onProfilesUpdated(updatedProfiles);
      setTrainingLogs((prev) => [...log, ...prev]);
      setIsTraining(false);
    }, 800);
  };

  // Téléversement d'un document personnalisé pour entraînement
  const handleUploadAndTrain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsTraining(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsedDoc = parseUploadedDocumentText(file.name, content);
      const { updatedProfiles, log } = trainModulesWithDocument(parsedDoc, currentProfiles);
      onProfilesUpdated(updatedProfiles);
      setTrainingLogs((prev) => [
        `[Document Téléversé] « ${file.name} » ingéré avec succès (${file.size} octets).`,
        ...log,
        ...prev,
      ]);
      setIsTraining(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full flex-1 flex flex-col p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <Brain className="w-3 h-3 text-blue-400" />
              Entraînement Continu & Distillation Cognitive
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Cockpit d'Apprentissage Autonome des 5 Cerveaux Spécialistes
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Chaque document téléversé affine les poids de réflexion des modules : ratios indexés, règles de décision inférées et alertes forgées de façon autonome.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadAndTrain}
            accept=".txt,.pdf,.docx,.doc,.csv,.json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isTraining}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{isTraining ? 'Entraînement en cours...' : 'Téléverser un Document'}</span>
          </button>
        </div>
      </div>

      {/* Cartes d'État Cognitif des 5 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(['finance', 'banque', 'technologie', 'droit', 'operations', 'strategie'] as ConsultingModuleId[]).map((modId) => {
          const profile = currentProfiles[modId];
          const isLead = modId === 'strategie';

          return (
            <div
              key={modId}
              className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${
                isLead
                  ? 'bg-amber-950/20 border-amber-500/40 md:col-span-2 lg:col-span-1 shadow-md shadow-amber-500/5'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {profile.avatar}
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-blue-400">
                      Maturité {profile.masteryLevel}%
                    </span>
                    <div className="w-24 h-2 bg-slate-950 rounded-full overflow-hidden mt-1 border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${profile.masteryLevel}%` }}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mt-1">{profile.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{profile.firmBenchmark}</p>
              </div>

              {/* Ratios & Règles acquises */}
              <div className="grid grid-cols-2 gap-2 text-center py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-850 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Ratios Extraits</div>
                  <div className="font-mono font-bold text-white text-sm">{profile.metricsExtracted}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Règles Inférées</div>
                  <div className="font-mono font-bold text-emerald-400 text-sm">{profile.inferredRulesCount}</div>
                </div>
              </div>

              {/* Hypothèse de réflexion autonome */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Raisonnement Autonome Actuel :
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  {profile.autonomousHypotheses[0] || 'En attente de documents...'}
                </p>
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>{profile.learnedDocumentsCount} documents appris</span>
                <span className="text-emerald-400">Poids actifs</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Raccourcis d'entraînement avec cas d'entreprise */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Entraîner Immédiatement sur un Cas d'Audit Réel
            </h3>
            <p className="text-xs text-slate-400">
              Injectez instantanément un dossier complet pour tester la capacité des modules à raisonner de leur propre gré.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToStudio}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            Aller au Studio Décisionnel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRELOADED_CASE_STUDIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleTrainWithCase(c)}
              disabled={isTraining}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-900 text-left transition cursor-pointer space-y-1.5 disabled:opacity-50"
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>{c.title.split('—')[0]}</span>
                <span className="text-[10px] text-blue-400 font-mono">Injecter</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {c.contentSnippet}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Journal d'Apprentissage Autonome (Training Log Stream) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
          <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Journal d'Apprentissage Autonome en Direct
          </span>
          <span className="text-[10px] text-slate-500">Moteur de distillation & raisonnement</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 text-slate-400 text-[11px]">
          {trainingLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-blue-500 shrink-0">›</span>
              <span className={log.includes('[Module') ? 'text-blue-300' : log.includes('[Document') ? 'text-emerald-300 font-bold' : 'text-slate-400'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
