import React from 'react';
import { PlatformOS } from '../types';
import { Apple, Monitor, Download, ShieldCheck, Cpu } from 'lucide-react';

interface DesktopWindowFrameProps {
  platform: PlatformOS;
  onTogglePlatform: (os: PlatformOS) => void;
  onExportApp: () => void;
  fontScalePx: number;
  onAdjustFontScale: (delta: number) => void;
  children: React.ReactNode;
}

export const DesktopWindowFrame: React.FC<DesktopWindowFrameProps> = ({
  platform,
  onTogglePlatform,
  onExportApp,
  fontScalePx,
  onAdjustFontScale,
  children,
}) => {
  return (
    <div
      style={{ fontSize: `${fontScalePx}px` }}
      className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black antialiased"
    >
      {/* Native Desktop Window Header */}
      <header
        className={`w-full h-12 border-b flex items-center justify-between px-4 select-none shrink-0 transition-colors ${
          platform === 'macos'
            ? 'bg-slate-900/90 border-slate-800 text-slate-300'
            : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}
      >
        {/* Left side: Window Controls or App Title */}
        <div className="flex items-center gap-3">
          {platform === 'macos' ? (
            /* macOS Traffic Lights */
            <div className="flex items-center gap-2 mr-2">
              <div
                className="w-3 h-3 rounded-full bg-rose-500 hover:brightness-110 cursor-pointer shadow-sm"
                title="Fermer"
              />
              <div
                className="w-3 h-3 rounded-full bg-amber-500 hover:brightness-110 cursor-pointer shadow-sm"
                title="Minimiser"
              />
              <div
                className="w-3 h-3 rounded-full bg-emerald-500 hover:brightness-110 cursor-pointer shadow-sm"
                title="Plein écran"
              />
            </div>
          ) : (
            /* Windows Logo / App Icon */
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>NEURODISTILL NMT</span>
            </div>
          )}

          {/* Center-Left Branding */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <span className="text-xs font-bold text-white tracking-wide">
              NeuroDistill NMT — 5 Agents Traducteurs
            </span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded font-mono">
              ECAI 2020
            </span>
          </div>
        </div>

        {/* Center: System Status & Authorship Credit (Strict Règle C6) */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
          <span className="text-slate-500">Conception :</span>
          <span className="font-semibold text-slate-200">
            Créé par Tarik Badri — en association avec Larbi Badri
          </span>
          <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3" /> PyTorch &amp; FastAPI
          </span>
        </div>

        {/* Right side: Accessibility A+/A-, OS Switcher, Export Button */}
        <div className="flex items-center gap-2.5">
          {/* Font Size A- / A+ (Directive C5: accessible 15 à 80+ ans) */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg overflow-hidden text-xs font-mono">
            <button
              type="button"
              onClick={() => onAdjustFontScale(-1)}
              title="Réduire la taille du texte"
              className="px-2.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer font-bold"
              aria-label="Diminuer la taille du texte"
            >
              A-
            </button>
            <span className="px-2 text-[11px] text-slate-400 border-x border-slate-700">
              {fontScalePx}px
            </span>
            <button
              type="button"
              onClick={() => onAdjustFontScale(1)}
              title="Agrandir la taille du texte"
              className="px-2.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer font-bold"
              aria-label="Agrandir la taille du texte"
            >
              A+
            </button>
          </div>

          {/* OS Switcher */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onTogglePlatform('macos')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                platform === 'macos'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Mode macOS"
            >
              <Apple className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">macOS</span>
            </button>
            <button
              type="button"
              onClick={() => onTogglePlatform('windows')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                platform === 'windows'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Mode Windows"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Windows</span>
            </button>
          </div>

          {/* Export / Package Desktop App */}
          <button
            type="button"
            onClick={onExportApp}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-md ring-1 ring-cyan-400/40 transition active:scale-95 cursor-pointer animate-pulse"
            aria-label="Télécharger le logiciel en format executable"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span className="font-extrabold tracking-wide">
              {platform === 'windows' ? 'Télécharger l\'Exécutable (.EXE)' : 'Télécharger le Software'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-auto">{children}</main>

      {/* Native Desktop Status Bar */}
      <footer className="h-7 bg-slate-900 border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-slate-300">5 Modules Décisionnels Autonomes (McKinsey / PwC Tier)</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">
            Créé par Tarik Badri — en association avec Larbi Badri
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span>Réf. scientifique : Mghabbar &amp; Ratnamogan (ECAI 2020)</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="text-cyan-400">
            Plateforme : {platform === 'macos' ? 'macOS (Darwin ARM/Intel)' : 'Windows 11/10 (Win32 x64)'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">0 surcoût d'inférence</span>
        </div>
      </footer>
    </div>
  );
};
