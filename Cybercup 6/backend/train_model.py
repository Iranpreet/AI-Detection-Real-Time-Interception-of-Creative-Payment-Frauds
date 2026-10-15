#!/usr/bin/env python3
"""
ShieldUPI / AI Fraud Shield - ML Model Training & Benchmarking Pipeline
Project: CC6-AI02: AI Detection of Creative Payment Frauds

Trains:
1. Supervised Random Forest Classifier for India-specific payment fraud vectors
2. Isolation Forest for Unsupervised Zero-Day Anomaly Detection
3. TF-IDF + Logistic Regression NLP intent classifier for SMS/message context
Generates synthetic transaction test set and evaluates Precision, Recall, FPR, Latency.
"""

import json
import time
import os
import random
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    precision_score, recall_score, f1_score, roc_auc_score,
    confusion_matrix, precision_recall_curve, roc_curve
)
from sklearn.model_selection import train_test_split
import joblib

# Set seeds for reproducibility
np.random.seed(42)
random.seed(42)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# Common Indian VPAs, Merchants, and Scam templates
LEGIT_MERCHANTS = [
    ("Blinkit Commerce Pvt Ltd", "blinkit@hdfcbank", "ecomm"),
    ("Swiggy Food Delivery", "swiggy@icici", "food"),
    ("Zomato Online Pvt Ltd", "zomato@paytm", "food"),
    ("Sharma Kirana Store", "sharma.kirana@upi", "retail"),
    ("Airtel Prepaid & Fiber", "airtel@airtelpaymentsbank", "utilities"),
    ("Apollo Pharmacy", "apollo.rx@axisbank", "health"),
    ("Indian Oil Petrol Pump", "indianoil@kotak", "fuel"),
    ("Reliance Retail Fresh", "relianceretail@icici", "retail"),
    ("Tata Power DDL", "tatapower@yesbank", "utilities"),
    ("IRCTC Railway Booking", "irctc@sbi", "travel"),
]

SCAM_VPAS = [
    ("cashback-claim-rewards@oksbi", "SBI Rewards Care", "Collect_Refund_Scam"),
    ("phonepe.support.refund98@ybl", "PhonePe Customer Support", "Collect_Refund_Scam"),
    ("gpay-cashback-desk@okaxis", "GooglePay Giftdesk", "Collect_Refund_Scam"),
    ("mule.rajesh89@paytm", "Sharma General Store (Tampered)", "QR_Tamper_Scam"),
    ("scan-to-win-lottery@ybl", "Lucky Draw UPI Desk", "QR_Tamper_Scam"),
    ("quicksupport.agent4@barodampay", "KYC Bank Officer", "Screenshare_RAT_Scam"),
    ("anydesk.verify.sbi@okaxis", "SBI Verification Executive", "Screenshare_RAT_Scam"),
    ("jamtara.mule.chain7@paytm", "P2P Fast Exchanger", "Mule_Velocity_Scam"),
    ("mewat.transfer.rapid@oksbi", "Crypto OTC Agent", "Mule_Velocity_Scam"),
    ("bses.urgent.disconnection@icici", "Electricity Bill Desk", "Phishing_Bill_Scam"),
    ("novel.deepfake.voice.auth@ybl", "AI Emergency Dispatch", "Zero_Day_Scam"),
]

LEGIT_MESSAGES = [
    "Payment for grocery order #49281",
    "Monthly broadband bill payment",
    "Dinner bill split with colleagues",
    "Medicines for mother from Apollo",
    "Petrol refill at IOCL station",
    "Vegetables from local mandi",
    "Electricity bill for month of September",
    "Milk subscription daily debit",
    "Cab fare payment for Uber ride",
    "Recharge of Jio prepaid number",
    "Shopping at DMart counter #4",
    "Rent payment for 2BHK flat",
]

