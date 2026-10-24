import JSZip from 'jszip';
import { generateStandaloneAppHtml } from './standaloneAppGenerator';
import { downloadBlob } from './pythonProjectGenerator';

export interface ElectronBuildConfig {
  appName: string;
  appId: string;
  version: string;
  author: string;
  copyright: string;
  macTargets: string[];
  winTargets: string[];
}

export const DEFAULT_ELECTRON_CONFIG: ElectronBuildConfig = {
  appName: 'NeuroDistill Strat-Intelligence',
  appId: 'com.neurodistill.stratintelligence',
  version: '1.0.0',
  author: 'Tarik Badri & Larbi Badri',
  copyright: 'Copyright © 2026 Tarik Badri — en association avec Larbi Badri. Réf: Mghabbar & Ratnamogan (ECAI 2020)',
  macTargets: ['dmg', 'zip', 'dir'], // dir produces .app directly
  winTargets: ['nsis', 'portable'], // portable produces standalone .exe
};

/**
 * Returns package.json formatted for electron-builder standalone compilation
 */
export function generateElectronPackageJson(config: ElectronBuildConfig = DEFAULT_ELECTRON_CONFIG): string {
  const pkg = {
    name: 'neurodistill-strat-intelligence',
    productName: config.appName,
    version: config.version,
    description: 'Application de Stratégie Décisionnelle & Traduction Neuronale par Distillation Multi-Professeurs (ECAI 2020)',
    main: 'electron/main.cjs',
    author: config.author,
    license: 'Proprietary',
    scripts: {
      start: 'electron .',
      'build:mac': 'electron-builder --mac',
      'build:mac:app': 'electron-builder --mac --dir',
      'build:mac:dmg': 'electron-builder --mac dmg',
      'build:win': 'electron-builder --win portable nsis',
      'build:win:exe': 'electron-builder --win portable',
      'build:all': 'electron-builder -mw',
    },
    devDependencies: {
      electron: '^33.2.0',
      'electron-builder': '^25.1.8',
    },
    build: {
      appId: config.appId,
      productName: config.appName,
      copyright: config.copyright,
      directories: {
        output: 'dist-electron',
      },
      files: [
        'electron/**/*',
        'index.html',
        'package.json',
      ],
      mac: {
        category: 'public.app-category.business',
        target: [
          { target: 'dmg', arch: ['x64', 'arm64'] },
          { target: 'zip', arch: ['x64', 'arm64'] },
          { target: 'dir', arch: ['x64', 'arm64'] },
        ],
        artifactName: '${productName}-${version}-macOS.${ext}',
        darkModeSupport: true,
      },
      win: {
        target: [
          { target: 'portable', arch: ['x64'] },
          { target: 'nsis', arch: ['x64'] },
        ],
        artifactName: '${productName}-${version}-Windows.${ext}',
      },
      nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: config.appName,
      },
      portable: {
        artifactName: 'NeuroDistill-Strat-Intelligence-Standalone.exe',
      },
    },
  };

  return JSON.stringify(pkg, null, 2);
}

/**
 * Returns electron-builder.json dedicated configuration file
 */
export function generateElectronBuilderConfig(config: ElectronBuildConfig = DEFAULT_ELECTRON_CONFIG): string {
  const builderConfig = {
    appId: config.appId,
    productName: config.appName,
    copyright: config.copyright,
    directories: {
      output: 'dist-electron',
    },
    files: [
      'electron/**/*',
      'index.html',
      'package.json',
    ],
    mac: {
      category: 'public.app-category.business',
      target: [
        { target: 'dmg', arch: ['x64', 'arm64'] },
        { target: 'zip', arch: ['x64', 'arm64'] },
        { target: 'dir', arch: ['x64', 'arm64'] },
      ],
      artifactName: '${productName}-${version}-macOS.${ext}',
      darkModeSupport: true,
    },
    win: {
      target: [
        { target: 'portable', arch: ['x64'] },
        { target: 'nsis', arch: ['x64'] },
      ],
      artifactName: '${productName}-${version}-Windows.${ext}',
    },
    portable: {
      artifactName: 'NeuroDistill-Strat-Intelligence-Standalone.exe',
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      shortcutName: config.appName,
    },
  };

  return JSON.stringify(builderConfig, null, 2);
}

/**
 * Returns electron/main.cjs main process script
 */
