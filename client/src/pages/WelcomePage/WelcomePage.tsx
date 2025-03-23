import React, { useState, useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setIsScrolled(window.scrollY > heroHeight - 100);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="welcome-container">
      <header className={`site-header ${isScrolled ? 'hidden' : ''}`}>
        <div className="logo">CENTSIBLE</div>
        <nav className="main-nav">
          <ul>
            <li><a href="#">Features</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="btn-login">Sign In</button>
        </div>
      </header>

      <section className="hero-section" id="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <div className="tag-line">YOUR FINANCIAL COMPANION</div>
          <h1>Take Control Of Your<br />Money Today!</h1>
          <div className="hero-buttons">
            <button className="btn-cta-primary">Get Started</button>
            <button className="btn-cta-secondary">Learn More</button>
          </div>
          <button className="scroll-down" onClick={() => document.getElementById('section-01')?.scrollIntoView({ behavior: 'smooth' })}>
            Scroll down
            <span className="arrow">↓</span>
          </button>
        </div>
      </section>

      <section className="content-section" id="section-01">
        <div className="section-container">
          <div className="section-number">01</div>
          <div className="section-header">
            <div className="section-tag">GET STARTED</div>
            <h2>Track Every Dollar<br />With Ease</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              Centsible makes it simple to monitor all your transactions in one place.
              Our intuitive interface automatically categorizes your spending, making
              budget tracking effortless. Connect your accounts and start seeing where
              your money goes immediately, with real-time updates and notifications.
            </p>
            <a href="#" className="read-more">read more <span className="arrow">→</span></a>
          </div>
          <div className="section-image">
            <div className="image-placeholder">Image of person budgeting</div>
          </div>
        </div>
      </section>

      <section className="content-section alt-section">
        <div className="section-container">
          <div className="section-image">
            <div className="image-placeholder">Image of budget dashboard</div>
          </div>
          <div className="section-number">02</div>
          <div className="section-header">
            <div className="section-tag">POWERFUL FEATURES</div>
            <h2>Visualize Your<br />Spending Habits</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              Transform complex financial data into clear, actionable insights. 
              Centsible's beautiful charts and reports help you understand exactly 
              where your money is going. Identify spending patterns, spot savings 
              opportunities, and track your progress toward financial goals with 
              our interactive dashboards.
            </p>
            <a href="#" className="read-more">read more <span className="arrow">→</span></a>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-container">
          <div className="section-number">03</div>
          <div className="section-header">
            <div className="section-tag">SMART BUDGETING</div>
            <h2>Set Goals &<br />Achieve Them</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              Create custom savings goals and watch your progress in real-time. 
              Whether you're saving for a vacation, a new home, or building an emergency fund, 
              Centsible helps you stay on track. Set up automatic savings rules, get 
              personalized recommendations, and celebrate your milestones along the way.
            </p>
            <a href="#" className="read-more">read more <span className="arrow">→</span></a>
          </div>
          <div className="section-image">
            <div className="image-placeholder">Image of financial graphs</div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="simple-footer">
          <p>Made with love by Carson Fulmer</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;