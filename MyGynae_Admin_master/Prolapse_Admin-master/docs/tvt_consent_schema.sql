-- TVT Consent Database Schema
-- Separate consent process specifically for TVT procedures
-- Incorporates: SUI Mesh Tapes Leaflet, Patient Request Form, SUI Consent Form 2023

-- Main TVT Consent Record
CREATE TABLE tvt_consents (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    answer_id INT NOT NULL,              -- Links to the TVT surgical procedure answer

    -- Workflow status
    status ENUM('started', 'leaflet_completed', 'request_completed', 'consent_completed') DEFAULT 'started',
    current_step INT DEFAULT 1,          -- 1: Leaflet, 2: Request Form, 3: Consent Form

    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,

    FOREIGN KEY (patient_id) REFERENCES patients(ID) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answers(ID) ON DELETE CASCADE,

    INDEX idx_patient (patient_id),
    INDEX idx_answer (answer_id),
    INDEX idx_status (status)
);

-- Step 1: SUI Mesh Tapes Information Leaflet (16 pages)
-- Patient confirms they have read and understood the leaflet
CREATE TABLE tvt_leaflet_confirmations (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    tvt_consent_id INT NOT NULL,

    -- Information Checklist (Page 16 of leaflet)
    understood_procedure BOOLEAN DEFAULT FALSE,
    understood_alternatives BOOLEAN DEFAULT FALSE,
    understood_risks BOOLEAN DEFAULT FALSE,
    understood_recovery BOOLEAN DEFAULT FALSE,
    understood_questions BOOLEAN DEFAULT FALSE,

    -- Confirmation
    patient_signature TEXT,              -- Base64 signature image
    confirmed_at DATETIME NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (tvt_consent_id) REFERENCES tvt_consents(ID) ON DELETE CASCADE,
    UNIQUE KEY unique_leaflet (tvt_consent_id)
);

-- Step 2: Patient Request for TVT Insertion (2 pages)
CREATE TABLE tvt_patient_requests (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    tvt_consent_id INT NOT NULL,

    -- Patient Confirmations
    has_debilitating_sui BOOLEAN DEFAULT FALSE,
    aware_hse_pause_2018 BOOLEAN DEFAULT FALSE,
    tried_pelvic_floor_exercises BOOLEAN DEFAULT FALSE,
    tried_lifestyle_changes BOOLEAN DEFAULT FALSE,
    tried_pessary BOOLEAN DEFAULT FALSE,

    -- Alternative Decline Confirmations
    declined_colposuspension BOOLEAN DEFAULT FALSE,
    declined_fascial_sling BOOLEAN DEFAULT FALSE,
    understand_tvt_risks BOOLEAN DEFAULT FALSE,

    -- Risk Awareness (from form)
    aware_success_rate_80_90 BOOLEAN DEFAULT FALSE,
    aware_complications_up_to_15 BOOLEAN DEFAULT FALSE,
    aware_mesh_exposure BOOLEAN DEFAULT FALSE,
    aware_bladder_injury BOOLEAN DEFAULT FALSE,
    aware_repeat_surgery_possible BOOLEAN DEFAULT FALSE,

    -- MDT Approval
    mdt_approval_required BOOLEAN DEFAULT TRUE,
    mdt_approved BOOLEAN DEFAULT FALSE,
    mdt_approval_date DATETIME NULL,
    mdt_notes TEXT,

    -- Signatures
    patient_signature TEXT,              -- Base64 signature image
    patient_signature_date DATETIME NULL,
    consultant_signature TEXT,           -- Base64 signature image
    consultant_name VARCHAR(255),
    consultant_signature_date DATETIME NULL,

    -- Additional notes
    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (tvt_consent_id) REFERENCES tvt_consents(ID) ON DELETE CASCADE,
    UNIQUE KEY unique_request (tvt_consent_id)
);

