import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateElectronPackageJson,
  generateElectronBuilderConfig,
  generateElectronMainScript,
  generateElectronPreloadScript,
  generateMacBuilderScript,
  generateWinBuilderScript,
  generateElectronReadme,
  DEFAULT_ELECTRON_CONFIG,
} from './electronPackageGenerator';

test('generateElectronPackageJson outputs valid JSON with electron-builder targets', () => {
  const jsonStr = generateElectronPackageJson();
  const parsed = JSON.parse(jsonStr);

  assert.equal(parsed.name, 'neurodistill-strat-intelligence');
  assert.equal(parsed.main, 'electron/main.cjs');
  assert.ok(parsed.devDependencies['electron-builder']);
  assert.ok(parsed.scripts['build:mac']);
  assert.ok(parsed.scripts['build:win']);
  assert.ok(parsed.scripts['build:mac:app']);
  assert.ok(parsed.scripts['build:win:exe']);

  // Check build configuration for macOS and Windows
  assert.ok(parsed.build);
  assert.equal(parsed.build.appId, DEFAULT_ELECTRON_CONFIG.appId);
  assert.ok(parsed.build.mac);
  assert.ok(parsed.build.win);
  assert.ok(parsed.build.portable);
  assert.equal(parsed.build.portable.artifactName, 'NeuroDistill-Strat-Intelligence-Standalone.exe');
});

test('generateElectronBuilderConfig contains required paths and targets', () => {
  const jsonStr = generateElectronBuilderConfig();
  const parsed = JSON.parse(jsonStr);

  assert.equal(parsed.directories.output, 'dist-electron');
  assert.ok(parsed.files.includes('electron/**/*'));
  assert.ok(parsed.files.includes('index.html'));
  assert.ok(parsed.mac.target.some((t: { target: string }) => t.target === 'dir' || t.target === 'dmg'));
  assert.ok(parsed.win.target.some((t: { target: string }) => t.target === 'portable' || t.target === 'nsis'));
});

test('generateElectronMainScript produces robust Electron main process', () => {
  const script = generateElectronMainScript();
  assert.ok(script.includes("require('electron')"));
  assert.ok(script.includes('BrowserWindow'));
  assert.ok(script.includes('loadFile(indexPath)'));
  assert.ok(script.includes('Tarik Badri'));
  assert.ok(script.includes('Larbi Badri'));
  assert.ok(script.includes('ECAI 2020'));
});

test('generateElectronPreloadScript exposes safe electronAPI', () => {
  const script = generateElectronPreloadScript();
  assert.ok(script.includes('contextBridge.exposeInMainWorld'));
  assert.ok(script.includes('electronAPI'));
  assert.ok(script.includes('electron-builder'));
});

test('generateMacBuilderScript and generateWinBuilderScript contain correct commands', () => {
  const macScript = generateMacBuilderScript();
  assert.ok(macScript.includes('electron-builder --mac'));
  assert.ok(macScript.includes('dist-electron'));
  assert.ok(macScript.includes('.app'));

  const winScript = generateWinBuilderScript();
  assert.ok(winScript.includes('electron-builder --win portable nsis'));
  assert.ok(winScript.includes('.exe'));
  assert.ok(winScript.includes('dist-electron'));
});

test('generateElectronReadme details standalone deployment guide', () => {
  const readme = generateElectronReadme();
  assert.ok(readme.includes('Tarik Badri'));
  assert.ok(readme.includes('Larbi Badri'));
  assert.ok(readme.includes('.app'));
  assert.ok(readme.includes('.exe'));
  assert.ok(readme.includes('ECAI 2020'));
});
