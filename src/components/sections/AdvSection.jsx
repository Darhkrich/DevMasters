"use client";

import { useEffect } from "react";

export default function AdvSection() {

  useEffect(() => {
    // Reveal logic
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < windowHeight - 100) {
          el.classList.add("active");
        }
      });
    };

    revealOnScroll();
    window.addEventListener("scroll", revealOnScroll);

    // Vanilla Tilt
    if (window.VanillaTilt) {
      VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15,
        speed: 400,
      });
    }

    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <>
    <section className="adv-section">
    
   
   
    <div className="adv-overlay"></div>

    <div className="adv-container">

        
        <div className="adv-header reveal">
            <h2>🚀 Next-Gen Services Now Available</h2>
            <p>Experience the future with our elite <strong>Application Development</strong> and transformational <strong>AI Automation</strong> solutions.</p>
        </div>

        <div className="adv-cards-grid">

           
            <div className="adv-card reveal" data-tilt data-tilt-max="15">
                
                <div className="adv-card-icon"><i className="fas fa-mobile-alt"></i></div>
                <h3 >Application Development</h3>
                
                <p>Custom-built mobile and web apps with unmatched speed, UI quality, and scalability.</p>

                <ul className="adva-list">
                    <li><i className="fas fa-check"></i> Android & iOS Mobile Apps</li>
                    <li><i className="fas fa-check"></i> Web Apps & SaaS Platforms</li>
                    <li><i className="fas fa-check"></i> Advanced UI/UX Design</li>
                </ul>

               
            </div>

            
            <div className="adv-card reveal" data-tilt data-tilt-max="15">
                
                <div className="adv-card-icon"><i className="fas fa-robot"></i></div>
                <h3>AI Automation</h3>
                <p>Integrate cutting-edge AI systems to automate tasks, boost performance, and grow smarter.</p>

                <ul className="adv-list">
                    <li><i className="fas fa-check"></i> AI Chatbots</li>
                    <li><i className="fas fa-check"></i> Business Workflow Automation</li>
                    <li><i className="fas fa-check"></i> Smart Data Analysis</li>
                </ul>

                
            </div>

        </div>

       
        <div className="adv-banner reveal">
           
            <h3>🔥 Transform Your Business with AI + App Development</h3>
            <p>Let’s build something powerful — elevate your brand with modern technology.</p>
           
        </div>

    </div>
</section>
    </>
  );
}