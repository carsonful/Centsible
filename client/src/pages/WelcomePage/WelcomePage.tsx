import React from 'react';
import './WelcomePage.css';
import money from '../../assets/Hands - Cash.png';
import { SignOutButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';

const WelcomePage: React.FC = () => {
  return (
    <div className="welcome-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-placeholder"></div>
          <span className="logo-text">centsible</span>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#use-cases">Use Cases</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </nav>


        {/* If user is signed in show this */}
        <SignedIn>
          <SignOutButton>
            <button className="cta-button-small">Sign out</button>
          </SignOutButton>
        </SignedIn>

        {/* If user is signed out show this */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="cta-button-small">Sign in</button>
          </SignInButton>
        </SignedOut>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Smart finance for <span className="highlight">your future</span></h1>
          <p>
            Simple tools to help you manage your money efficiently,
            track expenses, set goals, and make smarter financial decisions.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="cta-button">Get started</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" className="cta-button">Dashboard </a>
          </SignedIn>
        </div>
        <div className="hero-image">
          <img src={money} alt="Hands holding cash" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-title">
          <span className="tag">Features</span>
          <h2>Smart tools for your finances</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">01</div>
            <h3>Expense Tracking</h3>
            <p>Automatically categorize and visualize your spending patterns</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">02</div>
            <h3>Budget Planning</h3>
            <p>Create custom budgets that adapt to your lifestyle and goals</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">03</div>
            <h3>Savings Goals</h3>
            <p>Set, track, and achieve your financial milestones</p>
          </div>

          <div className="feature-card">
            <div className="feature-number">04</div>
            <h3>Visual Analytics</h3>
            <p>Gain insights through intuitive charts and reports</p>
          </div>
        </div>
      </section>
      
      {/* Chart Demo Section */}
      <section className="chart-section">
        <div className="section-title">
          <span className="tag">Analytics</span>
          <h2>Visualize your spending habits</h2>
          <p>Gain insights through intuitive and clear financial charts</p>
        </div>
        

        <div className='placeholder-text'>Chart Coming Soon</div>
      </section>

      {/* App Preview Section */}
      <section className="app-preview-section">
        <div className="section-title">
          <span className="tag">App Preview</span>
          <h2>See what you're getting</h2>
          <p>A clean, intuitive interface that makes finance management simple</p>
        </div>
        
        <div className="preview-container">
          <div className="preview-placeholder">
            <div className="placeholder-text">App Screenshot Coming Soon</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-title">
          <span className="tag">Process</span>
          <h2>How Centsible works</h2>
          <p>Getting started is easy and only takes a few minutes</p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect your accounts</h3>
            <p>Securely link your bank accounts to automatically import your financial data</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Categorize expenses</h3>
            <p>We'll automatically sort your transactions into categories you can customize</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Set your budget</h3>
            <p>Create budget goals based on your spending history and financial objectives</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track and optimize</h3>
            <p>Get insights and recommendations to improve your financial habits</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to optimize your finances?</h2>
          <p>
            Start your journey to financial freedom today.
          </p>
          <SignedOut>
            <a href="#proposal" className="cta-button">Get started</a>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" className="cta-button">Dashboard</a>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Made with ♥ by Carson Fulmer</p>
      </footer>
    </div>
  );
};

export default WelcomePage;