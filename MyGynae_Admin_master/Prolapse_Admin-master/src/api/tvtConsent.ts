import { delet, get, post, put } from '@/utils/request';

// ==================== INTERFACES ====================

export interface TvtConsent {
  ID: number;
  patient_id: number;
  answer_id: number;
  status: 'started' | 'leaflet_completed' | 'request_completed' | 'consent_completed';
  current_step: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TvtLeafletConfirmation {
  ID: number;
  tvt_consent_id: number;
  understood_procedure: boolean;
  understood_alternatives: boolean;
  understood_risks: boolean;
  understood_recovery: boolean;
  understood_questions: boolean;
  patient_signature?: string;
  confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TvtPatientRequest {
  ID: number;
  tvt_consent_id: number;

  // Patient Confirmations
  has_debilitating_sui: boolean;
  aware_hse_pause_2018: boolean;
  tried_pelvic_floor_exercises: boolean;
  tried_lifestyle_changes: boolean;
  tried_pessary: boolean;

  // Alternative Decline Confirmations
  declined_colposuspension: boolean;
  declined_fascial_sling: boolean;
  understand_tvt_risks: boolean;

  // Risk Awareness
  aware_success_rate_80_90: boolean;
  aware_complications_up_to_15: boolean;
  aware_mesh_exposure: boolean;
  aware_bladder_injury: boolean;
  aware_repeat_surgery_possible: boolean;

  // MDT Approval
  mdt_approval_required: boolean;
  mdt_approved: boolean;
  mdt_approval_date?: string;
  mdt_notes?: string;

  // Signatures
  patient_signature?: string;
  patient_signature_date?: string;
  consultant_signature?: string;
  consultant_name?: string;
  consultant_signature_date?: string;

  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TvtConsentForm {
  ID: number;
  tvt_consent_id: number;

  // Patient Details
  patient_identifier?: string;
  responsible_healthcare_professional?: string;
  job_title?: string;

  // Procedure Selection
  selected_procedure: 'TVT' | 'TVT-O';

  // Procedure Understanding
  understood_procedure_nature: boolean;
  understood_serious_risks: boolean;
  understood_common_risks: boolean;
  understood_alternatives: boolean;
  understood_no_guarantee: boolean;

  // Irish National Mesh Register
  mesh_register_consent?: boolean;
  mesh_register_reason?: string;

  // Additional Procedures
  additional_procedures?: string;
  blood_products_consent: boolean;

  // Interpreter
  interpreter_used: boolean;
  interpreter_name?: string;
  interpreter_id?: string;

  // Section A: Patient Agreement
  section_a_signature?: string;
  section_a_date?: string;
  section_a_name?: string;

  // Section B: Health Professional
  section_b_signature?: string;
  section_b_date?: string;
  section_b_name?: string;
  section_b_job_title?: string;

  // Section C: Interpreter (if applicable)
  section_c_signature?: string;
  section_c_date?: string;
  section_c_name?: string;
  section_c_interpreter_id?: string;

  // Section D: Patient Confirmation (Day of procedure)
  section_d_signature?: string;
  section_d_date?: string;
  section_d_name?: string;
  section_d_questions_answered: boolean;

  // Section E: Surgeon Confirmation
  section_e_signature?: string;
  section_e_date?: string;
  section_e_name?: string;
  section_e_job_title?: string;

  // Section F: Capacity Confirmation (if applicable)
  section_f_signature?: string;
  section_f_date?: string;
  section_f_name?: string;
  section_f_job_title?: string;
  section_f_assessment?: string;

  // Risk Acknowledgements
  acknowledged_bladder_perforation: boolean;
  acknowledged_bowel_perforation: boolean;
  acknowledged_mesh_exposure: boolean;
  acknowledged_chronic_pain: boolean;
  acknowledged_voiding_difficulty: boolean;
  acknowledged_recurrent_uti: boolean;
  acknowledged_mesh_removal_risk: boolean;
  acknowledged_success_rate?: string;

  additional_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TvtConsentNote {
  ID: number;
  tvt_consent_id: number;
  note_type: 'clinical' | 'administrative' | 'mdt' | 'followup';
  note: string;
  created_by: string;
  created_at: string;
}

export interface TvtConsentAudit {
  ID: number;
  tvt_consent_id: number;
  action: string;
  performed_by?: string;
  performed_at: string;
  details?: string;
  ip_address?: string;
}

export interface TvtConsentComplete {
  consent: TvtConsent;
  leaflet?: TvtLeafletConfirmation;
  request?: TvtPatientRequest;
  form?: TvtConsentForm;
  notes?: TvtConsentNote[];
  audit?: TvtConsentAudit[];
}

// ==================== API FUNCTIONS ====================

// Main TVT Consent Management
export const createTvtConsent = (patientId: number, answerId: number) => {
  return post('/tvt-consent/create', { patient_id: patientId, answer_id: answerId });
};

export const getTvtConsent = (consentId: number) => {
  return get(`/tvt-consent/${consentId}`);
};

export const getTvtConsentByAnswer = (answerId: number) => {
  return get(`/tvt-consent/by-answer/${answerId}`);
};

export const getTvtConsentsByPatient = (patientId: number) => {
  return get(`/tvt-consent/by-patient/${patientId}`);
};

export const updateTvtConsentStatus = (
  consentId: number,
  status: string,
  currentStep: number,
) => {
  return put(`/tvt-consent/${consentId}/status`, { status, current_step: currentStep });
};

export const completeTvtConsent = (consentId: number) => {
  return put(`/tvt-consent/${consentId}/complete`, {});
};

export const deleteTvtConsent = (consentId: number) => {
  return delet(`/tvt-consent/${consentId}`);
};

// Step 1: Leaflet Confirmation
export const saveLeafletConfirmation = (consentId: number, data: Partial<TvtLeafletConfirmation>) => {
  return post(`/tvt-consent/${consentId}/leaflet`, data);
};

export const getLeafletConfirmation = (consentId: number) => {
  return get(`/tvt-consent/${consentId}/leaflet`);
};

export const updateLeafletConfirmation = (
  consentId: number,
  data: Partial<TvtLeafletConfirmation>,
) => {
  return put(`/tvt-consent/${consentId}/leaflet`, data);
};

// Step 2: Patient Request Form
export const savePatientRequest = (consentId: number, data: Partial<TvtPatientRequest>) => {
  return post(`/tvt-consent/${consentId}/request`, data);
};

export const getPatientRequest = (consentId: number) => {
  return get(`/tvt-consent/${consentId}/request`);
};

export const updatePatientRequest = (consentId: number, data: Partial<TvtPatientRequest>) => {
  return put(`/tvt-consent/${consentId}/request`, data);
};

// MDT Approval
export const approveMdt = (consentId: number, notes?: string) => {
  return put(`/tvt-consent/${consentId}/request/mdt-approve`, { notes });
};

export const rejectMdt = (consentId: number, notes?: string) => {
  return put(`/tvt-consent/${consentId}/request/mdt-reject`, { notes });
};

// Step 3: Consent Form (with 6 sections)
export const saveConsentForm = (consentId: number, data: Partial<TvtConsentForm>) => {
  return post(`/tvt-consent/${consentId}/form`, data);
};

export const getConsentForm = (consentId: number) => {
  return get(`/tvt-consent/${consentId}/form`);
};

export const updateConsentForm = (consentId: number, data: Partial<TvtConsentForm>) => {
  return put(`/tvt-consent/${consentId}/form`, data);
};

// Individual section signatures
export const saveFormSectionSignature = (
  consentId: number,
  section: 'a' | 'b' | 'c' | 'd' | 'e' | 'f',
  data: any,
) => {
  return put(`/tvt-consent/${consentId}/form/section/${section}`, data);
};

// Notes
export const addConsentNote = (
  consentId: number,
  noteType: 'clinical' | 'administrative' | 'mdt' | 'followup',
  note: string,
  createdBy: string,
) => {
  return post(`/tvt-consent/${consentId}/notes`, {
    note_type: noteType,
    note,
    created_by: createdBy,
  });
};

export const getConsentNotes = (consentId: number) => {
  return get(`/tvt-consent/${consentId}/notes`);
};

export const deleteConsentNote = (noteId: number) => {
  return delet(`/tvt-consent/notes/${noteId}`);
};

// Audit Trail
export const getConsentAudit = (consentId: number) => {
  return get(`/tvt-consent/${consentId}/audit`);
};

// Complete consent data (all steps)
export const getTvtConsentComplete = (consentId: number): Promise<TvtConsentComplete> => {
  return get(`/tvt-consent/${consentId}/complete`);
};

// Generate PDF
export const generateTvtConsentPdf = (consentId: number) => {
  return get(`/tvt-consent/${consentId}/pdf`);
};

// Download SUI Mesh Tapes Leaflet (static PDF)
export const downloadSuiLeaflet = () => {
  return get('/tvt-consent/documents/sui-mesh-leaflet.pdf');
};
