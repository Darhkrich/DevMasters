'use client';
import { useRouter } from 'next/navigation';
import { createTemplateAdmin } from '@/lib/boemApi';
import TemplateForm from '@/components/admin/TemplateForm';

export default function AddTemplatePage() {
  const router = useRouter();

  const handleCreate = async (formData) => {
    await createTemplateAdmin(formData);
    router.push('/admin/templates');
  };

  return <TemplateForm onSubmit={handleCreate} />;
}