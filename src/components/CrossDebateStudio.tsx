/**
 * STRAT-INTELLIGENCE — Arène de Débat & Croisement Autonome des 5 Cerveaux
 * Conception : Tarik Badri — en association avec Larbi Badri
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldAlert,
  Zap,
  TrendingDown,
  CheckCircle,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Send,
  Building,
  UserCheck,
  Scale,
  Cpu,
  Coins,
  Factory,
} from 'lucide-react';
import {
  UploadedStrategicDocument,
  CrossModuleDebateMessage,
  ConsultingModuleId,
  ModuleCognitiveProfile,
} from '../types';
import { generateCrossModuleDebate } from '../utils/strategicConsultingEngine';

interface CrossDebateStudioProps {
  currentProfiles: Record<ConsultingModuleId, ModuleCognitiveProfile>;
  activeDocument: UploadedStrategicDocument;
  onBackToStudio: () => void;
}

export const CrossDebateStudio: React.FC<CrossDebateStudioProps> = ({
  currentProfiles,
  activeDocument,
  onBackToStudio,
}) => {
  const [messages, setMessages] = useState<CrossModuleDebateMessage[]>(() =>
    generateCrossModuleDebate(activeDocument)
  );
  const [filterModule, setFilterModule] = useState<string>('all');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Synthèse vocale Web Speech API
  const handleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking && activeSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;
    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeakingId(null);
    };
    setActiveSpeakingId(msgId);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Poser une question personnalisée au collège des 5 modules
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const userPrompt = customQuestion;
    setCustomQuestion('');

    const time = new Date().toTimeString().split(' ')[0];

    // Réponse autonome orchestrée par les modules compétents
    const lower = userPrompt.toLowerCase();
    let replyModule: ConsultingModuleId = 'strategie';
    let replyAuthor = 'Senior Strategy Partner (McKinsey / PwC Lead)';
    let replyStatement = `Arbitrage collégial sur votre question : « ${userPrompt} ». Le croisement des données du dossier montre que tout report sans compensation dégrade la liquidité nette sous 90 jours.`;

    if (lower.includes('cash') || lower.includes('coût') || lower.includes('prix') || lower.includes('marge') || lower.includes('ebitda')) {
      replyModule = 'finance';
      replyAuthor = 'Partner Corporate Finance & M&A (Module 1)';
      replyStatement = `Sur le plan financier direct, ce scénario impacterait immédiatement la marge opérationnelle de 450k€ à 1.2M€. Tout décalage doit être compensé par une réduction proportionnelle du BFR ou un recalibrage du Capex.`;
    } else if (lower.includes('dette') || lower.includes('banque') || lower.includes('covenant') || lower.includes('taux')) {
      replyModule = 'banque';
      replyAuthor = 'Director Credit & Treasury Advisory (Module 2)';
      replyStatement = `Alerte bancaire : la marge de manoeuvre auprès du pool bancaire est quasi-nulle. Ce choix risque de déclencher un test de covenant négatif lors de la prochaine clôture trimestrielle.`;
    } else if (lower.includes('tech') || lower.includes('informatique') || lower.includes('erp') || lower.includes('dora')) {
      replyModule = 'technologie';
      replyAuthor = 'VP Technology & Digital Transformation (Module 3)';
      replyStatement = `Du point de vue des systèmes, reporter ce chantier augmente la probabilité d'incident critique de 35% lors des pics d'activité et viole les exigences de résilience DORA.`;
    } else if (lower.includes('contrat') || lower.includes('juridique') || lower.includes('clause') || lower.includes('client')) {
      replyModule = 'droit';
      replyAuthor = 'Senior Counsel Legal & Compliance (Module 4)';
      replyStatement = `Sur le plan contractuel, nous devons vérifier si cette décision active une clause résolutoire ou expose l'entreprise à des indemnités pour rupture unilatérale.`;
    }

    const newReply: CrossModuleDebateMessage = {
      id: `custom_${Date.now()}`,
      moduleId: replyModule,
      authorTitle: replyAuthor,
      timestamp: time,
      statement: replyStatement,
      dataPointReferenced: `Question utilisateur : « ${userPrompt} »`,
      sentiment: replyModule === 'banque' ? 'alert' : 'challenge',
    };

    setMessages((prev) => [...prev, newReply]);
  };

  const filteredMessages = messages.filter((m) =>
    filterModule === 'all' ? true : m.moduleId === filterModule
  );

  return (
    <div className="w-full flex-1 flex flex-col p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header de l'Arène */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              Débat Autonome en Direct (Live War Room)
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Dossier : {activeDocument.title}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Croisement Contradictoire des 5 Cerveaux Spécialistes
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Observez comment les modules confrontent leurs données de leur propre gré, isolent les contradictions dans les chiffres et s'alignent pour le ComEx.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToStudio}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer shrink-0 self-start md:self-auto"
        >
          Retour à la Synthèse ComEx
        </button>
      </div>

      {/* Barre de Filtre par Module */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Filtrer par module :</span>
        <button
          type="button"
          onClick={() => setFilterModule('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            filterModule === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          Tous les échanges ({messages.length})
        </button>
        {(['finance', 'banque', 'technologie', 'droit', 'operations', 'strategie'] as ConsultingModuleId[]).map((id) => {
          const prof = currentProfiles[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFilterModule(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterModule === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{prof.avatar}</span>
              <span>{prof.name.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Fil de discussion interactif (War Room) */}
      <div className="space-y-4">
        {filteredMessages.map((msg) => {
          const prof = currentProfiles[msg.moduleId];
          const isSynthesis = msg.sentiment === 'synthesis';
          const isAlert = msg.sentiment === 'alert';
          const isChallenge = msg.sentiment === 'challenge';

          return (
            <div
              key={msg.id}
              className={`rounded-2xl border p-4.5 transition relative ${
                isSynthesis
                  ? 'bg-amber-950/25 border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : isAlert
                  ? 'bg-red-950/20 border-red-500/40'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    {prof?.avatar || '🎯'}
                  </span>
                  <div>
                    <div className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                      <span>{msg.authorTitle}</span>
                      {isSynthesis && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Arbitrage ComEx
                        </span>
                      )}
                      {isAlert && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                          Alerte Critique
                        </span>
                      )}
                      {isChallenge && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Contestation
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {prof?.firmBenchmark}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-[11px] text-slate-500 font-mono">{msg.timestamp}</span>
                  <button
                    type="button"
                    onClick={() => handleSpeak(msg.statement, msg.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Écouter l'intervention"
                  >
                    {isSpeaking && activeSpeakingId === msg.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Contenu du propos */}
              <div className="mt-3 space-y-2.5">
                <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
                  {msg.statement}
                </p>

                {/* Preuve chiffrée citée */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center gap-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">
                    Preuve chiffrée isolée :
                  </span>
                  <span className="text-amber-300 font-mono text-[11px] font-medium">
                    {msg.dataPointReferenced}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Boîte de questionnement interactif direct */}
      <form
        onSubmit={handleAskQuestion}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xl"
      >
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Posez une question ou soumettez une hypothèse aux 5 modules (ex: Quel impact si notre client principal rompt le contrat ?)"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!customQuestion.trim()}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Faire Réfléchir les 5 Cerveaux</span>
        </button>
      </form>
    </div>
  );
};
