import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase as db } from "../lib/supabase";

export function RedemptionFlow() {
  const params = useParams(),
    navigate = useNavigate(),
    [code, setCode] = useState(params.code || ""),
    [claim, setClaim] = useState<any>(null),
    [status, setStatus] = useState(""),
    [scanning, setScanning] = useState(false),
    video = useRef<HTMLVideoElement>(null),
    stream = useRef<MediaStream | null>(null);
  function stopCamera() {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    setScanning(false);
  }
  async function validate(value = code) {
    if (!db || !value) return;
    const { data, error } = await db.rpc("validate_redemption_code", {
      p_code: value.trim(),
    });
    if (error || !data?.length) {
      setClaim(null);
      return setStatus(
        error?.message ||
          "Code is invalid, expired, used, or belongs to another Partner.",
      );
    }
    setClaim(data[0]);
    setStatus("Valid claim. Confirm only after the offer was used.");
  }
  useEffect(() => {
    if (params.code) void validate(params.code);
    return stopCamera;
  }, [params.code]);
  async function confirm() {
    if (!db || !claim) return;
    const { data, error } = await db.rpc("confirm_redemption", {
      p_code: code.trim(),
      p_location_id: null,
    });
    if (error) return setStatus(error.message);
    setClaim(null);
    setStatus(
      `Utilization confirmed. Record ${data}. This is a redemption, not a verified savings total.`,
    );
  }
  async function scan() {
    if (!navigator.mediaDevices || !("BarcodeDetector" in window))
      return setStatus(
        "Camera scanning is unavailable here. Enter the code below instead.",
      );
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setScanning(true);
      setStatus("Point the camera at the ShelterPawtners redemption QR.");
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!video.current) return;
      video.current.srcObject = stream.current;
      await video.current.play();
      const Detector = (window as any).BarcodeDetector;
      const detector = new Detector({ formats: ["qr_code"] });
      const deadline = Date.now() + 30_000;
      while (Date.now() < deadline && stream.current) {
        const [result] = await detector.detect(video.current);
        if (result?.rawValue) {
          let value = result.rawValue as string;
          try {
            value =
              new URL(value).pathname.split("/").filter(Boolean).at(-1) ||
              value;
          } catch {
            // A raw opaque code is also a supported QR payload.
          }
          setCode(value);
          stopCamera();
          navigate(`/redeem/${value}`, { replace: true });
          await validate(value);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      stopCamera();
      setStatus("No code was detected. Enter the code below instead.");
    } catch {
      stopCamera();
      setStatus(
        "Camera permission was unavailable. Enter the code below instead.",
      );
    }
  }
  return (
    <section className="section shell formPage">
      <span className="eyebrow">Partner redemption</span>
      <h1>Validate, then confirm utilization.</h1>
      <p className="lead">
        Scan/open → validate → confirm. No customer search or re-entry.
      </p>
      <div className="panel">
        <button className="btn quiet" onClick={scan}>
          Scan QR with camera
        </button>
        {scanning && (
          <div>
            <video
              ref={video}
              muted
              playsInline
              aria-label="QR camera preview"
            />
            <button className="textButton" onClick={stopCamera}>
              Stop camera
            </button>
          </div>
        )}
        <label>
          Manual redemption code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
          />
        </label>
        <button
          className="btn quiet"
          onClick={() => {
            navigate(`/redeem/${code.trim()}`, { replace: true });
            void validate();
          }}
        >
          Validate code
        </button>
        {claim && (
          <div className="card">
            <h2>{claim.offer_title}</h2>
            <p>{claim.business_name}</p>
            <p>Claim status: {claim.status}</p>
            <p>Expires {new Date(claim.expires_at).toLocaleString()}</p>
            <button className="btn" onClick={confirm}>
              Confirm utilization
            </button>
          </div>
        )}
        <p role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </section>
  );
}
