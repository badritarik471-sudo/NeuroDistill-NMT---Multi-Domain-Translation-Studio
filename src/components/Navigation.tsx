import React from 'react';
import {
  Languages,
  BookOpen,
  LineChart,
  Code2,
  Box,
  FileCode,
  RotateCcw,
  Sparkles,
  Briefcase,
  Zap,
  Brain,
} from 'lucide-react';

export type ActiveTab =
  | 'strategy_studio'
  | 'cross_debate'
  | 'module_training'
  | 'python_engine'
  | 'translation_studio'
  | 'research_digest';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  masteryAverage: number;
  documentsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  masteryAverage,
  documentsCount,
}) => {
  const tabs = [
    {
      id: 'strategy_studio' as ActiveTab,
      label: 'Cabinet d’Analyse Stratégique',
      sublabel: 'McKinsey / PwC / Capgemini',
      icon: Briefcase,
      badge: 'Principal',
    },
    {
      id: 'cross_debate' as ActiveTab,
      label: 'Débat & Croisement en Direct',
      sublabel: 'Confrontation des 5 Cerveaux',
      icon: Zap,
    },
    {
      id: 'module_training' as ActiveTab,
      label: 'Entraînement des Modules',
      sublabel: 'Apprentissage par Documents',
      icon: Brain,
      badge: `${masteryAverage}% maturité`,
    },
    {
      id: 'python_engine' as ActiveTab,
      label: 'Moteur Python & Déploiement',
      sublabel: 'Scripts Mac & Windows',
      icon: Code2,
    },
    {
      id: 'translation_studio' as ActiveTab,
      label: 'Traduction Spécialisée NMT',
      sublabel: '5 Professeurs & Distillation',
      icon: Languages,
    },
    {
      id: 'research_digest' as ActiveTab,
      label: 'Référence Scientifique',
      sublabel: 'ECAI 2020 & Algorithmes',
      icon: BookOpen,
    },
  ];

  return (
    <nav
      aria-label="Navigation principale de l'application"
      className="w-full bg-slate-900/80 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 overflow-x-auto"
    >
      <div className="flex items-center gap-2 py-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              aria-label={`Ouvrir ${tab.label}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isActive
                          ? 'bg-blue-800 text-blue-200'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <div
                  className={`text-[10px] font-normal ${
                    isActive ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {tab.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
