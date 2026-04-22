'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail } from '@/lib/boemApi';

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

    verifyEmail(uid, token)
      .then((response) => {
        setStatus('success');
        const redirectQuery = /already verified/i.test(response?.message || '')
          ? 'already'
          : 'true';
        setTimeout(() => router.push(`/login?verified=${redirectQuery}`), 3000);
      })
      .catch((error) => {
        setStatus('error');
        setErrorMsg(error.message || 'Verification failed.');
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
            <Link href="/resend-verification">Request another verification email</Link>
            <br />
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
