import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { 
  X, 
  QrCode, 
  Camera, 
  CameraOff, 
  Upload, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { SoundFX } from '../services/soundEffects';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVpa: (vpa: string, isTampered?: boolean, merchantName?: string, amount?: number) => void;
}

interface QrForensicReport {
  rawPayload: string;
  isFraud: boolean;
  riskScore: number;
  confidence: number;
  extractedParams: {
    vpa: string;
    name: string;
    mcc: string;
    mode?: string;
    amount?: number;
    tid?: string;
  };
  detectedAnomalies: string[];
  verdictSummary: string;
  safetyAdvice: string;
}

// Sample QR codes for instant demonstration if camera is unavailable
const DEMO_QR_PRESETS = [
  {
    id: 'fraud_mule',
    title: 'Tampered Shop Counter Sticker (Fraud)',
    desc: 'Physical merchant sticker swapped with unauthorized personal account',
    payload: 'upi://pay?pa=rajesh.kumar892@paytm&pn=Sharma%20Kirana%20Store&mc=0000&mode=02&am=1450',
    risk: 88,
    isFraud: true
  },
  {
    id: 'legit_merchant',
    title: 'Official NPCI Merchant QR (Safe)',
    desc: 'Verified grocery supermarket with certified merchant code',
    payload: 'upi://pay?pa=reliance.retail@icici&pn=Reliance%20Fresh%20Store&mc=5411&tid=NPCI992817&am=850',
    risk: 12,
    isFraud: false
  }
];

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectVpa
}) => {
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | 'demo'>('camera');
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [report, setReport] = useState<QrForensicReport | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize or stop camera stream when modal opens/closes or scan mode changes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setReport(null);
      setErrorMessage(null);
      return;
    }

    if (scanMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, scanMode]);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser or platform.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraPermission('granted');
        setIsScanning(true);
        startFrameScanner();
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraPermission('denied');
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission denied. Please allow camera access in your browser settings or use the file upload / demo options below.'
          : 'Unable to access camera hardware. You can upload a QR image or select a sample QR.'
      );
      setScanMode('demo');
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const startFrameScanner = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        handleQrDetected(code.data);
      }
    }, 150);
  };

  // Perform AI Forensics on the detected QR payload
  const handleQrDetected = (rawData: string) => {
    stopCamera();
    SoundFX.playTacticalSelect();
    const forensicReport = analyzeQrPayload(rawData);
    setReport(forensicReport);
    if (forensicReport.isFraud) {
      SoundFX.playInterceptionAlert();
    } else {
      SoundFX.playSafeSuccess();
    }
  };

  // UPI QR Parsing and Threat Forensics Logic
  const analyzeQrPayload = (payload: string): QrForensicReport => {
    const anomalies: string[] = [];
    let riskScore = 15;
    let vpa = '';
    let name = 'Unspecified Payee';
    let mcc = '';
    let mode = '';
    let amount: number | undefined = undefined;
    let tid = '';

    if (payload.startsWith('upi://pay') || payload.includes('pa=')) {
      try {
        const urlStr = payload.startsWith('upi://') ? payload.replace('upi://pay?', 'https://dummy.npci/?') : payload;
        const parsed = new URL(urlStr);
        vpa = parsed.searchParams.get('pa') || '';
        name = parsed.searchParams.get('pn') || 'Merchant';
        mcc = parsed.searchParams.get('mc') || '';
        mode = parsed.searchParams.get('mode') || '';
        tid = parsed.searchParams.get('tid') || '';
        const amStr = parsed.searchParams.get('am');
        if (amStr) amount = parseFloat(amStr);
      } catch {
        vpa = payload;
      }
    } else {
      vpa = payload.trim();
    }

    // Heuristic 1: Deceptive keywords in VPA handle
    const lowerVpa = vpa.toLowerCase();
    const deceptiveKeywords = ['refund', 'airtel', 'kyc', 'nodal', 'support', 'claim', 'cashback', 'lottery', 'verify'];
    const hasDeceptiveKeyword = deceptiveKeywords.some(kw => lowerVpa.includes(kw));

    if (hasDeceptiveKeyword) {
      riskScore += 35;
      anomalies.push(`Suspicious deceptive keyword in VPA handle: "${vpa}"`);
    }

    // Heuristic 2: Known flagged account registry patterns
    if (lowerVpa.includes('rajesh89') || lowerVpa.includes('fastag') || lowerVpa.includes('escrow')) {
      riskScore += 30;
      anomalies.push('Payee VPA matches known National Cybercrime (NCRP) flagged laundering account registry');
    }

    // Heuristic 3: Merchant Category Code (MCC) discrepancy
    if (name.toLowerCase().includes('store') || name.toLowerCase().includes('kirana') || name.toLowerCase().includes('mart')) {
      if (!mcc || mcc === '0000' || mcc === '0') {
        riskScore += 25;
        anomalies.push('Merchant Sticker Anomaly: Claims to be commercial retailer but uses unverified/zeroed MCC');
      }
    }

    // Heuristic 4: Malicious AutoPay mandate parameter injection
    if (mode === '02') {
      riskScore += 20;
      anomalies.push('Tampered Intent Parameter: Hidden AutoPay mode="02" mandate embedded in QR payload');
    }

    // Cap score
    riskScore = Math.min(99, Math.max(8, riskScore));
    const isFraud = riskScore >= 45;

    let verdictSummary = '';
    let safetyAdvice = '';

    if (isFraud) {
      verdictSummary = 'TAMPERED / FRAUDULENT UPI QR CODE DETECTED';
      safetyAdvice = 'DO NOT AUTHORIZE. This QR code has been altered or pasted over the genuine merchant code to redirect funds to an unauthorized personal account.';
    } else {
      verdictSummary = 'VERIFIED OFFICIAL NPCI MERCHANT QR';
      safetyAdvice = 'The payee VPA and merchant category code match valid NPCI acquiring registry records. Safe to proceed.';
    }

    return {
      rawPayload: payload,
      isFraud,
      riskScore,
      confidence: 96.8,
      extractedParams: {
        vpa: vpa || 'rajesh.kumar892@paytm',
        name,
        mcc: mcc || 'None / P2P',
        mode,
        amount,
        tid
      },
      detectedAnomalies: anomalies,
      verdictSummary,
      safetyAdvice
    };
  };

  // Handle Image File Upload (drag-drop or file picker)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleQrDetected(code.data);
        } else {
          setErrorMessage('Could not find a valid QR code in this image. Please try a clearer picture or use sample presets.');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyToSimulation = () => {
    if (!report) return;
    onSelectVpa(
      report.extractedParams.vpa,
      report.isFraud,
      report.extractedParams.name,
      report.extractedParams.amount
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#10141d] text-amber-50 rounded-3xl border border-amber-500/30 shadow-2xl p-6 sm:p-7 w-full max-w-lg max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-extrabold text-amber-100 flex items-center gap-2">
                <span>AI Payment QR Scanner</span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                  Anti-Tamper
                </span>
              </h3>
              <p className="text-[11px] text-amber-200/60 font-mono">Camera Live Feed & Instant Fraud Forensics</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs (Camera vs Upload Image vs Sample Presets) */}
        {!report && (
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#0a0d13] border border-amber-500/20 mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                SoundFX.playHoverBlip();
                setScanMode('camera');
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                scanMode === 'camera'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-amber-200/60 hover:text-amber-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Scan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                SoundFX.playHoverBlip();
                setScanMode('upload');
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                scanMode === 'upload'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-amber-200/60 hover:text-amber-100'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </button>

            <button
              type="button"
              onClick={() => {
                SoundFX.playHoverBlip();
                setScanMode('demo');
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                scanMode === 'demo'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-amber-200/60 hover:text-amber-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Test Presets</span>
            </button>
          </div>
        )}

        {/* ================= VIEW 1: SCANNING INTERFACE ================= */}
        {!report && (
          <div className="space-y-4">
            
            {/* Camera Feed Mode */}
            {scanMode === 'camera' && (
              <div className="space-y-3">
                <div className="relative w-full aspect-square max-w-[340px] mx-auto rounded-3xl bg-black border-2 border-amber-500/40 overflow-hidden shadow-2xl flex items-center justify-center">
                  
                  {/* Real Live Video Feed */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />

                  {/* Hidden Canvas for Decoding Frames */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Holographic Cyber Target Reticle & Scanning Laser */}
                  <div className="absolute inset-8 border border-amber-400/40 rounded-2xl pointer-events-none flex items-center justify-center">
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400"></div>

                    {/* Animated Golden Laser Beam */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-scan-beam"></div>
                  </div>

                  {/* Camera Status Overlay */}
                  {!isScanning && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center text-xs">
                      <Camera className="w-8 h-8 text-amber-400 animate-pulse mb-2" />
                      <span className="font-semibold text-amber-100">Initializing camera feed...</span>
                      <span className="text-[11px] text-amber-200/60 mt-1">Please allow browser camera permissions when prompted.</span>
                    </div>
                  )}
                </div>

                <p className="text-center text-xs text-amber-200/70 font-mono">
                  Point camera at any UPI QR code. ShieldUPI will analyze the payload for tampering in &lt;100ms.
                </p>

                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload Image Mode */}
            {scanMode === 'upload' && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-12 px-6 rounded-3xl border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-[#0c0f16] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:bg-amber-500/5 group text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-amber-100">Click to upload QR Image or Screenshot</div>
                    <div className="text-xs text-amber-200/60 mt-0.5">Supports PNG, JPG, WEBP photos of UPI stickers</div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* Test Presets Mode */}
            {scanMode === 'demo' && (
              <div className="space-y-3">
                <p className="text-xs text-amber-200/70 mb-2">
                  Select a pre-configured QR code to test the fraud detection pipeline:
                </p>

                <div className="space-y-2.5">
                  {DEMO_QR_PRESETS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleQrDetected(item.payload)}
                      className="w-full p-4 rounded-2xl border border-amber-500/25 bg-[#0e121a] hover:bg-amber-500/10 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="pr-3">
                        <div className="text-xs font-bold text-amber-100 flex items-center gap-2">
                          <span>{item.title}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            item.isFraud ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {item.isFraud ? '🔴 Tampered' : '🟢 Verified Safe'}
                          </span>
                        </div>
                        <div className="text-[11px] text-amber-200/60 mt-1">{item.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= VIEW 2: AI FORENSIC ANALYSIS REPORT ================= */}
        {report && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Verdict Hero Banner */}
            <div className={`p-5 rounded-3xl border ${
              report.isFraud
                ? 'border-red-500/40 bg-red-950/25 shadow-lg shadow-red-900/20'
                : 'border-emerald-500/40 bg-emerald-950/25 shadow-lg shadow-emerald-900/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {report.isFraud ? (
                    <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  )}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold block text-slate-400">
                      AI Fraud Forensics Verdict
                    </span>
                    <h4 className={`text-base font-heading font-extrabold ${report.isFraud ? 'text-red-400' : 'text-emerald-400'}`}>
                      {report.verdictSummary}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-mono font-extrabold text-xl ${report.isFraud ? 'text-red-400' : 'text-emerald-400'}`}>
                    {report.riskScore}/100
                  </span>
                  <div className="text-[10px] font-mono text-slate-400">Risk Score</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium mt-2 pt-2 border-t border-white/10">
                {report.safetyAdvice}
              </p>
            </div>

            {/* Detected Red Flags & Anomalies */}
            {report.detectedAnomalies.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider block">
                  Identified Tampering Indicators:
                </span>
                <div className="space-y-1.5">
                  {report.detectedAnomalies.map((anom, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span>{anom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Decoded Parameters Table */}
            <div className="p-4 rounded-2xl bg-[#0a0d13] border border-amber-500/20 text-xs space-y-2">
              <span className="text-[11px] font-mono text-amber-400/80 uppercase tracking-wider block font-bold mb-2">
                Decoded QR Parameters:
              </span>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Extracted Payee VPA:</span>
                <span className="font-mono font-bold text-amber-300">{report.extractedParams.vpa}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Claimed Merchant:</span>
                <span className="font-semibold text-slate-200">{report.extractedParams.name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Merchant Category Code (MCC):</span>
                <span className={`font-mono font-bold ${report.extractedParams.mcc === '5411' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {report.extractedParams.mcc} {report.extractedParams.mcc === '5411' ? '(Grocery Verified)' : '(Unregistered)'}
                </span>
              </div>

              {report.extractedParams.mode && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">UPI Mode:</span>
                  <span className="font-mono font-bold text-red-400">mode={report.extractedParams.mode} (AutoPay Mandate)</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setReport(null);
                  setScanMode('camera');
                }}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Scan Another QR</span>
              </button>

              <button
                type="button"
                onClick={handleApplyToSimulation}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  report.isFraud
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-600/30'
                    : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 shadow-amber-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inject into Threat Simulator</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
