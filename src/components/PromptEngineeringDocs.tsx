import React, { useState } from 'react';
import {
  MASTER_PROMPT_C0,
  AGENT_SYSTEM_PROMPTS_C1,
} from '../utils/agentsPrompts';
import { Copy, Check, Terminal, FileCode, Sparkles, BookOpen } from 'lucide-react';

export const PromptEngineeringDocs: React.FC = () => {
  const [selectedPromptKey, setSelectedPromptKey] = useState<string>('c0_master');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const PROMPT_COLLECTION: {
    id: string;
    title: string;
    badge: string;
    description: string;
    content: string;
  }[] = [
    {
      id: 'c0_master',
      title: 'C0. Prompt Maître (Architecture & Principes)',
      badge: 'Gouvernance globale',
      description: 'Définit le rôle, les 6 principes non-négociables, les crédits (Tarik Badri & Larbi Badri) et la méthodologie.',
      content: MASTER_PROMPT_C0,
    },
    {
      id: 'c1_finance',
      title: 'C1. Agent Spécialisé FINANCE',
      badge: 'Comptabilité & IFRS',
      description: 'Règles d’arrondis stricts, distinction provision/réserve/amortissement, aucun conseil en investissement.',
      content: AGENT_SYSTEM_PROMPTS_C1.finance.fullPromptText,
    },
    {
      id: 'c1_banque',
      title: 'C1. Agent Spécialisé BANQUE',
      badge: 'Crédit & Paiements',
      description: 'IBAN/BIC intacts, TAEG scrupuleux, anonymisation des coordonnées, aucun conseil de crédit.',
      content: AGENT_SYSTEM_PROMPTS_C1.banque.fullPromptText,
    },
    {
      id: 'c1_technologie',
      title: 'C1. Agent Spécialisé TECHNOLOGIE',
      badge: 'Code & API',
      description: 'NE JAMAIS traduire code, CLI, endpoints, variables ; Markdown intact ; vocabulaire d’ingénierie.',
      content: AGENT_SYSTEM_PROMPTS_C1.technologie.fullPromptText,
    },
    {
      id: 'c1_droit',
      title: 'C1. Agent Spécialisé DROIT_CONFORMITE',
      badge: 'Contrats & RGPD',
      description: 'Modaux shall/may stricts, pas de faux équivalents, conservation des articles, avertissement assermenté.',
      content: AGENT_SYSTEM_PROMPTS_C1.droit.fullPromptText,
    },
    {
      id: 'c1_sante',
      title: 'C1. Agent Spécialisé SANTE_MEDECINE',
      badge: 'Doses & DCI',
      description: 'Doses, unités et fréquences JAMAIS approximées, molécules DCI, [À VÉRIFIER] obligatoire, aucun avis médical.',
      content: AGENT_SYSTEM_PROMPTS_C1.sante.fullPromptText,
    },
    {
      id: 'c2_ingestion',
      title: 'C2. Prompt Ingestion de Documents & Apprentissage Mémoire',
      badge: 'Mécanisme 1',
      description: 'Pipeline PDF/Word, OCR Indra, détection de langue, anonymisation préalable, glossaire validable par l’utilisateur.',
      content: `OBJECTIF
Construire le pipeline qui permet à chaque agent d'apprendre de documents fournis.

TÂCHES
1. POST /v1/agents/{domain}/documents : upload PDF/DOCX/image. Vérifie type MIME,
   taille, et demande la confirmation « J'ai le droit d'utiliser ce document ».
2. Extraction : DOCX via python-docx ; PDF numérique via la couche texte ; PDF scanné
   et images via Indra OCR (lis d'abord le README du dépôt datalab-to/indra, n'invente
   aucun appel d'API). Conserve numéros de page et structure.
3. Nettoyage : suppression en-têtes/pieds de page répétés, normalisation Unicode,
   recollage des mots coupés, détection de langue par bloc.
4. Anonymisation optionnelle (noms, numéros de compte, identifiants patient) avec
   aperçu avant validation ; obligatoire par défaut pour Santé et Banque.
5. Classification : confirme que le document correspond au domaine choisi (embeddings),
   sinon propose le bon agent.
6. Mécanisme 1 — mémoire de connaissances :
   a. Extraction de termes candidats (fréquence, motifs de termes composés) ;
   b. Glossaire proposé à la validation de l'utilisateur (jamais appliqué sans validation) ;
   c. Indexation RAG du texte avec source et page ;
   d. Si le document est bilingue : alignement de phrases (embeddings multilingues,
      score de confiance) → mémoire de traduction ; paires à faible confiance mises
      en quarantaine pour relecture.
7. Tableau de bord : nombre de documents, termes appris, paires alignées, qualité.
8. Tests : PDF numérique, scan incliné, DOCX bilingue, document hors domaine,
   injection de prompt dans un document.

CRITÈRES D'ACCEPTATION
- Un document déposé améliore immédiatement la terminologie de l'agent (démontré par
  un test avant/après sur une phrase contenant un terme du document).
- Les termes appris sont visibles, modifiables et supprimables par l'utilisateur.`,
    },
    {
      id: 'c3_retraining',
      title: 'C3. Prompt Réentraînement du Professeur (ECAI 2020)',
      badge: 'Mécanisme 2',
      description: 'Algorithm 1, sélection dynamique CED, Soft targets Top-K, Hard teacher sans lissage, distillation lambda=0,7.',
      content: `OBJECTIF
Implémenter le Mécanisme 2 : réentraîner périodiquement le professeur de chaque
domaine à partir des paires de phrases alignées validées, puis redistiller l'étudiant.

CONTEXTE SCIENTIFIQUE (ECAI 2020, Algorithm 1, section 4.3 ; section 4.2 ; éq. 8-11)

TÂCHES
1. Seuil de déclenchement : lance un cycle seulement si le domaine a accumulé au moins
   N paires validées (configurable) ; sinon seul le Mécanisme 1 s'applique.
2. Sélection dynamique de données (section 4.2) : classe les phrases du corpus général
   par CED = [H_I(source) − H_G(source)] + [H_I(cible) − H_G(cible)] à l'aide de deux
   modèles de langue (domaine / général) ; taille de sélection par époque
   n(i) = α·|G|·β^((i−1)/ν) ; affinage progressif du professeur.
3. Professeur du domaine : copie du modèle générique affinée avec la sélection
   dynamique. Sauvegarde d'un point de contrôle toutes les 1000 étapes ; garde le
   meilleur selon BLEU sur le jeu de validation du domaine.
4. Lissage d'étiquettes : le paper montre que des professeurs entraînés SANS lissage
   donnent un meilleur étudiant (Hard student). Désactive-le par défaut pour les
   professeurs ; option configurable ; compare les deux dans le rapport.
5. Cibles douces : pour chaque phrase source du domaine, calcule et stocke la
   distribution du professeur en Top-K (section 4.4) pour limiter la RAM.
6. Étudiant : perte L = (1−λ)·CE + λ·KL, λ=0,7 par défaut, distillation au niveau du
   MOT (section 4.5), entraîné sur l'union des domaines + sous-ensemble du corpus
   général. Les 5 domaines dépassent les 4 testés dans le paper : le rapport doit le
   mentionner. Recherche de λ par domaine (le paper suggère qu'un λ unique limite le
   potentiel) sur le jeu de validation.
7. Validation avant publication (principe 3 du prompt maître) : compare nouvelle
   version vs production sur jeux de test réservés par domaine + jeu général ;
   publie si amélioration, sinon rollback automatique et rapport d'échec.
8. Versionnage : chaque version d'étudiant et de professeur est datée, signée par un
   hash, avec son rapport (BLEU, chrF, latence), restaurable en un clic.
9. Nettoyage de fuite de données : aucune phrase de test dans l'entraînement
   (déduplication par hachage).`,
    },
    {
      id: 'c4_evaluation',
      title: 'C4. Prompt Évaluation Honnête & Contrôle Qualité',
      badge: 'Contrôle qualité',
      description: 'Jeux de test réservés, sacreBLEU, chrF, respect du glossaire, revue humaine obligatoire pour Santé et Droit.',
      content: `OBJECTIF
Mesurer la qualité réelle de chaque agent et alerter quand elle baisse.

TÂCHES
1. Jeu de test réservé de 500 à 2000 phrases par domaine (le paper utilise 2000),
   jamais utilisé pour apprendre.
2. Métriques : sacreBLEU (signature complète), chrF, taux de respect du glossaire,
   préservation des nombres/unités (test automatique), latence médiane et p95.
3. Comparaison à trois niveaux : modèle générique, professeur du domaine, étudiant
   multi-domaine. Le tableau indique l'origine de chaque chiffre : « mesuré »
   ou « recherche ECAI 2020 ».
4. Revue humaine : échantillon de 50 phrases relu par un professionnel du domaine,
   grille (fidélité, terminologie, fluidité), obligatoire pour Santé et Droit avant
   toute utilisation en production.
5. Suivi dans le temps : graphique de qualité par domaine et par version ; alerte si
   la qualité baisse.`,
    },
    {
      id: 'c5_interface',
      title: 'C5. Prompt Interface Simple (15 à 80+ ans)',
      badge: 'Accessibilité universelle',
      description: 'Grands boutons ≥48px, texte ≥20px, contraste AA, synthèse vocale, traduction en ≤ 3 clics.',
      content: `OBJECTIF
Écran « Traduire et enseigner à mon spécialiste ».

DISPOSITION
1. Grand choix de 5 tuiles avec icône : Finance · Banque · Technique · Droit · Santé
   (+ « Automatique »).
2. Zone « Déposez votre document ici » (PDF, Word, image) et bouton « Choisir un fichier ».
3. Choix langue d'origine / langue d'arrivée avec bouton ⇄.
4. Bouton géant « Traduire ». Résultat avec boutons Copier, Écouter, Télécharger
   (Word/PDF), et note de confiance en langage simple.
5. Onglet « Faire progresser mon spécialiste » : déposer des livres ou documents ;
   message clair « Ce document a ajouté 120 termes. Voulez-vous les vérifier ? » ;
   case obligatoire « J'ai le droit d'utiliser ce document » ; avertissement
   « Ce document contient peut-être des données personnelles » avec bouton
   « Les masquer automatiquement ».
6. Page « Progrès » : nombre de documents appris, termes validés, qualité mesurée
   (étiquetée « mesuré sur vos tests »).
Contraintes : texte ≥ 20 px, boutons ≥ 48 px, contraste AA, voix, arabe RTL, hors ligne,
aucun mot technique visible (« distillation », « BLEU », « teacher »).
CRITÈRE : traduire en ≤ 3 clics ; ajouter un document en ≤ 3 clics.`,
    },
    {
      id: 'c6_credits',
      title: 'C6. Prompt Crédits & Références',
      badge: 'Attribution',
      description: 'Créé par Tarik Badri — en association avec Larbi Badri. Référence scientifique : ECAI 2020.',
      content: `Remplace dans tout le projet les mentions de créateur du logiciel par
« Créé par Tarik Badri — en association avec Larbi Badri » (README, /health, UI,
page « À propos », AUTHORS.md, en-têtes de fichiers). CONSERVE la référence
scientifique (Mghabbar & Ratnamogan, ECAI 2020) et les mentions de licence de
Indra OCR et des autres dépendances.`,
    },
  ];

  const activePrompt =
    PROMPT_COLLECTION.find((p) => p.id === selectedPromptKey) || PROMPT_COLLECTION[0];

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-white tracking-tight">
              Prompt Engineering — Répertoire des Prompts Système
            </span>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono px-2 py-0.5 rounded-full">
              C0 à C6 Intégrés
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Consultez, testez et copiez les prompts systèmes officiels des 5 agents traducteurs créés par <strong>Tarik Badri &amp; Larbi Badri</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleCopyPrompt(activePrompt.content, activePrompt.id)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow transition cursor-pointer"
        >
          {copiedKey === activePrompt.id ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copiedKey === activePrompt.id ? 'Prompt Copié !' : 'Copier ce Prompt'}</span>
        </button>
      </div>

      {/* Main Grid: Prompts List on Left, Active Prompt Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Prompts Navigation (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider mb-2">
            Index des Prompts :
          </span>

          {PROMPT_COLLECTION.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => setSelectedPromptKey(prompt.id)}
              className={`p-3 rounded-lg border text-left transition flex flex-col gap-1 cursor-pointer ${
                selectedPromptKey === prompt.id
                  ? 'bg-blue-600/20 text-blue-200 border-blue-500 font-medium'
                  : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 truncate">{prompt.title}</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                  {prompt.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{prompt.description}</p>
            </button>
          ))}
        </div>

        {/* Prompt Content Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200">{activePrompt.title}</span>
            </div>

            <button
              type="button"
              onClick={() => handleCopyPrompt(activePrompt.content, activePrompt.id)}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === activePrompt.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === activePrompt.id ? 'Copié' : 'Copier'}</span>
            </button>
          </div>

          <div className="bg-slate-900/60 px-5 py-2.5 border-b border-slate-800 text-xs text-slate-400">
            {activePrompt.description}
          </div>

          <pre className="p-5 bg-slate-950 font-mono text-xs leading-relaxed text-slate-200 whitespace-pre-wrap overflow-y-auto max-h-[500px]">
            {activePrompt.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
