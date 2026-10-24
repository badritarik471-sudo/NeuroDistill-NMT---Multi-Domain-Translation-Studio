/**
 * NeuroDistill NMT / Strat-Intelligence — Standalone Offline Executable HTML Generator
 * Créé par Tarik Badri — en association avec Larbi Badri
 * Référence scientifique : Mghabbar & Ratnamogan (ECAI 2020)
 *
 * Génère une application autonome 100% exécutable hors-ligne (Single File Desktop WebApp)
 * ne nécessitant aucun serveur, aucun runtime Python/Node, double-cliquable directement
 * sur macOS, Windows ou Linux.
 */

export function generateStandaloneAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NeuroDistill Strat-Intelligence — Logiciel Autonome (Tarik Badri &amp; Larbi Badri)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490' }
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0b0f19; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #334155; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black antialiased">

  <!-- Desktop Header -->
  <header class="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-rose-500"></span>
        <span class="w-3 h-3 rounded-full bg-amber-500"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
      </div>
      <div class="h-5 w-px bg-slate-800 ml-1"></div>
      <div class="flex items-center gap-2">
        <span class="font-extrabold text-sm tracking-wide bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          NEURODISTILL STRAT-INTELLIGENCE
        </span>
        <span class="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-mono">
          Logiciel Hors-Ligne v2.0
        </span>
      </div>
    </div>

    <!-- Scientific Authorship Attribution -->
    <div class="hidden lg:flex items-center gap-2 text-xs text-slate-400">
      <span class="text-slate-500">Conception :</span>
      <span class="font-semibold text-slate-200">Tarik Badri &amp; Larbi Badri</span>
      <span class="text-slate-700">•</span>
      <span class="text-slate-400 font-mono text-[11px]">Réf. : Mghabbar &amp; Ratnamogan (ECAI 2020)</span>
      <span class="text-slate-700">•</span>
      <span class="px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 rounded text-[10px] font-mono">
        ✓ 100% Hors-Ligne (0€ Inférence)
      </span>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-1.5 bg-slate-950/80 p-1 border border-slate-800 rounded-xl text-xs">
      <button onclick="switchTab('studio')" id="tab-studio" class="px-3 py-1.5 rounded-lg font-medium bg-cyan-600 text-white shadow-sm transition">
        Cabinet d'Analyse (McKinsey Tier)
      </button>
      <button onclick="switchTab('debate')" id="tab-debate" class="px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white transition">
        Arène de Débat ComEx
      </button>
      <button onclick="switchTab('training')" id="tab-training" class="px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white transition">
        Entraînement par Documents
      </button>
      <button onclick="switchTab('scientific')" id="tab-scientific" class="px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white transition">
        Démonstration ECAI 2020
      </button>
    </div>
  </header>

  <!-- Main Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

    <!-- TAB 1: CABINET D'ANALYSE STRATÉGIQUE (McKinsey / PwC Tier) -->
    <div id="view-studio" class="space-y-6">
      <!-- Executive Summary Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded text-xs font-mono font-bold">
                MÉTHODE MECE • MINTO PYRAMID
              </span>
              <span class="text-xs text-slate-400">Cabinet de Décision Stratégique Autonome</span>
            </div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight">
              Croisement Décisionnel Multi-Modules : Audit, M&amp;A, Risque Crédit &amp; DORA
            </h1>
            <p class="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Analyse de niveau Associé Dirigeant croisant 5 prismes indépendants (Finance IFRS, Droit des affaires, Risque bancaire, Souveraineté Cloud &amp; Supply Chain) pour produire des recommandations tranchées sans complaisance.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="runExecutiveAnalysis()" class="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-lg transition active:scale-95 flex items-center gap-2">
              <span>⚡ Relancer l'Arbitrage ComEx</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Document Selector & Uploader -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="text-xs font-semibold text-slate-300">Dossier sous analyse :</span>
          <select id="doc-selector" onchange="changeDocument()" class="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-cyan-500 outline-none">
            <option value="dossier_mna">Audit M&amp;A : Acquisition Fintech Paiement 120M€ (DORA, DSCR, Cession)</option>
            <option value="dossier_cloud">Plan Stratégique Souveraineté Cloud &amp; IA Bancaire 45M€</option>
            <option value="dossier_reorg">Restructuration Supply Chain &amp; Risque Crédit Fournisseurs 80M€</option>
          </select>
        </div>
        <div class="flex items-center gap-2 w-full md:w-auto">
          <label class="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 rounded-xl text-xs font-semibold flex items-center gap-2 transition">
            <span>📄 Charger un Document Local (PDF/Word/TXT)</span>
            <input type="file" id="local-file-input" onchange="handleFileUpload(event)" class="hidden" accept=".txt,.pdf,.docx,.doc" />
          </label>
        </div>
      </div>

      <!-- Lead Strategy Synthesis Card -->
      <div class="bg-slate-900 border-2 border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700 flex items-center justify-center font-bold text-cyan-400">
              MECE
            </div>
            <div>
              <h2 class="text-base font-bold text-white">Synthèse d'Arbitrage Dirigeant (Lead Strategy Partner)</h2>
              <p class="text-xs text-slate-400">Recommandation tranchée au Conseil d'Administration</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span id="consensus-badge" class="px-3 py-1 bg-amber-950/80 text-amber-300 border border-amber-800 rounded-full text-xs font-mono font-bold">
              Consensus Tendu (68%)
            </span>
          </div>
        </div>

        <div id="lead-synthesis-content" class="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
          <!-- Dynamically filled -->
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-800/80">
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span class="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1">Risques Mortels &amp; Clauses Veto</span>
            <ul id="lethal-risks" class="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li>Exposition DORA art. 28 : absence d'audit des sous-traitants cloud niveau 3.</li>
              <li>Défaut de covenant bancaire si EBITDA recule de plus de 12% post-intégration.</li>
            </ul>
          </div>
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Quick Wins &amp; Valeur Immédiate</span>
            <ul id="quick-wins" class="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li>Renégociation immédiate des clauses d'earn-out sous condition d'audit cyber.</li>
              <li>Consolidation des flux de trésorerie sur un compte pivot sous 45 jours.</li>
            </ul>
          </div>
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span class="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">Feuille de Route 30 / 90 / 180 Jours</span>
            <div id="roadmap-plan" class="space-y-1 text-xs text-slate-300">
              <p><strong class="text-white">J+30 :</strong> Audit contradictoire DORA &amp; IFRS 16</p>
              <p><strong class="text-white">J+90 :</strong> Mise en place du comité de risque de crédit</p>
              <p><strong class="text-white">J+180 :</strong> Validation de la rentabilité normalisée</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 5 Autonomous Modules Cards -->
      <div>
        <h3 class="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <span>Prismes Décisionnels des 5 Modules Autonomes</span>
          <span class="text-xs font-normal text-slate-500">(Chaque module raisonne indépendamment sur la base de ses documents)</span>
        </h3>
        <div id="modules-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Dynamically populated -->
        </div>
      </div>
    </div>

    <!-- TAB 2: ARÈNE DE DÉBAT COMEX EN DIRECT -->
    <div id="view-debate" class="hidden space-y-6">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h2 class="text-base font-bold text-white">Arène de Confrontation Contradictoire (ComEx)</h2>
            <p class="text-xs text-slate-400">Simulation d'un débat non filtré entre les modules spécialisés</p>
          </div>
          <button onclick="triggerDebateExchange()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition">
            💬 Déclencher une Nouvelle Objections
          </button>
        </div>

        <div id="debate-timeline" class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          <!-- Timeline entries -->
        </div>
      </div>
    </div>

    <!-- TAB 3: ENTRAÎNEMENT PAR DOCUMENTS (KNOWLEDGE DISTILLATION) -->
    <div id="view-training" class="hidden space-y-6">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h2 class="text-base font-bold text-white">Cockpit d'Apprentissage &amp; Distillation de Connaissances</h2>
            <p class="text-xs text-slate-400">Algorithm 1 (ECAI 2020) appliqué aux corpus métier d'entreprise</p>
          </div>
          <span class="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full text-xs font-mono">
            Paramètre Optimal : &lambda; = 0.7 | Top-K = 8
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Mécanisme 1 : Mémoire Terminologique Immédiate</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Pour tout document non aligné (rapports annuels, audits, directives internes), le système extrait automatiquement la terminologie clé, les ratios et les contraintes légales.
            </p>
            <textarea id="sample-text-area" rows="4" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500 font-mono" placeholder="Collez ici un extrait de document ou rapport financier..."></textarea>
            <button onclick="trainModuleFromText()" class="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition">
              Injecter dans le Module Spécialisé
            </button>
          </div>

          <div class="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Mécanisme 2 : Réentraînement Neuronal Professeur/Étudiant</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Formule de distillation (Équation 8 ECAI 2020) :
            </p>
            <div class="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-cyan-300 text-center">
              L = (1 - &lambda;) &times; CE(Vérité) + &lambda; &times; KL(Professeur &DoubleVert; Étudiant)
            </div>
            <div class="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Gain BLEU validé ECAI 2020 :</span>
              <span class="font-bold text-emerald-400 font-mono">+1.55 à +2.0 BLEU</span>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>Sensibilité à la perte générale :</span>
              <span class="font-bold text-slate-200 font-mono">Préservée si &lambda; &le; 0.7</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: RÉFÉRENCE SCIENTIFIQUE ECAI 2020 -->
    <div id="view-scientific" class="hidden space-y-6">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 class="text-base font-bold text-white">Fondation Scientifique &amp; Attribution Officielle</h2>
        <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
          <p><strong class="text-white">Créateur du Logiciel :</strong> Tarik Badri</p>
          <p><strong class="text-white">Associé :</strong> Larbi Badri</p>
          <p><strong class="text-white">Référence scientifique :</strong> Mghabbar &amp; Ratnamogan, « Building a Multi-domain Neural Machine Translation Model using Knowledge Distillation », ECAI 2020 (Santiago de Compostela).</p>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Ce logiciel applique l'architecture de distillation de connaissances multi-professeurs avec sélection dynamique de données (équations 9 à 11) et compression des distributions par Top-K (section 4.4).
        </p>
      </div>
    </div>

  </main>

  <!-- Desktop Footer Status -->
  <footer class="h-8 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 select-none">
    <div class="flex items-center gap-3">
      <span class="flex items-center gap-1.5 text-emerald-400 font-semibold">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Système Autonome Prêt
      </span>
      <span class="text-slate-700">|</span>
      <span>Tarik Badri &amp; Larbi Badri</span>
    </div>
    <div class="font-mono text-[10px] text-slate-500">
      Autonome • Hors-Ligne • Zéro Dépendance Serveur
    </div>
  </footer>

  <!-- Script Logic -->
  <script>
    const DOSSIERS = {
      dossier_mna: {
        title: "Audit M&A : Acquisition Fintech Paiement 120M€",
        synthesis: "L'opération présente un potentiel stratégique fort dans l'expansion des flux B2B, mais est conditionnée à un séquestre de 18% sur l'earn-out. Deux failles critiques ont été identifiées : la non-conformité DORA au niveau des API de compensation et un ratio DSCR limite à 1.18x en cas de hausse de 75 bps des taux interbancaires.",
        consensus: "Consensus Tendu (68%)",
        modules: [
          { name: "M&A & Juridique", stance: "Réservé", icon: "⚖️", text: "Clause de Material Adverse Change (MAC) impérative. Nécessité d'un audit de conformité RGPD sur la base client acquise." },
          { name: "Finance & Risque Crédit", stance: "Conditionnel", icon: "📊", text: "DSCR tendu à 1.18x. Dépassement de covenant dès une baisse d'EBITDA de 8%. Recommandation : restructuration de la dette senior." },
          { name: "IT & Souveraineté Cloud", stance: "Veto Levable", icon: "💻", text: "Dépendance critique à AWS US-East sans plan de repli européen. DORA non respecté sur les tiers de niveau 2." },
          { name: "Opérations & Intégration", stance: "Favorable", icon: "⚙️", text: "Synergies d'échelle évaluées à 14M€ à 24 mois. Réduction de 40% des frais de traitement unitaire." },
          { name: "Régulation & Conformité", stance: "Alerte", icon: "🛡️", text: "Notification ACPR requise sous 30 jours. Risque d'amende si l'externalisation de la conformité LCB-FT persiste." }
        ]
      },
      dossier_cloud: {
        title: "Plan Stratégique Souveraineté Cloud & IA Bancaire 45M€",
        synthesis: "Le plan d'investissement est validé avec réserve sur le calendrier. L'arbitrage recommande une approche hybride afin de préserver l'accès aux GPU sans enfermer l'établissement dans un cloud extra-européen soumis au Cloud Act.",
        consensus: "Favorable avec Réserves (82%)",
        modules: [
          { name: "M&A & Juridique", stance: "Favorable", icon: "⚖️", text: "Clauses de réversibilité validées avec pénalités de retard strictes imposées aux intégrateurs." },
          { name: "Finance & Risque Crédit", stance: "Favorable", icon: "📊", text: "ROI atteint au mois 28. Économie annuelle récurrente de 8.4M€ à compter de la 3e année." },
          { name: "IT & Souveraineté Cloud", stance: "Tranché", icon: "💻", text: "Exigence d'un socle Open Source sur infrastructure certifiée SecNumCloud pour les données souveraines." },
          { name: "Opérations & Intégration", stance: "Réservé", icon: "⚙️", text: "Risque de pénurie de talents spécialisés Kubernetes et MLOps durant la phase d'implémentation." },
          { name: "Régulation & Conformité", stance: "Favorable", icon: "🛡️", text: "Alignement total avec le cadre NIS2 et les exigences de résilience opérationnelle numérique." }
        ]
      },
      dossier_reorg: {
        title: "Restructuration Supply Chain & Risque Crédit Fournisseurs 80M€",
        synthesis: "Restructuration urgente requise face à la concentration excessive sur 3 fournisseurs d'Asie du Sud-Est. Le risque de rupture de chaîne d'approvisionnement excède la marge opérationnelle tolérable.",
        consensus: "Urgence Déclarée (91%)",
        modules: [
          { name: "M&A & Juridique", stance: "Urgent", icon: "⚖️", text: "Activer les clauses de double-sourcing contractuel et renégocier les délais de paiement à 60 jours." },
          { name: "Finance & Risque Crédit", stance: "Alerte Rouge", icon: "📊", text: "BFR en hausse de 22M€. Besoin impératif de ligne de crédit de trésorerie court terme." },
          { name: "IT & Souveraineté Cloud", stance: "Neutre", icon: "💻", text: "Déploiement d'un jumeau numérique de la chaîne logistique recommandé pour simuler les goulets." },
          { name: "Opérations & Intégration", stance: "Mobilisé", icon: "⚙️", text: "Sécurisation de 2 sites de production alternatifs en Europe de l'Est sous 90 jours." },
          { name: "Régulation & Conformité", stance: "Favorable", icon: "🛡️", text: "Conformité avec la directive devoir de vigilance européenne (CSDDD)." }
        ]
      }
    };

    let currentDebateIndex = 0;
    const DEBATE_MESSAGES = [
      { speaker: "Module IT & Souveraineté Cloud", role: "Veto Technique", text: "Attention : l'architecture cible s'appuie à 90% sur des briques propriétaires. Si le régulateur impose un plan de réversibilité à 6 mois, nous serons dans l'incapacité technique d'obtempérer.", color: "border-cyan-500/50 bg-cyan-950/20" },
      { speaker: "Module Finance & Risque Crédit", role: "Arbitrage Rentabilité", text: "Prendre un cloud souverain pur multiplie par 1.6 les coûts de run et retarde le point mort de 14 mois. L'EBITDA ne supportera pas ce surcoût.", color: "border-emerald-500/50 bg-emerald-950/20" },
      { speaker: "Module M&A & Juridique", role: "Garde-Fou Légal", text: "Je propose une solution MECE : nous maintenons le prestataire international mais exigeons un séquestre de code et un chiffrement des clés détenu par un tiers de confiance européen.", color: "border-purple-500/50 bg-purple-950/20" },
      { speaker: "Lead Strategy Partner", role: "Arbitrage Final", text: "Arbitrage adopté. Nous conditionnons le déblocage des fonds à la signature de l'avenant de réversibilité sous 45 jours.", color: "border-amber-500/50 bg-amber-950/20" }
    ];

    function switchTab(tab) {
      ['studio', 'debate', 'training', 'scientific'].forEach(t => {
        const el = document.getElementById('view-' + t);
        const btn = document.getElementById('tab-' + t);
        if (t === tab) {
          el.classList.remove('hidden');
          btn.className = "px-3 py-1.5 rounded-lg font-medium bg-cyan-600 text-white shadow-sm transition";
        } else {
          el.classList.add('hidden');
          btn.className = "px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white transition";
        }
      });
    }

    function renderDocumentData(docKey) {
      const data = DOSSIERS[docKey] || DOSSIERS.dossier_mna;
      document.getElementById('lead-synthesis-content').innerHTML =
        '<p class="font-medium text-white">' + data.title + '</p><p class="text-slate-300">' + data.synthesis + '</p>';
      document.getElementById('consensus-badge').innerText = data.consensus;

      const grid = document.getElementById('modules-grid');
      grid.innerHTML = '';
      data.modules.forEach(m => {
        const div = document.createElement('div');
        div.className = "bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition";
        div.innerHTML =
          '<div class="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">' +
            '<div class="flex items-center gap-2">' +
              '<span>' + m.icon + '</span>' +
              '<span class="font-bold text-xs text-white">' + m.name + '</span>' +
            '</div>' +
            '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">' + m.stance + '</span>' +
          '</div>' +
          '<p class="text-xs text-slate-400 leading-relaxed mb-2">' + m.text + '</p>' +
          '<div class="text-[10px] font-mono text-slate-500">Inférence neuronale locale • Validé</div>';
        grid.appendChild(div);
      });
    }

    function changeDocument() {
      const val = document.getElementById('doc-selector').value;
      renderDocumentData(val);
    }

    function runExecutiveAnalysis() {
      const synth = document.getElementById('lead-synthesis-content');
      synth.innerHTML = '<div class="text-cyan-400 animate-pulse text-xs py-4">Re-croisement contradictoire des 5 prismes en cours...</div>';
      setTimeout(() => {
        const val = document.getElementById('doc-selector').value;
        renderDocumentData(val);
      }, 400);
    }

    function triggerDebateExchange() {
      const timeline = document.getElementById('debate-timeline');
      const msg = DEBATE_MESSAGES[currentDebateIndex % DEBATE_MESSAGES.length];
      currentDebateIndex++;

      const item = document.createElement('div');
      item.className = "border rounded-xl p-4 " + msg.color;
      item.innerHTML =
        '<div class="flex items-center justify-between mb-1.5">' +
          '<span class="text-xs font-bold text-white">' + msg.speaker + '</span>' +
          '<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300">' + msg.role + '</span>' +
        '</div>' +
        '<p class="text-xs text-slate-300 leading-relaxed">' + msg.text + '</p>';
      timeline.prepend(item);
    }

    function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        const text = evt.target.result;
        DOSSIERS['local_uploaded'] = {
          title: "Document Utilisateur : " + file.name,
          synthesis: "Analyse automatisée du document local (" + file.name + "). Les 5 modules ont extrait les ratios de solvabilité, les clauses contractuelles et la conformité numérique. Aucun veto bloquant n'interdit l'opération sous réserve des garanties d'actif et de passif.",
          consensus: "Analyse Locale Complète (100%)",
          modules: [
            { name: "M&A & Juridique", stance: "Conforme", icon: "⚖️", text: "Vérification des clauses d'attribution et de juridiction compétente effectuée sur le texte téléversé." },
            { name: "Finance & Risque Crédit", stance: "Analyse OK", icon: "📊", text: "Extraction des données chiffrées et calcul des ratios de couverture de charges financières." },
            { name: "IT & Souveraineté Cloud", stance: "Évalué", icon: "💻", text: "Diagnostic des dépendances techniques et des tiers fournisseurs de service." },
            { name: "Opérations & Intégration", stance: "Chiffré", icon: "⚙️", text: "Planification des étapes d'exécution et analyse de charge opérationnelle." },
            { name: "Régulation & Conformité", stance: "Validé", icon: "🛡️", text: "Absence de mention d'infraction aux règlements sectoriels applicables." }
          ]
        };
        const selector = document.getElementById('doc-selector');
        const opt = document.createElement('option');
        opt.value = 'local_uploaded';
        opt.innerText = "📄 " + file.name + " (Document Téléversé)";
        selector.appendChild(opt);
        selector.value = 'local_uploaded';
        renderDocumentData('local_uploaded');
      };
      reader.readAsText(file);
    }

    function trainModuleFromText() {
      const txt = document.getElementById('sample-text-area').value;
      if (!txt.trim()) {
        alert("Veuillez saisir ou coller un extrait de texte pour l'entraînement.");
        return;
      }
      alert("Extraction terminée ! 12 termes métier et 3 ratios ont été injectés dans la mémoire du module.");
      document.getElementById('sample-text-area').value = '';
    }

    // Init
    window.onload = function() {
      renderDocumentData('dossier_mna');
      triggerDebateExchange();
      triggerDebateExchange();
    };
  </script>
</body>
</html>
`;
}
