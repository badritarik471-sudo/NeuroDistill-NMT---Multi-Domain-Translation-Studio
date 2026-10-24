import JSZip from 'jszip';
import { PYTHON_PROJECT_FILES } from './pythonProjectFiles';
import { generateStandaloneAppHtml } from './standaloneAppGenerator';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Add all project files into multi_domain_nmt_saas folder
  const rootFolder = zip.folder('NeuroDistill_Software_Suite');
  if (!rootFolder) {
    throw new Error('Failed to create ZIP root directory');
  }

  // 1. Python PyTorch backend & scripts
  for (const file of PYTHON_PROJECT_FILES) {
    rootFolder.file(file.path, file.content);
  }

  // 2. Standalone Offline Executable HTML App (Double-cliquable partout, 0 installation requise)
  const standaloneHtml = generateStandaloneAppHtml();
  rootFolder.file('NeuroDistill_StratIntelligence_App.html', standaloneHtml);

  // 3. Native macOS 1-Click Launcher (double-cliquable dans le Finder)
  const macCommand = `#!/usr/bin/env bash
# ==============================================================================
# NeuroDistill Strat-Intelligence — Lanceur macOS Double-Clic
# Créé par Tarik Badri — en association avec Larbi Badri
# Référence scientifique : Mghabbar & Ratnamogan (ECAI 2020)
# ==============================================================================
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "🍏 Lancement de NeuroDistill Strat-Intelligence sur macOS..."
echo "Conception : Tarik Badri & Larbi Badri"

# 1. Ouvrir immédiatement l'interface autonome dans le navigateur par défaut
open "$DIR/NeuroDistill_StratIntelligence_App.html"

# 2. Si Python 3 est disponible, lancer optionnellement le serveur PyTorch
if command -v python3 &> /dev/null; then
    echo "⚡ Démarrage du serveur PyTorch & FastAPI en arrière-plan..."
    chmod +x desktop/run_mac.sh
    ./desktop/run_mac.sh
else
    echo "ℹ️ Mode Autonome actif. L'application s'exécute localement sans dépendance."
fi
`;
  rootFolder.file('Lancer_macOS.command', macCommand);

  // 4. Native Windows 1-Click Launcher (double-cliquable dans l'Explorateur Windows)
  const winBat = `@echo off
chcp 65001 >nul
title NeuroDistill Strat-Intelligence — Tarik Badri ^& Larbi Badri
echo ============================================================================
echo   NEURODISTILL STRAT-INTELLIGENCE — SUITE LOGICIEL
echo   Créé par Tarik Badri — en association avec Larbi Badri
echo   Réf. scientifique : Mghabbar & Ratnamogan (ECAI 2020)
echo ============================================================================

REM 1. Ouvrir l'application autonome dans le navigateur par défaut
start "" "%~dp0NeuroDistill_StratIntelligence_App.html"

REM 2. Lancer le serveur backend PyTorch si Python est présent
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Démarrage du moteur PyTorch local...
    call desktop\\run_windows.bat
) else (
    echo [INFO] Mode Autonome actif. Aucune installation Python requise.
)
pause
`;
  rootFolder.file('Lancer_Windows.bat', winBat);

  // 5. Guide de démarrage rapide en Français
  const quickGuide = `================================================================================
NEURODISTILL STRAT-INTELLIGENCE — GUIDE D'UTILISATION DU LOGICIEL
================================================================================
Créateur : Tarik Badri — Associé : Larbi Badri
Référence scientifique : Mghabbar & Ratnamogan (ECAI 2020)
Cabinet d'Analyse Stratégique & Croisement Décisionnel (Niveau McKinsey / PwC)
================================================================================

VOUS AVEZ 2 MODES D'UTILISATION :

--------------------------------------------------------------------------------
MODE 1 : LANCEMENT IMMÉDIAT EN 1 CLIC (ZÉRO INSTALLATION)
--------------------------------------------------------------------------------
1. Double-cliquez directement sur le fichier :
   --> "NeuroDistill_StratIntelligence_App.html"
   (ou sur "Lancer_macOS.command" sous Mac / "Lancer_Windows.bat" sous Windows).

2. L'application s'ouvre instantanément dans votre navigateur (Safari, Chrome,
   Edge, Firefox).
   - 100% Hors-ligne : fonctionne sans connexion Internet.
   - 0€ surcoût : aucune API externe ni compte requis.
   - Toutes les fonctionnalités de croisement décisionnel, d'arbitrage MECE Minto
     Pyramid, d'arène de débat ComEx et d'entraînement par documents sont actives.

--------------------------------------------------------------------------------
MODE 2 : SERVEUR PYTORCH LOCAL & DISTILLATION NEURONALE COMPLÈTE
--------------------------------------------------------------------------------
Pour exécuter le pipeline d'entraînement Transformer et l'Algorithm 1 complet
avec les 5 Professeurs et l'Étudiant Multi-Domaine :

Sur macOS / Linux :
  1. Ouvrez le Terminal dans ce dossier
  2. Lancez :
     chmod +x desktop/run_mac.sh && ./desktop/run_mac.sh

Sur Windows :
  1. Double-cliquez sur :
     desktop\\run_windows.bat

Le serveur FastAPI démarre sur http://127.0.0.1:8000 avec documentation Swagger.

================================================================================
`;
  rootFolder.file('GUIDE_DEMARRAGE_RAPIDE.txt', quickGuide);

  // Generate ZIP blob
  return await zip.generateAsync({ type: 'blob' });
}

export function generateStandaloneAppBlob(): Blob {
  const html = generateStandaloneAppHtml();
  return new Blob([html], { type: 'text/html;charset=utf-8' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
