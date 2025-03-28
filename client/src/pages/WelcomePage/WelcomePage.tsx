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
          <span className="logo-text">FairShare</span>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
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
          <h1><span className="highlight">Simplify shared expenses</span> with roommates</h1>
          <p>
            FairShare makes it easy to track shared bills, split costs fairly, and keep everyone on the same page.
            Plus, manage your personal budget all in one place.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="cta-button">Get started</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" className="cta-button">Dashboard</a>
          </SignedIn>
        </div>
        <div className="hero-image">
          <img src={money} alt="Roommate expense sharing" />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="section-title">
          <span className="tag">About</span>
          <h2>Why FairShare exists</h2>
          <p>We built FairShare to solve the headaches of shared living expenses</p>
        </div>
        
        <div className="about-content">
          <p>Living with roommates should be fun and stress-free, but money issues often cause tension. 
          FairShare was built by people who've been there - tracking expenses in messy spreadsheets, 
          chasing payments, and having awkward conversations about who owes what.</p>
          
          <p>Our app simplifies everything about shared finances, from splitting the rent and utilities 
          to tracking who bought the groceries last. And as a bonus, we've included personal budgeting tools 
          so you can manage your complete financial picture in one place.</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-title">
          <span className="tag">Features</span>
          <h2>Roommate finances made easy</h2>
        </div>

        <div className="features-grid roommate-features">
          <div className="feature-card primary-feature">
            <div className="feature-number">01</div>
            <h3>Bill Splitting</h3>
            <p>Split expenses equally or customize how costs are shared between roommates</p>
          </div>

          <div className="feature-card primary-feature">
            <div className="feature-number">02</div>
            <h3>Payment Tracking</h3>
            <p>Track who's paid what and get notified when payments are due</p>
          </div>

          <div className="feature-card primary-feature">
            <div className="feature-number">03</div>
            <h3>Recurring Bills</h3>
            <p>Set up regular expenses like rent and utilities to split automatically</p>
          </div>

          <div className="feature-card primary-feature">
            <div className="feature-number">04</div>
            <h3>Balance Summary</h3>
            <p>See who owes what at a glance with clear visual breakdowns</p>
          </div>
        </div>
        
        <div className="section-divider">
          <span>Plus</span>
        </div>
        
        <div className="section-subtitle">
          <h3>Personal Finance Tools</h3>
          <p>Keep track of your own spending alongside shared expenses</p>
        </div>
        
        <div className="features-grid secondary-features">
          <div className="feature-card secondary-feature">
            <div className="feature-number">05</div>
            <h3>Personal Budgeting</h3>
            <p>Set spending categories and track your personal expenses</p>
          </div>

          <div className="feature-card secondary-feature">
            <div className="feature-number">06</div>
            <h3>Savings Goals</h3>
            <p>Create and track personal savings targets</p>
          </div>
        </div>
      </section>
      
      {/* Chart Demo Section */}
      <section className="chart-section">
        <div className="section-title">
          <span className="tag">Analytics</span>
          <h2>Track shared expenses with clarity</h2>
          <p>See exactly how household costs are split and who owes what</p>
        </div>
        
        <div className="charts-container">
          <div className="chart-block primary-chart">
            <h3>Shared Expense Breakdown</h3>
            <div className='placeholder-text'>Roommate Expense Chart Coming Soon</div>
          </div>
          
          <div className="chart-block secondary-chart">
            <h3>Personal Budget Overview</h3>
            <div className='placeholder-text'>Personal Budget Chart Coming Soon</div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="app-preview-section">
        <div className="section-title">
          <span className="tag">App Preview</span>
          <h2>Designed for roommate harmony</h2>
          <p>An intuitive interface that makes expense sharing straightforward for everyone</p>
        </div>
        
        <div className="preview-container">
          <div className="preview-grid">
            <div className="preview-item main-preview">
              <h3>Roommate Expense Dashboard</h3>
              <div className="preview-placeholder">
                <div className="placeholder-text">Shared Expense View</div>
              </div>
            </div>
            
            <div className="preview-item secondary-preview">
              <h3>Personal Finance Tools</h3>
              <div className="preview-placeholder">
                <div className="placeholder-text">Personal Budget View</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-title">
          <span className="tag">Process</span>
          <h2>How FairShare works</h2>
          <p>Getting your household set up takes just minutes</p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create your household</h3>
            <p>Set up your shared space and invite all your roommates to join</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Add expenses as they happen</h3>
            <p>Quickly log bills and purchases - from rent to the pizza you ordered last night</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Choose how to split costs</h3>
            <p>Equal splits, percentage-based, or custom amounts for each person</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Settle up when ready</h3>
            <p>Get notified of balances and mark payments as complete when settled</p>
          </div>
        </div>
        
        <div className="secondary-features-note">
          <h3>Personal Budgeting</h3>
          <p>In addition to shared expenses, you can also set up personal budget categories and savings goals in your private dashboard.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-title">
          <span className="tag">Testimonials</span>
          <h2>From chaotic to clear</h2>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonial">
            <p>"Before FairShare, we had so many arguments about bills. Now everything's transparent and we haven't had a single money disagreement in months."</p>
            <div className="testimonial-author">— Jamie, Graduate Student</div>
          </div>
          
          <div className="testimonial">
            <p>"I love that I can see exactly what I owe at any time. The notification reminders are perfect for our busy household of four professionals."</p>
            <div className="testimonial-author">— Alex, Working Professional</div>
          </div>
          
          <div className="testimonial">
            <p>"The personal budgeting feature is a nice bonus. I can keep track of all my finances in one app instead of jumping between multiple tools."</p>
            <div className="testimonial-author">— Taylor, Young Professional</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready for stress-free roommate finances?</h2>
          <p>
            Join thousands of households already saving time and avoiding conflicts with FairShare.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="cta-button">Start your household</button>
            </SignUpButton>
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