-- Step 3: SUI Consent Form 2023 (13 pages with 6 signature sections A-F)
CREATE TABLE tvt_consent_forms (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    tvt_consent_id INT NOT NULL,

    -- Patient Details
    patient_identifier VARCHAR(255),
    responsible_healthcare_professional VARCHAR(255),
    job_title VARCHAR(255),

    -- Procedure Selection (from comparison table)
    selected_procedure ENUM('TVT', 'TVT-O') DEFAULT 'TVT',

    -- Procedure Understanding Checkboxes
    understood_procedure_nature BOOLEAN DEFAULT FALSE,
    understood_serious_risks BOOLEAN DEFAULT FALSE,
    understood_common_risks BOOLEAN DEFAULT FALSE,
    understood_alternatives BOOLEAN DEFAULT FALSE,
    understood_no_guarantee BOOLEAN DEFAULT FALSE,

    -- Irish National Mesh Register Consent
    mesh_register_consent BOOLEAN,       -- TRUE = CONSENT, FALSE = DO NOT CONSENT
    mesh_register_reason TEXT,           -- If declined, reason

    -- Additional Procedures/Investigations
    additional_procedures TEXT,
    blood_products_consent BOOLEAN DEFAULT FALSE,

    -- Interpreter/Communication Support
    interpreter_used BOOLEAN DEFAULT FALSE,
    interpreter_name VARCHAR(255),
    interpreter_id VARCHAR(255),

    -- Section A: Patient Agreement (Page 1 signature)
    section_a_signature TEXT,
    section_a_date DATETIME NULL,
    section_a_name VARCHAR(255),

    -- Section B: Health Professional Statement (Page 1 signature)
    section_b_signature TEXT,
    section_b_date DATETIME NULL,
    section_b_name VARCHAR(255),
    section_b_job_title VARCHAR(255),

    -- Section C: Interpreter Declaration (if applicable)
    section_c_signature TEXT,
    section_c_date DATETIME NULL,
    section_c_name VARCHAR(255),
    section_c_interpreter_id VARCHAR(255),

    -- Section D: Patient Confirmation (Day of procedure)
    section_d_signature TEXT,
    section_d_date DATETIME NULL,
    section_d_name VARCHAR(255),
    section_d_questions_answered BOOLEAN DEFAULT FALSE,

    -- Section E: Confirmation of Consent (Surgeon - Day of procedure)
    section_e_signature TEXT,
    section_e_date DATETIME NULL,
    section_e_name VARCHAR(255),
    section_e_job_title VARCHAR(255),

    -- Section F: Confirmation of Capacity (if applicable)
    section_f_signature TEXT,
    section_f_date DATETIME NULL,
    section_f_name VARCHAR(255),
    section_f_job_title VARCHAR(255),
    section_f_assessment TEXT,

    -- Specific Risk Acknowledgements (from tables in form)
    acknowledged_bladder_perforation BOOLEAN DEFAULT FALSE,
    acknowledged_bowel_perforation BOOLEAN DEFAULT FALSE,
    acknowledged_mesh_exposure BOOLEAN DEFAULT FALSE,
    acknowledged_chronic_pain BOOLEAN DEFAULT FALSE,
    acknowledged_voiding_difficulty BOOLEAN DEFAULT FALSE,
    acknowledged_recurrent_uti BOOLEAN DEFAULT FALSE,
    acknowledged_mesh_removal_risk BOOLEAN DEFAULT FALSE,

    -- Success rate acknowledgement
    acknowledged_success_rate VARCHAR(50), -- e.g., "77-90% at 1 year"

    -- Notes and additional information
    additional_notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (tvt_consent_id) REFERENCES tvt_consents(ID) ON DELETE CASCADE,
    UNIQUE KEY unique_consent_form (tvt_consent_id)
);

-- Audit trail for TVT consent process
CREATE TABLE tvt_consent_audit (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    tvt_consent_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,        -- e.g., 'leaflet_viewed', 'request_signed', 'consent_section_a_signed'
    performed_by VARCHAR(255),           -- User who performed the action
    performed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT,                        -- JSON with additional details
    ip_address VARCHAR(45),

    FOREIGN KEY (tvt_consent_id) REFERENCES tvt_consents(ID) ON DELETE CASCADE,
    INDEX idx_consent (tvt_consent_id),
    INDEX idx_action (action),
    INDEX idx_performed_at (performed_at)
);

-- Comments/Notes on TVT consent process
CREATE TABLE tvt_consent_notes (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    tvt_consent_id INT NOT NULL,
    note_type ENUM('clinical', 'administrative', 'mdt', 'followup') DEFAULT 'clinical',
    note TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (tvt_consent_id) REFERENCES tvt_consents(ID) ON DELETE CASCADE,
    INDEX idx_consent (tvt_consent_id),
    INDEX idx_type (note_type)
);
