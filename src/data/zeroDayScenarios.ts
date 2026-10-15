import { NovelScenario } from '../types';

export const NOVEL_SCAM_SCENARIOS: Record<string, NovelScenario> = {
  deepfake_voice: {
    name: "AI Deepfake Voice Clone & Emergency Medical Escrow",
    vpa: "novel.deepfake.voice.auth@ybl",
    amount: 32000,
    sms_text: "Urgent family hospital admission ICU deposit. Authenticated via emergency voice signature recording.",
    description: "Attackers synthesize an AI clone of the victim's close relative pleading for an emergency hospital transfer, evading traditional keyword lists.",
    behavioral_profile: {
      velocity_anomaly: 3.4,
      device_timing: "02:15 AM (Off-hours)",
      semantic_distance_sigma: 2.82,
      isolation_forest_outlier_score: 0.91
    }
  },
  upi_lite_evasion: {
    name: "UPI Lite High-Frequency Nano-Siphon Loop",
    vpa: "lite.drain.mesh89@okaxis",
    amount: 1980,
    sms_text: "Auto-recharge token authorization for micro-cloud compute pass",
    description: "Fraudsters trigger rapid repeated UPI Lite sub-threshold payments (below ₹2,000 PIN requirement) exploiting offline balances.",
    behavioral_profile: {
      velocity_anomaly: 8.9,
      device_timing: "Rapid burst (14 transactions in 90 seconds)",
      semantic_distance_sigma: 2.64,
      isolation_forest_outlier_score: 0.94
    }
  },
  malicious_intent_uri: {
    name: "Tampered UPI Intent Deep-Link with Embedded AutoPay Mandate",
    vpa: "recurring.subs.shield@paytm",
    amount: 499,
    sms_text: "Activate your ₹499 annual discount coupon. One-click instant unlock.",
    description: "A malicious deep link disguise: Clicking appears to pay a one-time ₹499 fee, but payload contains an unadvertised recurring ₹15,000/month e-mandate.",
    behavioral_profile: {
      velocity_anomaly: 2.1,
      device_timing: "Pasted from external Telegram bot",
      semantic_distance_sigma: 3.10,
      isolation_forest_outlier_score: 0.96
    }
  }
};
