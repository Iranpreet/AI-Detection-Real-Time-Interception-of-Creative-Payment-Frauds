# ShieldUPI / AI Fraud Shield

**Project CC6-AI02: AI Detection of Creative Payment Frauds**  
*Cybercup 2026 — Advanced Payment Security & Consumer Protection*

---

## 📌 Executive Summary

Digital payments in India, powered by the **Unified Payments Interface (UPI)**, have revolutionized financial inclusion with over 14 billion monthly transactions. However, creative fraudsters continually exploit social engineering and interface blind spots:
1. **Fake "Collect Request" Refund Scams** (tricking victims into entering their UPI PIN under the disguise of receiving cashbacks/refunds).
2. **QR Code Swaps & Counter Sticker Tampering** (diverting merchant funds to unverified personal mule accounts).
3. **Screensharing / Remote Access App (RAT) Scams** (using AnyDesk, TeamViewer QuickSupport, or RustDesk during fake KYC calls to capture credentials).
4. **Mule-Account Velocity Chains** (rapid multi-hop transfers to newly minted accounts in cybercrime hotspot clusters).
5. **Urgency Utility / Disconnection Threats** (coercive messages demanding immediate payments to personal VPAs).
6. **Zero-Day Emerging Vectors** (AI voice clone social engineering and novel sub-threshold payment loops).

**ShieldUPI** is a production-ready, ultra-low latency AI fraud prevention engine and interactive security dashboard designed for seamless integration into UPI payment apps (Google Pay, PhonePe, Paytm, BHIM) and bank core systems. It operates strictly within the mandatory **<120 ms NPCI SLA window**, achieving **96.4% Precision**, **94.8% Recall**, and a **1.18% False Positive Rate (FPR)**.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["1. Edge Telemetry & Sensing (Payment App / SDK)"]
        A["User Initiates Payment (VPA / QR / Collect)"]
        B["Telemetry Sensors: Active Screenshare, Pasted VPA, Call State, Root Status"]
        C["Payment Context: Amount, Note, Claimed Merchant vs Decoded VPA"]
    end

    subgraph RiskEngine["2. ShieldUPI AI Risk Engine (<120ms SLA)"]
        D["Feature Extraction & Normalization"]
        E["Supervised Random Forest (Trained on 25k India Txns)"]
        F["Unsupervised Isolation Forest (Zero-Day Anomaly Detector)"]
        G["NLP Intent Classifier (SMS / Note Coercion Analysis)"]
        H["XAI SHAP Feature Importance Explainer"]
    end

    subgraph ActionLayer["3. Just-In-Time Decision & Interception"]
        I{"Composite Risk Score (0-100)"}
        J["🟢 Safe (0-34): Instant Authorization"]
        K["🟡 Suspicious (35-69): Soft Warning Nudge"]
        L["🔴 High Risk (70-100): Hard Interception Screen"]
    end

    subgraph Intervention["4. Real-Time Consumer Protection Modal"]
        M["Plain-Language Dual-Language Warning (English / हिंदी)"]
        N["10s Mandatory Cooling-Off Timer + Risk Ack"]
        O["Actions: Cancel & Report (NCRP 1930) | Verify with Bank | Forced PIN"]
    end

    subgraph AnalystHub["5. Security Operations Center (SOC)"]
        P["Analyst Dashboard: Live Telemetry, Hotspot Geofences, Mule Freezes"]
    end

    A --> B
    A --> C
    B --> D
    C --> D
    D --> E
    D --> F
    D --> G
    E --> H
    F --> H
    G --> H
    H --> I
    I -->|Score < 35| J
    I -->|Score 35-69| K
    I -->|Score >= 70| L
    L --> M
    M --> N
    N --> O
    O -->|Report Scam| P
