import { productCatalog } from '../data/productCatalog';
import type { ProductAdoption, ResponseRecord } from '../types';

const product = (id: string) => productCatalog.find((p) => p.id === id);
type OpportunityConfidence = 'high' | 'medium';

const detectSignals = (responses: Record<string, ResponseRecord>) =>
  Object.values(responses)
    .map((r) => `${r.answer} ${r.followUpNote ?? ''} ${r.consequence ?? ''}`.toLowerCase())
    .join(' ');

export const deriveOpportunities = (
  responses: Record<string, ResponseRecord>,
  adoption: Record<string, ProductAdoption>,
  platforms: { hasDenticon: boolean; hasCloud9: boolean; hasApteryx: boolean }
): Array<{ title: string; platform: string; category: string; whyItFits: string; confidence: 'high' | 'medium'; nextStep: string; linkedEvidence: string }> => {
  const text = detectSignals(responses);

  const rules = [
    { id: 'patient', words: ['patient communication', 'forms', 'scheduling'], products: ['denticon_patient_communication', 'cloud9_connect', 'cloud9_signature', 'denticon_mytooth', 'cloud9_mytooth'], explanation: 'Patient communication workflow gap detected.' },
    { id: 'bi', words: ['dashboard', 'reporting', 'bi', 'data access', 'warehouse'], products: ['denticon_dpa_data_share', 'cloud9_cbs_data_share', 'denticon_xvweb_analytics', 'apteryx_xvweb_analytics', 'denticon_dpa_morning_huddle', 'denticon_dpa_dashboard_bundle'], explanation: 'BI/reporting maturity gap detected.' },
    { id: 'insurance', words: ['insurance', 'era', '835', 'eligibility'], products: ['denticon_835_era', 'denticon_autoeligibility'], explanation: 'Insurance processing friction detected.' },
    { id: 'ai', words: ['ai', 'automation'], products: ['denticon_ai_agents', 'cloud9_ai_agents', 'denticon_ai_voice_perio'], explanation: 'AI interest signal detected.' },
    { id: 'imaging', words: ['3d', 'imaging'], products: ['denticon_xvweb_3d', 'apteryx_xvweb_3d'], explanation: 'Imaging/3D gap detected.' },
    { id: 'sso', words: ['sso', 'identity'], products: ['denticon_sso'], explanation: 'Identity/SSO requirement detected.' },
    { id: 'ortho', words: ['ortho', 'orthodontic'], products: ['denticon_ortho_suite'], explanation: 'Orthodontic workflow opportunity detected.' }
  ];

  const platformBoost = (platform: string) =>
    (platform === 'Denticon' && platforms.hasDenticon) || (platform === 'Cloud 9' && platforms.hasCloud9) || (platform === 'Apteryx' && platforms.hasApteryx);

  return rules
    .filter((r) => r.words.some((w) => text.includes(w)))
    .flatMap((rule) =>
      rule.products
        .filter((id) => adoption[id]?.status !== 'adopted')
        .map((id) => {
          const p = product(id);
          if (!p) return null;
          return {
            title: p.name,
            platform: p.platform,
            category: p.category,
            whyItFits: rule.explanation,
            confidence: (platformBoost(p.platform) ? 'high' : 'medium') as OpportunityConfidence,
            nextStep: '',
            linkedEvidence: rule.id
          };
        })
        .filter((v): v is NonNullable<typeof v> => v !== null)
    );
};

export const topWhitespace = (
  responses: Record<string, ResponseRecord>,
  adoption: Record<string, ProductAdoption>,
  platforms: { hasDenticon: boolean; hasCloud9: boolean; hasApteryx: boolean }
) => deriveOpportunities(responses, adoption, platforms).slice(0, 5);
