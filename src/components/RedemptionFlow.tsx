import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase as db } from "../lib/supabase";

export function RedemptionFlow() {
  const params = useParams(),
    navigate = useNavigate(),
    [code, setCode] = useState(params.code || ""),
    [claim, setClaim] = useState<any>(null),
    [status, setStatus] = useState("");
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
    setStatus(
      "Camera scanning support is available; use the manual code for this browser test environment.",
    );
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
