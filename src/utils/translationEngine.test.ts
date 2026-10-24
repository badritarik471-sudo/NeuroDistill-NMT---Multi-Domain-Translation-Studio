import test from 'node:test';
import assert from 'node:assert/strict';
import { detectDomainFromText, executeAgentTranslation } from './translationEngine';
import { anonymizeDocumentText, extractCandidateTerms } from './documentLearningEngine';

test('detectDomainFromText correctly identifies finance terms', () => {
  const financeText = 'The quarterly dividend, ebitda and impairment loss were audited.';
  const domain = detectDomainFromText(financeText);
  assert.equal(domain, 'finance');
});

test('detectDomainFromText correctly identifies banque terms', () => {
  const banqueText = 'The fixed APR of 4.25% was attached to account IBAN FR76 •••• 9812 with overdraft.';
  const domain = detectDomainFromText(banqueText);
  assert.equal(domain, 'banque');
});

test('detectDomainFromText correctly identifies droit terms', () => {
  const legalText = 'Pursuant to clause 12, each party shall indemnify and hold harmless.';
  const domain = detectDomainFromText(legalText);
  assert.equal(domain, 'droit');
});

test('detectDomainFromText correctly identifies sante terms', () => {
  const medicalText = 'Administer paracetamol at 1000 mg every 8 hours with clinical trial remission.';
  const domain = detectDomainFromText(medicalText);
  assert.equal(domain, 'sante');
});

test('detectDomainFromText correctly identifies technologie terms', () => {
  const techText = 'Execute curl -X POST /v1/tokens with async JSON payload to the rate-limited cluster.';
  const domain = detectDomainFromText(techText);
  assert.equal(domain, 'technologie');
});

test('executeAgentTranslation returns valid comparisons and plain-language confidence', () => {
  const text = 'The bank approved the overdraft facility with fixed APR.';
  const result = executeAgentTranslation({ text, domainId: 'banque' });

  assert.equal(result.detectedDomain, 'banque');
  assert.ok(result.primaryTranslation.length > 0);
  assert.equal(result.comparisons.length, 3);
  assert.ok(result.confidenceLevel === 'eleve' || result.confidenceLevel === 'moyen');
  assert.ok(result.disclaimer.includes('conseil bancaire'));
});

test('anonymizeDocumentText masks sensitive IBANs, names and emails', () => {
  const sensitiveDoc = 'Client: M. Jean Dupont, IBAN: FR7612345678901234567890123, email: jean.dupont@finance.com';
  const anon = anonymizeDocumentText(sensitiveDoc);

  assert.ok(anon.detectedCount >= 2);
  assert.ok(!anon.anonymizedText.includes('jean.dupont@finance.com'));
  assert.ok(anon.anonymizedText.includes('••••'));
});

test('extractCandidateTerms extracts domain items with pending status for user validation', () => {
  const text = 'The company analyzed the impairment loss and hedging instruments under IFRS.';
  const terms = extractCandidateTerms(text, 'finance', 'Annual Report 2026.pdf');

  assert.ok(terms.length > 0);
  assert.equal(terms[0].domain, 'finance');
  assert.equal(terms[0].status, 'pending'); // Never applied without user approval!
});
