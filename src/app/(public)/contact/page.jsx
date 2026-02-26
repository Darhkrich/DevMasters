"use client";

import { useState } from "react";
import "./contact.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setShowModal(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        package: "",
        budget: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <>
      {/* HERO */}
      <section className="contact-hero">
        <div className="containers">
          <div className="the">
          <h2>Let’s Get You On The Internet And Boast Your Business Together</h2>
          <p>
            Have questions? We’re here to help. Get in touch with our team for
            expert guidance.
          </p>
          </div>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="contact-options">
        <div className="container">
          <div className="contact-cards">
            <div className="contact-card">
              <h3>Email Us</h3>
              <p>We usually reply within 24 hours</p>
              <a href="mailto:hello@sitecraft.com" className="contact-link">
                hello@sitecraft.com
              </a>
            </div>

            <div className="contact-card">
              <h3>Live Chat</h3>
              <p>Instant help during business hours</p>
              <button
                className="contact-link"
                onClick={() => alert("Live chat coming soon")}
              >
                Start Live Chat
              </button>
            </div>

            <div className="contact-card">
              
              <h3>Call Us</h3>
              <p>Speak directly with our experts</p>
              <a href="tel:+15551234567" className="contact-link">
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTACT */}
      <section className="main-contact">
        <div className="container">
          <div className="contact-grid">
            {/* FORM */}
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Interested Package</label>
                  <select
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                  >
                    <option value="">Select a package</option>
                    <option value="website">Website</option>
                    <option value="mobile-app">Mobile Application</option>
                    <option value="ai-automation">AI Automation</option>
                    <option value="multiple-options">multiple Options</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Project Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  >
                    <option value="">Select budget</option>
                    <option value="500-1000">$500 – $1,000</option>
                    <option value="1000-2500">$1,000 – $2,500</option>
                    <option value="2500-5000">$2,500 – $5,000</option>
                    <option value="5000+">$5,000+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Project Details *</label>
                  <textarea
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                  />
                  {errors.message && (
                    <span className="error-message">{errors.message}</span>
                  )}
                </div>

                <button className="btn btn-primary btn-full" type="submit">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* INFO */}
            <div className="contact-info">
              <h2>Get in Touch</h2>

              <div className="info-item">
                
                <div>
                  <h4>Our Office</h4>
                  <p>123 Web Design Street<br />San Francisco, CA</p>
                </div>
              </div>

              <div className="info-item">
               
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="info-item">
                <div>
                  <h4>Email</h4>
                  <p>hello@sitecraft.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
           
            <h3>Message Sent Successfully!</h3>
            <p>We’ll get back to you within 24 hours.</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}