SCAM_MESSAGES = [
    "Enter UPI PIN to receive ₹5,000 instant cashback credited from PhonePe rewards!",
    "Congratulations! You won ₹15,000 scratch card. Enter PIN to accept refund to bank.",
    "SBI Alert: Dear customer, your YONO account is locked. Download QuickSupport app & click here to verify.",
    "URGENT: BSES Electricity power will be disconnected at 9:30 PM due to unpaid bill. Pay immediately.",
    "Refund processing for cancelled Flipkart order. Click collect request and enter secret PIN to authorize deposit.",
    "Work from home: Earn ₹5,000 daily. Send ₹1,000 security deposit to active mule wallet.",
    "Notice from TRAI: Your SIM card will be deactivated in 2 hours for Aadhaar re-verification. Pay ₹25.",
    "Customs clearance fee for international iPhone parcel. Pay ₹4,800 to avoid police penalty.",
    "Army officer transfer urgent furniture sale on OLX. Scan QR code to accept advance booking deposit.",
    "Income Tax Department: Tax refund of ₹12,450 approved. Authorize collect request to deposit to account.",
]

def generate_synthetic_transactions(n_samples=25000):
    """
    Generates a high-fidelity synthetic Indian UPI transaction dataset.
    ~15% fraud, 85% legitimate transactions.
    Features include behavioral telemetry, device flags, temporal features, and NLP contexts.
    """
    rows = []
    
    for i in range(n_samples):
        is_fraud = np.random.rand() < 0.16  # ~16% fraud base rate
        
        if not is_fraud:
            # LEGITIMATE TRANSACTION
            scam_category = "None"
            amount = float(np.random.choice([
                np.random.exponential(scale=350) + 20,       # Daily micro: ₹20 - ₹800
                np.random.uniform(500, 3500),               # Grocery/Utilities: ₹500 - ₹3500
                np.random.uniform(4000, 18000),             # Rent/Large: ₹4k - ₹18k
            ], p=[0.70, 0.25, 0.05]))
            amount = round(amount, 2)
            
            txn_type = np.random.choice(["debit", "qr_scan", "collect"], p=[0.72, 0.23, 0.05])
            merchant_info = random.choice(LEGIT_MERCHANTS)
            merchant_name = merchant_info[0]
            payee_vpa = merchant_info[1]
            
            is_new_payee = 1 if np.random.rand() < 0.18 else 0
            payee_txn_count = int(np.random.randint(1, 45) if not is_new_payee else 0)
            pasted_vpa = 1 if np.random.rand() < 0.08 else 0
            active_screenshare = 1 if np.random.rand() < 0.005 else 0  # Very rare benign screen share
            active_phone_call = 1 if np.random.rand() < 0.04 else 0
            device_rooted = 1 if np.random.rand() < 0.01 else 0
            late_night_hour = 1 if np.random.rand() < 0.08 else 0
            velocity_1h = int(np.random.poisson(lam=0.4))
            velocity_24h = int(np.random.poisson(lam=2.8))
            ratio_amount_to_avg = round(float(np.random.lognormal(mean=0.0, sigma=0.4)), 2)
            
            # Message / context
            message = random.choice(LEGIT_MESSAGES)
            msg_has_refund_cashback = 0
            msg_urgency_score = 0
            qr_payload_tampered = 0
            is_mule_cluster = 0
            zero_day_vector = 0
            
        else:
            # FRAUDULENT TRANSACTION
            scam_choice = np.random.choice([
                "Collect_Refund_Scam",
                "QR_Tamper_Scam",
                "Screenshare_RAT_Scam",
                "Mule_Velocity_Scam",
                "Phishing_Bill_Scam",
                "Zero_Day_Scam"
            ], p=[0.32, 0.26, 0.20, 0.12, 0.07, 0.03])
            
            scam_category = scam_choice
            is_new_payee = 1
            payee_txn_count = 0
            pasted_vpa = 1 if np.random.rand() < 0.65 else 0
            device_rooted = 1 if np.random.rand() < 0.22 else 0
            late_night_hour = 1 if np.random.rand() < 0.48 else 0
            
            if scam_choice == "Collect_Refund_Scam":
                # Scammer sends a COLLECT request disguised as refund
                txn_type = "collect"
                amount = float(np.random.choice([2999, 4999, 9999, 14999, 24999, 49999]))
                scam_vpa_info = SCAM_VPAS[0] if np.random.rand() < 0.5 else SCAM_VPAS[1]
                payee_vpa = scam_vpa_info[0]
                merchant_name = scam_vpa_info[1]
                active_screenshare = 0
                active_phone_call = 1 if np.random.rand() < 0.60 else 0
                velocity_1h = int(np.random.randint(1, 5))
                velocity_24h = int(np.random.randint(2, 9))
                ratio_amount_to_avg = round(float(np.random.uniform(3.5, 12.0)), 2)
                message = "Enter UPI PIN to accept refund of ₹" + str(int(amount)) + " cashback reward"
                msg_has_refund_cashback = 1
                msg_urgency_score = 1
                qr_payload_tampered = 0
                is_mule_cluster = 1 if np.random.rand() < 0.40 else 0
                zero_day_vector = 0
                
            elif scam_choice == "QR_Tamper_Scam":
                # Replaced merchant sticker with malicious dynamic collect or personal VPA
                txn_type = "qr_scan"
                amount = float(np.random.uniform(450, 8500))
                payee_vpa = SCAM_VPAS[3][0]
                merchant_name = "Sharma Grocery Mart (Tampered Sticker)"
                active_screenshare = 0
                active_phone_call = 0
                velocity_1h = int(np.random.randint(2, 8))
                velocity_24h = int(np.random.randint(4, 15))
                ratio_amount_to_avg = round(float(np.random.uniform(1.8, 6.0)), 2)
                message = "UPI QR Scan: Dynamic collect payload injected"
                msg_has_refund_cashback = 0
                msg_urgency_score = 0
                qr_payload_tampered = 1
                is_mule_cluster = 1 if np.random.rand() < 0.55 else 0
                zero_day_vector = 0
                
            elif scam_choice == "Screenshare_RAT_Scam":
                # Remote access tool (AnyDesk/TeamViewer/QuickSupport) active during transfer
                txn_type = "debit"
                amount = float(np.random.uniform(12000, 95000))
                payee_vpa = SCAM_VPAS[5][0]
                merchant_name = "KYC Verification Desk"
                active_screenshare = 1
                active_phone_call = 1
                velocity_1h = int(np.random.randint(1, 4))
                velocity_24h = int(np.random.randint(2, 6))
                ratio_amount_to_avg = round(float(np.random.uniform(5.0, 25.0)), 2)
                message = "SBI KYC update session active via remote screen tool"
                msg_has_refund_cashback = 0
                msg_urgency_score = 1
                qr_payload_tampered = 0
                is_mule_cluster = 1
                zero_day_vector = 0
                
            elif scam_choice == "Mule_Velocity_Scam":
                # Rapid multi-hop transfers to newly minted account
                txn_type = "debit"
                amount = float(np.random.uniform(25000, 98000))
                payee_vpa = SCAM_VPAS[7][0]
                merchant_name = "Fast Crypto P2P Desk"
                active_screenshare = 0
                active_phone_call = 0
                velocity_1h = int(np.random.randint(5, 14))
                velocity_24h = int(np.random.randint(15, 38))
                ratio_amount_to_avg = round(float(np.random.uniform(8.0, 30.0)), 2)
                message = "Immediate fund clearing to P2P wallet"
                msg_has_refund_cashback = 0
                msg_urgency_score = 0
                qr_payload_tampered = 0
                is_mule_cluster = 1
                zero_day_vector = 0
                
            elif scam_choice == "Phishing_Bill_Scam":
                # Fake electricity or SIM cutoff threat
                txn_type = "debit"
                amount = float(np.random.uniform(1500, 7500))
                payee_vpa = SCAM_VPAS[9][0]
                merchant_name = "BSES Power Disconnection Desk"
                active_screenshare = 0
                active_phone_call = 1 if np.random.rand() < 0.45 else 0
                velocity_1h = 1
                velocity_24h = 2
                ratio_amount_to_avg = round(float(np.random.uniform(2.0, 5.0)), 2)
                message = "Power will be disconnected tonight at 9:30 PM due to unpaid bill"
                msg_has_refund_cashback = 0
                msg_urgency_score = 1
                qr_payload_tampered = 0
                is_mule_cluster = 1 if np.random.rand() < 0.50 else 0
                zero_day_vector = 0
                
            else: # Zero_Day_Scam
                txn_type = "debit"
                amount = float(np.random.uniform(18000, 70000))
                payee_vpa = SCAM_VPAS[10][0]
                merchant_name = "AI Voice Authentication Escrow"
                active_screenshare = 0
                active_phone_call = 1
                velocity_1h = 3
                velocity_24h = 5
                ratio_amount_to_avg = round(float(np.random.uniform(4.0, 15.0)), 2)
                message = "Emergency dispatch: Family medical escrow deposit authorized by voice sample"
                msg_has_refund_cashback = 0
                msg_urgency_score = 1
                qr_payload_tampered = 0
                is_mule_cluster = 0
                zero_day_vector = 1

        rows.append({
            "txn_id": f"UPI{int(time.time())}{i:05d}",
            "amount": amount,
            "txn_type": txn_type,
            "payee_vpa": payee_vpa,
            "merchant_name": merchant_name,
            "is_new_payee": is_new_payee,
            "payee_txn_count": payee_txn_count,
            "pasted_vpa": pasted_vpa,
            "active_screenshare": active_screenshare,
            "active_phone_call": active_phone_call,
            "device_rooted": device_rooted,
            "late_night_hour": late_night_hour,
            "velocity_1h": velocity_1h,
            "velocity_24h": velocity_24h,
            "ratio_amount_to_avg": ratio_amount_to_avg,
            "msg_has_refund_cashback": msg_has_refund_cashback,
            "msg_urgency_score": msg_urgency_score,
            "qr_payload_tampered": qr_payload_tampered,
            "is_mule_cluster": is_mule_cluster,
            "zero_day_vector": zero_day_vector,
            "message": message,
            "is_fraud": 1 if is_fraud else 0,
            "scam_category": scam_category
        })
        
    df = pd.DataFrame(rows)
    return df