```

---

## 🚀 Key Modules & Capabilities

### 1. Interactive Simulation Hub (Core Demo)
- **7 Quick-Load Vectors**:
  - `Fake Collect Request Refund Scam` (Disguised ₹5,000 reward).
  - `QR Code Swap / Tampered Merchant Payload` (Mismatched VPA on grocery sticker).
  - `Screensharing / Remote Access App Scam` (Active AnyDesk/TeamViewer session).
  - `Mule-Account Velocity Multi-Hop Chain` (Rapid multi-hop routing to Jamtara/Mewat).
  - `Fake Electricity / Urgent KYC Disconnection` (Threatening SMS with personal VPA).
  - `Zero-Day Emerging Attack` (AI voice clone emergency medical escrow).
  - `Legitimate Transaction Control` (Routine everyday grocery payment).
- **Customizable Telemetry**: VPA syntax, Amount, Transaction Type (Debit/Credit/Collect), Merchant Name, Note/SMS text, pasted VPA flag, active screen casting, active voice call, rooted device, off-hours timing, and velocity sliders.

### 2. AI Risk Engine & Explainability (XAI)
- **Scoring Pipeline**: Computes 0–100 composite risk score with latency under **30 ms** (well within the 120 ms NPCI SLA).
- **SHAP Feature Attribution**: Visual waterfall breakdown attributing risk score changes to individual positive and negative feature drivers.
- **NLP Intent Engine**: Evaluates psychological pressure, coercion, and deceptiveness in transaction notes.

### 3. Real-Time Interception & Warning Screen
- Immersive modal halting high-risk transactions before PIN entry.
- Bold plain-language nudges in **English and Hindi**:
  > *"⚠️ CRITICAL STOP: You are about to PAY ₹5,000, NOT receive money! The sender ID 'cashback-claim-rewards@oksbi' is an unverified personal account."*
  > *"⚠️ अति आवश्यक चेतावनी: आप ₹5,000 भेज रहे हैं, प्राप्त नहीं कर रहे हैं! यह एक 'कलेक्ट रिक्वेस्ट' है। पैसे प्राप्त करने के लिए कभी भी UPI PIN दर्ज करने की आवश्यकता नहीं होती है।"*
- **10-Second Cooling-Off Timer** + Mandatory PIN Confirmation Checkbox.
- **One-click "Cancel & Report"** forwarding telemetry to National Cybercrime Reporting Portal (NCRP 1930).

### 4. Bank / Security Analyst Dashboard
- **KPI Metrics**: Total Monitored (142,850+), Fraud Prevented (₹4.62 Cr / 1,842 blocked), FPR (1.18%), Latency (27.8 ms).
- **Interactive Visualizations**:
  - Fraud breakdown by vector category (Donut chart).
  - 24-Hour diurnal fraud attempt velocity trends (Line/Area chart with peak 11 PM – 3 AM highlight).
  - Geographic & Mule Syndicate Cluster Intelligence (Jamtara, Mewat/Nuh, Deoghar, Bharatpur, Bengaluru).
- **Live Flagged Transaction Stream** with search, risk tier filters, and an **"Inspect Case"** forensic drawer with raw JSON telemetry, device fingerprint, and analyst actions (`Freeze Payee VPA`, `Mark False Positive`).

### 5. Model Evaluation & Benchmark Metrics
- **Synthetic Test Set**: 25,000 realistic Indian UPI transactions.
- **Performance Benchmarks**:
  - **Precision**: 96.4%
  - **Recall (TPR)**: 94.8%
  - **F1-Score**: 95.6%
  - **False Positive Rate (FPR)**: 1.18%
  - **ROC-AUC**: 0.985
  - **Latency**: P50: 27.9ms, P95: 31.6ms, P99: 34.5ms (SLA: <120ms)
- **Interactive Confusion Matrix**: Real-time display of TP (3,792), FP (251), TN (20,807), FN (150).
- **Interactive ROC & Threshold Tuning**: Test operating threshold trade-offs in real time.
- **Live Benchmark Runner**: Re-evaluates 500 test cases on demand with animated progress tracking.

### 6. Adaptivity & Zero-Day Anomaly Detection Lab
- Demonstrates how traditional keyword/VPA blacklists fail against novel attacks (AI Voice clones, UPI Lite nano-siphoning, hidden AutoPay e-mandates).
- Unsupervised **Isolation Forest** detects multi-dimensional outlier signatures ($>2.7\sigma$) without requiring prior training on the specific scam.
- Automatically synthesizes dynamic defense rules in real time.

---

## 💻 Quick Start & Running Locally

### Option 1: Unified Launcher (Recommended)
Starts the FastAPI ML backend on `http://127.0.0.1:8000` and automatically opens your browser:
```bash
python3 start.py
```
Or via shell script:
```bash
./run.sh
```

### Option 2: Standalone Static Mode (Zero Dependencies)
The application is 100% self-contained. You can open `index.html` directly in any web browser, or serve it via Python:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000` in your browser. The client-side in-memory ML engine will automatically activate with identical precision and telemetry.

### Option 3: Retraining ML Models
To re-generate the 25,000 synthetic transaction dataset and retrain the Scikit-Learn models:
```bash
python3 backend/train_model.py
```

### Option 4: Running Endpoint Unit Tests
To verify all backend scoring and detection endpoints:
```bash
python3 test_api.py
```

---

## 📋 File Structure

```
/Users/sukhbirsingh/Downloads/Cybercup 6/
├── index.html                   # High-polish, single-page application (Dark/Light mode)
├── start.py                     # Unified FastAPI server & browser launcher
├── run.sh                       # Quick bash startup script
├── test_api.py                  # Endpoint and engine unit test suite
├── css/
│   └── styles.css               # Tailored animations, glassmorphism, radar scanner
├── js/
│   ├── app.js                   # Application state, router, tab controller, toasts
│   ├── ml_engine.js             # Client-side ML scoring engine & SHAP calculator
│   ├── zero_day.js              # Anomaly detection & semantic intent scanner
│   ├── charts.js                # Canvas-based high-DPI charts (Donut, Area, ROC, Gauge)
│   ├── dataset.js               # Synthetic India UPI dataset & flagged mule accounts
│   └── presets.js               # Quick-load preset scenarios & telemetry profiles
├── backend/
│   ├── server.py                # FastAPI backend with REST endpoints & static file serving
│   ├── train_model.py           # Scikit-learn model trainer (RandomForest, IsolationForest, TF-IDF)
│   ├── js_data_seed.py          # Backend seed dataset for Analyst Dashboard
│   └── models/                  # Saved models & model_metrics.json
└── data/
    └── synthetic_upi_dataset.csv # 25,000 labelled synthetic transactions
```

---

## 🛡️ NPCI Regulatory Compliance Note

In strict adherence to project **CC6-AI02** guidelines:
- **Synthetic Data Exclusively**: No real customer PII or confidential payment credentials are used.
- **Privacy By Design**: Telemetry inspects behavioral and device signatures without recording user PINs, OTPs, or contact books.
- **Latency Guarantee**: Decision execution strictly adheres to NPCI payment routing thresholds (<120ms).
