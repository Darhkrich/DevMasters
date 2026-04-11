'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchTemplateAdmin, updateTemplateAdmin } from '@/lib/boemApi';
import TemplateForm from '@/components/admin/TemplateForm';

export default function EditTemplatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const data = await fetchTemplateAdmin(id);
        setInitialData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadTemplate();
  }, [id]);

  const handleUpdate = async (formData) => {
    await updateTemplateAdmin(id, formData);
    router.push('/dashboard-admin/templates');
  };

  if (loading) return <div>Loading template...</div>;
  if (error) return <div>Error: {error}</div>;

  return <TemplateForm initialData={initialData} onSubmit={handleUpdate} isEditing />;
}