export function generateElectronMainScript(): string {
  return `/**
 * NeuroDistill Strat-Intelligence — Processus Principal Electron
 * Conçu par Tarik Badri — en association avec Larbi Badri
 * Référence scientifique : Mghabbar & Ratnamogan (ECAI 2020)
 */

const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1024,
    minHeight: 700,
    title: 'NeuroDistill Strat-Intelligence — Tarik Badri & Larbi Badri',
    backgroundColor: '#070b14',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    show: false,
  });

  // Load the standalone offline bundle
  const indexPath = path.join(__dirname, '..', 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupAppMenu();
}

function setupAppMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              {
                label: 'À propos de NeuroDistill...',
                click: () => {
                  dialog.showMessageBox(mainWindow, {
                    type: 'info',
                    title: 'À propos',
                    message: 'NeuroDistill Strat-Intelligence (v1.0.0)',
                    detail:
                      'Conçu par : Tarik Badri\\nAssocié : Larbi Badri\\n\\nRéférence scientifique : Mghabbar & Ratnamogan (ECAI 2020)\\nDistillation Multi-Domaines & Croisement Décisionnel Stratégique.',
                  });
                },
              },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'Fichier',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit', label: 'Quitter' },
      ],
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Recharger l\\'interface' },
        { role: 'forceReload', label: 'Forcer le rechargement' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Taille normale' },
        { role: 'zoomIn', label: 'Zoom avant' },
        { role: 'zoomOut', label: 'Zoom arrière' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' },
      ],
    },
    {
      label: 'Aide & Recherche',
      submenu: [
        {
          label: 'Documentation Scientifique (ECAI 2020)',
          click: () => {
            shell.openExternal('https://ecai2020.eu/');
          },
        },
        {
          label: 'Crédits : Tarik Badri & Larbi Badri',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Crédits & Conception',
              message: 'NeuroDistill Strat-Intelligence',
              detail: 'Créé par Tarik Badri, en association avec Larbi Badri.',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
`;
}

/**
 * Returns electron/preload.cjs script
 */
export function generateElectronPreloadScript(): string {
  return `/**
 * NeuroDistill Strat-Intelligence — Script Preload sécurisé
 */
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  version: '1.0.0',
  buildEngine: 'electron-builder',
});
`;
}

/**
 * Returns build_standalone_mac.command 1-click builder script
 */
export function generateMacBuilderScript(): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# NeuroDistill Strat-Intelligence — Générateur Standalone macOS (.app)
# Conçu par Tarik Badri — en association avec Larbi Badri
# Référence scientifique : Mghabbar & Ratnamogan (ECAI 2020)
# ==============================================================================
set -e

DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "🍏 ======================================================================"
echo "🍏   GÉNÉRATEUR STANDALONE MACOS (.app & .dmg)"
echo "🍏   NeuroDistill Strat-Intelligence — Tarik Badri & Larbi Badri"
echo "🍏   Outil utilisé : electron-builder"
echo "🍏 ======================================================================"
echo ""

# Vérification de Node.js et npm
if ! command -v npm &> /dev/null; then
    echo "❌ Erreur : Node.js et npm ne sont pas installés."
    echo "➡️  Veuillez télécharger et installer Node.js depuis https://nodejs.org/"
    exit 1
fi

echo "📦 Étape 1/3 : Installation des dépendances Electron & electron-builder..."
npm install

echo ""
echo "🔨 Étape 2/3 : Compilation de l'application standalone macOS (.app & .dmg)..."
npx electron-builder --mac

echo ""
echo "✨ ======================================================================"
echo "🎉 Étape 3/3 : COMPILATION RÉUSSIE !"
echo "📁 Votre logiciel macOS est prêt dans le dossier 'dist-electron' :"
echo "   ▶ Application native : dist-electron/mac/NeuroDistill Strat-Intelligence.app"
echo "   ▶ Image disque DMG   : dist-electron/NeuroDistill Strat-Intelligence-1.0.0-macOS.dmg"
echo "======================================================================"

# Ouvrir le dossier résultant dans le Finder
if [ -d "dist-electron" ]; then
    open dist-electron
fi
`;
}

/**
 * Returns build_standalone_win.bat 1-click builder script
 */
export function generateWinBuilderScript(): string {
  return `@echo off
chcp 65001 >nul
title NeuroDistill Strat-Intelligence — Générateur Standalone Windows (.exe)
echo ======================================================================
echo   GÉNÉRATEUR STANDALONE WINDOWS (.exe) VIA ELECTRON-BUILDER
echo   NeuroDistill Strat-Intelligence — Tarik Badri ^& Larbi Badri
echo   Réf. scientifique : Mghabbar ^& Ratnamogan (ECAI 2020)
echo ======================================================================
echo.

REM Vérification de npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js et npm ne sont pas détectés.
    echo ➡️ Veuillez installer Node.js depuis https://nodejs.org/ (version LTS recommandée).
    pause
    exit /b 1
)

echo [1/3] Installation des modules Electron et electron-builder...
call npm install
if %errorlevel% neq 0 (
    echo [ERREUR] Échec lors de npm install.
    pause
    exit /b 1
)

