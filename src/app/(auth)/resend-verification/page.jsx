"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resendVerificationEmail } from "@/lib/boemApi";

function ResendVerificationContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegistered = searchParams.get("registered") === "true";
  const wasSent = searchParams.get("sent") !== "false";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await resendVerificationEmail(email);
      setMessage(data.message || "Verification email sent. Check your inbox.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", textAlign: "center" }}>
      <h2>Resend Verification Email</h2>

      {isRegistered && (
        <p style={{ marginBottom: "15px" }}>
          {wasSent
            ? "Your account was created. Check your inbox for the verification link."
            : "Your account was created, but we could not send the verification email right away. You can try again here."}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
          {loading ? "Sending..." : "Resend Email"}
        </button>
      </form>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}

export default function ResendVerificationPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: "400px", margin: "80px auto", textAlign: "center" }}>Loading...</div>}>
      <ResendVerificationContent />
    </Suspense>
  );
}
