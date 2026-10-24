/**
 * Unit Tests for Autonomous Strategic Consulting & Multi-Module Data Analysis Engine
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_MODULE_PROFILES,
  PRELOADED_CASE_STUDIES,
  trainModulesWithDocument,
  generateCrossModuleDebate,
  generateExecutiveSynthesis,
  parseUploadedDocumentText,
} from './strategicConsultingEngine';

describe('STRAT-INTELLIGENCE Pure Logic Unit Tests', () => {
  test('Initial module profiles contain 5 specialists + lead strategy partner', () => {
    assert.ok(INITIAL_MODULE_PROFILES.finance);
    assert.ok(INITIAL_MODULE_PROFILES.banque);
    assert.ok(INITIAL_MODULE_PROFILES.technologie);
    assert.ok(INITIAL_MODULE_PROFILES.droit);
    assert.ok(INITIAL_MODULE_PROFILES.operations);
    assert.ok(INITIAL_MODULE_PROFILES.strategie);

    assert.equal(INITIAL_MODULE_PROFILES.finance.firmBenchmark, 'McKinsey Corporate Finance / PwC Deals');
    assert.equal(INITIAL_MODULE_PROFILES.technologie.firmBenchmark, 'Capgemini Invent / Tech Due Diligence');
  });

  test('Preloaded case studies are defined with ratios and strategic risks', () => {
    assert.equal(PRELOADED_CASE_STUDIES.length, 3);
    const mnaCase = PRELOADED_CASE_STUDIES[0];
    assert.ok(mnaCase.ratios.length >= 3);
    assert.ok(mnaCase.risks.length >= 2);
    assert.ok(mnaCase.keyFigures.length >= 3);
  });

  test('Document training engine increases module cognitive mastery and logs progress', () => {
    const doc = PRELOADED_CASE_STUDIES[0];
    const { updatedProfiles, log } = trainModulesWithDocument(doc, INITIAL_MODULE_PROFILES);

    assert.ok(updatedProfiles.finance.masteryLevel > INITIAL_MODULE_PROFILES.finance.masteryLevel);
    assert.ok(updatedProfiles.banque.masteryLevel > INITIAL_MODULE_PROFILES.banque.masteryLevel);
    assert.ok(updatedProfiles.technologie.masteryLevel > INITIAL_MODULE_PROFILES.technologie.masteryLevel);
    assert.ok(updatedProfiles.droit.masteryLevel > INITIAL_MODULE_PROFILES.droit.masteryLevel);
    assert.ok(updatedProfiles.operations.masteryLevel > INITIAL_MODULE_PROFILES.operations.masteryLevel);
    assert.ok(updatedProfiles.strategie.masteryLevel > INITIAL_MODULE_PROFILES.strategie.masteryLevel);
    assert.ok(log.length >= 5);
  });

  test('Cross-examination debate engine generates confrontational dialogue across modules', () => {
    const doc = PRELOADED_CASE_STUDIES[1]; // turnaround
    const debate = generateCrossModuleDebate(doc);

    assert.ok(debate.length >= 5);
    const hasAlert = debate.some((d) => d.sentiment === 'alert');
    const hasChallenge = debate.some((d) => d.sentiment === 'challenge');
    const hasSynthesis = debate.some((d) => d.sentiment === 'synthesis');

    assert.ok(hasAlert, 'Should contain an alert message');
    assert.ok(hasChallenge, 'Should contain a challenge message');
    assert.ok(hasSynthesis, 'Should contain an executive synthesis message');
  });

  test('Executive synthesis follows Minto Pyramid and contains prioritization matrix', () => {
    const doc = PRELOADED_CASE_STUDIES[0];
    const synthesis = generateExecutiveSynthesis(doc);

    assert.ok(synthesis.mintoPyramid.situation.length > 10);
    assert.ok(synthesis.mintoPyramid.complication.length > 10);
    assert.ok(synthesis.mintoPyramid.question.length > 10);
    assert.ok(synthesis.mintoPyramid.reponse.length > 10);

    assert.ok(synthesis.crossDataInsights.length >= 2);
    assert.ok(synthesis.prioritizationMatrix.length >= 3);
    assert.ok(synthesis.actionPlan.length >= 2);
    assert.ok(synthesis.netValueUnlockedEstimate.includes('M€'));
  });

  test('Universal document text parser extracts figures, percentages, and creates structured document', () => {
    const raw = `Rapport d'activité annuel: Chiffre d'affaires consolidé de 55.4 M€. EBITDA en recul de 8.2%. 
    La dette bancaire auprès du Crédit Lyonnais s'élève à 18.2 M€. Le contrat fournisseur majeur arrive à échéance avec risque de litige.`;

    const parsed = parseUploadedDocumentText('Audit_Interne_2026.pdf', raw);
    assert.equal(parsed.title, 'Audit_Interne_2026');
    assert.ok(parsed.ratios.length >= 1);
    assert.ok(parsed.risks.length >= 1);
    assert.ok(parsed.keyFigures.length >= 1);
  });
});
