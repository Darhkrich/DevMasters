'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_BOEM_API_BASE_URL || 'http://localhost:8000/api/v1';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uid = searchParams.get('uid')?.trim() || '';
  const token = searchParams.get('token')?.trim() || '';
  const [status, setStatus] = useState(uid && token ? 'verifying' : 'error');
  const [errorMsg, setErrorMsg] = useState(uid && token ? '' : 'Invalid verification link.');

  useEffect(() => {
    if (!uid || !token) {
      return;
    }

    const url = `${API_BASE}/auth/verify-email/?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`;

    fetch(url)
      .then(async (response) => {
        if (response.ok) {
          setStatus('success');
          setTimeout(() => router.push('/login?verified=true'), 3000);
          return;
        }

        const data = await response.json();
        setStatus('error');
        setErrorMsg(data.error || 'Verification failed.');
      })
      .catch(() => {
        setStatus('error');
        setErrorMsg('Network error. Please try again.');
      });
  }, [router, token, uid]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === 'verifying' && (
          <>
            <h1>Verifying your email</h1>
            <p>Please wait...</p>
            <div className="spinner" />
          </>
        )}
        {status === 'success' && (
          <>
            <h1>Email verified!</h1>
            <p>Your account is now active. Redirecting to login...</p>
            <Link href="/login">Login now</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1>Verification failed</h1>
            <p>{errorMsg}</p>
            <Link href="/login">Back to login</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="auth-container">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