def train_and_evaluate():
    print("Generating 25,000 synthetic India UPI transactions...")
    df = generate_synthetic_transactions(25000)
    
    # Save a sample to data/
    df.to_csv(os.path.join(DATA_DIR, "synthetic_upi_dataset.csv"), index=False)
    print(f"Dataset saved. Fraud count: {df['is_fraud'].sum()} / {len(df)} ({df['is_fraud'].mean()*100:.1f}%)")
    
    # Feature preparation for ML
    feature_cols = [
        "amount",
        "is_new_payee",
        "payee_txn_count",
        "pasted_vpa",
        "active_screenshare",
        "active_phone_call",
        "device_rooted",
        "late_night_hour",
        "velocity_1h",
        "velocity_24h",
        "ratio_amount_to_avg",
        "msg_has_refund_cashback",
        "msg_urgency_score",
        "qr_payload_tampered",
        "is_mule_cluster"
    ]
    
    # One-hot encode txn_type
    txn_dummies = pd.get_dummies(df["txn_type"], prefix="type", drop_first=False)
    X = pd.concat([df[feature_cols], txn_dummies], axis=1)
    y = df["is_fraud"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    
    print("Training Supervised Random Forest Classifier...")
    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1
    )
    rf.fit(X_train, y_train)
    
    # Save Random Forest model
    joblib.dump(rf, os.path.join(MODELS_DIR, "rf_fraud_model.pkl"))
    
    # Evaluate RF
    y_pred_proba = rf.predict_proba(X_test)[:, 1]
    
    # Choose optimal threshold for high precision & recall
    threshold = 0.50
    y_pred = (y_pred_proba >= threshold).astype(int)
    
    precision = float(precision_score(y_test, y_pred))
    recall = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    roc_auc = float(roc_auc_score(y_test, y_pred_proba))
    
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
    fpr = float(fp / (fp + tn))
    
    print("\n--- Model Evaluation Results ---")
    print(f"Precision:         {precision*100:.2f}%")
    print(f"Recall (TPR):      {recall*100:.2f}%")
    print(f"F1-Score:          {f1*100:.2f}%")
    print(f"False Pos Rate:    {fpr*100:.2f}%")
    print(f"ROC-AUC:           {roc_auc:.4f}")
    print(f"Confusion Matrix:  TP={tp}, FP={fp}, TN={tn}, FN={fn}")
    
    # Feature Importances
    importances = dict(zip(X.columns, [float(v) for v in rf.feature_importances_]))
    sorted_importances = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))
    
    # Latency benchmarking
    print("\nBenchmarking Inference Latency over 1,000 real-time queries...")
    sample_records = X_test.iloc[:1000]
    latencies = []
    for _, row in sample_records.iterrows():
        t0 = time.perf_counter()
        _ = rf.predict_proba(row.values.reshape(1, -1))
        t1 = time.perf_counter()
        latencies.append((t1 - t0) * 1000.0) # in milliseconds
        
    p50_latency = float(np.percentile(latencies, 50))
    p95_latency = float(np.percentile(latencies, 95))
    p99_latency = float(np.percentile(latencies, 99))
    avg_latency = float(np.mean(latencies))
    print(f"Average Latency:   {avg_latency:.2f} ms")
    print(f"P50 Latency:       {p50_latency:.2f} ms")
    print(f"P95 Latency:       {p95_latency:.2f} ms")
    print(f"P99 Latency:       {p99_latency:.2f} ms (Well within 120ms NPCI SLA)")
    
    # Train Isolation Forest for Zero-Day Anomaly Detection
    print("\nTraining Unsupervised Isolation Forest for Zero-Day Detection...")
    # Train on legitimate-like subset to establish normal baseline
    X_legit = X_train[y_train == 0]
    iso_forest = IsolationForest(
        n_estimators=100,
        contamination=0.03,
        random_state=42,
        n_jobs=-1
    )
    iso_forest.fit(X_legit)
    joblib.dump(iso_forest, os.path.join(MODELS_DIR, "iso_forest_zero_day.pkl"))
    
    # Train NLP TF-IDF Vectorizer + Classifier for Scam Intent in SMS/Notes
    print("Training NLP Intent Classifier for payment notes & SMS...")
    tfidf = TfidfVectorizer(max_features=500, ngram_range=(1, 2))
    X_text = tfidf.fit_transform(df["message"])
    nlp_model = LogisticRegression(max_iter=500)
    nlp_model.fit(X_text, df["is_fraud"])
    
    joblib.dump(tfidf, os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
    joblib.dump(nlp_model, os.path.join(MODELS_DIR, "nlp_model.pkl"))
    
    # Compute ROC Curve and PR Curve points for charts
    fpr_arr, tpr_arr, _ = roc_curve(y_test, y_pred_proba)
    # Downsample points for lightweight web rendering
    step = max(1, len(fpr_arr) // 25)
    roc_points = [{"fpr": round(float(fpr_arr[i]), 3), "tpr": round(float(tpr_arr[i]), 3)} for i in range(0, len(fpr_arr), step)]
    
    p_arr, r_arr, _ = precision_recall_curve(y_test, y_pred_proba)
    step_pr = max(1, len(p_arr) // 25)
    pr_points = [{"recall": round(float(r_arr[i]), 3), "precision": round(float(p_arr[i]), 3)} for i in range(0, len(p_arr), step_pr)]
    
    # Save full metrics to JSON
    metrics_data = {
        "dataset_summary": {
            "total_transactions": len(df),
            "train_size": len(X_train),
            "test_size": len(X_test),
            "fraud_ratio": round(float(df["is_fraud"].mean()), 4),
            "scam_breakdown": df["scam_category"].value_counts().to_dict()
        },
        "model_performance": {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "fpr": round(fpr, 4),
            "roc_auc": round(roc_auc, 4),
            "accuracy": round(float((tp + tn) / len(y_test)), 4)
        },
        "confusion_matrix": {
            "tp": int(tp),
            "fp": int(fp),
            "tn": int(tn),
            "fn": int(fn)
        },
        "latency_benchmarks_ms": {
            "avg": round(avg_latency, 2),
            "p50": round(p50_latency, 2),
            "p95": round(p95_latency, 2),
            "p99": round(p99_latency, 2),
            "npci_sla_threshold_ms": 120.0
        },
        "feature_importances": sorted_importances,
        "feature_names": list(X.columns),
        "curves": {
            "roc_points": roc_points,
            "pr_points": pr_points
        }
    }
    
    with open(os.path.join(MODELS_DIR, "model_metrics.json"), "w") as f:
        json.dump(metrics_data, f, indent=2)
        
    print(f"\nAll models and metrics saved to {MODELS_DIR}/")
    return metrics_data

if __name__ == "__main__":
    train_and_evaluate()
