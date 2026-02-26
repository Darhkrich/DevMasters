'use client';

import { useState, useEffect } from 'react';
import './BuilderSection.css';
import { builderOptions } from '@/data/pricingBuilder';
import AddToQuoteButton from '@/components/common/AddToQuoteButton';

export default function BuilderSection({ onPackageSelect, onDashboardNavigate }) {
  // State for builder calculator
  const [builderCategories, setBuilderCategories] = useState({
    web: false,
    app: false,
    ai: false
  });
  
  const [builderSelections, setBuilderSelections] = useState({
    webBase: 'none',
    appBase: 'none',
    aiBase: 'none',
    webExtras: [],
    appExtras: [],
    aiExtras: [],
    priority: 'speed'
  });
  
  const [builderTotal, setBuilderTotal] = useState(0);
  const [builderBreakdown, setBuilderBreakdown] = useState([]);
  const [notification, setNotification] = useState({ visible: false, message: '' });

  // Handle builder category toggle
  const handleBuilderCategoryToggle = (category) => {
    setBuilderCategories(prev => {
      const newValue = !prev[category];
      
      if (!newValue) {
        setBuilderSelections(prevSelections => ({
          ...prevSelections,
          [`${category}Base`]: 'none',
          [`${category}Extras`]: []
        }));
      }
      
      return {
        ...prev,
        [category]: newValue
      };
    });
  };

  // Handle builder base selection
  const handleBuilderBaseSelect = (category, value) => {
    setBuilderSelections(prev => ({
      ...prev,
      [`${category}Base`]: value
    }));
  };

  // Handle builder extra toggle
  const handleBuilderExtraToggle = (category, value) => {
    setBuilderSelections(prev => {
      const extrasKey = `${category}Extras`;
      const currentExtras = prev[extrasKey];
      
      if (currentExtras.includes(value)) {
        return {
          ...prev,
          [extrasKey]: currentExtras.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [extrasKey]: [...currentExtras, value]
        };
      }
    });
  };

  // Handle priority selection
  const handlePrioritySelect = (value) => {
    setBuilderSelections(prev => ({
      ...prev,
      priority: value
    }));
  };

  // Calculate builder total
  useEffect(() => {
    let total = 0;
    const breakdown = [];

    // Calculate web total
    if (builderCategories.web) {
      const webBase = builderOptions.web.base.find(opt => opt.value === builderSelections.webBase);
      if (webBase && webBase.price > 0) {
        total += webBase.price;
        breakdown.push({ label: 'Website base', price: webBase.price });
      }

      // Web extras
      builderSelections.webExtras.forEach(extraValue => {
        const extra = builderOptions.web.extras.find(opt => opt.value === extraValue);
        if (extra) {
          total += extra.price;
          breakdown.push({ label: extra.label, price: extra.price });
        }
      });
    }

    // Calculate app total
    if (builderCategories.app) {
      const appBase = builderOptions.app.base.find(opt => opt.value === builderSelections.appBase);
      if (appBase && appBase.price > 0) {
        total += appBase.price;
        breakdown.push({ label: 'App base', price: appBase.price });
      }

      // App extras
      builderSelections.appExtras.forEach(extraValue => {
        const extra = builderOptions.app.extras.find(opt => opt.value === extraValue);
        if (extra) {
          total += extra.price;
          breakdown.push({ label: extra.label, price: extra.price });
        }
      });
    }

    // Calculate AI total
    if (builderCategories.ai) {
      const aiBase = builderOptions.ai.base.find(opt => opt.value === builderSelections.aiBase);
      if (aiBase && aiBase.price > 0) {
        total += aiBase.price;
        breakdown.push({ label: 'AI base', price: aiBase.price });
      }

      // AI extras
      builderSelections.aiExtras.forEach(extraValue => {
        const extra = builderOptions.ai.extras.find(opt => opt.value === extraValue);
        if (extra) {
          total += extra.price;
          breakdown.push({ label: extra.label, price: extra.price });
        }
      });
    }

    setBuilderTotal(total);
    setBuilderBreakdown(breakdown);
  }, [builderCategories, builderSelections]);

  // Handle save custom package
  const handleSaveCustomPackage = () => {
    const selectedTypes = Object.entries(builderCategories)
      .filter(([_, isChecked]) => isChecked)
      .map(([category]) => category);

    const builderData = {
      id: `custom-builder-${Date.now()}`,
      category: 'custom-builder',
      title: 'Custom Package Request',
      types: selectedTypes,
      priority: builderSelections.priority,
      estimateTotal: builderTotal,
      breakdown: builderBreakdown,
      price: builderTotal.toString(),
      subtitle: `Custom package with ${selectedTypes.map(t => t).join(', ')}`
    };

    // Call parent handler
    if (onPackageSelect) {
      onPackageSelect(builderData);
    }

    // Show notification
    setNotification({
      visible: true,
      message: `✅ Your custom package has been added to your client dashboard.`
    });
    
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 7000);
  };

  // Helper function to capitalize
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <section className="builder-section">
      {/* Notification */}
      {notification.visible && (
        <div className="builder-notification builder-notification--visible">
          <span>{notification.message}</span>
          <br/>
          <span>Go to your <a href="/dashboard">client dashboard</a> to check it out.</span>
        </div>
      )}

      <header className="builder-header">
        <div>
          <h2>Build your own package</h2>
          <p>
            Choose exactly what you need across websites, apps and AI automation. 
            See your estimated cost update in real time before you request the package.
          </p>
        </div>
        <div className="builder-badge">Live estimate calculator</div>
      </header>

      <div className="builder-card">
        {/* LEFT COLUMN: Options */}
        <div className="builder-column builder-options">
          <h3>1. What do you need?</h3>
          <p className="builder-hint">
            Pick one or more categories and then customize the options below.
          </p>

          {/* Categories selection */}
          <div className="builder-category-group">
            {Object.entries(builderCategories).map(([category, isChecked]) => (
              <label key={category} className={`builder-category ${isChecked ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  className="builder-cat-input"
                  checked={isChecked}
                  onChange={() => handleBuilderCategoryToggle(category)}
                />
                <span>
                  <i className={`fas fa-${category === 'web' ? 'globe' : category === 'app' ? 'mobile-alt' : 'robot'}`}></i>
                  {category === 'web' ? ' Website / Landing page' : category === 'app' ? ' Web or mobile app' : ' AI automation & workflows'}
                </span>
              </label>
            ))}
          </div>

          {/* Website options */}
          <div 
            className={`builder-options-group ${builderCategories.web ? 'visible' : ''}`} 
            data-group="web"
          >
            <h4>Website options</h4>
            <p className="builder-hint">
              Choose how advanced your website should be.
            </p>

            <div className="builder-options-grid">
              {builderOptions.web.base.map((option) => (
                <label
                  key={option.value}
                  className={`builder-option-pill ${builderSelections.webBase === option.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="webBase"
                    value={option.value}
                    checked={builderSelections.webBase === option.value}
                    onChange={() => handleBuilderBaseSelect('web', option.value)}
                  />
                  <span>{option.label}</span>
                  <span className="builder-option-price">
                    {option.price === 0 ? 'Included' : `+ $${option.price}`}
                  </span>
                </label>
              ))}
            </div>

            <h5>Extras</h5>
            <div className="builder-options-grid">
              {builderOptions.web.extras.map((extra) => (
                <label
                  key={extra.value}
                  className={`builder-option-pill ${builderSelections.webExtras.includes(extra.value) ? 'active' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="builder-extra-input"
                    checked={builderSelections.webExtras.includes(extra.value)}
                    onChange={() => handleBuilderExtraToggle('web', extra.value)}
                  />
                  <span>{extra.label}</span>
                  <span className="builder-option-price">+ ${extra.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* App options */}
          <div 
            className={`builder-options-group ${builderCategories.app ? 'visible' : ''}`} 
            data-group="app"
          >
            <h4>Web & mobile app options</h4>
            <p className="builder-hint">
              Choose how complex your app should be.
            </p>

            <div className="builder-options-grid">
              {builderOptions.app.base.map((option) => (
                <label
                  key={option.value}
                  className={`builder-option-pill ${builderSelections.appBase === option.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="appBase"
                    value={option.value}
                    checked={builderSelections.appBase === option.value}
                    onChange={() => handleBuilderBaseSelect('app', option.value)}
                  />
                  <span>{option.label}</span>
                  <span className="builder-option-price">
                    {option.price === 0 ? 'Included' : `+ $${option.price}`}
                  </span>
                </label>
              ))}
            </div>

            <h5>Extras</h5>
            <div className="builder-options-grid">
              {builderOptions.app.extras.map((extra) => (
                <label
                  key={extra.value}
                  className={`builder-option-pill ${builderSelections.appExtras.includes(extra.value) ? 'active' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="builder-extra-input"
                    checked={builderSelections.appExtras.includes(extra.value)}
                    onChange={() => handleBuilderExtraToggle('app', extra.value)}
                  />
                  <span>{extra.label}</span>
                  <span className="builder-option-price">+ ${extra.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* AI options */}
          <div 
            className={`builder-options-group ${builderCategories.ai ? 'visible' : ''}`} 
            data-group="ai"
          >
            <h4>AI automation options</h4>
            <p className="builder-hint">
              Decide how much you want to automate with AI.
            </p>

            <div className="builder-options-grid">
              {builderOptions.ai.base.map((option) => (
                <label
                  key={option.value}
                  className={`builder-option-pill ${builderSelections.aiBase === option.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="aiBase"
                    value={option.value}
                    checked={builderSelections.aiBase === option.value}
                    onChange={() => handleBuilderBaseSelect('ai', option.value)}
                  />
                  <span>{option.label}</span>
                  <span className="builder-option-price">
                    {option.price === 0 ? 'Included' : `+ $${option.price}`}
                  </span>
                </label>
              ))}
            </div>

            <h5>Extras</h5>
            <div className="builder-options-grid">
              {builderOptions.ai.extras.map((extra) => (
                <label
                  key={extra.value}
                  className={`builder-option-pill ${builderSelections.aiExtras.includes(extra.value) ? 'active' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="builder-extra-input"
                    checked={builderSelections.aiExtras.includes(extra.value)}
                    onChange={() => handleBuilderExtraToggle('ai', extra.value)}
                  />
                  <span>{extra.label}</span>
                  <span className="builder-option-price">+ ${extra.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority */}
          <h3>2. What's your priority?</h3>
          <div className="builder-options-grid">
            {builderOptions.priority.map((option) => (
              <label
                key={option.value}
                className={`builder-option-pill ${builderSelections.priority === option.value ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="builderPriority"
                  value={option.value}
                  checked={builderSelections.priority === option.value}
                  onChange={() => handlePrioritySelect(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Live summary & total */}
        <div className="builder-column builder-summary">
          <h3>3. Your package summary</h3>
          <p className="builder-hint">
            This is an estimated one-time setup price. Final pricing is confirmed after we review your request.
          </p>

          <div className="builder-total-box">
            <div className="builder-total-label">Estimated total</div>
            <div className="builder-total-value">
              <span className="builder-total-currency">$</span>
              <span className="builder-total-number">{builderTotal}</span>
            </div>
            <div className="builder-total-note">
              One-time setup estimate • Taxes & recurring costs (hosting, tools) may be separate.
            </div>
          </div>

          <div className="builder-breakdown">
            <h4>Breakdown</h4>
            <ul className="builder-breakdown-list">
              {builderBreakdown.length === 0 ? (
                <li><span>No paid options selected yet.</span><span>$0</span></li>
              ) : (
                builderBreakdown.map((item, index) => (
                  <li key={index}>
                    <span>{item.label}</span><span>${item.price}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
         
              
{/* FIXED: Changed 'service' to 'template' and 'source' to 'templates' */}
            <AddToQuoteButton 
              item={builderCategories} 
              source="templates" 
              className="wc-btn-ghost wc-btn-customize"
            />

          <p className="builder-footnote">
            When you save, we'll send this custom package to your client dashboard. You'll be able to 
            review, ask questions and confirm before anything starts.
          </p>
        </div>
      </div>
    </section>
  );
}