// src/components/checkout/QuoteForm.jsx
'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './Quoteform.css';

export default function QuoteForm({ onSubmit, isSubmitting, autoFillData }) {
  const { formData, updateFormData } = useCart();
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData({
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['fullName', 'email', 'phone', 'serviceCategory', 'budgetRange', 'timeline', 'description', 'urgency'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  const budgetOptions = [
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $20,000',
    '$20,000 - $50,000',
    '$50,000+',
    'To be discussed'
  ];

  const timelineOptions = [
    'ASAP (1-2 weeks)',
    'Quick Start (1 month)',
    'Standard (1-3 months)',
    'Flexible (3-6 months)',
    'Long-term (6+ months)'
  ];

  const howHeardOptions = [
    'Google Search',
    'Social Media (Instagram/LinkedIn)',
    'Referral from friend/client',
    'Previous customer',
    'Industry event/conference',
    'Other'
  ];

  return (
    <div className="chk-form">
      <h2 className="chk-form-title">Project & Contact Details</h2>
      <p className="chk-form-subtitle">
        Please provide your information so we can prepare a customized quote.
      </p>

      <form onSubmit={handleSubmit} className="chk-form-spacing">
        {/* Contact Information */}
        <div className="chk-form-section">
          <h3 className="chk-form-section-title">
            <i className="fas fa-user"></i>
            Contact Information
          </h3>
          <div className="chk-form-grid">
            {[
              { name: 'fullName', label: 'Full Name *', type: 'text', placeholder: 'Emma Smith', required: true },
              { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'sky@company.com', required: true },
              { name: 'phone', label: 'Phone Number *', type: 'tel', placeholder: '+1 (233) 123-4567', required: true },
              { name: 'company', label: 'Company Name', type: 'text', placeholder: 'Your Company Inc.', required: false },
            ].map(field => (
              <div key={field.name} className="chk-form-group">
                <label className={`chk-form-label ${field.required ? 'chk-form-required' : ''}`}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`chk-form-input ${errors[field.name] ? 'chk-form-input-error' : ''}`}
                />
                {errors[field.name] && (
                  <div className="chk-form-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors[field.name]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Project Details */}
        <div className="chk-form-section">
          <h3 className="chk-form-section-title">
            <i className="fas fa-project-diagram"></i>
            Project Details
          </h3>
          <div className="chk-form-stack">
            <div className="chk-form-group">
              <label className="chk-form-label chk-form-required">Service Category *</label>
              <select
                name="serviceCategory"
                value={formData.serviceCategory || autoFillData.serviceCategory || ''}
                onChange={handleChange}
                className={`chk-form-select ${errors.serviceCategory ? 'chk-form-input-error' : ''}`}
              >
                <option value="">Select a category</option>
                <option value="AI Automation">AI Automation</option>
                <option value="Web Application">Web Application</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Website Template">Website Template</option>
                <option value="Full-Stack Solution">Full-Stack Solution</option>
                <option value="Multiple Services">Multiple Services</option>
              </select>
              {autoFillData.serviceCategory && !formData.serviceCategory && (
                <div className="chk-form-hint">
                  <i className="fas fa-magic"></i>
                  Auto-detected from your cart
                </div>
              )}
              {errors.serviceCategory && (
                <div className="chk-form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.serviceCategory}
                </div>
              )}
            </div>

            <div className="chk-form-group">
              <label className="chk-form-label chk-form-required">Project Budget Range *</label>
              <select
                name="budgetRange"
                value={formData.budgetRange || ''}
                onChange={handleChange}
                className={`chk-form-select ${errors.budgetRange ? 'chk-form-input-error' : ''}`}
              >
                <option value="">Select budget range</option>
                {budgetOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.budgetRange && (
                <div className="chk-form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.budgetRange}
                </div>
              )}
            </div>

            <div className="chk-form-group">
              <label className="chk-form-label chk-form-required">Preferred Timeline *</label>
              <select
                name="timeline"
                value={formData.timeline || autoFillData.suggestedTimeline || ''}
                onChange={handleChange}
                className={`chk-form-select ${errors.timeline ? 'chk-form-input-error' : ''}`}
              >
                <option value="">Select timeline</option>
                {timelineOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {autoFillData.suggestedTimeline && !formData.timeline && (
                <div className="chk-form-hint">
                  <i className="fas fa-clock"></i>
                  Suggested based on your selections
                </div>
              )}
              {errors.timeline && (
                <div className="chk-form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.timeline}
                </div>
              )}
            </div>

            <div className="chk-form-group">
              <label className="chk-form-label chk-form-required">Project Description & Requirements *</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your project goals, target audience, specific features needed..."
                className={`chk-form-textarea ${errors.description ? 'chk-form-input-error' : ''}`}
              />
              <div className="chk-form-textarea-footer">
                <div className="chk-form-hint">
                  <i className="fas fa-lightbulb"></i>
                  Be as detailed as possible
                </div>
                <div className="chk-form-hint">
                  {formData.description?.length || 0}/1000
                </div>
              </div>
              {errors.description && (
                <div className="chk-form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="chk-form-section">
          <h3 className="chk-form-section-title">
            <i className="fas fa-info-circle"></i>
            Additional Information
          </h3>
          <div className="chk-form-stack">
            <div className="chk-form-group">
              <label className="chk-form-label">How did you hear about us?</label>
              <select
                name="howHeard"
                value={formData.howHeard || ''}
                onChange={handleChange}
                className="chk-form-select"
              >
                <option value="">Select an option</option>
                {howHeardOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="chk-form-group">
              <label className="chk-form-label chk-form-required">Project Urgency *</label>
              <div className="chk-radio-group">
                {[
                  { value: 'high', label: 'High', desc: 'Start within 2 weeks' },
                  { value: 'medium', label: 'Medium', desc: 'Start in 1-2 months' },
                  { value: 'low', label: 'Low', desc: 'Planning phase' },
                ].map(option => (
                  <label
                    key={option.value}
                    className={`chk-radio-option ${formData.urgency === option.value ? 'chk-radio-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={formData.urgency === option.value}
                      onChange={handleChange}
                      className="chk-radio-input"
                    />
                    <div className="chk-radio-label">{option.label}</div>
                    <div className="chk-radio-desc">{option.desc}</div>
                  </label>
                ))}
              </div>
              {errors.urgency && (
                <div className="chk-form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.urgency}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="chk-terms">
          <label className="chk-terms-label">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted || false}
              onChange={handleChange}
              className="chk-terms-checkbox"
            />
            <div className="chk-terms-text">
              <span className="chk-terms-main">
                I agree to be contacted regarding this quote request
              </span>
              <div className="chk-terms-sub">
                By submitting this form, you agree to receive communication from our team via email or phone. We respect your privacy and will not share your information.
              </div>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="chk-submit">
          <div className="chk-submit-info">
            <i className="fas fa-lock"></i>
            Your information is secure and encrypted
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !formData.termsAccepted}
            className="chk-submit-btn"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Processing...
              </>
            ) : (
              <>
                Request Quote
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>
          {formSubmitted && Object.keys(errors).length > 0 && (
            <div className="chk-submit-error">
              <div className="chk-submit-error-msg">
                <i className="fas fa-exclamation-triangle"></i>
                Please fix the errors above before submitting.
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}