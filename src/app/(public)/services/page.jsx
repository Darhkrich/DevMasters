import Link from "next/link";
import Image from "next/image";
import "./services.css";
export const metadata = {
  title: "Our Services | BOEM",
  description:
    "From ready-made websites to custom apps and AI automation. Explore WebCraft services and choose what fits your business.",
};

export default function ServicesPage() {
  return (
    <main className="sp1__wc-services-page">

      {/* ================= HERO ================= */}
      <section className="sp1__wc-services-hero" data-aos="fade-up">
        <div className="sp1__wc-services-hero-text">
          <span className="sp1__wc-pill">Our Premium Services</span>
          <h1>Everything you need to get online faster.</h1>
          <p>
            From ready-made websites to fully custom apps and AI automations,
            pick the service that matches your goals and budget.
          </p>
        </div>

        <div className="sp1__wc-services-hero-demo">
          <div className="sp1__wc-hero-demo-card">
            <span className="sp1__wc-hero-label"></span>

            <Link href="/contact" className="sp1__wc-btn-primary">
              Book a Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ================= QUICK NAV ================= */}
      <nav className="sp1__wc-services-nav" aria-label="Services navigation">
        <a href="#ready-made" className="sp1__wc-services-nav-item">
          <i className="fas fa-globe"></i>
          <span>Ready-Made Websites</span>
        </a>
        <a href="#templates" className="sp1__wc-services-nav-item">
          <i className="fas fa-paint-brush"></i>
          <span>Customizable Websites</span>
        </a>
        <a href="#apps" className="sp1__wc-services-nav-item">
          <i className="fas fa-mobile-alt"></i>
          <span>Web & Mobile Apps</span>
        </a>
        <a href="#ai" className="sp1__wc-services-nav-item">
          <i className="fas fa-robot"></i>
          <span>AI Automation</span>
        </a>
      </nav>

      {/* ================= READY-MADE WEBSITES ================= */}
      <section id="ready-made" className="sp1__wc-service-section" data-aos="fade-up">
        <header className="sp1__wc-service-section-header">
          <div>
            <h2>Available Websites</h2>
            <p>
              Launch a professional website in days instead of months. Pick a
              pre-built site, we plug in your content and you’re live.
            </p>
          </div>
          <div className="sp1__wc-section-badge">Fastest launch</div>
        </header>

        <div className="sp1__wc-service-layout">
          <div className="sp1__wc-service-cards">
            <Link href="/services/templates">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas"></i>
                <div>
                  <h3>Starter Business Site</h3>
                  <p>
                    Perfect for small businesses that need a clean home, about,
                    services and contact page.
                  </p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-clock"></i> Delivery: 3–5 days</li>
                    <li><i className="fas fa-check-circle"></i> Mobile responsive</li>
                  </ul>
                </div>
              </div>
            </Link>
            <Link href="/services/templates">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-store"></i>
                <div>
                  <h3>E-Commerce Website</h3>
                  <p>
                    Launch your Online store to sell your products and services
                    with easy checkout.
                  </p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-box-open"></i> Upload unlimited products</li>
                    <li><i className="fas fa-credit-card"></i> Payments integrated</li>
                  </ul>
                </div>
              </div>
            </Link>

            <Link href="/services/templates">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-store"></i>
                <div>
                  <h3>Blogs/Social Media Website</h3>
                  <p>
                    Control the media with No limitations
                  </p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-box-open"></i> Post unlimited</li>
                    <li><i className="fas fa-credit-card"></i> 
                      Get Monetize on your wesite
                    </li>
                  </ul>
                </div>
              </div>
            </Link>

            <Link href="/services/templates">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-user-tie"></i>
                <div>
                  <h3>Personal Brand / Portfolio Websites</h3>
                  <p>
                    For creators, freelancers and professionals who want to
                    showcase work and capture leads.
                  </p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-images"></i> Gallery + case studies</li>
                    <li><i className="fas fa-envelope-open-text"></i> Lead forms</li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>

          <aside className="sp1__wc-service-demo">
            <h3>Ready-Made Websites Demo</h3>
            <p>
              Scroll through a quick preview of what your site could look like.
              Swap colors, fonts and images without touching code.
            </p>

            <div className="sp1__wc-demo-window">
              <div className="sp1__wc-demo-window-body">
                <Image
                  src="/builder-one.png"
                  alt="Builder website preview"
                  className="sp1__two"
                  width={1200}
                  height={900}
                />
              </div>
            </div>

            <Link href="/services/templates" className="sp1__wc-btn-ghost">
              View Sample Ready-Made Websites
            </Link>
          </aside>
        </div>
      </section>

      {/* ================= TEMPLATES ================= */}
      <section id="templates" className="sp1__wc-service-section" data-aos="fade-up">
        <header className="sp1__wc-service-section-header">
          <div>
            <h2>Customizable Website </h2>
            <p>
              Choose a template that matches your industry and we’ll customize
              it to match your brand.
            </p>
          </div>
          <div className="sp1__wc-section-badge">Best value</div>
        </header>

        <div className="sp1__wc-service-layout">
          <div className="sp1__wc-service-cards">
            <Link href="/services/templates">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-briefcase"></i>
                <div>
                  <h3>Business & Agency websites</h3>
                  <p>
                    Modern layouts for agencies, consulting businesses and
                    service providers.
                  </p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-fill-drip"></i> Brand colors</li>
                    <li><i className="fas fa-pencil-alt"></i> Content filled</li>
                  </ul>
                </div>
              </div>
            </Link>
            <Link href="/services/templates">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-graduation-cap"></i>
                <div>
                  <h3>Course / Learning Websites</h3>
                  <p>
                    Landing pages and mini-sites for courses and memberships.
                  </p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-video"></i> Lesson sections</li>
                    <li><i className="fas fa-user-friends"></i> Funnels</li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= APPS & AI SECTIONS ================= */}

      <section id="apps" className="sp1__wc-service-section" data-aos="fade-up">
        <header className="sp1__wc-service-section-header">
          <div>
            <h1>Web & Mobile Apps</h1>
            <p>When you need more than a website. We design and build custom web and mobile apps that grow with your business.</p>
          </div>
          <div className="sp1__wc-section-badge">Custom development</div>
        </header>

        <div className="sp1__wc-service-layout">
          <div className="sp1__wc-service-cards">
            <Link href="/services/application">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-laptop-code"></i>
                <div>
                  <h3>Web App MVP</h3>
                  <p>Launch a minimum viable product to test your idea with real users quickly.</p>
                  {/* Fixed typo: classc → className */}
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-layer-group"></i> Modern tech stack</li>
                    <li><i className="fas fa-chart-line"></i> Analytics integration</li>
                  </ul>
                </div>
              </div>
            </Link>

            <Link href="/services/application">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-mobile-alt"></i>
                <div>
                  <h3>Hybrid Mobile App</h3>
                  <p>One codebase that works on both iOS and Android using modern frameworks.</p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-apple-alt"></i> iOS</li>
                    <li><i className="fab fa-android"></i> Android</li>
                  </ul>
                </div>
              </div>
            </Link>
            <Link href="/services/application">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-network-wired"></i>
                <div>
                  <h3>API & Integrations</h3>
                  <p>Connect your app to payment gateways, CRMs and third-party tools.</p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-plug"></i> Stripe, Paystack, etc.</li>
                    <li><i className="fas fa-sync"></i> Real-time sync</li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>

          <aside className="sp1__wc-service-demo">
            <h3>App Flow Demo</h3>
            <p>Preview a simple user flow: onboarding screen, dashboard, and settings — just like a real app.</p>

            <div className="sp1__wc-demo-mobile-row">
              <div className="sp1__wc-demo-phone">
                <div className="sp1__wc-demo-phone-notch"></div>
                <div className="sp1__wc-demo-phone-screen sp1__wc-demo-phone-screen--onboarding">
                  <Image src="/m2.jpg" alt="App onboarding preview" className="sp1__newimg" width={480} height={960} />
                </div>
              </div>
              <div className="sp1__wc-demo-phone">
                <div className="sp1__wc-demo-phone-notch"></div>
                <div className="sp1__wc-demo-phone-screen sp1__wc-demo-phone-screen--dashboard">
                  <Image src="/m3.jpg" alt="App dashboard preview" className="sp1__newimg" width={480} height={960} />
                </div>
              </div>
              <div className="sp1__wc-demo-phone">
                <div className="sp1__wc-demo-phone-notch"></div>
                <div className="sp1__wc-demo-phone-screen sp1__wc-demo-phone-screen--settings">
                  <Image src="/m4.jpg" alt="App settings preview" className="sp1__newimg" width={480} height={960} />
                </div>
              </div>
            </div>
            <Link href="/services/application">
              <button className="sp1__wc-btn-ghost">Talk About Your App Idea</button>
            </Link>
          </aside>
        </div>
      </section>

      <section id="ai" className="sp1__wc-service-section" data-aos="fade-up">
        <header className="sp1__wc-service-section-header">
          <div>
            <h1>AI Automation Services</h1>
            <p>Automate repetitive tasks, respond to customers faster, and make smarter decisions using AI.</p>
          </div>
          <div className="sp1__wc-section-badge">New</div>
        </header>

        <div className="sp1__wc-service-layout">
          <div className="sp1__wc-service-cards">
            <Link href="/services/ai-automation">        
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-comments"></i>
                <div>
                  <h3>AI Chatbots</h3>
                  <p>Handle FAQs, basic support, and lead capture 24/7 on your website or WhatsApp.</p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-comments-dollar"></i> Lead qualification</li>
                    <li><i className="fas fa-language"></i> Multi-language options</li>
                  </ul>
                </div>
              </div>
            </Link>
            <Link href="/services/ai-automation">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-envelope-open-text"></i>
                <div>
                  <h3>Email & Workflow Automation</h3>
                  <p>Trigger follow-up emails, reminders and notifications automatically based on user actions.</p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-bell"></i> Smart alerts</li>
                    <li><i className="fas fa-route"></i> Custom workflows</li>
                  </ul>
                </div>
              </div>
            </Link>
            <Link href="/services/ai-automation">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-brain"></i>
                <div>
                  <h3>AI Content Assist</h3>
                  <p>Generate drafts for blogs, product descriptions and social posts directly from your dashboard.</p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-pen-fancy"></i> Brand-tuned outputs</li>
                    <li><i className="fas fa-history"></i> Edit history saved</li>
                  </ul>
                </div>
              </div>
            </Link>

            <Link href="/services/ai-automation">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-brain"></i>
                <div>
                  <h3>Data & Document Processing</h3>
                  <p>Invoice & Receipt Extraction, Legal/Contract Review</p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-pen-fancy"></i> Brand-tuned outputs</li>
                    <li><i className="fas fa-history"></i> Edit history saved</li>
                  </ul>
                </div>
              </div> 
            </Link>
            <Link href="/services/ai-automation">
              <div className="sp1__service sp1__wc-accent-left" data-selectable="true">
                <i className="fas fa-brain"></i>
                <div>
                  <h3>Customer Support & Operations AI</h3>
                  <p>Auto-Triage system, AI reads and sends customer emails and messages, providing necessary assistance, Meeting Assistant</p>
                  <ul className="sp1__wc-service-meta">
                    <li><i className="fas fa-pen-fancy"></i> Brand-tuned outputs</li>
                    <li><i className="fas fa-history"></i> Edit history saved</li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>

          <aside className="sp1__wc-service-demo">
            <h3>Automation Demo</h3>
            <p>Watch how a simple customer question flows through your AI assistant and triggers actions.</p>

            <div className="sp1__wc-demo-automation">
              <div className="sp1__wc-demo-bubble sp1__wc-demo-bubble--user">“Hi, I want a website for my business.”</div>
              <div className="sp1__wc-demo-bubble sp1__wc-demo-bubble--bot">“Great! What type of business do you run?”</div>
              <div className="sp1__wc-demo-bubble sp1__wc-demo-bubble--system">Lead created in CRM ✓</div>
            </div>

            <button className="sp1__wc-btn-primary">Automate My Business</button>
          </aside>
        </div>
      </section>
    </main>
  );
}
