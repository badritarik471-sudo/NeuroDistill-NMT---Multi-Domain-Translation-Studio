import test from 'node:test';
import assert from 'node:assert';
import {
  generateWindowsExeBlob,
  generateIExpressSedScript,
  generatePowerShellToExeScript,
} from './windowsExeGenerator';

test('generateWindowsExeBlob returns a valid PE32 Windows executable blob', async () => {
  const blob = generateWindowsExeBlob();
  assert.ok(blob instanceof Blob, 'Should be a Blob');
  assert.strictEqual(blob.size, 0x600, 'PE binary should be exactly 1536 bytes (3 aligned blocks)');

  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Check DOS header magic 'MZ'
  assert.strictEqual(bytes[0], 0x4d); // 'M'
  assert.strictEqual(bytes[1], 0x5a); // 'Z'

  // Check PE offset at 0x3c
  const view = new DataView(buffer);
  const peOffset = view.getUint32(0x3c, true);
  assert.strictEqual(peOffset, 128);

  // Check PE signature 'PE\0\0'
  assert.strictEqual(bytes[peOffset], 0x50);     // 'P'
  assert.strictEqual(bytes[peOffset + 1], 0x45); // 'E'
  assert.strictEqual(bytes[peOffset + 2], 0x00);
  assert.strictEqual(bytes[peOffset + 3], 0x00);

  // Check COFF machine = 0x014c (i386)
  assert.strictEqual(view.getUint16(peOffset + 4, true), 0x014c);

  // Check Subsystem = 2 (IMAGE_SUBSYSTEM_WINDOWS_GUI)
  // Optional header starts at peOffset + 24
  // Subsystem is at offset 68 in optional header
  const subsystem = view.getUint16(peOffset + 24 + 68, true);
  assert.strictEqual(subsystem, 2, 'Subsystem should be Windows GUI (2)');
});

test('generateIExpressSedScript generates valid Microsoft IExpress directive', () => {
  const sed = generateIExpressSedScript('TestApp', 'index.html');
  assert.ok(sed.includes('[Version]'));
  assert.ok(sed.includes('Class=IEXPRESS'));
  assert.ok(sed.includes('TargetName=TestApp.exe'));
  assert.ok(sed.includes('FILE0="index.html"'));
});

test('generatePowerShellToExeScript returns batch compilation script', () => {
  const bat = generatePowerShellToExeScript();
  assert.ok(bat.includes('iexpress /N make_exe.sed'));
  assert.ok(bat.includes('NeuroDistill_StratIntelligence.exe'));
});
