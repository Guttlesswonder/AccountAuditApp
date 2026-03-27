import { productCatalog } from '../data/productCatalog';
import type { ProductAdoption, ProductCatalogItem, ResponseRecord } from '../types';

type RuleResult = { suggestedProductIds: string[]; explanation: string; evidenceItemIds: string[] };

const containsAny = (text: string, words: string[]) => words.some((word) => text.includes(word));

export const deriveOpportunities = (
  responses: Record<string, ResponseRecord>,
  adoption: Record<string, ProductAdoption>
): RuleResult[] => {
  const textBlob = Object.entries(responses)
    .map(([id, r]) => `${id} ${r.answer} ${r.risk} ${r.status}`.toLowerCase())
    .join(' ');

  const rules: Array<{ trigger: string[]; products: string[]; explanation: string }> = [
    { trigger: ['patient communication', 'forms', 'scheduling'], products: ['denticon_patient_comm', 'cloud9_connect', 'cloud9_signature', 'denticon_mytooth', 'cloud9_mytooth'], explanation: 'Patient communication friction detected.' },
    { trigger: ['bi', 'report', 'dashboard', 'data warehouse', 'data access'], products: ['denticon_dpa_data_share', 'cloud9_cbs_data_share', 'denticon_xvweb_analytics', 'apteryx_xvweb_analytics', 'denticon_dpa_morning_huddle', 'denticon_dpa_dashboard_bundle'], explanation: 'BI/reporting or data access gap detected.' },
    { trigger: ['insurance', 'era', '835', 'eligibility'], products: ['denticon_835_era', 'denticon_autoeligibility'], explanation: 'Insurance workflow friction detected.' },
    { trigger: ['ai', 'automation'], products: ['denticon_ai_agents', 'cloud9_ai_agents', 'denticon_ai_voice_perio'], explanation: 'AI interest detected.' },
    { trigger: ['3d', 'imaging'], products: ['denticon_xvweb_3d', 'apteryx_xvweb_3d'], explanation: 'Imaging/3D gap detected.' },
    { trigger: ['sso', 'identity'], products: ['denticon_sso'], explanation: 'Identity/SSO need detected.' },
    { trigger: ['ortho', 'orthodontic'], products: ['denticon_ortho_suite'], explanation: 'Orthodontic workflow need detected.' }
  ];

  return rules
    .filter((rule) => containsAny(textBlob, rule.trigger))
    .map((rule) => {
      const suggestedProductIds = rule.products.filter((p) => adoption[p]?.status !== 'adopted');
      return {
        suggestedProductIds,
        explanation: rule.explanation,
        evidenceItemIds: Object.keys(responses).filter((id) => textBlob.includes(id))
      };
    })
    .filter((r) => r.suggestedProductIds.length > 0);
};

export const opportunityRegister = (
  responses: Record<string, ResponseRecord>,
  adoption: Record<string, ProductAdoption>
) => {
  const direct = Object.entries(responses)
    .filter(([, r]) => r.status === 'Opportunity')
    .map(([id, r]) => ({ title: `Checklist opportunity ${id}`, platform: 'N/A', category: 'checklist', whyItFits: r.answer, confidence: 'medium', owner: r.owner, nextStep: r.risk, linkedEvidenceItemIds: [id] }));

  const derived = deriveOpportunities(responses, adoption).flatMap((o) => o.suggestedProductIds.map((id) => {
    const product = productCatalog.find((p) => p.id === id) as ProductCatalogItem;
    return {
      title: product.name,
      platform: product.platform,
      category: product.category,
      whyItFits: o.explanation,
      confidence: adoption[id]?.opportunityValue || 'medium',
      owner: adoption[id]?.owner || '',
      nextStep: adoption[id]?.notes || 'Validate discovery signal and define commercial motion.',
      linkedEvidenceItemIds: o.evidenceItemIds
    };
  }));

  return [...direct, ...derived];
};
