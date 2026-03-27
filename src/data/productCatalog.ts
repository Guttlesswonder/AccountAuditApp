import type { ProductCatalogItem } from '../types';

export const productCatalog: ProductCatalogItem[] = [
  { id: 'denticon_xvweb_pro_location', name: 'XVWeb Pro Location (Unlimited)', platform: 'Denticon', category: 'core' },
  { id: 'denticon_xvweb_analytics', name: 'XVWeb Analytics Dashboard', platform: 'Denticon', category: 'analytics', overlapsWith: ['apteryx_xvweb_analytics'] },
  { id: 'denticon_ortho_suite', name: 'Ortho Suite', platform: 'Denticon', category: 'core' },
  { id: 'denticon_xvweb_3d', name: 'XVWeb 3D Module', platform: 'Denticon', category: 'imaging', overlapsWith: ['apteryx_xvweb_3d'] },
  { id: 'denticon_dpa_morning_huddle', name: 'DPA: Morning Huddle Dashboard', platform: 'Denticon', category: 'analytics' },
  { id: 'denticon_dpa_dashboard_bundle', name: 'DPA: Dashboard Bundle', platform: 'Denticon', category: 'analytics' },
  { id: 'denticon_patient_comm', name: 'Denticon Patient Communication', platform: 'Denticon', category: 'patient_experience' },
  { id: 'denticon_dxc_attach', name: 'DXC Attachments', platform: 'Denticon', category: 'integration' },
  { id: 'denticon_835_era', name: '835 ERA Unlimited', platform: 'Denticon', category: 'rcm' },
  { id: 'denticon_dpa_data_share', name: 'DPA: Data Share', platform: 'Denticon', category: 'analytics', overlapsWith: ['cloud9_cbs_data_share'] },
  { id: 'denticon_autoeligibility', name: 'AutoEligibility', platform: 'Denticon', category: 'rcm' },
  { id: 'denticon_mytooth', name: 'MyTooth: Forms & Scheduling', platform: 'Denticon', category: 'patient_experience', overlapsWith: ['cloud9_mytooth'] },
  { id: 'denticon_ai_voice_perio', name: 'AI Voice Perio', platform: 'Denticon', category: 'ai' },
  { id: 'denticon_sso', name: 'Single-Sign On', platform: 'Denticon', category: 'security' },
  { id: 'denticon_ai_agents', name: 'AI Agents', platform: 'Denticon', category: 'ai', overlapsWith: ['cloud9_ai_agents'] },
  { id: 'cloud9_connect', name: 'Connect', platform: 'Cloud9', category: 'patient_experience' },
  { id: 'cloud9_signature', name: 'Signature', platform: 'Cloud9', category: 'patient_experience' },
  { id: 'cloud9_cbs_data_share', name: 'CBS: Data Share', platform: 'Cloud9', category: 'analytics' },
  { id: 'cloud9_ai_agents', name: 'AI Agents', platform: 'Cloud9', category: 'ai' },
  { id: 'cloud9_mytooth', name: 'MyTooth', platform: 'Cloud9', category: 'patient_experience' },
  { id: 'apteryx_xvweb_3d', name: 'XVWeb 3D Module', platform: 'Apteryx', category: 'imaging' },
  { id: 'apteryx_xvweb_analytics', name: 'XVWeb Analytics Dashboard', platform: 'Apteryx', category: 'analytics' }
];
