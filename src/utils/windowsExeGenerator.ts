/**
 * Générateur d'Exécutable Windows (.EXE) Natif & Scripts de Packaging
 * Créé par Tarik Badri — en association avec Larbi Badri
 * Référence scientifique : Mghabbar & Ratnamogan (ECAI 2020)
 */

/**
 * Construit un véritable binaire Windows PE32 (Portable Executable GUI Intel 80386)
 * Lanceur autonome natif pour Windows 10 & 11 sans fenêtre console noire.
 */
export function generateWindowsExeBlob(): Blob {
  // En-tête DOS (64 octets)
  const dosHeader = new Uint8Array(64);
  dosHeader[0] = 0x4d; // 'M'
  dosHeader[1] = 0x5a; // 'Z'
  const peOffset = 128; // 0x80
  const view32 = new DataView(dosHeader.buffer);
  view32.setUint32(0x3c, peOffset, true); // e_lfanew

  // DOS Stub (64 octets)
  const dosStub = new TextEncoder().encode('This program cannot be run in DOS mode.\r\r\n$');
  const dosStubPadded = new Uint8Array(64);
  dosStubPadded.set(dosStub, 0);

  // Signature PE ("PE\0\0")
  const peSig = new Uint8Array([0x50, 0x45, 0x00, 0x00]);

  // En-tête COFF (20 octets) : Machine 0x014c (i386), 2 sections (.text, .rdata), OptHeader=224, Flags=0x0102
  const coffHeader = new Uint8Array(20);
  const coffView = new DataView(coffHeader.buffer);
  coffView.setUint16(0, 0x014c, true); // Machine: i386
  coffView.setUint16(2, 2, true);      // NumberOfSections: 2
  coffView.setUint32(4, 0, true);      // TimeDateStamp
  coffView.setUint32(8, 0, true);      // PointerToSymbolTable
  coffView.setUint32(12, 0, true);     // NumberOfSymbols
  coffView.setUint16(16, 224, true);   // SizeOfOptionalHeader
  coffView.setUint16(18, 0x0102, true);// Characteristics: EXECUTABLE_IMAGE | 32BIT_MACHINE

  // En-tête Optionnel Standard (28 octets) + Windows (68 octets) + DataDirs (128 octets) = 224 octets
  const optHeader = new Uint8Array(224);
  const optView = new DataView(optHeader.buffer);
  optView.setUint16(0, 0x010b, true); // Magic: PE32
  optView.setUint8(2, 14);            // MajorLinkerVersion
  optView.setUint8(3, 0);             // MinorLinkerVersion
  optView.setUint32(4, 0x200, true);  // SizeOfCode
  optView.setUint32(8, 0x200, true);  // SizeOfInitializedData
  optView.setUint32(12, 0, true);     // SizeOfUninitializedData
  optView.setUint32(16, 0x1000, true);// AddressOfEntryPoint (RVA 0x1000)
  optView.setUint32(20, 0x1000, true);// BaseOfCode
  optView.setUint32(24, 0x2000, true);// BaseOfData

  // Windows Specific Fields
  optView.setUint32(28, 0x00400000, true); // ImageBase
  optView.setUint32(32, 0x1000, true);     // SectionAlignment: 4096
  optView.setUint32(36, 0x200, true);      // FileAlignment: 512
  optView.setUint16(40, 5, true);          // MajorOSVersion (WinXP+)
  optView.setUint16(42, 1, true);          // MinorOSVersion
  optView.setUint16(44, 1, true);          // MajorImageVersion
  optView.setUint16(46, 0, true);          // MinorImageVersion
  optView.setUint16(48, 5, true);          // MajorSubsystemVersion
  optView.setUint16(50, 1, true);          // MinorSubsystemVersion
  optView.setUint32(52, 0, true);          // Win32VersionValue
  optView.setUint32(56, 0x3000, true);     // SizeOfImage
  optView.setUint32(60, 0x200, true);      // SizeOfHeaders
  optView.setUint32(64, 0, true);          // CheckSum
  optView.setUint16(68, 2, true);          // Subsystem: IMAGE_SUBSYSTEM_WINDOWS_GUI (2 = GUI, pas de console)
  optView.setUint16(70, 0x8140, true);     // DllCharacteristics: DYNAMIC_BASE | NX_COMPAT
  optView.setUint32(72, 0x100000, true);   // SizeOfStackReserve
  optView.setUint32(76, 0x1000, true);     // SizeOfStackCommit
  optView.setUint32(80, 0x100000, true);   // SizeOfHeapReserve
  optView.setUint32(84, 0x1000, true);     // SizeOfHeapCommit
  optView.setUint32(88, 0, true);          // LoaderFlags
  optView.setUint32(92, 16, true);         // NumberOfRvaAndSizes

  // Répertoires de données (Import Directory at index 1 = offset 96 + 8 = 104)
  optView.setUint32(96 + 8, 0x2000, true); // Import Table RVA
  optView.setUint32(96 + 12, 0x80, true);  // Import Table Size

  // En-têtes de section (40 octets chacun)
  // Section 1 : .text
  const textHeader = new Uint8Array(40);
  const textHView = new DataView(textHeader.buffer);
  textHeader.set(new TextEncoder().encode('.text\0\0\0'), 0);
  textHView.setUint32(8, 0x100, true);      // VirtualSize
  textHView.setUint32(12, 0x1000, true);    // VirtualAddress (RVA)
  textHView.setUint32(16, 0x200, true);     // SizeOfRawData
  textHView.setUint32(20, 0x200, true);     // PointerToRawData
  textHView.setUint32(36, 0x60000020, true);// Characteristics: EXECUTE | READ

  // Section 2 : .rdata
  const rdataHeader = new Uint8Array(40);
  const rdataHView = new DataView(rdataHeader.buffer);
  rdataHeader.set(new TextEncoder().encode('.rdata\0\0'), 0);
  rdataHView.setUint32(8, 0x200, true);      // VirtualSize
  rdataHView.setUint32(12, 0x2000, true);    // VirtualAddress (RVA)
  rdataHView.setUint32(16, 0x200, true);     // SizeOfRawData
  rdataHView.setUint32(20, 0x400, true);     // PointerToRawData
  rdataHView.setUint32(36, 0x40000040, true);// Characteristics: INITIALIZED | READ

  // Assemblage des en-têtes (aligné à 512 octets = 0x200)
  const headerBytes = new Uint8Array(0x200);
  let hPos = 0;
  headerBytes.set(dosHeader, hPos); hPos += dosHeader.length;
  headerBytes.set(dosStubPadded, hPos); hPos += dosStubPadded.length;
  headerBytes.set(peSig, hPos); hPos += peSig.length;
  headerBytes.set(coffHeader, hPos); hPos += coffHeader.length;
  headerBytes.set(optHeader, hPos); hPos += optHeader.length;
  headerBytes.set(textHeader, hPos); hPos += textHeader.length;
  headerBytes.set(rdataHeader, hPos);

  // Section .rdata : Tables d'importation KERNEL32.DLL (WinExec, ExitProcess)
  const rdata = new Uint8Array(0x200);
  const rdataView = new DataView(rdata.buffer);
  // IMAGE_IMPORT_DESCRIPTOR à l'offset 0 (RVA 0x2000)
  rdataView.setUint32(0, 0x2050, true); // OriginalFirstThunk (ILT)
  rdataView.setUint32(12, 0x2080, true);// Name RVA ('KERNEL32.DLL')
  rdataView.setUint32(16, 0x2060, true);// FirstThunk (IAT)

  // ILT à l'offset 0x50
  rdataView.setUint32(0x50, 0x2090, true); // WinExec
  rdataView.setUint32(0x54, 0x20a0, true); // ExitProcess

  // IAT à l'offset 0x60
  rdataView.setUint32(0x60, 0x2090, true); // WinExec
  rdataView.setUint32(0x64, 0x20a0, true); // ExitProcess

  // Chaîne "KERNEL32.DLL\0" à l'offset 0x80
  rdata.set(new TextEncoder().encode('KERNEL32.DLL\0'), 0x80);

  // Hint/Name pour WinExec à l'offset 0x90
  rdata.set(new Uint8Array([0x00, 0x00]), 0x90);
  rdata.set(new TextEncoder().encode('WinExec\0'), 0x92);

  // Hint/Name pour ExitProcess à l'offset 0xa0
  rdata.set(new Uint8Array([0x00, 0x00]), 0xa0);
  rdata.set(new TextEncoder().encode('ExitProcess\0'), 0xa2);

  // Commande exécutée silencieusement au double-clic (offset 0xc0 = RVA 0x20C0)
  // Lance Microsoft Edge en mode fenêtre d'application autonome (comme un logiciel natif)
  const cmdStr =
    'cmd.exe /c start "" msedge.exe --app="%~dp0NeuroDistill_StratIntelligence_App.html" 2>nul || start "" "%~dp0NeuroDistill_StratIntelligence_App.html" 2>nul || start "" index.html\0';
  rdata.set(new TextEncoder().encode(cmdStr), 0xc0);

  // Section .text : Code machine x86
  const text = new Uint8Array(0x200);
  const code = [
    0x6a, 0x00,                         // push 0 (SW_HIDE : aucune console noire)
    0x68, 0xc0, 0x20, 0x40, 0x00,       // push 0x004020C0 (adresse de cmdStr)
    0xff, 0x15, 0x60, 0x20, 0x40, 0x00, // call [0x00402060] (WinExec)
    0x6a, 0x00,                         // push 0 (exit code)
    0xff, 0x15, 0x64, 0x20, 0x40, 0x00, // call [0x00402064] (ExitProcess)
    0xc3,                               // ret
  ];
  text.set(new Uint8Array(code), 0);

  // Binaire PE complet = Headers (512) + .text (512) + .rdata (512)
  const fullPe = new Uint8Array(0x600);
  fullPe.set(headerBytes, 0);
  fullPe.set(text, 0x200);
  fullPe.set(rdata, 0x400);

  return new Blob([fullPe], { type: 'application/vnd.microsoft.portable-executable' });
}

