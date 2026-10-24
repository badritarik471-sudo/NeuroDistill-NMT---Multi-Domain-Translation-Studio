import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  generateProjectZip,
  generateStandaloneAppBlob,
  downloadBlob,
} from '../utils/pythonProjectGenerator';
import {
  generateElectronStandaloneZip,
  DEFAULT_ELECTRON_CONFIG,
} from '../utils/electronPackageGenerator';
import {
  CODE_SCHEMA_BLOCKS,
  ARCHITECTURE_ASCII_SCHEMA,
  CodeBlockItem,
} from '../utils/architectureCodeSchema';
import {
  generateWindowsExeBlob,
  generateIExpressSedScript,
  generatePowerShellToExeScript,
} from '../utils/windowsExeGenerator';
import { PlatformOS } from '../types';
import {
  X,
  Download,
  Terminal,
  Apple,
  Monitor,
  Check,
  Copy,
  FolderArchive,
  FileCode,
  Sparkles,
  ShieldCheck,
  Laptop,
  ArrowDownCircle,
  PackageCheck,
  Box,
  Layers,
  ChevronRight,
  Info,
  Code2,
  Play,
  FileCheck,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformOS;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, platform }) => {
  const [activeTab, setActiveTab] = useState<'exe' | 'electron' | 'schema' | 'suite' | 'html' | 'pwa'>(
    platform === 'windows' ? 'exe' : 'exe'
  );
  const [selectedSchemaBlock, setSelectedSchemaBlock] = useState<string>(CODE_SCHEMA_BLOCKS[0].id);
  const [selectedOsTarget, setSelectedOsTarget] = useState<'mac' | 'win'>('win');
  const [isExportingExe, setIsExportingExe] = useState(false);
  const [isExportingIExpress, setIsExportingIExpress] = useState(false);
  const [isExportingElectron, setIsExportingElectron] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsPwaInstalled(isStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  // 0. Download Direct Windows PE .EXE Executable File
  const handleDownloadDirectExe = () => {
    try {
      setIsExportingExe(true);
      const blob = generateWindowsExeBlob();
      downloadBlob(blob, 'NeuroDistill_StratIntelligence_Portable.exe');
      setDownloadSuccess('Fichier exécutable Windows (.exe) téléchargé avec succès ! Double-cliquez dessus pour lancer immédiatement.');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error('Direct EXE export error:', err);
    } finally {
      setIsExportingExe(false);
    }
  };

  // 0.1 Download Microsoft IExpress Pack (.bat + .sed + HTML) to compile native .exe on Windows
  const handleDownloadIExpressKit = async () => {
    try {
      setIsExportingIExpress(true);
      const zip = new JSZip();
      const htmlBlob = generateStandaloneAppBlob();
      const htmlText = await htmlBlob.text();
      zip.file('NeuroDistill_StratIntelligence_App.html', htmlText);
      zip.file('make_exe.sed', generateIExpressSedScript('NeuroDistill_StratIntelligence', 'NeuroDistill_StratIntelligence_App.html'));
      zip.file('make_exe.bat', generatePowerShellToExeScript());
      zip.file('LISEZMOI_EXE.txt', `COMMENT CRÉER LE .EXE :
1. Décompressez ce dossier ZIP.
2. Double-cliquez sur "make_exe.bat".
3. L'outil officiel Microsoft IExpress (inclus dans 100% des PC Windows 10/11) compile instantanément "NeuroDistill_StratIntelligence.exe" !
4. Vous pouvez ensuite déplacer le fichier .exe où vous voulez.`);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, 'NeuroDistill_Windows_EXE_Maker.zip');
      setDownloadSuccess('Pack Convertisseur .EXE Windows téléchargé ! Double-cliquez sur make_exe.bat pour compiler votre .exe en 5 secondes.');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error('IExpress kit error:', err);
    } finally {
      setIsExportingIExpress(false);
    }
  };

  // 1. Download Standalone Electron Builder Kit (.app & .exe)
  const handleDownloadElectronBuilder = async () => {
    try {
      setIsExportingElectron(true);
      const zip = await generateElectronStandaloneZip();
      downloadBlob(zip, 'NeuroDistill_Electron_Standalone_Builder.zip');
      setDownloadSuccess('Kit Standalone Electron-Builder téléchargé ! Suivez les instructions ci-dessous pour générer votre .app ou .exe.');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (e) {
      console.error('Electron export error:', e);
    } finally {
      setIsExportingElectron(false);
    }
  };

  // 2. Download Complete ZIP Package (PyTorch backend + HTML)
  const handleDownloadZip = async () => {
    try {
      setIsExportingZip(true);
      const zip = await generateProjectZip();
      downloadBlob(zip, 'NeuroDistill_Software_Suite.zip');
      setDownloadSuccess('Pack ZIP téléchargé avec succès !');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingZip(false);
    }
  };

  // 3. Download Standalone Single HTML File (0-setup instant run)
  const handleDownloadStandaloneHtml = () => {
    try {
      setIsExportingHtml(true);
      const blob = generateStandaloneAppBlob();
      downloadBlob(blob, 'NeuroDistill_StratIntelligence_App.html');
      setDownloadSuccess('Logiciel autonome .HTML téléchargé ! Double-cliquez dessus pour le lancer sans serveur.');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingHtml(false);
    }
  };

  // 4. Trigger Native PWA Desktop Install
  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      alert(
        "Pour installer l'application sur votre bureau :\n• Sur Chrome / Edge : Cliquez sur l'icône d'installation dans la barre d'adresse (en haut à droite).\n• Sur Safari (macOS) : Menu Fichier > Ajouter au Dock."
      );
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const handleCopy = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const macElectronCmd = `npm install && npx electron-builder --mac`;
  const winElectronCmd = `npm install && npx electron-builder --win portable nsis`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-slate-200 my-auto animate-in fade-in duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-900/80 to-blue-900/60 border border-cyan-600/60 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white">
                  Déploiement Logiciel Standalone (.app macOS &amp; .exe Windows)
                </h2>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono font-semibold">
                  electron-builder v25
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  100% Hors-Ligne
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Créé par Tarik Badri — en association avec Larbi Badri • Réf. : Mghabbar &amp; Ratnamogan (ECAI 2020)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Fermer la fenêtre d'export"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {downloadSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in shadow-md">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{downloadSuccess}</span>
          </div>
        )}

        {/* Navigation Tabs (Segmented Control) */}
        <div className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('exe')}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'exe'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-950/80 ring-1 ring-emerald-400/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Monitor className="w-4 h-4 text-emerald-300" />
            <span>🪟 Exécutable .EXE Windows</span>
            <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-600 px-1.5 py-0.5 rounded font-mono font-semibold">
              Direct
            </span>
          </button>

          <button
            onClick={() => setActiveTab('electron')}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'electron'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Box className="w-4 h-4 text-cyan-300" />
            <span>Standalone .app / .exe (electron-builder)</span>
            <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-700/80 px-1.5 py-0.5 rounded font-mono font-semibold">
              Recommandé
            </span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'schema'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-900/50 ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-300" />
            <span>📋 Schéma &amp; Code Source (Copier l'Outil)</span>
            <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-700/80 px-1.5 py-0.5 rounded font-mono font-semibold">
              PyTorch &amp; TS
            </span>
          </button>

          <button
            onClick={() => setActiveTab('suite')}
            className={`px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'suite'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>Pack ZIP &amp; Backend PyTorch</span>
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'html'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Fichier Unique .HTML (0 install)</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer shrink-0 ${
              activeTab === 'pwa'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Installation Bureau PWA</span>
          </button>
        </div>

        {/* TAB 0: DIRECT WINDOWS .EXE EXECUTABLE */}
        {activeTab === 'exe' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Hero Main Download Box */}
            <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/50 border border-emerald-600/50 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-extrabold text-white flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-emerald-400" />
                    <span>Fichier Exécutable Windows Direct (.EXE)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    PE32 Windows Natif
                  </span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700 px-2 py-0.5 rounded font-mono">
                    Windows 11 / 10 (64 &amp; 32-bit)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Voici le fichier binaire exécutable <strong>.EXE</strong> direct pour Windows. Il se lance par un simple double-clic, fonctionne <strong>100% hors-ligne</strong> sans serveur, sans terminal et sans aucune commande technique.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                  <span>Nom : <strong className="text-emerald-300">NeuroDistill_StratIntelligence_Portable.exe</strong></span>
                  <span>•</span>
                  <span>Lancement : <strong className="text-cyan-300">Fenêtre Bureau Dédiée (Sans Navigateur)</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  onClick={handleDownloadDirectExe}
                  disabled={isExportingExe}
                  className="px-5 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                  <span>{isExportingExe ? 'Génération du .EXE...' : 'Télécharger le .EXE Direct'}</span>
                </button>
                <a
                  href="/NeuroDistill_Portable.exe"
                  download="NeuroDistill_Portable.exe"
                  className="px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center justify-center gap-1.5 border border-slate-700 transition"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lien alternatif direct (.exe)</span>
                </a>
              </div>
            </div>

            {/* 3 Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* Method 1: Convert HTML into .EXE via Windows Built-in IExpress (Zero install) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span>Convertir en .EXE avec l'outil officiel Windows (IExpress)</span>
                    </span>
                    <span className="text-[9px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                      0 Outil à Installer
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Votre ordinateur Windows 10/11 contient déjà l'utilitaire système officiel Microsoft <code className="text-cyan-300 font-mono text-[10px]">iexpress.exe</code>. Ce pack contient un script automatique <strong className="text-slate-100">make_exe.bat</strong> qui compile le fichier en un <strong>.EXE autonome certifié</strong> en 5 secondes.
                  </p>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                    <div>1. Téléchargez le pack ci-dessous et dézippez-le</div>
                    <div>2. Double-cliquez sur <span className="text-emerald-400 font-bold">make_exe.bat</span></div>
                    <div>3. Votre exécutable <span className="text-cyan-300 font-bold">NeuroDistill.exe</span> est créé !</div>
                  </div>
                </div>

                <button
                  onClick={handleDownloadIExpressKit}
                  disabled={isExportingIExpress}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-600/40 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>{isExportingIExpress ? 'Préparation...' : 'Télécharger le Kit Convertisseur .EXE (make_exe.bat)'}</span>
                </button>
              </div>

              {/* Method 2: Professional Electron-Builder .EXE (Chromium runtime standalone) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Box className="w-4 h-4 text-cyan-400" />
                      <span>Binaire Électron Complet (.EXE Portable &amp; Setup)</span>
                    </span>
                    <span className="text-[9px] bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
                      electron-builder v25
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Pour générer un installateur officiel Windows avec icône dans le Menu Démarrer et runtime Chromium intégré sans aucune dépendance :
                  </p>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                    <div>• Produit : <span className="text-cyan-300">NeuroDistill-Portable.exe</span> (portable)</div>
                    <div>• Produit : <span className="text-cyan-300">NeuroDistill-Setup.exe</span> (installateur)</div>
                    <div>• Commande : <code className="text-slate-300">npm install &amp;&amp; npx electron-builder --win</code></div>
                  </div>
                </div>

                <button
                  onClick={handleDownloadElectronBuilder}
                  disabled={isExportingElectron}
                  className="w-full py-2.5 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/60 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span>{isExportingElectron ? 'Génération du kit...' : 'Télécharger le Kit Electron-Builder (.zip)'}</span>
                </button>
              </div>

            </div>

            {/* Step-by-Step Instructions for Windows */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instructions d'exécution sur Windows 10 et Windows 11 :</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">1. Télécharger le .EXE</div>
                  <p className="text-[11px] text-slate-400">
                    Cliquez sur le bouton vert <strong>« Télécharger le .EXE Direct »</strong> ci-dessus. Le fichier se place dans votre dossier Téléchargements.
                  </p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">2. Double-clic pour lancer</div>
                  <p className="text-[11px] text-slate-400">
                    Double-cliquez sur le fichier. L'application s'ouvre immédiatement dans sa <strong>propre fenêtre autonome</strong> sans barre de navigateur.
                  </p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">3. SmartScreen (Si affiché)</div>
                  <p className="text-[11px] text-slate-400">
                    Si Windows affiche l'écran bleu <em>« Windows a protégé votre PC »</em>, cliquez sur <strong>« Informations complémentaires »</strong> puis sur <strong>« Exécuter quand même »</strong>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 1: ELECTRON-BUILDER STANDALONE */}
        {activeTab === 'electron' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Banner overview */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 border border-cyan-600/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    Générateur Standalone Officiel Electron-Builder
                  </span>
                  <span className="text-[10px] bg-cyan-900/80 text-cyan-200 border border-cyan-700 px-2 py-0.5 rounded font-mono">
                    macOS (.app) &amp; Windows (.exe)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Déploie l’intégralité de l’application (Analyse de données type McKinsey/PwC, Arène ComEx, Entraînement par documents et Distillerie neuronale ECAI 2020) sous forme d'un <strong>logiciel de bureau natif autonome</strong> sans dépendance de serveur web.
                </p>
              </div>

              <button
                onClick={handleDownloadElectronBuilder}
                disabled={isExportingElectron}
                className="w-full md:w-auto px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2.5 transition active:scale-98 shrink-0 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isExportingElectron
                    ? 'Création du Kit Standalone...'
                    : 'Télécharger le Kit Standalone (.zip)'}
                </span>
              </button>
            </div>

            {/* Target OS Toggle Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* macOS .app Card */}
              <div
                onClick={() => setSelectedOsTarget('mac')}
                className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between gap-3 ${
                  selectedOsTarget === 'mac'
                    ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200">
                        <Apple className="w-4 h-4" />
                      </div>
                      <span>macOS (.app &amp; .dmg)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      Apple Silicon &amp; Intel
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Produit un véritable bundle <strong>.app</strong> natif macOS et une image disque <strong>.dmg</strong> prêts pour le Finder et le Dock.
                  </p>
                  <div className="text-[11px] text-slate-400 space-y-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Exécutable généré :</span>
                      <code className="text-cyan-300 font-mono text-[10px]">dist-electron/mac/NeuroDistill.app</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Image d'installation :</span>
                      <code className="text-cyan-300 font-mono text-[10px]">dist-electron/*.dmg</code>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">1-Clic ou Terminal :</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(macElectronCmd, 'mac-electron');
                      }}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCmd === 'mac-electron' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCmd === 'mac-electron' ? 'Copié' : 'Copier'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-900 p-2 rounded text-[10px] font-mono text-cyan-300 select-all border border-slate-800">
                    {macElectronCmd}
                  </div>
                </div>
              </div>

              {/* Windows .exe Card */}
              <div
                onClick={() => setSelectedOsTarget('win')}
                className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between gap-3 ${
                  selectedOsTarget === 'win'
                    ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <span>Windows (.exe Standalone)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      Portable &amp; NSIS Setup
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Génère l’exécutable autonome <strong>.exe</strong> portable (double-clic direct sans installation) et l'installeur officiel Windows avec raccourci bureau.
                  </p>
                  <div className="text-[11px] text-slate-400 space-y-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Exécutable Portable :</span>
                      <code className="text-cyan-300 font-mono text-[10px]">dist-electron/*-Standalone.exe</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Installeur Windows :</span>
                      <code className="text-cyan-300 font-mono text-[10px]">dist-electron/*-Windows.exe</code>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">1-Clic ou Terminal :</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(winElectronCmd, 'win-electron');
                      }}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCmd === 'win-electron' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCmd === 'win-electron' ? 'Copié' : 'Copier'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-900 p-2 rounded text-[10px] font-mono text-cyan-300 select-all border border-slate-800">
                    {winElectronCmd}
                  </div>
                </div>
              </div>

            </div>

            {/* Step-by-step Execution Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Marche à suivre en 3 étapes simples :</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">1. Dézippez le Kit</div>
                  <p className="text-[11px] text-slate-400">
                    Cliquez sur le bouton ci-dessus pour télécharger <span className="text-slate-200">NeuroDistill_Electron_Standalone_Builder.zip</span> et décompressez-le.
                  </p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">2. Lancez le Générateur</div>
                  <p className="text-[11px] text-slate-400">
                    Double-cliquez sur <strong className="text-slate-200">build_standalone_mac.command</strong> (Mac) ou <strong className="text-slate-200">build_standalone_win.bat</strong> (PC).
                  </p>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">3. Récupérez le .app ou .exe</div>
                  <p className="text-[11px] text-slate-400">
                    Votre logiciel standalone apparaît automatiquement dans le sous-dossier <span className="text-emerald-300 font-mono">dist-electron/</span> !
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CODE SCHEMA & REPLICATION BLUEPRINT */}
        {activeTab === 'schema' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Top banner */}
            <div className="bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-700/50 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    Schéma Détaillé &amp; Code Source pour Copier / Répliquer l'Outil
                  </span>
                  <span className="text-[10px] bg-indigo-900/80 text-indigo-200 border border-indigo-700 px-2 py-0.5 rounded font-mono">
                    Code 100% Fonctionnel
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Tous les blocs d'algorithmes et d'architecture prêts à copier-coller : PyTorch (distillation ECAI 2020), TypeScript (moteur mathématique &amp; débat ComEx) et configuration de déploiement Electron.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    handleCopy(ARCHITECTURE_ASCII_SCHEMA, 'ascii-schema');
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedCmd === 'ascii-schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedCmd === 'ascii-schema' ? 'Schéma Copié !' : 'Copier Schéma ASCII'}</span>
                </button>
              </div>
            </div>

            {/* Code Selector & Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3">
              {/* Left sidebar: File selector */}
              <div className="lg:col-span-4 flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold px-2 py-1">
                  Composants du Système (5 fichiers) :
                </span>
                {CODE_SCHEMA_BLOCKS.map((item) => {
                  const isSelected = selectedSchemaBlock === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSchemaBlock(item.id)}
                      className={`text-left p-2.5 rounded-lg border transition cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-indigo-950/80 border-indigo-600 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{item.filename}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {item.language}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1">{item.title}</span>
                    </button>
                  );
                })}

                {/* ASCII Diagram Toggle */}
                <button
                  onClick={() => setSelectedSchemaBlock('ascii_diagram')}
                  className={`text-left p-2.5 rounded-lg border transition cursor-pointer flex flex-col gap-1 ${
                    selectedSchemaBlock === 'ascii_diagram'
                      ? 'bg-indigo-950/80 border-indigo-600 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">schema_global.txt</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      diagramme
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Schéma d'Architecture Global ASCII</span>
                </button>
              </div>

              {/* Right main area: Code Inspector */}
              <div className="lg:col-span-8 flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                {selectedSchemaBlock === 'ascii_diagram' ? (
                  <div className="flex flex-col h-full">
                    <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-300">schema_global.txt</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          Architecture Complète
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(ARCHITECTURE_ASCII_SCHEMA, 'active-code')}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedCmd === 'active-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCmd === 'active-code' ? 'Copié !' : 'Copier Tout'}</span>
                      </button>
                    </div>
                    <pre className="p-4 text-[10px] leading-tight font-mono text-cyan-200 bg-slate-950 overflow-x-auto overflow-y-auto max-h-[380px] select-all whitespace-pre">
                      {ARCHITECTURE_ASCII_SCHEMA}
                    </pre>
                  </div>
                ) : (
                  (() => {
                    const block = CODE_SCHEMA_BLOCKS.find((b) => b.id === selectedSchemaBlock) || CODE_SCHEMA_BLOCKS[0];
                    return (
                      <div className="flex flex-col h-full">
                        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-cyan-300">{block.filename}</span>
                            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">
                              {block.badge}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const blob = new Blob([block.code], { type: 'text/plain;charset=utf-8' });
                                downloadBlob(blob, block.filename);
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                              title="Télécharger ce fichier individuel"
                            >
                              <Download className="w-3 h-3 text-cyan-400" />
                              <span>Télécharger</span>
                            </button>
                            <button
                              onClick={() => handleCopy(block.code, 'active-code')}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
                            >
                              {copiedCmd === 'active-code' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedCmd === 'active-code' ? 'Code Copié !' : 'Copier en 1-Clic'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400">
                          {block.description}
                        </div>

                        <div className="p-3 bg-slate-950 overflow-x-auto overflow-y-auto max-h-[340px]">
                          <pre className="text-[11px] leading-relaxed font-mono text-slate-200 select-all whitespace-pre">
                            {block.code}
                          </pre>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETE SUITE ZIP */}
        {activeTab === 'suite' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4 animate-in fade-in duration-150">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <FolderArchive className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">Pack Logiciel Complet (.ZIP) avec Serveur PyTorch</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Comprend l'application complète hors-ligne, les lanceurs automatiques double-clic (Mac &amp; PC), le backend PyTorch d'entraînement des 5 professeurs et la documentation.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 mb-4 bg-slate-900 p-3 rounded-lg border border-slate-800">
                <li className="flex items-center gap-2">
                  <Apple className="w-3.5 h-3.5 text-slate-300" />
                  <span><strong>Lancer_macOS.command</strong> (Lanceur double-clic macOS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-slate-300" />
                  <span><strong>Lancer_Windows.bat</strong> (Lanceur double-clic Windows)</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span><strong>NeuroDistill_StratIntelligence_App.html</strong> (Application autonome)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isExportingZip}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingZip ? 'Génération du ZIP en cours...' : 'Télécharger le Pack ZIP Complet (.ZIP)'}</span>
            </button>
          </div>
        )}

        {/* TAB 3: STANDALONE HTML FILE */}
        {activeTab === 'html' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4 animate-in fade-in duration-150">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <FileCode className="w-5 h-5" />
                <h3 className="font-bold text-sm text-white">Exécutable Unique Hors-Ligne (.HTML)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Un seul fichier autonome. Double-cliquez dessus pour l'ouvrir dans n'importe quel navigateur (Safari, Chrome, Edge) sans aucun serveur, sans npm ni installation.
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 space-y-1.5 mb-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Fonctionnel Hors-Ligne &amp; Zéro Dépendance</span>
                </div>
                <div>Fonctionne immédiatement sur clé USB, disque dur externe ou machine d'entreprise sécurisée sans droits administrateur.</div>
              </div>
            </div>

            <button
              onClick={handleDownloadStandaloneHtml}
              disabled={isExportingHtml}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/80 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>{isExportingHtml ? 'Téléchargement...' : 'Télécharger l\'Appli Unique (.HTML)'}</span>
            </button>
          </div>
        )}

        {/* TAB 4: PWA DESKTOP INSTALL */}
        {activeTab === 'pwa' && (
          <div className="bg-gradient-to-r from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-900/60 rounded-xl p-5 flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-700/80 flex items-center justify-center text-indigo-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Installer comme Application Bureau Native (Dock / Menu Démarrer)</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Installe l'application directement dans votre système d’exploitation avec sa propre fenêtre dédiée et son icône native (Chrome, Edge ou Safari macOS).
                </p>
              </div>
            </div>

            <button
              onClick={handleInstallPwa}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow"
            >
              {isPwaInstalled ? 'Application Déjà Installée sur le Bureau' : 'Installer l\'Application sur le Bureau (Dock / Menu Démarrer)'}
            </button>
          </div>
        )}

        {/* Footer with credits */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>Conçu par Tarik Badri — en association avec Larbi Badri</span>
          <span className="font-mono">Réf. Scientifique : Mghabbar &amp; Ratnamogan (ECAI 2020)</span>
        </div>

      </div>
    </div>
  );
};
