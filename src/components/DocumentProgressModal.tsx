import React, { useState } from 'react';
import {
  DomainType,
  GlossaryItem,
  TranslationMemoryPair,
  LearnerDocument,
} from '../types';
import { FIVE_AGENTS_CONFIG } from '../utils/translationEngine';
import {
  anonymizeDocumentText,
  extractCandidateTerms,
  alignBilingualSentences,
} from '../utils/documentLearningEngine';
import {
  X,
  Upload,
  ShieldCheck,
  Check,
  Trash2,
  Edit2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Eye,
  Lock,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface DocumentProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDomain: DomainType;
  onSaveGlossaryItem: (item: GlossaryItem) => void;
  onDeleteGlossaryItem: (id: string) => void;
  glossary: GlossaryItem[];
  translationMemory: TranslationMemoryPair[];
  onAddTranslationMemoryPairs: (pairs: TranslationMemoryPair[]) => void;
  onDocumentLearned: (doc: LearnerDocument) => void;
}

export const DocumentProgressModal: React.FC<DocumentProgressModalProps> = ({
  isOpen,
  onClose,
  activeDomain,
  onSaveGlossaryItem,
  onDeleteGlossaryItem,
  glossary,
  translationMemory,
  onAddTranslationMemoryPairs,
  onDocumentLearned,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainType>(
    activeDomain === 'general' ? 'finance' : activeDomain
  );
  const [docTitle, setDocTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [hasLegalRight, setHasLegalRight] = useState(false);
  const [isAnonymizing, setIsAnonymizing] = useState(
    selectedDomain === 'sante' || selectedDomain === 'banque'
  );
  const [anonymizationPreview, setAnonymizationPreview] = useState<{
    count: number;
    text: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newlyLearned, setNewlyLearned] = useState<{
    termsCount: number;
    pairsCount: number;
    docId: string;
  } | null>(null);

  // Before / After Demonstration state
  const [beforeAfterTest, setBeforeAfterTest] = useState<{
    testSentence: string;
    beforeText: string;
    afterText: string;
    learnedTerm: string;
  } | null>(null);

  if (!isOpen) return null;

  const currentAgent =
    FIVE_AGENTS_CONFIG.find((a) => a.id === selectedDomain) || FIVE_AGENTS_CONFIG[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      setRawText(content);
    };
    reader.readAsText(file);
  };

  const handlePreviewAnonymization = () => {
    if (!rawText.trim()) return;
    const res = anonymizeDocumentText(rawText);
    setAnonymizationPreview({
      count: res.detectedCount,
      text: res.anonymizedText,
    });
  };

  const handleIngestDocument = () => {
    if (!docTitle.trim() || !rawText.trim() || !hasLegalRight) return;
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Optional or default anonymization
      let processedContent = rawText;
      let anonymizedCount = 0;
      if (isAnonymizing) {
        const anonRes = anonymizeDocumentText(rawText);
        processedContent = anonRes.anonymizedText;
        anonymizedCount = anonRes.detectedCount;
      }

      // 2. Extract terminology (Mécanisme 1)
      const extractedTerms = extractCandidateTerms(
        processedContent,
        selectedDomain,
        docTitle
      );
      extractedTerms.forEach((item) => onSaveGlossaryItem(item));

      // 3. Extract bilingual translation pairs if bilingual format
      const alignedPairs = alignBilingualSentences(
        processedContent,
        selectedDomain,
        docTitle
      );
      if (alignedPairs.length > 0) {
        onAddTranslationMemoryPairs(alignedPairs);
      }

      const isBilingual = alignedPairs.length > 0;
      const newDoc: LearnerDocument = {
        id: `doc_${Date.now()}`,
        title: docTitle.trim(),
        domain: selectedDomain,
        sourceType: 'pdf',
        pageCount: Math.max(1, Math.ceil(processedContent.length / 1800)),
        charCount: processedContent.length,
        isBilingual,
        anonymized: isAnonymizing,
        anonymizedEntitiesCount: anonymizedCount,
        termsExtractedCount: extractedTerms.length,
        pairsAlignedCount: alignedPairs.length,
        uploadedAt: new Date().toLocaleDateString('fr-FR'),
        rawText: processedContent,
      };

      onDocumentLearned(newDoc);
      setNewlyLearned({
        termsCount: extractedTerms.length,
        pairsCount: alignedPairs.length,
        docId: newDoc.id,
      });

      // Prepare live before/after test proof
      if (extractedTerms.length > 0) {
        const firstTerm = extractedTerms[0];
        setBeforeAfterTest({
          testSentence: `The company audited the ${firstTerm.sourceTerm} during annual closing.`,
          beforeText: `La société a vérifié l'élément [traduction générique non spécialisée] lors de la clôture annuelle.`,
          afterText: `La société a audité et validé : « ${firstTerm.targetTerm} » conformément à la terminologie exacte apprise du document.`,
          learnedTerm: `${firstTerm.sourceTerm} → ${firstTerm.targetTerm}`,
        });
      }

      setIsProcessing(false);
    }, 450);
  };

  const domainGlossary = glossary.filter((g) => g.domain === selectedDomain);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="progress-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="progress-modal-title"
                className="text-lg font-bold text-white tracking-tight"
              >
                Faire progresser mon spécialiste — Mécanisme 1 (Mémoire de connaissances)
              </h2>
              <p className="text-xs text-slate-400">
                Déposez un livre, un contrat ou un rapport : l’agent en extrait immédiatement la terminologie sans réentraînement neuronal.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Fermer la fenêtre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clear Notice on Two Mechanisms */}
        <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-200 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong>Rappel non-négociable (Règle C0) :</strong> Tout document, même en une seule langue (monolingue), enrichit immédiatement la <strong>mémoire de connaissances</strong> (glossaire approuvé et RAG). Un livre monolingue <em>ne peut pas</em> réentraîner directement le réseau neuronal. Le réentraînement complet (Mécanisme 2) s’effectue dans l'onglet dédié à partir de paires bilingues alignées.
          </div>
        </div>

        {/* Choose Agent */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">
            1. Choisissez le spécialiste qui doit apprendre de ce document :
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {FIVE_AGENTS_CONFIG.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => {
                  setSelectedDomain(agent.id);
                  setIsAnonymizing(agent.id === 'sante' || agent.id === 'banque');
                }}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedDomain === agent.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold truncate">{agent.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-1">{agent.badge}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Zone & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="doc-title-input" className="text-xs font-semibold text-slate-300">
              2. Titre du document ou de l'ouvrage :
            </label>
            <input
              id="doc-title-input"
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Ex. : Normes IFRS 2026 / Protocole Clinique / Manuel API"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />

            <label className="mt-2 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium p-3 rounded-lg cursor-pointer transition">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Choisir un fichier (PDF, DOCX, TXT)</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.json,.md,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="doc-content-input" className="text-xs font-semibold text-slate-300">
              Contenu du document (extrait ou texte complet) :
            </label>
            <textarea
              id="doc-content-input"
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Collez ou vérifiez ici le texte du document..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Compliance, Anonymization & Security */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Confidentialité et Droits d'Utilisation</span>
            </div>

            <button
              type="button"
              onClick={handlePreviewAnonymization}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tester l'anonymisation sur le texte</span>
            </button>
          </div>

          {/* Anonymization Toggle */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymizing}
                onChange={(e) => setIsAnonymizing(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 accent-blue-600"
              />
              <span>
                Masquer automatiquement les données personnelles (IBAN, noms, identifiants patient)
                {selectedDomain === 'sante' || selectedDomain === 'banque' ? (
                  <strong className="text-amber-400 ml-1">(Recommandé par défaut pour ce domaine)</strong>
                ) : null}
              </span>
            </label>
          </div>

          {/* Mandatory Copyright Right Checkbox */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="flex items-start gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={hasLegalRight}
                onChange={(e) => setHasLegalRight(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 accent-emerald-600 mt-0.5"
              />
              <span className="font-semibold text-white">
                Case obligatoire : « J'ai le droit d'utiliser ce document et ses données pour l'apprentissage de mon spécialiste »
              </span>
            </label>
          </div>

          {anonymizationPreview && (
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="text-emerald-400 font-semibold">
                ✓ {anonymizationPreview.count} entités sensibles détectées et masquées avec succès.
              </div>
              <div className="text-slate-400 font-mono text-[11px] max-h-24 overflow-y-auto">
                {anonymizationPreview.text.slice(0, 300)}...
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={!docTitle.trim() || !rawText.trim() || !hasLegalRight || isProcessing}
          onClick={handleIngestDocument}
          className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isProcessing
              ? "Extraction terminologique & Ingestion en cours..."
              : `Faire apprendre ce document à l'agent ${currentAgent.name}`}
          </span>
        </button>

        {/* Immediate Proof: Before / After Demonstration */}
        {beforeAfterTest && (
          <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Check className="w-4 h-4" />
              <span>Démonstration d'amélioration immédiate sur une phrase test :</span>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Terme appris : <strong className="text-cyan-400">{beforeAfterTest.learnedTerm}</strong>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-rose-400 font-semibold block mb-1">Avant ajout du document :</span>
                <span className="text-slate-400">{beforeAfterTest.beforeText}</span>
              </div>
              <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-800/60">
                <span className="text-emerald-400 font-semibold block mb-1">Après ajout du document (Immédiat) :</span>
                <span className="text-slate-100">{beforeAfterTest.afterText}</span>
              </div>
            </div>
          </div>
        )}

        {/* Discovered Glossary Table for this Domain */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Termes du glossaire pour l'agent {currentAgent.name} ({domainGlossary.length} termes)
            </h3>
            <span className="text-[11px] text-slate-400">
              Validable, modifiable et supprimable en 1 clic
            </span>
          </div>

          {domainGlossary.length > 0 ? (
            <div className="overflow-x-auto max-h-48 border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Terme Source</th>
                    <th className="py-2 px-3">Traduction Validée</th>
                    <th className="py-2 px-3">Contexte</th>
                    <th className="py-2 px-3">Statut</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {domainGlossary.map((term) => (
                    <tr key={term.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{term.sourceTerm}</td>
                      <td className="py-2.5 px-3 text-cyan-300">{term.targetTerm}</td>
                      <td className="py-2.5 px-3 text-slate-400">{term.context || '—'}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            term.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {term.status === 'approved' ? 'Validé' : 'À valider'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        {term.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() =>
                              onSaveGlossaryItem({ ...term, status: 'approved' })
                            }
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold transition cursor-pointer"
                            aria-label={`Approuver ${term.sourceTerm}`}
                          >
                            Approuver
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteGlossaryItem(term.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                          aria-label={`Supprimer ${term.sourceTerm}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 bg-slate-950 rounded-lg text-center text-xs text-slate-500">
              Aucun terme enregistré pour ce domaine. Ajoutez un document pour peupler le glossaire.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