/**
 * Génère le fichier de directive Microsoft IExpress (.SED)
 * Permet à tout utilisateur Windows de compiler son propre .EXE certifié en 1 clic
 * via C:\Windows\System32\iexpress.exe (intégré par défaut dans 100% des PC Windows).
 */
export function generateIExpressSedScript(
  appName = 'NeuroDistill_StratIntelligence',
  htmlFilename = 'NeuroDistill_StratIntelligence_App.html'
): string {
  return `[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=0
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=1
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=%InstallPrompt%
DisplayLicense=%DisplayLicense%
FinishMessage=%FinishMessage%
TargetName=%TargetName%
FriendlyName=%FriendlyName%
AppLaunched=%AppLaunched%
PostInstallCmd=%PostInstallCmd%
AdminQuietInstCmd=%AdminQuietInstCmd%
UserQuietInstCmd=%UserQuietInstCmd%
SourceFiles=SourceFiles
[Strings]
InstallPrompt=
DisplayLicense=
FinishMessage=
TargetName=${appName}.exe
FriendlyName=NeuroDistill Strat-Intelligence (Tarik Badri & Larbi Badri)
AppLaunched=cmd.exe /c start msedge.exe --app="%TEMP%\\${htmlFilename}" || start "" "%TEMP%\\${htmlFilename}"
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
FILE0="${htmlFilename}"
[SourceFiles]
SourceFiles0=.
[SourceFiles0]
%FILE0%=
`;
}

/**
 * Script de conversion PowerShell Windows (PowerShell vers .EXE)
 */
export function generatePowerShellToExeScript(): string {
  return `@echo off
chcp 65001 >nul
title NeuroDistill - Convertisseur .EXE Windows
echo ============================================================================
echo   GÉNÉRATEUR D'EXÉCUTABLE .EXE WINDOWS 10 / 11
echo   Créé par Tarik Badri — en association avec Larbi Badri
echo ============================================================================
echo.
echo [1/2] Création de l'application autonome exécutable...
if not exist "NeuroDistill_StratIntelligence_App.html" (
    echo [ERREUR] Le fichier HTML n'est pas présent dans ce dossier.
    pause
    exit /b 1
)

echo [2/2] Compilation du package via Microsoft IExpress (outil natif Windows)...
iexpress /N make_exe.sed

if exist "NeuroDistill_StratIntelligence.exe" (
    echo.
    echo ============================================================================
    echo [SUCCÈS] Votre fichier exécutable "NeuroDistill_StratIntelligence.exe" est prêt !
    echo Vous pouvez désormais double-cliquer dessus pour lancer l'application.
    echo ============================================================================
) else (
    echo [INFO] Génération terminée.
)
pause
`;
}
