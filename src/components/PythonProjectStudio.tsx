import React, { useState } from 'react';
import { PYTHON_PROJECT_FILES } from '../utils/pythonProjectFiles';
import { generateProjectZip, downloadBlob } from '../utils/pythonProjectGenerator';
import { PythonProjectFile } from '../types';
import {
  Folder,
  FileCode,
  Download,
  Copy,
  Check,
  Search,
  Terminal,
  Play,
  FileText,
  Settings,
  Database,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const PythonProjectStudio: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState('config/config.yaml');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'instructions'>('editor');

  const selectedFile =
    PYTHON_PROJECT_FILES.find((f) => f.path === selectedFilePath) || PYTHON_PROJECT_FILES[0];

  const filteredFiles = PYTHON_PROJECT_FILES.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, selectedFile.name);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await generateProjectZip();
      downloadBlob(zipBlob, 'multi_domain_nmt_saas.zip');
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const getCategoryIcon = (category: PythonProjectFile['category']) => {
    switch (category) {
      case 'config':
        return <Settings className="w-3.5 h-3.5 text-amber-400" />;
      case 'models':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'training':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case 'data':
        return <Database className="w-3.5 h-3.5 text-blue-400" />;
      case 'api':
        return <Terminal className="w-3.5 h-3.5 text-purple-400" />;
      case 'desktop':
        return <Play className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <FileCode className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg font-bold text-white tracking-tight">
              multi_domain_nmt_saas/ Python Software Hub
            </span>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono px-2 py-0.5 rounded-full">
              Full PyTorch & FastAPI SaaS
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            The exact code architecture specified in the ECAI 2020 paper attachment. Ready to execute on macOS (Apple Silicon / Intel) and Windows (CUDA / CPU).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab(activeTab === 'editor' ? 'instructions' : 'editor')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
            aria-label="Toggle instructions"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{activeTab === 'editor' ? 'How to Run (Win / Mac)' : 'Back to Code Editor'}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md transition active:scale-95 disabled:opacity-50"
            aria-label="Download full SaaS project as ZIP"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Packaging ZIP...' : 'Download Full Project (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'instructions' ? (
        /* Windows and macOS Setup Instructions */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Cross-Platform Execution Guide (macOS & Windows)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* macOS / Linux */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <h4 className="text-sm font-bold text-white">macOS (Apple Silicon & Intel)</h4>
              </div>
              <p className="text-xs text-slate-400">
                Uses Metal Performance Shaders (MPS) on M1/M2/M3/M4 or CPU fallback.
              </p>

              <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-cyan-300 overflow-x-auto space-y-1">
                <div className="text-slate-500"># 1. Unzip downloaded package</div>
                <div>unzip multi_domain_nmt_saas.zip</div>
                <div>cd multi_domain_nmt_saas</div>
                <div className="text-slate-500 pt-1"># 2. Grant execute permission and run</div>
                <div>chmod +x desktop/run_mac.sh</div>
                <div>./desktop/run_mac.sh</div>
              </div>

              <ul className="text-xs text-slate-400 list-disc list-inside space-y-1 pt-1">
                <li>Automatically configures Python virtual environment (.venv)</li>
                <li>Installs PyTorch, Transformers, FastAPI, and SacreBLEU</li>
                <li>Launches the REST API on <code className="text-cyan-300">http://localhost:8000</code></li>
              </ul>
            </div>

            {/* Windows 11 / 10 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-400" />
                <h4 className="text-sm font-bold text-white">Windows 11 / 10</h4>
              </div>
              <p className="text-xs text-slate-400">
                Supports NVIDIA CUDA hardware acceleration or multithreaded CPU.
              </p>

              <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-cyan-300 overflow-x-auto space-y-1">
                <div className="text-slate-500">REM 1. Extract zip and open terminal / CMD</div>
                <div>cd multi_domain_nmt_saas</div>
                <div className="text-slate-500 pt-1">REM 2. Run the Windows batch runner</div>
                <div>desktop\run_windows.bat</div>
                <div className="text-slate-500 pt-1">REM Or run directly with Python:</div>
                <div>python -m venv .venv && .venv\Scripts\activate</div>
                <div>pip install -r requirements.txt && python main.py</div>
              </div>

              <ul className="text-xs text-slate-400 list-disc list-inside space-y-1 pt-1">
                <li>Automated virtualenv initialization and dependency resolution</li>
                <li>FastAPI documentation available at <code className="text-cyan-300">http://localhost:8000/docs</code></li>
                <li>Desktop shortcuts ready for double-click launch</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* File Explorer and Code Workbench */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
          {/* File Explorer Tree (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Project Structure (ECAI 2020)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {PYTHON_PROJECT_FILES.length} Files
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto max-h-[500px] flex flex-col gap-1 pr-1">
              {filteredFiles.map((file) => {
                const isSelected = file.path === selectedFilePath;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-200 border border-blue-500/40 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                    aria-label={`Open file ${file.path}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getCategoryIcon(file.category)}
                      <span className="font-mono text-xs truncate">{file.path}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 ml-2">
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            {/* Editor Top Bar */}
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-semibold text-slate-200">
                  {selectedFile.path}
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  — {selectedFile.description}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded transition"
                  aria-label="Copy code content"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadSingle}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded transition"
                  aria-label="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Save</span>
                </button>
              </div>
            </div>

            {/* Code Content Area with Line Numbers */}
            <div className="flex-1 bg-slate-950 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 max-h-[540px]">
              <pre className="flex">
                {/* Line Numbers */}
                <span className="select-none text-slate-600 text-right pr-4 border-r border-slate-800 mr-4">
                  {selectedFile.content.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </span>
                {/* Code Body */}
                <code className="text-slate-300">{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
