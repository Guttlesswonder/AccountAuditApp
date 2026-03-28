import { scoringConfig } from '../data/scoringConfig';
import { calculateReadiness, riskRegister } from './readiness';
import { opportunityRegister } from './opportunityRules';
import type { ProductAdoption, ResponseRecord, ReviewLens, Snapshot } from '../types';

export const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export const computeScores = (
  responses: Record<string, ResponseRecord>,
  adoption: Record<string, ProductAdoption>,
  lens: ReviewLens
) => {
  const readiness = calculateReadiness(responses, lens);
  const risks = riskRegister(responses).length;
  const opportunities = opportunityRegister(responses, adoption).length;

  const relationshipHealth = clamp(100 - readiness.blockers * scoringConfig.relationshipPenalty);
  const retentionRisk = clamp(risks * scoringConfig.retentionRiskStep);
  const growthPotential = clamp(readiness.opportunities * 8 + opportunities * scoringConfig.growthOpportunityStep);
  const operationalComplexity = clamp((readiness.blockers + readiness.warnings) * scoringConfig.complexityStep);

  const overallPosture =
    retentionRisk >= 75 || readiness.percentCoverage < 40
      ? 'Red'
      : retentionRisk >= 45
      ? 'Yellow'
      : growthPotential >= 60
      ? 'Blue'
      : 'Green';

  return { relationshipHealth, retentionRisk, growthPotential, operationalComplexity, overallPosture };
};

export const createSnapshot = (
  responses: Record<string, ResponseRecord>,
  adoption: Record<string, ProductAdoption>,
  lens: ReviewLens,
  note: string
): Snapshot => {
  const score = computeScores(responses, adoption, lens);
  return { id: crypto.randomUUID(), createdAt: new Date().toISOString(), note, ...score };
};
