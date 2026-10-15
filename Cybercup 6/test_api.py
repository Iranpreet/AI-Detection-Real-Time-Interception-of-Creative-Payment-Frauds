#!/usr/bin/env python3
"""
Test ShieldUPI FastAPI endpoints and scoring pipeline directly without httpx.
"""
import sys
import json
from backend.server import (
    health_check, get_metrics, score_transaction, evaluate_zero_day,
    run_benchmark_test, TransactionPayload
)

def test_endpoints():
    print("Testing health_check()...")
    h = health_check()
    assert h["status"] == "healthy"
    print("  Health OK:", h)

    print("\nTesting get_metrics()...")
    m = get_metrics()
    assert "model_performance" in m
    print("  Metrics precision:", m["model_performance"]["precision"])
    print("  Metrics recall:", m["model_performance"]["recall"])
    print("  Metrics FPR:", m["model_performance"]["fpr"])

    print("\nTesting score_transaction() for Collect Refund Scam...")
    p1 = TransactionPayload(
        amount=5000.0,
        txn_type="collect",
        payee_vpa="cashback-claim-rewards@oksbi",
        merchant_name="SBI Rewards Desk (Claim)",
        message="Enter UPI PIN to receive ₹5,000 instant cashback reward credited to your bank account!",
        pasted_vpa=True,
        active_screenshare=False,
        active_phone_call=True,
        device_rooted=False,
        late_night_hour=False,
        is_new_payee=True,
        payee_txn_count=0,
        velocity_1h=3,
        velocity_24h=7,
        ratio_amount_to_avg=5.8,
        qr_payload_tampered=False,
        is_mule_cluster=True,
        zero_day_vector=False
    )
    res1 = score_transaction(p1)
    print(f"  Score: {res1['risk_score']} | Classification: {res1['classification']} | Latency: {res1['latency_ms']}ms")
    print(f"  Nudge EN: {res1['nudges']['en'][:90]}...")
    print(f"  Nudge HI: {res1['nudges']['hi'][:90]}...")
    assert res1["classification"] == "HIGH_RISK"
    assert res1["action"] == "BLOCK_INTERCEPT"

    print("\nTesting score_transaction() for Legitimate Merchant Debit...")
    p_legit = TransactionPayload(
        amount=348.0,
        txn_type="debit",
        payee_vpa="blinkit@hdfcbank",
        merchant_name="Blinkit Retail Ltd",
        message="Groceries delivery order #BL92831",
        pasted_vpa=False,
        active_screenshare=False,
        active_phone_call=False,
        device_rooted=False,
        late_night_hour=False,
        is_new_payee=False,
        payee_txn_count=14,
        velocity_1h=0,
        velocity_24h=3,
        ratio_amount_to_avg=0.9,
        qr_payload_tampered=False,
        is_mule_cluster=False,
        zero_day_vector=False
    )
    res_legit = score_transaction(p_legit)
    print(f"  Legit Score: {res_legit['risk_score']} | Classification: {res_legit['classification']} | Latency: {res_legit['latency_ms']}ms")
    assert res_legit["classification"] == "SAFE"
    assert res_legit["action"] == "ALLOW"

    print("\nTesting evaluate_zero_day()...")
    p_zd = TransactionPayload(
        amount=28000.0,
        txn_type="debit",
        payee_vpa="novel.deepfake.voice.auth@ybl",
        merchant_name="Emergency Medical Escrow Care",
        message="Family hospital admission fee authenticated via cloned audio snippet",
        pasted_vpa=True,
        active_screenshare=False,
        active_phone_call=True,
        device_rooted=False,
        late_night_hour=True,
        is_new_payee=True,
        payee_txn_count=0,
        velocity_1h=3,
        velocity_24h=6,
        ratio_amount_to_avg=7.2,
        qr_payload_tampered=False,
        is_mule_cluster=False,
        zero_day_vector=True
    )
    res_zd = evaluate_zero_day(p_zd)
    print("  Traditional Rule Verdict:", res_zd["traditional_rule_engine"]["verdict"])
    print("  Unsupervised Anomaly Verdict:", res_zd["unsupervised_anomaly_engine"]["verdict"])
    print("  Synthesized Dynamic Rule:", res_zd["dynamic_rule_generated"]["rule_id"])
    assert res_zd["traditional_rule_engine"]["passed"] == True # Scam evaded traditional rules!
    assert res_zd["unsupervised_anomaly_engine"]["flagged"] == True # Intercepted by unsupervised engine!

    print("\nTesting run_benchmark_test()...")
    res_bench = run_benchmark_test()
    print("  Live Benchmark Results:", res_bench)
    assert res_bench["status"] == "COMPLETED"

    print("\n✅ ALL TEST CASES & ENGINE LOGIC PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