echo.
echo [2/3] Compilation du package standalone Windows (.exe)...
echo       - Génération de l'exécutable portable direct (.exe)
echo       - Génération de l'installeur officiel Windows (.exe)
call npx electron-builder --win portable nsis
if %errorlevel% neq 0 (
    echo [ERREUR] Échec de la compilation electron-builder.
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo [SUCCÈS] Votre logiciel standalone Windows (.exe) est prêt !
echo Dossier de sortie : dist-electron\\
echo   1. Exécutable Portable (.exe) :
echo      --> dist-electron\\NeuroDistill-Strat-Intelligence-Standalone.exe
echo   2. Installeur Complet (.exe) :
echo      --> dist-electron\\NeuroDistill Strat-Intelligence-1.0.0-Windows.exe
echo ======================================================================
echo.

if exist "dist-electron" (
    explorer dist-electron
)
pause
`;
}

/**
 * Generates the full documentation README for electron-builder
 */
export function generateElectronReadme(): string {
  return `# NeuroDistill Strat-Intelligence — Kit Standalone Electron-Builder (.app & .exe)

**Créateur :** Tarik Badri — **Associé :** Larbi Badri  
**Référence scientifique :** Mghabbar & Ratnamogan, *« Building a Multi-domain Neural Machine Translation Model using Knowledge Distillation »*, ECAI 2020.

---

## 🎯 Vue d'Ensemble

Ce kit permet de compiler et générer automatiquement l'application sous forme de véritable **logiciel de bureau natif (Standalone)** :
- **macOS :** Exécutable \`.app\` et image d'installation \`.dmg\` (compatible processeurs Apple Silicon M1/M2/M3/M4 et Intel x64).
- **Windows :** Exécutable autonome \`.exe\` (version portable sans installation) et installeur complet Windows (\`setup.exe\` NSIS).

L'application intègre l'ensemble des modules d'analyse stratégique type McKinsey/PwC, l'arène de confrontation ComEx, l'entraînement par documents et le moteur de distillation neuronale multi-professeurs.

---

## 🚀 Méthode 1 : Compilation en 1 Clic (Sans Ligne de Commande)

### Sur macOS :
1. Décompressez le fichier ZIP.
2. Double-cliquez sur le fichier :
   \`\`\`bash
   build_standalone_mac.command
   \`\`\`
   *(Si macOS vous demande une autorisation d'exécution : faites un clic-droit > Ouvrir).*
3. Le script installe \`electron-builder\`, compile le projet et ouvre automatiquement le dossier \`dist-electron/\` contenant :
   - \`dist-electron/mac/NeuroDistill Strat-Intelligence.app\`
   - \`dist-electron/NeuroDistill Strat-Intelligence-1.0.0-macOS.dmg\`

### Sur Windows :
1. Décompressez le fichier ZIP.
2. Double-cliquez sur le fichier :
   \`\`\`bat
   build_standalone_win.bat
   \`\`\`
3. Le script génère automatiquement dans le dossier \`dist-electron/\` :
   - \`NeuroDistill-Strat-Intelligence-Standalone.exe\` *(Double-cliquez et utilisez directement)*
   - \`NeuroDistill Strat-Intelligence-1.0.0-Windows.exe\` *(Installeur complet avec raccourci bureau)*

---

## 💻 Méthode 2 : Ligne de Commande (Terminal / CMD)

Ouvrez un terminal dans le dossier décompressé :

\`\`\`bash
# 1. Installer les dépendances
npm install

# 2. Pour macOS (.app + .dmg) :
npm run build:mac

# 3. Pour Windows (.exe standalone + setup) :
npm run build:win

# 4. Pour tester immédiatement sans compiler :
npm start
\`\`\`

---

## 🛡️ Fonctionnement 100% Hors-Ligne & Données Sécurisées
- L'exécutable standalone fonctionne **intégralement en local**, sans serveur distant ni envoi de données.
- Vos documents d'entreprise, analyses financières et grilles d'arbitrage restent strictement confinés sur votre machine.
`;
}

/**
 * Creates the complete ready-to-build ZIP archive with electron-builder pre-configured
 */
export async function generateElectronStandaloneZip(config: ElectronBuildConfig = DEFAULT_ELECTRON_CONFIG): Promise<Blob> {
  const zip = new JSZip();

  const folder = zip.folder('NeuroDistill_Electron_Standalone_Builder');
  if (!folder) {
    throw new Error('Failed to create ZIP directory');
  }

  // 1. package.json with electron-builder configuration
  const pkgJson = generateElectronPackageJson(config);
  folder.file('package.json', pkgJson);

  // 2. electron-builder.json dedicated config
  const builderJson = generateElectronBuilderConfig(config);
  folder.file('electron-builder.json', builderJson);

  // 3. electron/ directory
  const electronFolder = folder.folder('electron');
  if (electronFolder) {
    electronFolder.file('main.cjs', generateElectronMainScript());
    electronFolder.file('preload.cjs', generateElectronPreloadScript());
  }

  // 4. Standalone single-file HTML app bundle embedded as index.html
  const standaloneHtml = generateStandaloneAppHtml();
  folder.file('index.html', standaloneHtml);

  // 5. Automated 1-click build scripts
  folder.file('build_standalone_mac.command', generateMacBuilderScript());
  folder.file('build_standalone_win.bat', generateWinBuilderScript());

  // 6. Comprehensive README
  folder.file('README_ELECTRON_BUILDER.md', generateElectronReadme());

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Triggers instant download of the complete Electron builder package
 */
export async function downloadElectronStandaloneBuilderKit(): Promise<void> {
  const zipBlob = await generateElectronStandaloneZip();
  downloadBlob(zipBlob, 'NeuroDistill_Electron_Standalone_Builder.zip');
}
