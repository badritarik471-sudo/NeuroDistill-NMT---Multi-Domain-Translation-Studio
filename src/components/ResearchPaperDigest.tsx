import React from 'react';
import { BookOpen, Award, Users, CheckCircle, AlertTriangle, FileText, Bookmark } from 'lucide-react';

export const ResearchPaperDigest: React.FC = () => {
  return (
    <div className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
      {/* Paper Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wide uppercase">
            24th European Conference on Artificial Intelligence (ECAI 2020) • Santiago de Compostela, Spain
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Architecture NMT Multi-Domaines
          </span>
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
            Building a Multi-domain Neural Machine Translation Model using Knowledge Distillation
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-300">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-100">Idriss MGHABBAR</span>
            <span className="text-slate-500">et</span>
            <span className="font-semibold text-slate-100">Pirashanth RATNAMOGAN</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-medium">BNP Paribas, France</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Implémentation logicielle et extension à 5 agents : <strong className="text-slate-200">Créé par Tarik Badri — en association avec Larbi Badri</strong>.
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 leading-relaxed space-y-2">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Résumé scientifique :</span>
          </div>
          <p>
            Le manque de données spécialisées rend la construction d’outils de traduction automatique multi-domaines complexe.
            Ce papier propose un pipeline d’entraînement où la distillation de connaissances à partir de multiples professeurs
            spécialisés permet d’affiner un modèle étudiant unique sans ajouter de coût à l’inférence (+2,0 points en BLEU).
          </p>
        </div>
      </div>

      {/* PARTIE A — Où se trouve l'algorithme dans le PDF (Exactement la table demandée) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Partie A — Où se trouve l'algorithme dans le PDF
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Élément clé</th>
                <th className="py-2.5 px-3">Où dans le PDF</th>
                <th className="py-2.5 px-3">Contenu et Rôle technique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-bold text-cyan-300 font-mono">Algorithm 1</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Section 4.3 « Distillation process » (p. 4)</td>
                <td className="py-2.5 px-3 text-slate-400">Le pipeline complet en 4 étapes (générique → professeurs → cibles douces → étudiant).</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-bold text-cyan-300 font-mono">Schéma du principe</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Figure 2 (page 4)</td>
                <td className="py-2.5 px-3 text-slate-400">Données de chaque domaine → professeur du domaine → perte → modèle multi-domaine.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-bold text-cyan-300 font-mono">Sélection dynamique</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Section 4.2, équations (9) à (11)</td>
                <td className="py-2.5 px-3 text-slate-400">Cross-Entropy Difference (CED) pour affiner chaque professeur avec les données générales proches.</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-bold text-cyan-300 font-mono">Fonction de perte</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Section 2.5, équation (8)</td>
                <td className="py-2.5 px-3 text-slate-400">Mélange pondéré par λ : L = (1 − λ)·CrossEntropy(vérité) + λ·KL(professeur ‖ étudiant).</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-bold text-cyan-300 font-mono">Top-K soft targets</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Section 4.4</td>
                <td className="py-2.5 px-3 text-slate-400">Économie de mémoire RAM (K=8 au lieu du vocabulaire complet de 32 000 tokens).</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-bold text-cyan-300 font-mono">Niveau mot vs séquence</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Section 4.5</td>
                <td className="py-2.5 px-3 text-slate-400">Le paper retient formellement le niveau MOT (word-level).</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-bold text-cyan-300 font-mono">Lissage d'étiquettes</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Section 4.6 &amp; section 5.2.2</td>
                <td className="py-2.5 px-3 text-slate-400">Les professeurs entraînés SANS lissage donnent un meilleur étudiant (Hard student).</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-bold text-cyan-300 font-mono">Résultats mesurés</td>
                <td className="py-2.5 px-3 font-semibold text-slate-200">Tables 2, 4, 5</td>
                <td className="py-2.5 px-3 text-slate-400">+2,0 BLEU (2 domaines), +1,1 (3 domaines), +1,55 (4 domaines) pour le Hard student.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Ce que le paper démontre réellement (À ne pas surévaluer) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs leading-relaxed">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Ce que le paper démontre réellement (Règle d'honnêteté)</span>
        </h3>
        <ul className="space-y-2 text-slate-300 list-disc list-inside">
          <li>
            <strong>Le gain moyen n'augmente pas avec le nombre de domaines :</strong> +2,0 BLEU à 2 domaines, +1,1 à 3 domaines, et +1,55 à 4 domaines.
          </li>
          <li>
            <strong>Domaines testés dans le paper :</strong> Médical (EMEA), Juridique (JRC), Logiciel (GNOME), Religion (Bible), en <strong>anglais → français uniquement</strong>.
          </li>
          <li>
            <strong>Finance et Banque n'ont PAS été testés dans le paper :</strong> pour ces deux domaines, la méthode est appliquée par extension par <strong>Tarik Badri &amp; Larbi Badri</strong>. Aucun gain chiffré n'est garanti avant nos propres mesures d'audit.
          </li>
          <li>
            <strong>Sensibilité à λ :</strong> Le paper trouve <strong>λ = 0,7</strong> comme meilleur compromis. À λ = 1, le domaine s'améliore mais le corpus général chute de 4,6 points BLEU (configuration 4 domaines).
          </li>
        </ul>
      </div>

      {/* Mathematical Formulations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white">Formulations Mathématiques Fondamentales</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs flex flex-col gap-2">
            <span className="text-slate-400 font-sans font-semibold">1. Softmax avec Température T :</span>
            <div className="text-cyan-300 text-sm py-2">
              q_i = exp(z_i / T) / &Sigma;_j exp(z_j / T)
            </div>
            <p className="text-[11px] font-sans text-slate-400 leading-normal">
              Où T = 2,0 adoucit la distribution de probabilités sur le vocabulaire et révèle les affinités secondaires du professeur.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs flex flex-col gap-2">
            <span className="text-slate-400 font-sans font-semibold">2. Perte de Distillation Mixte (Équation 8) :</span>
            <div className="text-emerald-300 text-sm py-2">
              L = (1 - &lambda;) &middot; L_CE + &lambda; &middot; T&sup2; &middot; L_KL
            </div>
            <p className="text-[11px] font-sans text-slate-400 leading-normal">
              Combine l’entropie croisée de vérité terrain et la divergence de Kullback-Leibler du professeur, avec &lambda; = 0,7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
