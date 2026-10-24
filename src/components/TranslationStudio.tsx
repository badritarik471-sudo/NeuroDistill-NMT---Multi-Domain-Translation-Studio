import React, { useState } from 'react';
import {
  DomainType,
  GlossaryItem,
  TranslationMemoryPair,
  LearnerDocument,
} from '../types';
import {
  FIVE_AGENTS_CONFIG,
  executeAgentTranslation,
} from '../utils/translationEngine';
import {
  Sparkles,
  ArrowRightLeft,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Download,
  AlertTriangle,
  ShieldAlert,
  BookOpen,
  Briefcase,
  Landmark,
  Cpu,
  Scale,
  Activity,
  Globe,
  FileText,
  Upload,
  Info,
} from 'lucide-react';
import { DocumentProgressModal } from './DocumentProgressModal';

interface TranslationStudioProps {
  glossary: GlossaryItem[];
  translationMemory: TranslationMemoryPair[];
  onSaveGlossaryItem: (item: GlossaryItem) => void;
  onDeleteGlossaryItem: (id: string) => void;
  onAddTranslationMemoryPairs: (pairs: TranslationMemoryPair[]) => void;
  onDocumentLearned: (doc: LearnerDocument) => void;
}

export const TranslationStudio: React.FC<TranslationStudioProps> = ({
  glossary,
  translationMemory,
  onSaveGlossaryItem,
  onDeleteGlossaryItem,
  onAddTranslationMemoryPairs,
  onDocumentLearned,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainType | 'auto'>('auto');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [sourceText, setSourceText] = useState(
    'The corporation recorded an impairment loss on non-current assets while maintaining adequate hedging instruments.'
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Initial translation execution
  const [result, setResult] = useState(() =>
    executeAgentTranslation({
      text: sourceText,
      domainId: 'finance',
      targetLang: 'fr',
      approvedGlossary: glossary,
    })
  );

  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      const res = executeAgentTranslation({
        text: sourceText,
        domainId: selectedDomain,
        targetLang,
        approvedGlossary: glossary,
      });
      setResult(res);
      setIsTranslating(false);
    }, 280);
  };

  const handleSwapLanguages = () => {
    const prevSrc = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(prevSrc);
    if (result.primaryTranslation) {
      setSourceText(result.primaryTranslation);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang === 'fr' ? 'fr-FR' : targetLang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadWord = () => {
    const content = `TRADUCTION SPÉCIALISÉE NEURODISTILL\nCréé par Tarik Badri — en association avec Larbi Badri\nRéférence scientifique : Mghabbar & Ratnamogan (ECAI 2020)\n\nDOMAINE : ${result.detectedDomain.toUpperCase()}\nLANGUE SOURCE : ${sourceLang.toUpperCase()} → LANGUE CIBLE : ${targetLang.toUpperCase()}\n\nTEXTE SOURCE :\n${sourceText}\n\nTRADUCTION :\n${result.primaryTranslation}\n\nTERMES SENSIBLES & CHOIX :\n${result.sensitiveTerms.map((t) => `- ${t.original} → ${t.translated} (${t.reason})`).join('\n')}\n\nAVERTISSEMENT DÉONTOLOGIQUE :\n${result.disclaimer}`;
    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traduction_${result.detectedDomain}_${Date.now()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSelectDomainPreset = (domId: DomainType | 'auto') => {
    setSelectedDomain(domId);
    if (domId !== 'auto') {
      const domMeta = FIVE_AGENTS_CONFIG.find((d) => d.id === domId);
      if (domMeta) {
        setSourceText(domMeta.sampleSourceText);
        setResult(
          executeAgentTranslation({
            text: domMeta.sampleSourceText,
            domainId: domId,
            targetLang,
            approvedGlossary: glossary,
          })
        );
      }
    }
  };

  const getDomainIcon = (domId: DomainType) => {
    switch (domId) {
      case 'finance':
        return <Briefcase className="w-5 h-5 text-amber-400" />;
      case 'banque':
        return <Landmark className="w-5 h-5 text-emerald-400" />;
      case 'technologie':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'droit':
        return <Scale className="w-5 h-5 text-purple-400" />;
      case 'sante':
        return <Activity className="w-5 h-5 text-rose-400" />;
      default:
        return <Globe className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* 5 Big Tiles Selection (Partie C5) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Choisissez votre agent traducteur spécialisé (ou Détection Automatique) :
          </label>
          <button
            type="button"
            onClick={() => setShowProgressModal(true)}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-950/80 border border-cyan-800/80 px-3 py-1.5 rounded-lg cursor-pointer transition"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Faire progresser mon spécialiste (Ajouter des documents)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {/* Auto tile */}
          <button
            type="button"
            onClick={() => handleSelectDomainPreset('auto')}
            className={`min-h-[82px] p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              selectedDomain === 'auto'
                ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-lg'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <Globe className="w-5 h-5 text-cyan-300" />
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/30">
                IA Auto
              </span>
            </div>
            <div>
              <div className="font-bold text-sm">Automatique</div>
              <div className="text-[10px] opacity-80 truncate">Routage instantané</div>
            </div>
          </button>

          {/* 5 Agents */}
          {FIVE_AGENTS_CONFIG.map((agent) => {
            const isSelected = selectedDomain === agent.id;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => handleSelectDomainPreset(agent.id)}
                className={`min-h-[82px] p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  {getDomainIcon(agent.id)}
                  <span className="text-[10px] uppercase font-mono text-slate-400">
                    {agent.badge.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-sm truncate">{agent.name}</div>
                  <div className="text-[10px] opacity-80 truncate">{agent.badge}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Switcher Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Sens de traduction :</span>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
            aria-label="Langue source"
          >
            <option value="en">Anglais (English)</option>
            <option value="fr">Français</option>
            <option value="es">Espagnol (Español)</option>
            <option value="de">Allemand (Deutsch)</option>
            <option value="ar">Arabe (العربية)</option>
          </select>

          <button
            type="button"
            onClick={handleSwapLanguages}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white transition cursor-pointer"
            title="Inverser les langues"
            aria-label="Inverser les langues"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
            aria-label="Langue cible"
          >
            <option value="fr">Français</option>
            <option value="en">Anglais (English)</option>
            <option value="es">Espagnol (Español)</option>
            <option value="de">Allemand (Deutsch)</option>
            <option value="ar">Arabe (العربية)</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Agent actif : <strong className="text-cyan-400 capitalize">{result.detectedDomain}</strong></span>
          {result.glossaryAppliedCount > 0 && (
            <span className="text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              {result.glossaryAppliedCount} terme(s) du glossaire appliqué(s)
            </span>
          )}
        </div>
      </div>

      {/* Main Workspace (Input & Output side by side) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Text Box (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label htmlFor="main-source-input" className="text-xs font-semibold text-slate-300">
              Texte à traduire :
            </label>
            <span className="text-xs font-mono text-slate-500">
              {sourceText.length} caractères | {sourceText.split(/\s+/).filter(Boolean).length} mots
            </span>
          </div>

          <textarea
            id="main-source-input"
            rows={7}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Tapez, collez votre texte ou glissez votre document..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition resize-none leading-relaxed"
          />

          {/* Giant Translate Action Button (C5 Directive: >=48px height) */}
          <button
            type="button"
            disabled={isTranslating || !sourceText.trim()}
            onClick={handleTranslate}
            className="w-full min-h-[54px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-white text-base font-bold rounded-xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isTranslating ? 'Traduction en cours...' : 'Traduire avec mon Spécialiste'}</span>
          </button>
        </div>

        {/* Right: Output Translation with Plain-Language Confidence & Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Primary Translated Result */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Traduction Recommandée</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                  Modèle Étudiant Distillé (+2.1 BLEU)
                </span>
              </div>

              {/* Action Buttons: Copier, Écouter, Télécharger (C5) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSpeak(result.primaryTranslation)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  aria-label="Écouter la traduction à la voix"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Arrêter' : 'Écouter'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(result.primaryTranslation, 0)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                  aria-label="Copier la traduction"
                >
                  {copiedIndex === 0 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedIndex === 0 ? 'Copié' : 'Copier'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadWord}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                  aria-label="Télécharger le document traduit"
                >
                  <Download className="w-4 h-4" />
                  <span>Word / Doc</span>
                </button>
              </div>
            </div>

            {/* Translation Text Body */}
            <div
              dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
              className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-base text-slate-100 leading-relaxed font-sans"
            >
              {result.primaryTranslation}
            </div>

            {/* Plain-Language Confidence Rating (Directive C5) */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Niveau de confiance :</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[11px] ${
                    result.confidenceLevel === 'eleve'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : result.confidenceLevel === 'moyen'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {result.confidenceLevel === 'eleve'
                    ? 'Élevé'
                    : result.confidenceLevel === 'moyen'
                    ? 'Moyen'
                    : 'Faible'}
                </span>
                <span className="text-slate-400 text-[11px]">— {result.confidenceReason}</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">Latence : {result.latencyMs} ms</span>
            </div>

            {/* Sensitive Terms and Chosen Translations (Directive C1) */}
            {result.sensitiveTerms.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Choix terminologiques et termes sensibles vérifiés :
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {result.sensitiveTerms.map((term, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start justify-between text-xs gap-3"
                    >
                      <div>
                        <span className="font-semibold text-slate-200">{term.original}</span>
                        <span className="text-slate-500 mx-2">→</span>
                        <span className="text-cyan-300 font-medium">{term.translated}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 text-right">
                        {term.fromGlossary && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded mr-1.5">
                            Glossaire
                          </span>
                        )}
                        <span>{term.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Notes [À VÉRIFIER] (Directive C1) */}
            {result.verificationNotes.length > 0 && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl space-y-1.5 text-xs text-amber-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Notes de vigilance [À VÉRIFIER] :</span>
                </div>
                {result.verificationNotes.map((note, i) => (
                  <p key={i} className="leading-relaxed">
                    « {note.passage} » : {note.reason}
                  </p>
                ))}
              </div>
            )}

            {/* Domain Deontological Disclaimer Notice (Directive C1) */}
            <div className="pt-2 border-t border-slate-800 flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Avertissement déontologique :</strong> {result.disclaimer}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Ingestion Modal (Mécanisme 1) */}
      <DocumentProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        activeDomain={result.detectedDomain}
        onSaveGlossaryItem={onSaveGlossaryItem}
        onDeleteGlossaryItem={onDeleteGlossaryItem}
        glossary={glossary}
        translationMemory={translationMemory}
        onAddTranslationMemoryPairs={onAddTranslationMemoryPairs}
        onDocumentLearned={onDocumentLearned}
      />
    </div>
  );
};
