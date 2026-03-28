import { calculateReadiness, deriveRiskRegister } from './readiness';
import { topWhitespace } from './opportunityRules';
import type { ProductAdoption, ResponseRecord, ReviewLens, Snapshot } from '../types';

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const computeScores = (
  responses: Record<string, ResponseRecord>,
  adoption: Record<string, ProductAdoption>,
  lens: ReviewLens,
  platforms: { hasDenticon: boolean; hasCloud9: boolean; hasApteryx: boolean }
) => {
  const readiness = calculateReadiness(responses, lens);
  const riskCount = deriveRiskRegister(responses).length;
  const whitespaceCount = topWhitespace(responses, adoption, platforms).length;

  const relationshipHealth = clamp(100 - readiness.blockers * 12);
  const retentionRisk = clamp(riskCount * 18);
  const growthPotential = clamp(20 + whitespaceCount * 12 + (100 - retentionRisk) * 0.2);
  const operationalComplexity = clamp(riskCount * 10 + (100 - readiness.percentCoverage) * 0.4);

  const overallPosture: Snapshot['overallPosture'] =
    retentionRisk > 70 ? 'Red' : retentionRisk > 45 ? 'Yellow' : growthPotential > 75 ? 'Blue' : 'Green';

  return { relationshipHealth, retentionRisk, growthPotential, operationalComplexity, overallPosture };
};

export const labelMetric = (metric: 'relationship' | 'risk' | 'growth' | 'complexity', value: number) => {
  if (metric === 'relationship') return value >= 75 ? 'Strong' : value >= 45 ? 'Moderate' : 'Low';
  return value >= 70 ? 'High' : value >= 40 ? 'Moderate' : 'Low';
};

export const createSnapshot = (
  responses: Record<string, ResponseRecord>,
  adoption: Record<string, ProductAdoption>,
  lens: ReviewLens,
  platforms: { hasDenticon: boolean; hasCloud9: boolean; hasApteryx: boolean },
  note: string
): Snapshot => ({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), note, ...computeScores(responses, adoption, lens, platforms) });
