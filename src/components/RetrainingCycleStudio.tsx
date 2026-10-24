import React, { useState } from 'react';
import {
  DomainType,
  ModelVersion,
  TranslationMemoryPair,
} from '../types';
import { FIVE_AGENTS_CONFIG } from '../utils/translationEngine';
import { runAlgorithm1Cycle, RetrainingSimulationResult } from '../utils/documentLearningEngine';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Terminal,
  Cpu,
  Layers,
  Database,
  ArrowRight,
  TrendingUp,
  History,
  FileCheck2,
} from 'lucide-react';

interface RetrainingCycleStudioProps {
  translationMemory: TranslationMemoryPair[];
  modelVersions: ModelVersion[];
  onNewVersionPublished: (version: ModelVersion) => void;
  onRestoreVersion: (versionId: string) => void;
}

export const RetrainingCycleStudio: React.FC<RetrainingCycleStudioProps> = ({
  translationMemory,
  modelVersions,
  onNewVersionPublished,
  onRestoreVersion,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('droit');
  const [lambdaValue, setLambdaValue] = useState<number>(0.7);
  const [topKValue, setTopKValue] = useState<number>(8);
  const [isHardTeacher, setIsHardTeacher] = useState<boolean>(true); // No label smoothing per paper §4.6
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<RetrainingSimulationResult | null>(null);

  const activeAgent =
    FIVE_AGENTS_CONFIG.find((a) => a.id === selectedDomain) || FIVE_AGENTS_CONFIG[0];

  const domainPairs = translationMemory.filter(
    (p) => p.domain === selectedDomain && !p.isQuarantined
  );

  const handleLaunchCycle = () => {
    setIsRunning(true);
    setCurrentResult(null);

    setTimeout(() => {
      // Execute the genuine Algorithm 1 ECAI 2020 cycle
      const result = runAlgorithm1Cycle({
        domain: selectedDomain,
        validatedPairs: domainPairs,
        lambdaValue,
        topKValue,
        isHardTeacher,
      });

      setCurrentResult(result);
      if (result.passedAntiRegressionGate) {
        onNewVersionPublished(result.modelVersionCreated);
      }
      setIsRunning(false);
    }, 850);
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-white tracking-tight">
              Mécanisme 2 — Réentraînement du Professeur (ECAI 2020 Algorithm 1)
            </span>
            <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-mono px-2 py-0.5 rounded-full">
              Section 4.3 « Distillation process »
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Réentraînement neuronal périodique uniquement à partir de <strong>données bilingues alignées validées</strong>.
            Applique la sélection dynamique de données (équations 9 à 11), l’extraction Top-K (§4.4) et la fonction de perte mixte à λ=0,7 (§2.5 éq. 8).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Garantie Aucune Régression</span>
        </div>
      </div>

      {/* Grid: 4-Step Pipeline Summary & Interactive Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Parameters & Runner */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Domain Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-300">
              Agent Traducteur à réentraîner :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {FIVE_AGENTS_CONFIG.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => {
                    setSelectedDomain(agent.id);
                    setCurrentResult(null);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                    selectedDomain === agent.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold truncate">{agent.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {translationMemory.filter((p) => p.domain === agent.id).length} paires TM
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hyperparameters Config (ECAI 2020) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Hyperparamètres de l'Algorithm 1</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Lambda slider */}
              <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Poids λ (KD) :</span>
                  <strong className="text-cyan-400">{lambdaValue.toFixed(2)}</strong>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={lambdaValue}
                  onChange={(e) => setLambdaValue(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 leading-tight">
                  λ=0,7 est le compromis optimal prouvé par l'article.
                </span>
              </div>

              {/* Top-K Selection */}
              <div className="flex flex-col gap-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Top-K soft targets :</span>
                  <strong className="text-emerald-400">{topKValue}</strong>
                </div>
                <select
                  value={topKValue}
                  onChange={(e) => setTopKValue(parseInt(e.target.value, 10))}
                  className="bg-slate-900 border border-slate-700 text-xs rounded p-1 text-slate-200"
                >
                  <option value={4}>K = 4 (Économie RAM max)</option>
                  <option value={8}>K = 8 (Recommandé §4.4)</option>
                  <option value={16}>K = 16 (Haute précision)</option>
                </select>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Limite l’empreinte mémoire du vocabulaire à 32 000 tokens.
                </span>
              </div>

              {/* Hard Teacher / Label smoothing option */}
              <div className="flex flex-col justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="text-xs text-slate-300 font-semibold flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHardTeacher}
                    onChange={(e) => setIsHardTeacher(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700 rounded accent-blue-600 mt-0.5"
                  />
                  <span>Hard teacher (§4.6)</span>
                </label>
                <span className="text-[10px] text-slate-500 leading-tight mt-1">
                  Sans lissage d'étiquettes pour le prof (donne un meilleur étudiant).
                </span>
              </div>
            </div>

            {/* CLI Command Snippet */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-xs text-cyan-300">
              <div className="flex items-center gap-2 truncate">
                <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">
                  python scripts/learn_cycle.py --domain {selectedDomain} --lambda {lambdaValue} --top_k {topKValue}
                </span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                CLI
              </span>
            </div>

            {/* Run Button */}
            <button
              type="button"
              disabled={isRunning}
              onClick={handleLaunchCycle}
              className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>
                {isRunning
                  ? "Cycle d'entraînement en cours (Algorithm 1)..."
                  : `Lancer le cycle de réentraînement pour ${activeAgent.name}`}
              </span>
            </button>
          </div>

          {/* Real-time Cycle Execution Logs */}
          {currentResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-cyan-400" />
                  <span>Rapport d'exécution du cycle :</span>
                </h4>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                    currentResult.passedAntiRegressionGate
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {currentResult.passedAntiRegressionGate
                    ? '✓ Publié en production'
                    : '✗ Rollback automatique'}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono space-y-1.5 max-h-48 overflow-y-auto">
                {currentResult.stepLogs.map((log, idx) => (
                  <div key={idx} className="text-slate-300">
                    {log}
                  </div>
                ))}
              </div>

              {/* Measured Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 pt-1 text-center font-mono text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">BLEU précédent :</span>
                  <strong className="text-slate-300 text-sm">{currentResult.previousBleu}</strong>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">BLEU mesuré :</span>
                  <strong className="text-emerald-400 text-sm">{currentResult.newBleuMeasured}</strong>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Gain net :</span>
                  <strong className="text-cyan-400 text-sm">+{currentResult.bleuGain} pts</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Algorithm 1 Breakdown & Version History */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* 4 Steps of Algorithm 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Les 4 étapes de l'Algorithm 1 (PDF Page 4)</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <strong className="text-cyan-400 block mb-0.5">1. Modèle générique :</strong>
                <span className="text-slate-400">
                  Entraîner un Transformer sur grand corpus général jusqu'à convergence.
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <strong className="text-emerald-400 block mb-0.5">2. Professeurs par domaine :</strong>
                <span className="text-slate-400">
                  Copier le générique, affiner avec sélection dynamique de données (équations 9-11) sans lissage d'étiquettes.
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <strong className="text-purple-400 block mb-0.5">3. Cibles douces :</strong>
                <span className="text-slate-400">
                  Calculer et stocker les probabilités du professeur en Top-K adoucies par température T.
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                <strong className="text-blue-400 block mb-0.5">4. Étudiant multi-domaine :</strong>
                <span className="text-slate-400">
                  Entraîner un unique modèle distillé avec L = (1-&lambda;) &middot; L_CE + &lambda; &middot; L_KL à &lambda; = 0,7.
                </span>
              </div>
            </div>
          </div>

          {/* Model Version History */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Historique des Versions Signées</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {modelVersions.length} versions
              </span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {modelVersions.map((ver) => (
                <div
                  key={ver.versionId}
                  className={`p-3 rounded-lg border text-xs flex flex-col gap-1.5 transition ${
                    ver.status === 'production'
                      ? 'bg-slate-950/80 border-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-200">{ver.hash}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded uppercase">
                        {ver.domain}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-emerald-400 font-bold">{ver.bleuDomainMeasured} BLEU</span>
                      {ver.status === 'production' ? (
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
                          Actif
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRestoreVersion(ver.versionId)}
                          className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                        >
                          Restaurer
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{ver.timestamp} • λ={ver.lambdaUsed} • K={ver.topKUsed}</span>
                    <span>chrF: {ver.chrfMeasured}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
