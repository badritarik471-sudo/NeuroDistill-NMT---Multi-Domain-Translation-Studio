import test from 'node:test';
import assert from 'node:assert/strict';
import {
  softmaxWithTemperature,
  klDivergence,
  computeDistillationLoss,
  blendTeacherLogits,
  calculateBLEUScore,
} from './distillationMath';

test('softmaxWithTemperature produces valid probability distribution summing to 1', () => {
  const logits = [2.0, 1.0, 0.1];
  const probs = softmaxWithTemperature(logits, 2.0);
  const sum = probs.reduce((acc, p) => acc + p, 0);

  assert.equal(probs.length, 3);
  assert.ok(Math.abs(sum - 1.0) < 1e-5, `Sum should be ~1.0, got ${sum}`);
  // With higher temperature, distribution is softer
  assert.ok(probs[0] > probs[1] && probs[1] > probs[2]);
});

test('softmaxWithTemperature softens distribution when temperature increases', () => {
  const logits = [5.0, 1.0];
  const sharpProbs = softmaxWithTemperature(logits, 1.0);
  const softProbs = softmaxWithTemperature(logits, 5.0);

  // At T=1, top class dominates much more than at T=5
  assert.ok(sharpProbs[0] > softProbs[0]);
  assert.ok(softProbs[1] > sharpProbs[1]);
});

test('klDivergence returns 0 for identical probability distributions', () => {
  const p = [0.6, 0.3, 0.1];
  const kl = klDivergence(p, p);
  assert.ok(kl < 1e-5, `KL divergence of identical distributions should be ~0, got ${kl}`);
});

test('computeDistillationLoss calculates blended loss with alpha and temperature', () => {
  const teacherProbs = [0.7, 0.2, 0.1];
  const studentProbs = [0.5, 0.3, 0.2];
  const ceLoss = 1.25;
  const alpha = 0.7;
  const temperature = 2.0;

  const result = computeDistillationLoss(ceLoss, teacherProbs, studentProbs, alpha, temperature);
  assert.ok(result.totalLoss > 0);
  assert.ok(result.kdLoss >= 0);
  assert.equal(result.ceLoss, 1.25);
});

test('blendTeacherLogits combines multiple specialized teacher models', () => {
  const teachers = [
    { domain: 'finance', logits: [1.0, 0.0], weight: 0.5 },
    { domain: 'legal', logits: [0.0, 2.0], weight: 0.5 },
  ];
  const blended = blendTeacherLogits(teachers);
  assert.equal(blended.length, 2);
  assert.equal(blended[0], 0.5);
  assert.equal(blended[1], 1.0);
});

test('calculateBLEUScore computes accurate match score', () => {
  const ref = 'the quarterly financial reports show solid growth';
  const hyp = 'the quarterly financial reports show solid growth';
  const score = calculateBLEUScore(ref, hyp);
  assert.ok(score >= 95, `Exact match score should be near 100, got ${score}`);

  const diffHyp = 'felines canines birds fishes swim fly';
  const zeroScore = calculateBLEUScore(ref, diffHyp);
  assert.equal(zeroScore, 0, `Disjoint sentence should have 0 BLEU, got ${zeroScore}`);
});
