'use client';
import { useState } from 'react';
import './styles.css';
export default function PaymentMethodsPage() {
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      brand: 'visa',
      lastFour: '4242',
      expiry: '12/2025',
      name: 'John Doe',
      isDefault: true,
      provider: null,
      mobileNumber: null
    },
    {
      id: 2,
      type: 'mobile',
      brand: 'mobile',
      lastFour: null,
      expiry: null,
      name: null,
      isDefault: false,
      provider: 'MTN',
      mobileNumber: '+1 234 567 8900'
    }
  ]);

  // State for new payment method form
  const [activeMethod, setActiveMethod] = useState('card');
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    setAsDefault: true
  });
  const [newMobileMoney, setNewMobileMoney] = useState({
    provider: '',
    mobileNumber: '',
    saveAccount: true
  });

  // State for editing
  const [editingMethod, setEditingMethod] = useState(null);
  const [editForm, setEditForm] = useState({
    expiry: '',
    name: '',
    mobileNumber: ''
  });

  // Handle method option click
  const handleMethodOptionClick = (method) => {
    setActiveMethod(method);
  };

  // Handle new card input changes
  const handleCardInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCard(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle mobile money input changes
  const handleMobileInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMobileMoney(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format card number for display
  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  // Handle adding new card
  const handleAddCard = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newCard.cardNumber || !newCard.expiryDate || !newCard.cvv || !newCard.cardholderName) {
      alert('Please fill all required fields');
      return;
    }

    // Extract last 4 digits
    const lastFour = newCard.cardNumber.replace(/\D/g, '').slice(-4);
    
    // Determine card brand based on first digit
    const firstDigit = newCard.cardNumber.charAt(0);
    let brand = 'credit-card';
    if (firstDigit === '4') brand = 'visa';
    else if (firstDigit === '5') brand = 'mastercard';
    else if (firstDigit === '3') brand = 'amex';

    // Create new payment method
    const newPaymentMethod = {
      id: Date.now(),
      type: 'card',
      brand: brand,
      lastFour: lastFour,
      expiry: newCard.expiryDate,
      name: newCard.cardholderName,
      isDefault: newCard.setAsDefault,
      provider: null,
      mobileNumber: null
    };

    // If setting as default, update other methods
    let updatedMethods = [...paymentMethods];
    if (newCard.setAsDefault) {
      updatedMethods = updatedMethods.map(method => ({
        ...method,
        isDefault: false
      }));
    }

    updatedMethods.push(newPaymentMethod);
    setPaymentMethods(updatedMethods);

    // Reset form
    setNewCard({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      setAsDefault: true
    });

    alert('Card added successfully!');
  };

  // Handle saving mobile money
  const handleSaveMobileMoney = (e) => {
    e.preventDefault();
    
    if (!newMobileMoney.provider || !newMobileMoney.mobileNumber) {
      alert('Please select a provider and enter your mobile number');
      return;
    }

    const newPaymentMethod = {
      id: Date.now(),
      type: 'mobile',
      brand: 'mobile',
      lastFour: null,
      expiry: null,
      name: null,
      isDefault: false,
      provider: newMobileMoney.provider,
      mobileNumber: newMobileMoney.mobileNumber
    };

    setPaymentMethods(prev => [...prev, newPaymentMethod]);
    
    // Reset form
    setNewMobileMoney({
      provider: '',
      mobileNumber: '',
      saveAccount: true
    });

    alert('Mobile Money account saved successfully!');
  };

  // Handle setting default payment method
  const handleSetDefault = (id) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    setPaymentMethods(updatedMethods);
  };

  // Handle removing payment method
  const handleRemoveMethod = (id) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    
    // If we removed the default, set the first remaining method as default
    if (updatedMethods.length > 0 && !updatedMethods.some(m => m.isDefault)) {
      updatedMethods[0].isDefault = true;
    }
    
    setPaymentMethods(updatedMethods);
    setEditingMethod(null); // Close edit form if open
  };

  // Handle starting edit
  const handleStartEdit = (method) => {
    setEditingMethod(method.id);
    setEditForm({
      expiry: method.expiry || '',
      name: method.name || '',
      mobileNumber: method.mobileNumber || ''
    });
  };

  // Handle saving edit
  const handleSaveEdit = (id) => {
    const updatedMethods = paymentMethods.map(method => {
      if (method.id === id) {
        return {
          ...method,
          expiry: editForm.expiry || method.expiry,
          name: editForm.name || method.name,
          mobileNumber: editForm.mobileNumber || method.mobileNumber
        };
      }
      return method;
    });
    
    setPaymentMethods(updatedMethods);
    setEditingMethod(null);
    alert('Payment method updated successfully!');
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingMethod(null);
    setEditForm({
      expiry: '',
      name: '',
      mobileNumber: ''
    });
  };

  // Handle menu toggle (for mobile)
  const handleMenuToggle = () => {
    console.log('Menu toggle clicked');
    // In a real app, you would toggle a sidebar here
  };

  // Card brand icons mapping
  const cardBrandIcons = {
    visa: 'fab fa-cc-visa',
    mastercard: 'fab fa-cc-mastercard',
    amex: 'fab fa-cc-amex',
    mobile: 'fas fa-mobile-alt',
    'credit-card': 'fas fa-credit-card'
  };

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button className="menu-toggle" id="menuToggle" onClick={handleMenuToggle}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="breadcrumb">
              <a href="/dashboard">Dashboard</a>
              <i className="fas fa-chevron-right"></i>
              <a href="/billing">Billing</a>
              <i className="fas fa-chevron-right"></i>
              <span>Payment Methods</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="icon-btn">
                <i className="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Payment Methods Content */}
        <div className="content-area">
          {/* Current Payment Methods */}
          <section className="card">
            <div className="card-header">
              <h3>Your Payment Methods</h3>
              <p>Manage your saved payment methods for faster checkout</p>
            </div>
            <div className="card-body">
              <div className="payment-methods-list">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id} 
                    className={`payment-method-card ${method.isDefault ? 'default' : ''}`}
                  >
                    <div className="method-header">
                      <div className="method-icon">
                        <i className={cardBrandIcons[method.brand] || 'fas fa-credit-card'}></i>
                      </div>
                      <div className="method-details">
                        {method.type === 'card' ? (
                          <>
                            <h4>
                              {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} ending in {method.lastFour}
                            </h4>
                            <p>
                              Expires {method.expiry} • {method.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <h4>{method.provider}</h4>
                            <p>{method.mobileNumber}</p>
                          </>
                        )}
                      </div>
                      <div className="method-status">
                        {method.isDefault ? (
                          <span className="default-badge">Default</span>
                        ) : (
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Edit Form or Actions */}
                    {editingMethod === method.id ? (
                      <div className="edit-form">
                        {method.type === 'card' ? (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Expiry Date</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                name="expiry"
                                value={editForm.expiry}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Cardholder Name</label>
                              <input
                                type="text"
                                placeholder="John Doe"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="form-group">
                            <label>Mobile Number</label>
                            <input
                              type="text"
                              placeholder="+1 234 567 8900"
                              name="mobileNumber"
                              value={editForm.mobileNumber}
                              onChange={handleEditChange}
                            />
                          </div>
                        )}
                        <div className="edit-actions">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSaveEdit(method.id)}
                          >
                            Save Changes
                          </button>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="method-actions">
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleStartEdit(method)}
                        >
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                        {!method.isDefault && (
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => handleRemoveMethod(method.id)}
                          >
                            <i className="fas fa-trash"></i>
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Add New Payment Method */}
          <section className="card">
            <div className="card-header">
              <h3>Add New Payment Method</h3>
            </div>
            <div className="card-body">
              <div className="payment-method-options">
                <div 
                  className={`method-option ${activeMethod === 'card' ? 'active' : ''}`}
                  onClick={() => handleMethodOptionClick('card')}
                >
                  <i className="fab fa-cc-stripe"></i>
                  <span>Credit/Debit Card</span>
                </div>
                <div 
                  className={`method-option ${activeMethod === 'bank' ? 'active' : ''}`}
                  onClick={() => handleMethodOptionClick('bank')}
                >
                  <i className="fas fa-university"></i>
                  <span>Bank Transfer</span>
                </div>
                <div 
                  className={`method-option ${activeMethod === 'mobile' ? 'active' : ''}`}
                  onClick={() => handleMethodOptionClick('mobile')}
                >
                  <i className="fas fa-mobile-alt"></i>
                  <span>Mobile Money</span>
                </div>
              </div>

              {/* Credit Card Form */}
              {activeMethod === 'card' && (
                <form className="payment-form active" onSubmit={handleAddCard}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456" 
                        className="card-input"
                        name="cardNumber"
                        value={newCard.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setNewCard(prev => ({ ...prev, cardNumber: formatted }));
                        }}
                        maxLength="19"
                      />
                      <div className="card-icons">
                        <i className="fab fa-cc-visa"></i>
                        <i className="fab fa-cc-mastercard"></i>
                        <i className="fab fa-cc-amex"></i>
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        name="expiryDate"
                        value={newCard.expiryDate}
                        onChange={handleCardInputChange}
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input 
                        type="password" 
                        placeholder="123"
                        name="cvv"
                        value={newCard.cvv}
                        onChange={handleCardInputChange}
                        maxLength="4"
                      />
                      <i className="fas fa-question-circle help-icon" title="3-digit security code"></i>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        name="cardholderName"
                        value={newCard.cardholderName}
                        onChange={handleCardInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-checkbox">
                      <input 
                        type="checkbox" 
                        id="setDefault" 
                        name="setAsDefault"
                        checked={newCard.setAsDefault}
                        onChange={handleCardInputChange}
                      />
                      <label htmlFor="setDefault">Set as default payment method</label>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-plus"></i>
                      Add Card
                    </button>
                  </div>
                </form>
              )}

              {/* Bank Transfer Info */}
              {activeMethod === 'bank' && (
                <div className="payment-form" id="bank-form">
                  <div className="bank-info">
                    <h4>Bank Transfer Instructions</h4>
                    <div className="bank-details">
                      <div className="bank-detail-item">
                        <span>Bank Name:</span>
                        <strong>Global Business Bank</strong>
                      </div>
                      <div className="bank-detail-item">
                        <span>Account Name:</span>
                        <strong>WebCraft Services Inc.</strong>
                      </div>
                      <div className="bank-detail-item">
                        <span>Account Number:</span>
                        <strong>1234567890</strong>
                      </div>
                      <div className="bank-detail-item">
                        <span>Routing Number:</span>
                        <strong>021000021</strong>
                      </div>
                      <div className="bank-detail-item">
                        <span>SWIFT/BIC:</span>
                        <strong>GBBUS33</strong>
                      </div>
                    </div>
                    <div className="bank-note">
                      <p><i className="fas fa-info-circle"></i> Please include your invoice number as reference when making transfers</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Money Form */}
              {activeMethod === 'mobile' && (
                <form className="payment-form" onSubmit={handleSaveMobileMoney}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Mobile Provider</label>
                      <select 
                        className="form-select"
                        name="provider"
                        value={newMobileMoney.provider}
                        onChange={handleMobileInputChange}
                      >
                        <option value="">Select Provider</option>
                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                        <option value="Airtel Money">Airtel Money</option>
                        <option value="Vodafone Cash">Vodafone Cash</option>
                        <option value="Orange Money">Orange Money</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input 
                        type="text" 
                        placeholder="+1 234 567 8900"
                        name="mobileNumber"
                        value={newMobileMoney.mobileNumber}
                        onChange={handleMobileInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-checkbox">
                      <input 
                        type="checkbox" 
                        id="saveMobile"
                        name="saveAccount"
                        checked={newMobileMoney.saveAccount}
                        onChange={handleMobileInputChange}
                      />
                      <label htmlFor="saveMobile">Save this mobile money account</label>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-save"></i>
                      Save Mobile Money
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* Security & Trust */}
          <section className="card">
            <div className="card-header">
              <h3>Security & Privacy</h3>
            </div>
            <div className="card-body">
              <div className="security-features">
                <div className="security-item">
                  <i className="fas fa-shield-alt"></i>
                  <div className="security-info">
                    <h4>PCI DSS Compliant</h4>
                    <p>We adhere to the highest security standards for payment processing</p>
                  </div>
                </div>
                <div className="security-item">
                  <i className="fas fa-lock"></i>
                  <div className="security-info">
                    <h4>256-bit Encryption</h4>
                    <p>All your payment data is encrypted and securely stored</p>
                  </div>
                </div>
                <div className="security-item">
                  <i className="fas fa-user-shield"></i>
                  <div className="security-info">
                    <h4>Privacy Protected</h4>
                    <p>We never share your payment details with third parties</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}