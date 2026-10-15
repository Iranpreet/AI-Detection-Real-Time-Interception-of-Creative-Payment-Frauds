# ShieldUPI - AI Detection & Real-Time Interception of Creative Payment Frauds

ShieldUPI (Project CC6-AI02) is an AI-driven, real-time fraud detection and interception engine designed for the Indian UPI digital payments ecosystem. The application evaluates transaction telemetry, behavioral velocity, and message intent in **<30 milliseconds** (well within the mandatory **120 ms NPCI SLA**), delivers Explainable AI (XAI) feature importance breakdowns, and intercepts fraudulent transactions before UPI PIN authorization with plain-language English & Hindi nudges.

## Key Features

1. **Simulation Hub**: Interactive testing ground for 7 core scam vectors (Fake Collect Refund, QR Code Swap, Screenshare RAT, Mule Velocity Chain, Discom Bill Urgency, Zero-Day AI Voice Clone, and Legitimate Transactions).
2. **Real-Time XAI Engine**: SHAP-style waterfall attribution showing positive and negative risk drivers, dynamic animated gauge, and latency SLA verification.
3. **Just-In-Time Safety Interception Modal**: Pre-PIN authorization intervention screen with cooling-off period countdown timer, bilingual warning messages (English/Hindi), verification helpline guide (1930 / Bank), and NCRP reporting.
4. **Analyst Operations Dashboard**: Bank compliance operations with KPI metrics, 24-hour hourly trend analysis highlighting off-hours spikes, fraud categorization breakdown, and reported mule syndicate geofences.
5. **Model Evaluation & Benchmarking**: Rigorous metrics (96.4% Precision, 94.8% Recall, 1.18% FPR, 0.985 ROC-AUC), interactive Confusion Matrix, and threshold tuning curve.
6. **Zero-Day AI Lab**: Unsupervised Isolation Forest outlier detection comparing novel uncatalogued attacks against rigid static rules with dynamic defense rule synthesis.
7. **Architecture & NPCI Integration Specs**: Three-tier system blueprint from edge sensors to hybrid scoring and plain-language consumer interventions.

## Technology Stack

- **Framework**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS with custom cyber glassmorphic aesthetics, neon glows, and animated radar sweep
- **Graphics & Visualization**: High-DPI Canvas charting engine for Risk Gauges, Category Donut, Hourly Velocity Trends, and ROC Curves
- **Icons**: Lucide React
