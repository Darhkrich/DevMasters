'use client';

import { useEffect, useState } from 'react';
import {
  fetchPricingPackagesAdmin,
  createPricingPackageAdmin,
  updatePricingPackageAdmin,
  deletePricingPackageAdmin,
  fetchBuilderOptionsAdmin,
  createBuilderOptionAdmin,
  updateBuilderOptionAdmin,
  deleteBuilderOptionAdmin,
  fetchPrioritiesAdmin,
  createPriorityAdmin,
  updatePriorityAdmin,
  deletePriorityAdmin,
} from '@/lib/boemApi';
import './pricing-one.css';

export default function AdminPricingPage() {
  const [packages, setPackages] = useState([]);
  const [builderOptions, setBuilderOptions] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingPackage, setEditingPackage] = useState(null);
  const [editingOption, setEditingOption] = useState(null);
  const [editingPriority, setEditingPriority] = useState(null);

  const [packageForm, setPackageForm] = useState({});
  const [optionForm, setOptionForm] = useState({});
  const [priorityForm, setPriorityForm] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [pkgRes, optRes, priRes] = await Promise.all([
        fetchPricingPackagesAdmin(),
        fetchBuilderOptionsAdmin(),
        fetchPrioritiesAdmin(),
      ]);
      setPackages(pkgRes);
      setBuilderOptions(optRes);
      setPriorities(priRes);
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

  // Packages CRUD
  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await updatePricingPackageAdmin(editingPackage.id, packageForm);
      } else {
        await createPricingPackageAdmin(packageForm);
      }
      resetPackageForm();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const deletePackage = async (id) => {
    if (!confirm('Delete this package?')) return;
    try {
      await deletePricingPackageAdmin(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const editPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageForm(pkg);
  };

  const resetPackageForm = () => {
    setEditingPackage(null);
    setPackageForm({});
  };

  // Builder Options CRUD
  const handleOptionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOption) {
        await updateBuilderOptionAdmin(editingOption.id, optionForm);
      } else {
        await createBuilderOptionAdmin(optionForm);
      }
      resetOptionForm();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteOption = async (id) => {
    if (!confirm('Delete this option?')) return;
    try {
      await deleteBuilderOptionAdmin(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const editOption = (opt) => {
    setEditingOption(opt);
    setOptionForm(opt);
  };

  const resetOptionForm = () => {
    setEditingOption(null);
    setOptionForm({});
  };

  // Priorities CRUD
  const handlePrioritySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPriority) {
        await updatePriorityAdmin(editingPriority.id, priorityForm);
      } else {
        await createPriorityAdmin(priorityForm);
      }
      resetPriorityForm();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const deletePriority = async (id) => {
    if (!confirm('Delete this priority?')) return;
    try {
      await deletePriorityAdmin(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const editPriority = (pri) => {
    setEditingPriority(pri);
    setPriorityForm(pri);
  };

  const resetPriorityForm = () => {
    setEditingPriority(null);
    setPriorityForm({});
  };

  if (loading) return <div className="ap-container">Loading admin data...</div>;
  if (error) return <div className="ap-container ap-error">Error: {error}</div>;

  return (
    <div className="ap-container">
      <main className="ap-main-content">
        <div className="ap-header">
          <h1>Admin: Pricing Management</h1>
        </div>

        {/* Packages Section */}
        <section className="ap-section">
          <h2>Packages</h2>
          <div className="ap-card">
            <h3>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
            <form onSubmit={handlePackageSubmit}>
              <div className="ap-form-grid">
                <input
                  type="text"
                  placeholder="ID (slug)"
                  value={packageForm.id || ''}
                  onChange={(e) => setPackageForm({ ...packageForm, id: e.target.value })}
                  required
                />
                <select
                  value={packageForm.category || ''}
                  onChange={(e) => setPackageForm({ ...packageForm, category: e.target.value })}
                  required
                >
                  <option value="">Category</option>
                  <option value="websites">Websites</option>
                  <option value="apps">Apps</option>
                  <option value="ai">AI</option>
                </select>
                <select
                  value={packageForm.subcategory || ''}
                  onChange={(e) => setPackageForm({ ...packageForm, subcategory: e.target.value })}
                  required
                >
                  <option value="">Subcategory</option>
                  <option value="ready-made">Ready Made</option>
                  <option value="custom">Custom</option>
                  <option value="apps">Apps</option>
                  <option value="ai">AI</option>
                </select>
                <input
                  type="text"
                  placeholder="Tier"
                  value={packageForm.tier || ''}
                  onChange={(e) => setPackageForm({ ...packageForm, tier: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={packageForm.title || ''}
                  onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Subtitle"
                  rows="2"
                  value={packageForm.subtitle || ''}
                  onChange={(e) => setPackageForm({ ...packageForm, subtitle: e.target.value })}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="One-time price"
                  value={packageForm.billing_one_time || ''}
                  onChange={(e) => setPackageForm({ ...packageForm, billing_one_time: e.target.value })}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Monthly price (optional)"
                  value={packageForm.billing_monthly || ''}
                  onChange={(e) => setPackageForm({ ...packageForm, billing_monthly: e.target.value })}
                />
                <textarea
                  placeholder='Features (JSON array)'
                  rows="4"
                  value={packageForm.features ? JSON.stringify(packageForm.features, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      setPackageForm({ ...packageForm, features: JSON.parse(e.target.value) });
                    } catch (err) {
                      // ignore
                    }
                  }}
                />
                <div className="ap-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={packageForm.popular || false}
                      onChange={(e) => setPackageForm({ ...packageForm, popular: e.target.checked })}
                    />{' '}
                    Popular
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={packageForm.best_value || false}
                      onChange={(e) => setPackageForm({ ...packageForm, best_value: e.target.checked })}
                    />{' '}
                    Best Value
                  </label>
                </div>
                <textarea
                  placeholder="Footnote"
                  rows="2"
                  value={packageForm.footnote || ''}
                  onChange={(e) => setPackageForm({ ...packageForm, footnote: e.target.value })}
                />
              </div>
              <div className="ap-form-actions">
                <button type="submit" className="ap-btn-primary">{editingPackage ? 'Update' : 'Create'}</button>
                {editingPackage && (
                  <button type="button" className="ap-btn-secondary" onClick={resetPackageForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="ap-list">
            {packages.map((pkg) => (
              <div key={pkg.id} className="ap-card-item">
                <div><strong>{pkg.title}</strong> ({pkg.tier})</div>
                <div>Category: {pkg.category} / {pkg.subcategory}</div>
                <div>Price: ${pkg.billing_one_time} + ${pkg.billing_monthly}/mo</div>
                <div>Popular: {pkg.popular ? '✅' : '❌'} Best Value: {pkg.best_value ? '✅' : '❌'}</div>
                <div className="ap-card-actions">
                  <button className="ap-btn-outline" onClick={() => editPackage(pkg)}>Edit</button>
                  <button className="ap-btn-danger" onClick={() => deletePackage(pkg.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Builder Options Section */}
        <section className="ap-section">
          <h2>Builder Options (Base & Extras)</h2>
          <div className="ap-card">
            <h3>{editingOption ? 'Edit Option' : 'Add New Option'}</h3>
            <form onSubmit={handleOptionSubmit}>
              <div className="ap-form-grid">
                <select
                  value={optionForm.type || ''}
                  onChange={(e) => setOptionForm({ ...optionForm, type: e.target.value })}
                  required
                >
                  <option value="">Type</option>
                  <option value="web">Web</option>
                  <option value="app">App</option>
                  <option value="ai">AI</option>
                </select>
                <select
                  value={optionForm.option_type || ''}
                  onChange={(e) => setOptionForm({ ...optionForm, option_type: e.target.value })}
                  required
                >
                  <option value="">Option Type</option>
                  <option value="base">Base</option>
                  <option value="extra">Extra</option>
                </select>
                <input
                  type="text"
                  placeholder="Value (slug)"
                  value={optionForm.value || ''}
                  onChange={(e) => setOptionForm({ ...optionForm, value: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={optionForm.label || ''}
                  onChange={(e) => setOptionForm({ ...optionForm, label: e.target.value })}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={optionForm.price || ''}
                  onChange={(e) => setOptionForm({ ...optionForm, price: e.target.value })}
                  required
                />
              </div>
              <div className="ap-form-actions">
                <button type="submit" className="ap-btn-primary">{editingOption ? 'Update' : 'Create'}</button>
                {editingOption && (
                  <button type="button" className="ap-btn-secondary" onClick={resetOptionForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="ap-list">
            {builderOptions.map((opt) => (
              <div key={opt.id} className="ap-card-item">
                <div><strong>{opt.label}</strong> ({opt.type} / {opt.option_type})</div>
                <div>Value: {opt.value}</div>
                <div>Price: ${opt.price}</div>
                <div className="ap-card-actions">
                  <button className="ap-btn-outline" onClick={() => editOption(opt)}>Edit</button>
                  <button className="ap-btn-danger" onClick={() => deleteOption(opt.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Priorities Section */}
        <section className="ap-section">
          <h2>Builder Priorities (Multipliers)</h2>
          <div className="ap-card">
            <h3>{editingPriority ? 'Edit Priority' : 'Add New Priority'}</h3>
            <form onSubmit={handlePrioritySubmit}>
              <div className="ap-form-grid">
                <input
                  type="text"
                  placeholder="Value (slug)"
                  value={priorityForm.value || ''}
                  onChange={(e) => setPriorityForm({ ...priorityForm, value: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={priorityForm.label || ''}
                  onChange={(e) => setPriorityForm({ ...priorityForm, label: e.target.value })}
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Multiplier"
                  value={priorityForm.multiplier || ''}
                  onChange={(e) => setPriorityForm({ ...priorityForm, multiplier: e.target.value })}
                  required
                />
              </div>
              <div className="ap-form-actions">
                <button type="submit" className="ap-btn-primary">{editingPriority ? 'Update' : 'Create'}</button>
                {editingPriority && (
                  <button type="button" className="ap-btn-secondary" onClick={resetPriorityForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="ap-list">
            {priorities.map((pri) => (
              <div key={pri.id} className="ap-card-item">
                <div><strong>{pri.label}</strong> (value: {pri.value})</div>
                <div>Multiplier: {pri.multiplier}</div>
                <div className="ap-card-actions">
                  <button className="ap-btn-outline" onClick={() => editPriority(pri)}>Edit</button>
                  <button className="ap-btn-danger" onClick={() => deletePriority(pri.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}