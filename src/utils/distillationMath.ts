/**
 * Pure mathematical functions for Multi-Domain Knowledge Distillation
 * Based on ECAI 2020 paper: "Building a Multi-domain Neural Machine Translation Model using Knowledge Distillation"
 * Authors: Idriss MGHABBAR, Pirashanth RATNAMOGAN (BNP Paribas)
 */

export interface DistillationConfig {
  temperature: number; // T (default 2.0)
  alpha: number; // weight for distillation loss (default 0.7)
  learningRate: number;
  batchSize: number;
}

/**
 * Softmax with temperature scaling: q_i = exp(z_i / T) / sum(exp(z_j / T))
 */
export function softmaxWithTemperature(logits: number[], temperature: number): number[] {
  if (temperature <= 0) {
    throw new Error('Temperature must be greater than 0');
  }
  if (logits.length === 0) return [];

  // Numerical stability: subtract max logit
  const maxLogit = Math.max(...logits);
  const scaled = logits.map((z) => Math.exp((z - maxLogit) / temperature));
  const sum = scaled.reduce((acc, val) => acc + val, 0);

  if (sum === 0) {
    return logits.map(() => 1 / logits.length);
  }

  return scaled.map((val) => val / sum);
}

/**
 * Kullback-Leibler (KL) Divergence: D_KL(P || Q) = sum(P_i * log(P_i / Q_i))
 * where P is Teacher soft distribution and Q is Student soft distribution
 */
export function klDivergence(teacherProbs: number[], studentProbs: number[]): number {
  if (teacherProbs.length !== studentProbs.length) {
    throw new Error('Teacher and Student probability distributions must have matching length');
  }
  let sum = 0;
  const eps = 1e-9;
  for (let i = 0; i < teacherProbs.length; i++) {
    const p = Math.max(teacherProbs[i], eps);
    const q = Math.max(studentProbs[i], eps);
    sum += p * Math.log(p / q);
  }
  return Math.max(0, sum);
}

/**
 * Multi-Domain Knowledge Distillation Loss:
 * L_total = (1 - alpha) * L_CE(Student, GroundTruth) + alpha * (T^2) * L_KL(Teacher_ensemble_or_domain, Student)
 */
export function computeDistillationLoss(
  crossEntropyLoss: number,
  teacherProbs: number[],
  studentProbs: number[],
  alpha: number,
  temperature: number
): { totalLoss: number; ceLoss: number; kdLoss: number } {
  const kl = klDivergence(teacherProbs, studentProbs);
  const kdLoss = Math.pow(temperature, 2) * kl;
  const totalLoss = (1 - alpha) * crossEntropyLoss + alpha * kdLoss;

  return {
    totalLoss: Number(totalLoss.toFixed(4)),
    ceLoss: Number(crossEntropyLoss.toFixed(4)),
    kdLoss: Number(kdLoss.toFixed(4)),
  };
}

/**
 * Multi-Domain Weighted Teacher Distribution
 * When distilling from multiple specialized domain teachers (e.g., Finance, Legal, Medical, Tech)
 */
export function blendTeacherLogits(
  teacherLogits: { domain: string; logits: number[]; weight: number }[]
): number[] {
  if (teacherLogits.length === 0) return [];
  const length = teacherLogits[0].logits.length;
  const totalWeight = teacherLogits.reduce((acc, t) => acc + t.weight, 0) || 1;
  const blended = new Array(length).fill(0);

  for (let i = 0; i < length; i++) {
    for (const t of teacherLogits) {
      blended[i] += (t.logits[i] || 0) * (t.weight / totalWeight);
    }
  }

  return blended;
}

/**
 * Simplified BLEU-4 score calculation helper for translations
 */
export function calculateBLEUScore(reference: string, hypothesis: string): number {
  const refTokens = reference.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const hypTokens = hypothesis.toLowerCase().trim().split(/\s+/).filter(Boolean);

  if (hypTokens.length === 0 || refTokens.length === 0) return 0;

  // Exact matching unigrams, bigrams
  let unigramMatches = 0;
  const refCounts: Record<string, number> = {};
  for (const t of refTokens) {
    refCounts[t] = (refCounts[t] || 0) + 1;
  }
  const hypCounts: Record<string, number> = {};
  for (const t of hypTokens) {
    hypCounts[t] = (hypCounts[t] || 0) + 1;
  }

  for (const [token, count] of Object.entries(hypCounts)) {
    if (refCounts[token]) {
      unigramMatches += Math.min(count, refCounts[token]);
    }
  }

  if (unigramMatches === 0) return 0;

  const p1 = unigramMatches / hypTokens.length;

  // Brevity penalty
  const bp = hypTokens.length >= refTokens.length
    ? 1
    : Math.exp(1 - refTokens.length / hypTokens.length);

  const rawBleu = bp * p1 * 100;
  return Math.min(100, Math.max(0, Number(rawBleu.toFixed(2))));
}
