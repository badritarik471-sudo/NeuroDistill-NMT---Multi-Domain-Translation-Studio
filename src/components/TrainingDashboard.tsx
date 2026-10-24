import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, LineChart, Cpu, Zap, Activity } from 'lucide-react';
import { TrainingLogEntry } from '../types';

export const TrainingDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(120);
  const [epoch, setEpoch] = useState(4);
  const [logs, setLogs] = useState<TrainingLogEntry[]>(() => [
    { epoch: 1, step: 200, ceLoss: 3.82, kdLoss: 2.95, totalLoss: 3.21, learningRate: 0.00005, bleuFinance: 22.4, bleuLegal: 20.1, bleuMedical: 19.8, bleuTech: 21.2, bleuOverall: 20.9 },
    { epoch: 2, step: 400, ceLoss: 2.64, kdLoss: 1.84, totalLoss: 2.08, learningRate: 0.0001, bleuFinance: 27.8, bleuLegal: 25.4, bleuMedical: 24.6, bleuTech: 26.1, bleuOverall: 26.0 },
    { epoch: 3, step: 600, ceLoss: 1.91, kdLoss: 1.12, totalLoss: 1.36, learningRate: 0.00009, bleuFinance: 31.6, bleuLegal: 29.8, bleuMedical: 28.9, bleuTech: 30.4, bleuOverall: 30.2 },
    { epoch: 4, step: 800, ceLoss: 1.48, kdLoss: 0.74, totalLoss: 0.96, learningRate: 0.00008, bleuFinance: 33.4, bleuLegal: 31.9, bleuMedical: 31.2, bleuTech: 32.7, bleuOverall: 32.3 },
  ]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setStep((prevStep) => {
        const nextStep = prevStep + 20;
        const currentEpoch = Math.floor(nextStep / 200) + 1;
        setEpoch(currentEpoch);

        // Simulated decaying loss and rising BLEU
        const decay = Math.exp(-nextStep / 600);
        const ce = Math.max(0.75, 4.0 * decay + 0.6);
        const kd = Math.max(0.35, 3.2 * decay + 0.3);
        const total = 0.3 * ce + 0.7 * kd;

        const maxBleu = 34.0;
        const bleuDelta = (1 - decay) * 13;
        const bFin = 20.0 + bleuDelta * 1.05;
        const bLeg = 19.0 + bleuDelta * 0.98;
        const bMed = 18.5 + bleuDelta * 0.95;
        const bTec = 19.5 + bleuDelta * 1.02;
        const bOver = (bFin + bLeg + bMed + bTec) / 4;

        setLogs((prev) => [
          ...prev.slice(-9),
          {
            epoch: currentEpoch,
            step: nextStep,
            ceLoss: Number(ce.toFixed(3)),
            kdLoss: Number(kd.toFixed(3)),
            totalLoss: Number(total.toFixed(3)),
            learningRate: 0.0001 * Math.min(1.0, nextStep / 400),
            bleuFinance: Number(bFin.toFixed(1)),
            bleuLegal: Number(bLeg.toFixed(1)),
            bleuMedical: Number(bMed.toFixed(1)),
            bleuTech: Number(bTec.toFixed(1)),
            bleuOverall: Number(bOver.toFixed(1)),
          },
        ]);

        return nextStep;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isRunning]);

  const latestLog = logs[logs.length - 1];

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Top Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-white tracking-tight">
              Knowledge Distillation Training Pipeline
            </span>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-mono px-2 py-0.5 rounded-full">
              Multi-Teacher Supervision
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulates dynamic domain batch scheduling where the generic student model learns soft output targets from the domain teachers (ECAI 2020 §3).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white shadow transition active:scale-95 ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
            aria-label="Toggle training simulation"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause Training' : 'Run Distillation Loop'}</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setStep(0);
              setEpoch(1);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            aria-label="Reset training"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400">Total Loss (Blended)</span>
          <span className="text-2xl font-bold font-mono text-cyan-400">{latestLog.totalLoss}</span>
          <span className="text-[11px] text-slate-500">0.3 CE + 0.7 KD (T=2.0)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400">Overall BLEU-4</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{latestLog.bleuOverall}</span>
          <span className="text-[11px] text-emerald-400/80 font-medium">+2.1 BLEU over baseline</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400">Finance BLEU (BNP Paribas)</span>
          <span className="text-2xl font-bold font-mono text-purple-400">{latestLog.bleuFinance}</span>
          <span className="text-[11px] text-slate-500">Teacher: 33.5 max</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-xs text-slate-400">Step & Epoch</span>
          <span className="text-2xl font-bold font-mono text-amber-400">
            {step} <span className="text-sm text-slate-500 font-sans font-normal">(Ep {epoch})</span>
          </span>
          <span className="text-[11px] text-slate-500">Batch size: 32</span>
        </div>
      </div>

      {/* Charts & Metric Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loss Curves */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Loss Progression (CE vs Knowledge Distillation KL)</span>
            </h4>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-0.5 bg-cyan-400 rounded" /> Total Loss
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-0.5 bg-emerald-400 rounded" /> KD Loss
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-0.5 bg-amber-400 rounded" /> CE Loss
              </span>
            </div>
          </div>

          <div className="h-56 bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-end gap-2 overflow-x-auto">
            {logs.map((item, idx) => {
              const maxScale = 4.0;
              const hTotal = Math.min(100, (item.totalLoss / maxScale) * 100);
              const hKd = Math.min(100, (item.kdLoss / maxScale) * 100);
              const hCe = Math.min(100, (item.ceLoss / maxScale) * 100);

              return (
                <div key={idx} className="flex-1 min-w-[28px] flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-0.5 h-44">
                    <div
                      className="w-2 bg-amber-500 rounded-t transition-all duration-300"
                      style={{ height: `${hCe}%` }}
                      title={`CE Loss: ${item.ceLoss}`}
                    />
                    <div
                      className="w-2 bg-emerald-500 rounded-t transition-all duration-300"
                      style={{ height: `${hKd}%` }}
                      title={`KD Loss: ${item.kdLoss}`}
                    />
                    <div
                      className="w-2 bg-cyan-500 rounded-t transition-all duration-300"
                      style={{ height: `${hTotal}%` }}
                      title={`Total Loss: ${item.totalLoss}`}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">#{item.step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Domain BLEU Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <LineChart className="w-4 h-4 text-emerald-400" />
              <span>Multi-Domain BLEU-4 Convergence</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">4 Domain Teachers</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { name: 'Finance (BNP Paribas)', val: latestLog.bleuFinance, baseline: 31.2, color: 'bg-emerald-500' },
              { name: 'Legal & Compliance', val: latestLog.bleuLegal, baseline: 29.8, color: 'bg-amber-500' },
              { name: 'Medical & Healthcare', val: latestLog.bleuMedical, baseline: 29.0, color: 'bg-rose-500' },
              { name: 'Tech & Architecture', val: latestLog.bleuTech, baseline: 30.5, color: 'bg-cyan-500' },
            ].map((domain) => {
              const pct = (domain.val / 40.0) * 100;
              const delta = (domain.val - domain.baseline).toFixed(1);
              return (
                <div key={domain.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{domain.name}</span>
                    <span className="font-mono text-slate-300">
                      <strong>{domain.val} BLEU</strong>{' '}
                      <span className="text-emerald-400 text-[11px]">(+{delta} pts)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${domain.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 leading-relaxed">
            Multi-teacher knowledge distillation achieves simultaneous performance boosts across all domains without catastrophic forgetting of general vocabulary.
          </div>
        </div>
      </div>
    </div>
  );
};
