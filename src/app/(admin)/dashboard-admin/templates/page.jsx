'use client';
import './styles.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const TemplatesManagementPage = () => {
  
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Business Pro',
      description: 'Modern business website with professional design',
      category: 'business',
      price: 299,
      orders: 24,
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/007bff/ffffff?text=Business+Pro',
    },
    {
      id: 2,
      name: 'Ecommerce Basic',
      description: 'Complete online store with product management',
      category: 'ecommerce',
      price: 499,
      orders: 18,
      rating: 4.9,
      image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Ecommerce+Basic',
    },
    {
      id: 3,
      name: 'Portfolio Modern',
      description: 'Creative portfolio for designers and artists',
      category: 'portfolio',
      price: 199,
      orders: 32,
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/6f42c1/ffffff?text=Portfolio+Modern',
    },
    {
      id: 4,
      name: 'Restaurant Elite',
      description: 'Restaurant website with menu and reservation system',
      category: 'restaurant',
      price: 349,
      orders: 15,
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200/fd7e14/ffffff?text=Restaurant+Elite',
    },
    {
      id: 5,
      name: 'Medical Pro',
      description: 'Healthcare website with appointment booking',
      category: 'medical',
      price: 399,
      orders: 12,
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/d63384/ffffff?text=Medical+Pro',
    },
    {
      id: 6,
      name: 'Blog Master',
      description: 'Professional blogging platform with modern design',
      category: 'blog',
      price: 179,
      orders: 28,
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/20c997/ffffff?text=Blog+Master',
    },
  ]);

  // Filter states
  const [activeCategory, setActiveCategory] = useState('All Templates');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtered templates
  const [filteredTemplates, setFilteredTemplates] = useState(templates);

  // Categories for filtering
  const categories = [
    'All Templates',
    'Business',
    'E-commerce',
    'Portfolio',
    'Restaurant',
    'Medical',
    'Blog'
  ];

 

  // Handle filter changes
  useEffect(() => {
    let result = [...templates];

    // Search filter
    if (searchQuery) {
      result = result.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (activeCategory !== 'All Templates') {
      result = result.filter(template => 
        template.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    setFilteredTemplates(result);
  }, [templates, activeCategory, searchQuery]);

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  // Handle preview template
  const handlePreviewTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    console.log(`Previewing template: ${template.name}`);
    alert(`Opening preview for ${template.name}`);
  };

  // Handle edit template
  const handleEditTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    console.log(`Editing template: ${template.name}`);
    alert(`Opening edit form for ${template.name}`);
  };



  // Get category badge class
  const getCategoryClass = (category) => {
    switch (category) {
      case 'business':
        return 'template-category business';
      case 'ecommerce':
        return 'template-category ecommerce';
      case 'portfolio':
        return 'template-category portfolio';
      case 'restaurant':
        return 'template-category restaurant';
      case 'medical':
        return 'template-category medical';
      case 'blog':
        return 'template-category blog';
      default:
        return 'template-category';
    }
  };

  // Format price
  const formatPrice = (price) => {
    return `$${price}`;
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Templates Management</h1>
            <p className="welcome-text">Manage your website templates and categories</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search templates..." 
                value={searchQuery}
                onChange={handleSearch}
              />
              <button>🔍</button>
            </div>
            <Link href="/dashboard-admin/Add-Templates">
            <button className="primary-btn">
              + Add New Template
            </button>
            </Link>
          </div>
        </header>

        {/* Template Categories */}
        <div className="categories-bar">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="templates-grid">
          {filteredTemplates.map((template) => (
            <div className="template-card" key={template.id}>
              <div className="template-image">
                <img src={template.image} alt={`${template.name} Template`} />
                <div className="template-overlay">
                  <button 
                    className="overlay-btn"
                    onClick={() => handlePreviewTemplate(template.id)}
                  >
                    Preview
                  </button>
                  <button 
                    className="overlay-btn"
                    onClick={() => handleEditTemplate(template.id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="template-meta">
                  <span className={getCategoryClass(template.category)}>
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </span>
                  <span className="template-price">{formatPrice(template.price)}</span>
                </div>
                <div className="template-stats">
                  <span>📊 {template.orders} orders</span>
                  <span>⭐ {template.rating}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Template Card */}
          <div className="template-card add-new-template">
            <Link href="/dashboard-admin/Add-Templates">
            <div className="add-new-content" >
              <span className="add-icon">+</span>
              <h3>Add New Template</h3>
              <p>Create a new website template</p>
              <div className="primary-btn">Create Template</div>
            </div>
            </Link>
          </div>
        </div>

        {/* No Results Message */}
        {filteredTemplates.length === 0 && (
          <div className="no-templates-message">
            <div className="no-templates-icon">🎨</div>
            <h3>No templates found</h3>
            <p>Try changing your search or filter criteria</p>
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setActiveCategory('All Templates');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TemplatesManagementPage;