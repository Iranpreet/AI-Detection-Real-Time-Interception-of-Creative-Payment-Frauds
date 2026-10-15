export interface TxnPayload {
  amount: number;
  txn_type: 'collect' | 'debit' | 'qr_scan';
  payee_vpa: string;
  merchant_name: string;
  message: string;
  pasted_vpa: boolean;
  active_screenshare: boolean;
  active_phone_call: boolean;
  device_rooted: boolean;
  late_night_hour: boolean;
  is_new_payee: boolean;
  payee_txn_count: number;
  velocity_1h: number;
  velocity_24h: number;
  ratio_amount_to_avg: number;
  qr_payload_tampered: boolean;
  is_mule_cluster: boolean;
  zero_day_vector: boolean;
}

export interface ShapFeature {
  feature: string;
  impact: number;
  direction: 'positive' | 'negative';
  description: string;
}

export interface ScoreResult {
  txn_id: string;
  risk_score: number;
  classification: 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK';
  action: 'ALLOW' | 'WARN_COOLOFF' | 'BLOCK_INTERCEPT';
  status_label: string;
  detected_vector: string;
  latency_ms: number;
  latency_sla_met: boolean;
  nlp_intent_score: number;
  nudges: {
    en: string;
    hi: string;
  };
  shap_features: ShapFeature[];
  context_flags: {
    has_cashback_refund: boolean;
    is_collect_refund_scam: boolean;
    is_qr_tampered: boolean;
    is_screenshare_scam: boolean;
    is_mule: boolean;
    has_urgency: boolean;
  };
  timestamp: string;
}

export interface ScamPreset {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  values: TxnPayload;
  educational_note: string;
}

export interface TransactionRecord {
  txn_id: string;
  timestamp: string;
  payer: string;
  payee_vpa: string;
  merchant_name: string;
  amount: number;
  txn_type: 'collect' | 'debit' | 'qr_scan';
  risk_score: number;
  classification: 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK';
  detected_vector: string;
  status: 'BLOCKED' | 'ALLOWED' | 'WARNED_COOLOFF' | 'FROZEN_BY_ANALYST' | 'ALLOWED_OVERRIDE';
  message: string;
  telemetry: {
    device_model: string;
    os_version: string;
    app_package: string;
    ip_location: string;
    pasted_vpa: boolean;
    active_screenshare: boolean;
    screenshare_app?: string;
    active_phone_call: boolean;
    device_rooted: boolean;
    late_night_hour: boolean;
    velocity_1h: number;
    velocity_24h: number;
    ratio_amount_to_avg: number;
    nlp_intent_score: number;
    mule_cluster_origin: string;
    shap_summary: string;
  };
}

export interface MuleCluster {
  cluster_name: string;
  state: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  active_mule_nodes: number;
  flagged_vpans: string;
  blocked_volume_inr: string;
  primary_vector: string;
}

export interface HourlyTrend {
  hour: string;
  scanned: number;
  blocked: number;
  fraud_rate: number;
}

export interface FraudCategory {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface NovelScenario {
  name: string;
  vpa: string;
  amount: number;
  sms_text: string;
  description: string;
  behavioral_profile: {
    velocity_anomaly: number;
    device_timing: string;
    semantic_distance_sigma: number;
    isolation_forest_outlier_score: number;
  };
}

export interface DynamicDefenseRule {
  rule_id: string;
  synthesized_pattern: string;
  threat_signature: string;
  remediation: string;
  generated_at: string;
  confidence_score: number;
}

export interface ZeroDayEvalResult {
  scenario: NovelScenario;
  text_evaluated: string;
  traditional_rules: {
    evaded: boolean;
    matched_rules: string[];
    verdict: string;
    explanation: string;
  };
  unsupervised_engine: {
    flagged: boolean;
    outlier_score: number;
    semantic_distance_sigma: number;
    verdict: string;
    explanation: string;
  };
  dynamic_defense_rule: DynamicDefenseRule;
}

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}
