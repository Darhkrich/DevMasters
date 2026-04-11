// /api/inquiries/convert/route.js

import { NextResponse } from 'next/server';

export async function POST(req) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET;

  const auth = req.headers.get('authorization');

  if (auth !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await req.json();

  if (!body.inquiryId || !body.price) {
    return NextResponse.json(
      { error: 'Invalid data' },
      { status: 400 }
    );
  }

  const order = {
    id: `ORD-${Date.now().toString().slice(-8)}`,
    ...body
  };

  return NextResponse.json({ success: true, order });
}


const convertToOrder = async (inquiryId) => {
  const res = await fetch('/api/orders/convert/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inquiry_id: inquiryId }),
  });

  const data = await res.json();

  if (res.ok) {
    alert('Order created successfully');
  } else {
    alert(data.error);
  }
};


const handlePreviewTemplate = (template) => {
  window.open(template.preview_url, '_blank');
};
const handleEditTemplate = (templateId) => {
  router.push(`/dashboard-admin/templates/edit/${templateId}`);
};

const handleDelete = async (id) => {
  if (!confirm("Delete this template?")) return;

  try {
    await fetch(`http://localhost:8000/api/templates/${id}/`, {
      method: 'DELETE',
    });

    setTemplates(prev => prev.filter(t => t.id !== id));
  } catch (err) {
    console.error(err);
  }
};