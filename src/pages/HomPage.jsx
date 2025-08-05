// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home-page.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Rebuilding Hope in South Lebanon</h1>
          <p className="hero-subtitle">
            Help families whose homes were destroyed during wartime. 
            Your donation goes directly to verified families in need.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">2,847</span>
              <span className="stat-label">Families Helped</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">156</span>
              <span className="stat-label">Villages Covered</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">89%</span>
              <span className="stat-label">Cases Verified</span>
            </div>
          </div>
          <Link to="/register" className="cta-button">
            <i className="fas fa-hand-holding-heart"></i>
            Start Helping Now
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="section-title">
            <h2 className="display-5">Impact Statistics</h2>
            <p className="lead">Real-time data showing the scale of destruction and our collective response</p>
          </div>
          
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <div className="stat-icon text-danger">
                  <i className="fas fa-home"></i>
                </div>
                <div className="stat-number-large">12,543</div>
                <div className="stat-label-large">Homes Destroyed</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <div className="stat-icon text-warning">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-number-large">45,892</div>
                <div className="stat-label-large">People Affected</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <div className="stat-icon text-success">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-number-large">8,234</div>
                <div className="stat-label-large">Cases Verified</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <div className="stat-icon text-info">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="stat-number-large">$2.8M</div>
                <div className="stat-label-large">Funds Raised</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="content-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-upload"></i>
              </div>
              <h3>1. Families Submit</h3>
              <p>Affected families upload photos and documents of destroyed homes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>2. Expert Verification</h3>
              <p>Trained auditors verify each case through investigation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>3. Direct Aid</h3>
              <p>Donors contribute directly to verified families with transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="content-section alternate">
        <div className="container">
          <h2>Together We Rebuild</h2>
          <p>
            From the rubble of destruction, we plant seeds of hope. 
            Join our community and help Lebanese families rebuild their lives.
          </p>
          <Link to="/register" className="secondary-button">
            <i className="fas fa-users"></i>
            Join Our Mission
          </Link>
        </div>
      </section>
        <Footer />
    </div>
  );
};

export default HomePage;