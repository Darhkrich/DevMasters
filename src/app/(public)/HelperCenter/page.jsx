"use client";

import { useState } from "react";
import Link from "next/link";
import "./helper.css";

// Sample article data
const articlesData = [
  {
    id: 1,
    categoryId: "getting-started",
    title: "Welcome to DevMasters – Your first steps",
    excerpt: "Learn how to set up your account and navigate the dashboard.",
    content:
      "<p>Welcome to DevMasters! This guide will help you get started with your new account. You'll learn how to customize your profile, understand the dashboard, and find the services you need.</p><p>If you have any questions, our support team is here to help.</p>",
  },
  {
    id: 2,
    categoryId: "getting-started",
    title: "How to request a quote",
    excerpt: "Use the 'Add to Quote' feature to build your custom package.",
    content:
      "<p>Our 'Add to Quote' button lets you collect services you're interested in. Once you're ready, you can submit the quote and we'll get back to you with a detailed proposal.</p>",
  },
  {
    id: 3,
    categoryId: "getting-started",
    title: "Understanding your client dashboard",
    excerpt: "Manage your projects, quotes, and support tickets.",
    content:
      "<p>The client dashboard is your central hub. Here you can track ongoing projects, view past quotes, and open support tickets. We'll guide you through each section.</p>",
  },
  {
    id: 4,
    categoryId: "websites",
    title: "Ready‑made vs custom websites",
    excerpt: "Which option is right for your business?",
    content:
      "<p>Ready‑made websites are pre‑built templates that launch quickly. Custom websites are built from scratch to your exact needs. Compare the pros and cons to decide.</p>",
  },
  {
    id: 5,
    categoryId: "websites",
    title: "How to add your own domain",
    excerpt: "Connect a custom domain to your new site.",
    content:
      "<p>After your site is ready, you can connect your own domain. We'll provide step‑by‑step instructions and help with DNS settings if needed.</p>",
  },
  {
    id: 6,
    categoryId: "apps",
    title: "Web app MVP development process",
    excerpt: "From idea to launch in weeks, not months.",
    content:
      "<p>Our MVP process includes discovery, design, development, and testing. You'll be involved at every stage to ensure the final product meets your vision.</p>",
  },
  {
    id: 7,
    categoryId: "apps",
    title: "iOS vs Android – which first?",
    excerpt: "Advice on platform choice for mobile apps.",
    content:
      "<p>Depending on your target audience, you may want to start with iOS or Android. We'll help you analyze market data and make the right decision.</p>",
  },
  {
    id: 8,
    categoryId: "ai",
    title: "What is AI automation?",
    excerpt: "An introduction to AI‑powered workflows.",
    content:
      "<p>AI automation uses machine learning to handle repetitive tasks, qualify leads, and provide instant customer support. Learn how it can save your business time and money.</p>",
  },
  {
    id: 9,
    categoryId: "ai",
    title: "Setting up your first chatbot",
    excerpt: "A guide to deploying a chatbot on your website.",
    content:
      "<p>Our chatbots can answer FAQs, collect lead info, and even schedule meetings. This article walks you through the setup process.</p>",
  },
  {
    id: 10,
    categoryId: "billing",
    title: "One‑time vs monthly plans",
    excerpt: "Understand the differences and choose wisely.",
    content:
      "<p>One‑time plans cover the initial build with a warranty period. Monthly plans include ongoing maintenance, updates, and priority support. Compare them here.</p>",
  },
  {
    id: 11,
    categoryId: "billing",
    title: "How to update your payment method",
    excerpt: "Keep your billing information current.",
    content:
      "<p>You can update your credit card or switch between payment methods in your account settings. Follow these simple steps.</p>",
  },
  {
    id: 12,
    categoryId: "account",
    title: "Resetting your password",
    excerpt: "Forgot your password? Here's how to reset it.",
    content:
      "<p>Click 'Forgot password' on the login page, enter your email, and follow the instructions sent to you. If you don't receive an email, check your spam folder.</p>",
  },
  {
    id: 13,
    categoryId: "account",
    title: "Managing team members",
    excerpt: "Add or remove users from your account.",
    content:
      "<p>You can invite team members to collaborate on projects. Each member gets their own login and permissions. Learn how to manage them here.</p>",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null); // for modal

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: "fas fa-rocket", count: 3 },
    { id: "websites", name: "Websites", icon: "fas fa-globe", count: 2 },
    { id: "apps", name: "Apps & Development", icon: "fas fa-mobile-alt", count: 2 },
    { id: "ai", name: "AI Automation", icon: "fas fa-robot", count: 2 },
    { id: "billing", name: "Billing & Pricing", icon: "fas fa-credit-card", count: 2 },
    { id: "account", name: "Account & Support", icon: "fas fa-user-cog", count: 2 },
  ];

  // Filter articles by search and active category
  const filteredArticles = articlesData.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || article.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Close modal
  const closeModal = () => setSelectedArticle(null);

  return (
    <main className="sp6__wc-services-page sp6__help-center-page">
      {/* HERO with search */}
      <section className="sp6__help-hero">
        <div className="sp6__help-hero-content">
          <span className="sp6__wc-pill">
            <i className="fas fa-life-ring"></i> Help Center
          </span>
          <h1>How can we help you?</h1>
          <p>Search for articles, guides, and FAQs or browse by category.</p>
          <div className="sp6__help-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="sp6__help-categories">
        <h2>Browse by category</h2>
        <div className="sp6__category-grid">
          <button
            className={`sp6__category-card ${activeCategory === "all" ? "sp6__category-card--active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            <i className="fas fa-border-all"></i>
            <h3>All articles</h3>
            <span>{articlesData.length} articles</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`sp6__category-card ${activeCategory === cat.id ? "sp6__category-card--active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <i className={cat.icon}></i>
              <h3>{cat.name}</h3>
              <span>{cat.count} articles</span>
            </button>
          ))}
        </div>
      </section>

      {/* ARTICLES LIST */}
      <section className="sp6__articles-section">
        <h2>
          {activeCategory === "all"
            ? "All articles"
            : `${categories.find((c) => c.id === activeCategory)?.name || "Articles"}`}
        </h2>
        {filteredArticles.length === 0 ? (
          <p className="sp6__no-articles">No articles found. Try a different search or category.</p>
        ) : (
          <div className="sp6__articles-grid">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="sp6__article-card"
                onClick={() => setSelectedArticle(article)}
              >
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <span className="sp6__read-more">
                  Read article <i className="fas fa-arrow-right"></i>
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* POPULAR ARTICLES + FAQ (still visible) */}
      <div className="sp6__help-layout">
        <section className="sp6__popular-articles">
          <h2>Popular articles</h2>
          <ul className="sp6__articles-list">
            {articlesData.slice(0, 5).map((article) => (
              <li key={article.id}>
                <button type="button" onClick={() => setSelectedArticle(article)}>
                  <i className="fas fa-file-alt"></i> {article.title}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="sp6__faq-section">
          <h2>Frequently asked questions</h2>
          <div className="sp6__faq-list">
            {/* FAQ items (static) – could also be dynamic */}
            <div className="sp6__faq-item">
              <button className="sp6__faq-question">
                <span>How long does it take to launch a ready‑made website?</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              {/* You can add answers later */}
            </div>
            <div className="sp6__faq-item">
              <button className="sp6__faq-question">
                <span>Can I switch from a monthly plan to one‑time later?</span>
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
            <div className="sp6__faq-item">
              <button className="sp6__faq-question">
                <span>Do you provide ongoing maintenance?</span>
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* CONTACT SUPPORT */}
      <section className="sp6__help-contact">
        <div className="sp6__contact-card">
          <h2>Still need help?</h2>
          <p>Our support team is ready to assist you.</p>
          <div className="sp6__contact-options">
            <Link href="/contact" className="sp6__wc-btn-primary">
              <i className="fas fa-envelope"></i> Contact us
            </Link>
            <Link href="/" className="sp6__wc-btn-ghost">
              <i className="fas fa-home"></i> Back to Homepage
            </Link>
          </div>
          <p className="sp6__contact-note">Response time: within 24 hours</p>
        </div>
      </section>

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div className="sp6__modal-overlay" onClick={closeModal}>
          <div className="sp6__modal" onClick={(e) => e.stopPropagation()}>
            <button className="sp6__modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <h2>{selectedArticle.title}</h2>
            <div
              className="sp6__modal-content"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
