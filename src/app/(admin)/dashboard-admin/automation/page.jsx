// app/admin/automations/page.js
'use client';

import { useEffect, useState } from 'react';
import {
  fetchAutomationsAdmin,
  createAutomationAdmin,
  updateAutomationAdmin,
  deleteAutomationAdmin,
  fetchBundlesAdmin,
  createBundleAdmin,
  updateBundleAdmin,
  deleteBundleAdmin,
} from '@/lib/boemApi';
import './automation.css';

export default function AdminAutomationsPage() {
  const [activeTab, setActiveTab] = useState('automations');
  const [automations, setAutomations] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Automations form
  const [editingAuto, setEditingAuto] = useState(null);
  const [autoForm, setAutoForm] = useState({
    id: '',
    title: '',
    description: '',
    sector: '',
    icon: '',
    features: [],
    integration: [],
    use_cases: [],
    benefits: [],
    price_note: '',
    delivery_time: '',
    preview_url: '#',
    image: '',
  });

  // Bundles form
  const [editingBundle, setEditingBundle] = useState(null);
  const [bundleForm, setBundleForm] = useState({
    id: '',
    title: '',
    description: '',
    tag: '',
    items: [],
    features: [],
    ideal_for: [],
    price_note: '',
    delivery_time: '',
    preview_url: '#',
    image: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [autoRes, bundleRes] = await Promise.all([
        fetchAutomationsAdmin(),
        fetchBundlesAdmin(),
      ]);
      setAutomations(autoRes);
      setBundles(bundleRes);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------- Automations ----------
  const handleAutoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAuto) {
        await updateAutomationAdmin(editingAuto.id, autoForm);
      } else {
        await createAutomationAdmin(autoForm);
      }
      resetAutoForm();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteAuto = async (id) => {
    if (!confirm('Delete this automation?')) return;
    try {
      await deleteAutomationAdmin(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const editAuto = (item) => {
    setEditingAuto(item);
    setAutoForm(item);
  };

  const resetAutoForm = () => {
    setEditingAuto(null);
    setAutoForm({
      id: '',
      title: '',
      description: '',
      sector: '',
      icon: '',
      features: [],
      integration: [],
      use_cases: [],
      benefits: [],
      price_note: '',
      delivery_time: '',
      preview_url: '#',
      image: '',
    });
  };

  // ---------- Bundles ----------
  const handleBundleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBundle) {
        await updateBundleAdmin(editingBundle.id, bundleForm);
      } else {
        await createBundleAdmin(bundleForm);
      }
      resetBundleForm();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteBundle = async (id) => {
    if (!confirm('Delete this bundle?')) return;
    try {
      await deleteBundleAdmin(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const editBundle = (item) => {
    setEditingBundle(item);
    setBundleForm(item);
  };

  const resetBundleForm = () => {
    setEditingBundle(null);
    setBundleForm({
      id: '',
      title: '',
      description: '',
      tag: '',
      items: [],
      features: [],
      ideal_for: [],
      price_note: '',
      delivery_time: '',
      preview_url: '#',
      image: '',
    });
  };

  // JSON field helpers
  const handleJsonChange = (setter) => (e) => {
    const { name, value } = e.target;
    try {
      const parsed = JSON.parse(value);
      setter(prev => ({ ...prev, [name]: parsed }));
    } catch (err) {
      // ignore
    }
  };

  if (loading) return <div className="aa-container">Loading...</div>;
  if (error) return <div className="aa-container">Error: {error}</div>;

  return (
    <div className="aa-container">
      <main className="aa-main-content">
        <div className="aa-header">
          <h1>Admin: AI Automations & Bundles</h1>
        </div>

        <div className="aa-tabs">
          <button
            className={`aa-tab ${activeTab === 'automations' ? 'aa-tab-active' : ''}`}
            onClick={() => setActiveTab('automations')}
          >
            Automations
          </button>
          <button
            className={`aa-tab ${activeTab === 'bundles' ? 'aa-tab-active' : ''}`}
            onClick={() => setActiveTab('bundles')}
          >
            Bundles
          </button>
        </div>

        {activeTab === 'automations' && (
          <>
            <div className="aa-card">
              <h3>{editingAuto ? 'Edit Automation' : 'Add New Automation'}</h3>
              <form onSubmit={handleAutoSubmit}>
                <div className="aa-form-grid">
                  <input type="text" name="id" placeholder="ID (slug)" value={autoForm.id} onChange={e => setAutoForm({ ...autoForm, id: e.target.value })} required />
                  <input type="text" name="title" placeholder="Title" value={autoForm.title} onChange={e => setAutoForm({ ...autoForm, title: e.target.value })} required />
                  <textarea name="description" placeholder="Description" rows="2" value={autoForm.description} onChange={e => setAutoForm({ ...autoForm, description: e.target.value })} required />
                  <input type="text" name="sector" placeholder="Sector (e.g., ecommerce, services)" value={autoForm.sector} onChange={e => setAutoForm({ ...autoForm, sector: e.target.value })} required />
                  <input type="text" name="icon" placeholder="Icon class (e.g., fas fa-robot)" value={autoForm.icon} onChange={e => setAutoForm({ ...autoForm, icon: e.target.value })} required />
                  <textarea name="features" placeholder="Features (JSON array)" rows="3" value={JSON.stringify(autoForm.features, null, 2)} onChange={handleJsonChange(setAutoForm)} />
                  <textarea name="integration" placeholder="Integration (JSON array)" rows="2" value={JSON.stringify(autoForm.integration, null, 2)} onChange={handleJsonChange(setAutoForm)} />
                  <textarea name="use_cases" placeholder="Use Cases (JSON array)" rows="3" value={JSON.stringify(autoForm.use_cases, null, 2)} onChange={handleJsonChange(setAutoForm)} />
                  <textarea name="benefits" placeholder="Benefits (JSON array)" rows="3" value={JSON.stringify(autoForm.benefits, null, 2)} onChange={handleJsonChange(setAutoForm)} />
                  <input type="text" name="price_note" placeholder="Price note" value={autoForm.price_note} onChange={e => setAutoForm({ ...autoForm, price_note: e.target.value })} required />
                  <input type="text" name="delivery_time" placeholder="Delivery time" value={autoForm.delivery_time} onChange={e => setAutoForm({ ...autoForm, delivery_time: e.target.value })} required />
                  <input type="url" name="preview_url" placeholder="Preview URL" value={autoForm.preview_url} onChange={e => setAutoForm({ ...autoForm, preview_url: e.target.value })} />
                  <input type="text" name="image" placeholder="Image path" value={autoForm.image} onChange={e => setAutoForm({ ...autoForm, image: e.target.value })} />
                </div>
                <div className="aa-form-actions">
                  <button type="submit" className="aa-btn-primary">{editingAuto ? 'Update' : 'Create'}</button>
                  {editingAuto && <button type="button" className="aa-btn-secondary" onClick={resetAutoForm}>Cancel</button>}
                </div>
              </form>
            </div>

            <div className="aa-list">
              {automations.map(auto => (
                <div key={auto.id} className="aa-card-item">
                  <div><strong>{auto.title}</strong> ({auto.id})</div>
                  <div>Sector: {auto.sector}</div>
                  <div className="aa-card-actions">
                    <button className="aa-btn-outline" onClick={() => editAuto(auto)}>Edit</button>
                    <button className="aa-btn-danger" onClick={() => deleteAuto(auto.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {automations.length === 0 && <div className="aa-empty">No automations found.</div>}
            </div>
          </>
        )}

        {activeTab === 'bundles' && (
          <>
            <div className="aa-card">
              <h3>{editingBundle ? 'Edit Bundle' : 'Add New Bundle'}</h3>
              <form onSubmit={handleBundleSubmit}>
                <div className="aa-form-grid">
                  <input type="text" name="id" placeholder="ID (slug)" value={bundleForm.id} onChange={e => setBundleForm({ ...bundleForm, id: e.target.value })} required />
                  <input type="text" name="title" placeholder="Title" value={bundleForm.title} onChange={e => setBundleForm({ ...bundleForm, title: e.target.value })} required />
                  <textarea name="description" placeholder="Description" rows="2" value={bundleForm.description} onChange={e => setBundleForm({ ...bundleForm, description: e.target.value })} required />
                  <input type="text" name="tag" placeholder="Tag (e.g., Best Seller, Popular)" value={bundleForm.tag} onChange={e => setBundleForm({ ...bundleForm, tag: e.target.value })} required />
                  <textarea name="items" placeholder="Items (JSON array of strings)" rows="3" value={JSON.stringify(bundleForm.items, null, 2)} onChange={handleJsonChange(setBundleForm)} />
                  <textarea name="features" placeholder="Features (JSON array of strings)" rows="3" value={JSON.stringify(bundleForm.features, null, 2)} onChange={handleJsonChange(setBundleForm)} />
                  <textarea name="ideal_for" placeholder="Ideal For (JSON array of strings)" rows="2" value={JSON.stringify(bundleForm.ideal_for, null, 2)} onChange={handleJsonChange(setBundleForm)} />
                  <input type="text" name="price_note" placeholder="Price note" value={bundleForm.price_note} onChange={e => setBundleForm({ ...bundleForm, price_note: e.target.value })} required />
                  <input type="text" name="delivery_time" placeholder="Delivery time" value={bundleForm.delivery_time} onChange={e => setBundleForm({ ...bundleForm, delivery_time: e.target.value })} required />
                  <input type="url" name="preview_url" placeholder="Preview URL" value={bundleForm.preview_url} onChange={e => setBundleForm({ ...bundleForm, preview_url: e.target.value })} />
                  <input type="text" name="image" placeholder="Image path" value={bundleForm.image} onChange={e => setBundleForm({ ...bundleForm, image: e.target.value })} />
                </div>
                <div className="aa-form-actions">
                  <button type="submit" className="aa-btn-primary">{editingBundle ? 'Update' : 'Create'}</button>
                  {editingBundle && <button type="button" className="aa-btn-secondary" onClick={resetBundleForm}>Cancel</button>}
                </div>
              </form>
            </div>

            <div className="aa-list">
              {bundles.map(bundle => (
                <div key={bundle.id} className="aa-card-item">
                  <div><strong>{bundle.title}</strong> ({bundle.id})</div>
                  <div>Tag: {bundle.tag}</div>
                  <div className="aa-card-actions">
                    <button className="aa-btn-outline" onClick={() => editBundle(bundle)}>Edit</button>
                    <button className="aa-btn-danger" onClick={() => deleteBundle(bundle.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {bundles.length === 0 && <div className="aa-empty">No bundles found.</div>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}