// /api/inquiries/route.js

import { NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rateLimit';
import sanitizeHtml from 'sanitize-html';
import { sendEmail } from '@/lib/email';

function clean(input) {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export async function POST(req) {
  try {
    // 1. Rate limit
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    if (!rateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // 2. Payload size check
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10000) {
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413 }
      );
    }

    // 3. Parse body
    const body = await req.json();

    // 4. Validate
    const parsed = quoteSchema.safeParse(body.formData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // 5. Sanitize
    const cleanData = {
      ...parsed.data,
      fullName: clean(parsed.data.fullName),
      description: clean(parsed.data.description),
    };

    // 6. Save (mock)
    const inquiryId = `QR-${Date.now().toString().slice(-8)}`;

    // 7. Send emails (AFTER validation only)
    await sendEmail({
      to: "your@email.com",
      subject: `New Inquiry (${inquiryId})`,
      html: `<p>${cleanData.fullName}</p>`
    });

    await sendEmail({
      to: cleanData.email,
      subject: "Request received",
      html: `<p>We got your request</p>`
    });

    return NextResponse.json({
      success: true,
      id: inquiryId
    });

  } catch (err) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}