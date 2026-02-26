// src/components/checkout/QuoteForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export default function QuoteForm({ onSubmit, isSubmitting, autoFillData }) {
  const { formData, updateFormData } = useCart();
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData({
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['fullName', 'email', 'phone', 'serviceCategory', 'budgetRange', 'timeline', 'description'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
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
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  // Budget range options
  const budgetOptions = [
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $20,000',
    '$20,000 - $50,000',
    '$50,000+',
    'To be discussed'
  ];

  // Timeline options
  const timelineOptions = [
    'ASAP (1-2 weeks)',
    'Quick Start (1 month)',
    'Standard (1-3 months)',
    'Flexible (3-6 months)',
    'Long-term (6+ months)'
  ];

  // How heard options
  const howHeardOptions = [
    'Google Search',
    'Social Media (Instagram/LinkedIn)',
    'Referral from friend/client',
    'Previous customer',
    'Industry event/conference',
    'Other'
  ];

  return (
    <div className="quote-form">
      <h2 className="quote-form-title">Project & Contact Details</h2>
      <p className="quote-form-subtitle">
        Please provide your information so we can prepare a customized quote.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div className="form-section">
          <h3 className="form-section-title">
            <i className="fas fa-user text-blue-400"></i>
            Contact Information
          </h3>
          <div className="form-grid">
            {[
              { name: 'fullName', label: 'Full Name *', type: 'text', placeholder: 'John Smith', required: true },
              { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'john@company.com', required: true },
              { name: 'phone', label: 'Phone Number *', type: 'tel', placeholder: '+1 (555) 123-4567', required: true },
              { name: 'company', label: 'Company Name', type: 'text', placeholder: 'Your Company Inc.', required: false },
            ].map(field => (
              <div key={field.name} className="form-group">
                <label className={`form-label ${field.required ? 'required' : ''}`}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`form-input ${errors[field.name] ? 'error' : ''}`}
                />
                {errors[field.name] && (
                  <div className="form-error">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    {errors[field.name]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Project Details */}
        <div className="form-section">
          <h3 className="form-section-title">
            <i className="fas fa-project-diagram text-purple-400"></i>
            Project Details
          </h3>
          <div className="space-y-4">
            {/* Service Category - Auto-filled */}
            <div className="form-group">
              <label className="form-label required">Service Category *</label>
              <select
                name="serviceCategory"
                value={formData.serviceCategory || autoFillData.serviceCategory || ''}
                onChange={handleChange}
                className="form-select"
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
                <div className="form-hint">
                  <i className="fas fa-magic mr-1"></i>
                  Auto-detected from your cart
                </div>
              )}
            </div>

            {/* Budget Range */}
            <div className="form-group">
              <label className="form-label required">Project Budget Range *</label>
              <select
                name="budgetRange"
                value={formData.budgetRange || ''}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select budget range</option>
                {budgetOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeline */}
            <div className="form-group">
              <label className="form-label required">Preferred Timeline *</label>
              <select
                name="timeline"
                value={formData.timeline || autoFillData.suggestedTimeline || ''}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select timeline</option>
                {timelineOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {autoFillData.suggestedTimeline && !formData.timeline && (
                <div className="form-hint">
                  <i className="fas fa-clock mr-1"></i>
                  Suggested based on your selections
                </div>
              )}
            </div>

            {/* Project Description */}
            <div className="form-group">
              <label className="form-label required">Project Description & Requirements *</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your project goals, target audience, specific features needed, timeline expectations, and any existing systems to integrate with..."
                className={`form-textarea ${errors.description ? 'error' : ''}`}
              />
              <div className="flex justify-between items-center mt-1">
                <div className="form-hint">
                  <i className="fas fa-lightbulb mr-1"></i>
                  Be as detailed as possible for an accurate quote
                </div>
                <div className="form-hint">
                  {formData.description?.length || 0}/1000
                </div>
              </div>
              {errors.description && (
                <div className="form-error">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h3 className="form-section-title">
            <i className="fas fa-info-circle text-green-400"></i>
            Additional Information
          </h3>
          <div className="space-y-4">
            {/* How Heard */}
            <div className="form-group">
              <label className="form-label">How did you hear about us?</label>
              <select
                name="howHeard"
                value={formData.howHeard || ''}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select an option</option>
                {howHeardOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency */}
            <div className="form-group">
              <label className="form-label required">Project Urgency *</label>
              <div className="radio-group">
                {[
                  { value: 'high', label: 'High', desc: 'Start within 2 weeks', color: 'red' },
                  { value: 'medium', label: 'Medium', desc: 'Start in 1-2 months', color: 'yellow' },
                  { value: 'low', label: 'Low', desc: 'Planning phase', color: 'green' },
                ].map(option => (
                  <label
                    key={option.value}
                    className={`radio-option ${formData.urgency === option.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={formData.urgency === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="radio-label">{option.label}</div>
                    <div className="radio-description">{option.desc}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Consent */}
        <div className="terms-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted || false}
              onChange={handleChange}
              className="checkbox-input"
            />
            <div className="checkbox-text">
              <span className="font-medium">
                I agree to be contacted regarding this quote request
              </span>
              <div className="checkbox-subtext">
                By submitting this form, you agree to receive communication from our team via email or phone. We respect your privacy and will not share your information.
              </div>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <div className="submit-info">
            <i className="fas fa-lock"></i>
            Your information is secure and encrypted
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !formData.termsAccepted}
            className="submit-button"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Processing...
              </>
            ) : (
              <>
                Request Quote
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </>
            )}
          </button>
          {formSubmitted && Object.keys(errors).length > 0 && (
            <div className="submit-error">
              <div className="submit-error-message">
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