"use client";

import { useState } from "react";
import { createInquiry } from "@/lib/boemApi";
import "./contact.css"; // new CSS file

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    package: "",
    budget: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.message) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.package ? `${formData.package} inquiry` : "General inquiry",
        service_category: formData.package || "General inquiry",
        budget: formData.budget || "To be discussed",
        message: formData.message,
        project_details: formData.message,
        metadata: { source: "contact-page" },
      });

      setLoading(false);
      setShowModal(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        package: "",
        budget: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrors({ submit: error.message || "We couldn't send your message right now." });
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="cnt-wrapper">
      {/* HERO */}
      <section className="cnt-hero">
        <div className="cnt-container">
          <h2 className="cnt-hero-title">Let's Get You On The Internet And Boost Your Business Together</h2>
          <p className="cnt-hero-subtitle">
            Have questions? We're here to help. Get in touch with our team for expert guidance.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="cnt-section">
        <div className="cnt-container">
          <div className="cnt-cards">
            <div className="cnt-card">
              <h3 className="cnt-card-title">Email Us</h3>
              <p className="cnt-card-text">We usually reply within 24 hours</p>
              <a href="mailto:hello@sitecraft.com" className="cnt-link">hello@sitecraft.com</a>
            </div>
            <div className="cnt-card">
              <h3 className="cnt-card-title">Live Chat</h3>
              <p className="cnt-card-text">Instant help during business hours</p>
              <button className="cnt-link" onClick={() => alert("Live chat coming soon")}>
                Start Live Chat
              </button>
            </div>
            <div className="cnt-card">
              <h3 className="cnt-card-title">Call Us</h3>
              <p className="cnt-card-text">Speak directly with our experts</p>
              <a href="tel:+15551234567" className="cnt-link">+1 (555) 123-4567</a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FORM + INFO */}
      <section className="cnt-section cnt-section-last">
        <div className="cnt-container">
          <div className="cnt-grid">
            {/* FORM */}
            <div className="cnt-form-card">
              <h2 className="cnt-form-title">Send Us a Message</h2>
              <form className="cnt-form" onSubmit={handleSubmit}>
                <div className="cnt-form-group">
                  <label className="cnt-label">Full Name *</label>
                  <input className="cnt-input" name="name" value={formData.name} onChange={handleChange} />
                  {errors.name && <span className="cnt-error">{errors.name}</span>}
                </div>
                <div className="cnt-form-group">
                  <label className="cnt-label">Email Address *</label>
                  <input className="cnt-input" name="email" type="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <span className="cnt-error">{errors.email}</span>}
                </div>
                <div className="cnt-form-group">
                  <label className="cnt-label">Phone Number</label>
                  <input className="cnt-input" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="cnt-form-group">
                  <label className="cnt-label">Company Name</label>
                  <input className="cnt-input" name="company" value={formData.company} onChange={handleChange} />
                </div>
                <div className="cnt-form-group">
                  <label className="cnt-label">Interested Package</label>
                  <select className="cnt-select" name="package" value={formData.package} onChange={handleChange}>
                    <option value="">Select a package</option>
                    <option value="website">Website</option>
                    <option value="mobile-app">Mobile Application</option>
                    <option value="ai-automation">AI Automation</option>
                    <option value="multiple-options">Multiple Options</option>
                  </select>
                </div>
                <div className="cnt-form-group">
                  <label className="cnt-label">Project Budget</label>
                  <select className="cnt-select" name="budget" value={formData.budget} onChange={handleChange}>
                    <option value="">Select budget</option>
                    <option value="500-1000">$500 – $1,000</option>
                    <option value="1000-2500">$1,000 – $2,500</option>
                    <option value="2500-5000">$2,500 – $5,000</option>
                    <option value="5000+">$5,000+</option>
                  </select>
                </div>
                <div className="cnt-form-group">
                  <label className="cnt-label">Project Details *</label>
                  <textarea className="cnt-textarea" name="message" rows="6" value={formData.message} onChange={handleChange} />
                  {errors.message && <span className="cnt-error">{errors.message}</span>}
                </div>
                <button className="cnt-btn cnt-btn-primary cnt-btn-full" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
                {errors.submit && <span className="cnt-error" style={{ display: "block", marginTop: "12px" }}>{errors.submit}</span>}
              </form>
            </div>

            {/* INFO */}
            <div className="cnt-info-card">
              <h2 className="cnt-info-title">Get in Touch</h2>
              <div className="cnt-info-item">
                <div>
                  <h4 className="cnt-info-item-title">Our Office</h4>
                  <p className="cnt-info-item-text">123 Web Design Street<br />San Francisco, CA</p>
                </div>
              </div>
              <div className="cnt-info-item">
                <div>
                  <h4 className="cnt-info-item-title">Phone</h4>
                  <p className="cnt-info-item-text">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="cnt-info-item">
                <div>
                  <h4 className="cnt-info-item-title">Email</h4>
                  <p className="cnt-info-item-text">hello@sitecraft.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="cnt-modal" onClick={closeModal}>
          <div className="cnt-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="cnt-modal-title">Message Sent Successfully!</h3>
            <p className="cnt-modal-text">We'll get back to you within 24 hours.</p>
            <button className="cnt-btn cnt-btn-primary" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}