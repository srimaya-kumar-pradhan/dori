import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { usePageTitle } from '../../utils/usePageTitle';
import { Navbar } from '../../components/layout/Navbar';
import { DecorativeBorder } from '../../components/ui/DecorativeBorder';
import { DoriWordmark } from '../../components/ui/DoriWordmark';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Icon } from '../../components/ui/Icon';
import { BackgroundPattern } from '../../components/ui/BackgroundPattern';
import { QRCodeCard } from '../../components/ui/QRCodeCard';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  usePageTitle('Predictive Continuity of Care Infrastructure for Rural India');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLaunch = async (username: string, path: string) => {
    try {
      await login(username, 'dori2024demo');
      navigate(path);
    } catch {
      navigate(path);
    }
  };

  return (
    <div className="dori-landing-page">
      <Navbar />

      {/* ─── SECTION 1: HERO (The Iconic DORI Folk-Art Frame) ─── */}
      <section className="landing-hero-section">
        <BackgroundPattern opacity={0.35} pattern="textile" color="#5a1520" />
        <div className="container">
          <DecorativeBorder variant="hero" motifSize={64} className="hero-frame">
            <div className="hero-content">
              <div className="hero-badge-container">
                <Badge variant="gold" dot>
                  National Digital Health Infrastructure • Smart India Hackathon
                </Badge>
              </div>

              <div className="hero-branding">
                <DoriWordmark size="hero" variant="gold" showTagline={false} />
              </div>

              <h1 className="hero-headline">
                Predictive Continuity of Care Infrastructure for Rural India
              </h1>

              <p className="hero-subtitle">
                Bridging fragmented primary care, high maternal/TB dropout, and broken referral loops
                through cryptographically verifiable Care Passports, edge AI care-gap prediction,
                and offline-first frontline sync.
              </p>

              <div className="hero-cta-group">
                <Link to="/login">
                  <Button variant="gold" size="lg" icon={<Icon name="arrow-right" size={16} />}>
                    Launch Interactive Demo
                  </Button>
                </Link>
                <a href="#care-passport">
                  <Button variant="outline" size="lg" style={{ color: '#ffffff', borderColor: 'var(--color-gold)' }}>
                    Explore Architecture
                  </Button>
                </a>
              </div>

              {/* Quick Persona Launch Bar */}
              <div className="hero-persona-launcher">
                <span className="persona-launcher-title">Direct Role Simulations & Specialized Portals:</span>
                <div className="persona-btn-grid">
                  <button
                    className="persona-quick-btn"
                    onClick={() => handleQuickDemoLaunch('patient_sunita', '/patient')}
                  >
                    <Icon name="patient" size={20} color="var(--color-gold)" />
                    <span className="btn-role-text">
                      <strong>Patient</strong>
                      <small>Sunita Devi (ANC)</small>
                    </span>
                  </button>
                  <button
                    className="persona-quick-btn"
                    onClick={() => handleQuickDemoLaunch('asha_priya', '/asha')}
                  >
                    <Icon name="asha" size={20} color="var(--color-gold)" />
                    <span className="btn-role-text">
                      <strong>ASHA Worker</strong>
                      <small>Priya Sharma</small>
                    </span>
                  </button>
                  <button
                    className="persona-quick-btn"
                    onClick={() => handleQuickDemoLaunch('mo_sharma', '/mo')}
                  >
                    <Icon name="doctor" size={20} color="var(--color-gold)" />
                    <span className="btn-role-text">
                      <strong>Medical Officer</strong>
                      <small>Dr. Rajesh Sharma</small>
                    </span>
                  </button>
                  <button
                    className="persona-quick-btn"
                    onClick={() => handleQuickDemoLaunch('specialist_aiims', '/referral')}
                  >
                    <Icon name="hospital" size={20} color="var(--color-gold)" />
                    <span className="btn-role-text">
                      <strong>Specialist</strong>
                      <small>District Hospital</small>
                    </span>
                  </button>
                  <button
                    className="persona-quick-btn"
                    onClick={() => handleQuickDemoLaunch('dho_verma', '/dho')}
                  >
                    <Icon name="district" size={20} color="var(--color-gold)" />
                    <span className="btn-role-text">
                      <strong>District Officer</strong>
                      <small>Dr. Verma (DHO)</small>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </DecorativeBorder>
        </div>
      </section>

      {/* ─── SECTION 2: THE CONTINUITY GAP IN RURAL INDIA ─── */}
      <section className="landing-section bg-light" id="problem">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-kicker">The Structural Breakdown</span>
            <h2 className="section-title">The Rural Care Continuity Paradox</h2>
            <p className="section-desc">
              India has over 1 million ASHA workers, 160,000+ Sub-Centers, and 30,000+ PHCs/CHCs.
              Yet, patients drop out of care at alarming rates between primary and secondary tiers.
            </p>
          </div>

          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon-wrapper">
                <Icon name="passport" size={28} color="var(--color-crimson)" />
              </div>
              <h3>Fragile Paper Slip Syndrome</h3>
              <p>
                Patients carry wrinkled, rain-damaged paper slips across rural bus routes.
                When lost, critical clinical history, ANC ultrasound results, and blood tests vanish.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon-wrapper">
                <Icon name="network" size={28} color="var(--color-crimson)" />
              </div>
              <h3>The 2G / Blackout Blindspot</h3>
              <p>
                Conventional cloud EHRs fail when cell towers lose power or connectivity drops in remote hamlets.
                Frontline health workers cannot wait for page reloads.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon-wrapper">
                <Icon name="alert" size={28} color="var(--color-crimson)" />
              </div>
              <h3>Silent Dropout in High-Risk ANC & TB</h3>
              <p>
                Care gaps (missed ANC-2/ANC-3 visits, TB medication defaults) are discovered only months later
                during emergency crises rather than predicted beforehand.
              </p>
            </div>

            <div className="problem-card">
              <div className="problem-icon-wrapper">
                <Icon name="sync" size={28} color="var(--color-crimson)" />
              </div>
              <h3>Broken Referral Feedback Loops</h3>
              <p>
                Over 70% of rural patients referred to district hospitals never have their discharge outcomes
                communicated back to the village ASHA worker for follow-up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: THE DORI SOLUTION (4 CORE PILLARS) ─── */}
      <section className="landing-section" id="solution">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-kicker">Architectural Innovation</span>
            <h2 className="section-title">How DORI Reconnects Rural Care</h2>
            <p className="section-desc">
              A four-pillar infrastructure that preserves longitudinal continuity without requiring permanent cloud connectivity.
            </p>
          </div>

          <div className="pillars-grid">
            <DecorativeBorder variant="card" className="pillar-card" motifSize={36}>
              <div className="pillar-inner">
                <div className="pillar-num">01</div>
                <h3>Cryptographic Care Passport</h3>
                <p>
                  A tamper-evident, offline-scannable digital passport with verifiable credentials.
                  Preserves patient privacy via pseudonymous IDs and granular selective consent.
                </p>
                <div className="pillar-tag">Zero-Cloud Offline Verification</div>
              </div>
            </DecorativeBorder>

            <DecorativeBorder variant="card" className="pillar-card" motifSize={36}>
              <div className="pillar-inner">
                <div className="pillar-num">02</div>
                <h3>Predictive Care-Gap Engine</h3>
                <p>
                  Edge ML models analyze longitudinal touchpoints, travel distance, gestational age, and treatment phase
                  to forecast dropout risks before they manifest into emergencies.
                </p>
                <div className="pillar-tag">Clinical Decision Support</div>
              </div>
            </DecorativeBorder>

            <DecorativeBorder variant="card" className="pillar-card" motifSize={36}>
              <div className="pillar-inner">
                <div className="pillar-num">03</div>
                <h3>Offline-First Sync Engine</h3>
                <p>
                  Frontline tablets queue updates locally with conflict-free replication algorithms.
                  Synchronizes seamlessly over intermittent 2G/3G bursts or Bluetooth relay.
                </p>
                <div className="pillar-tag">Store-and-Forward Telemetry</div>
              </div>
            </DecorativeBorder>

            <DecorativeBorder variant="card" className="pillar-card" motifSize={36}>
              <div className="pillar-inner">
                <div className="pillar-num">04</div>
                <h3>Decentralized Federated Intelligence</h3>
                <p>
                  District and state models train collaboratively across primary facilities without raw patient health
                  records ever leaving local facility boundaries.
                </p>
                <div className="pillar-tag">Differential Privacy Guaranteed</div>
              </div>
            </DecorativeBorder>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: CARE PASSPORT LIVE DEMO ─── */}
      <section className="landing-section bg-light" id="care-passport">
        <div className="container">
          <div className="passport-demo-layout">
            <div className="passport-demo-info">
              <span className="section-kicker">Patient Sovereignty</span>
              <h2 className="section-title">The DORI Care Passport</h2>
              <p className="section-desc">
                The Care Passport replaces vulnerable paper slips with a signed, selective-disclosure credential.
                Patients own their key; medical officers scan offline to access critical treatment timelines.
              </p>

              <div className="passport-features-list">
                <div className="feature-item">
                  <div className="feature-bullet">
                    <Icon name="check" size={16} color="var(--color-teal)" />
                  </div>
                  <div>
                    <strong>Pseudonymous Identity (PID):</strong> Identifies patients across tiers without exposing Aadhaar or raw PII.
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-bullet">
                    <Icon name="check" size={16} color="var(--color-teal)" />
                  </div>
                  <div>
                    <strong>Selective Consent Matrix:</strong> Patient grants specific scopes (e.g. maternal history only, excluding sensitive past records).
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-bullet">
                    <Icon name="check" size={16} color="var(--color-teal)" />
                  </div>
                  <div>
                    <strong>Emergency Break-Glass:</strong> Authenticated doctors in acute emergencies can bypass consent with mandatory immutable audit logging.
                  </div>
                </div>
              </div>
            </div>

            <div className="passport-demo-card-wrap">
              <QRCodeCard
                pseudonymousId="PID-2026-SUNITA-9021"
                patientName="Sunita Devi"
                qrPayload="DORI:PASSPORT:v1:eyJhbGciOiJFRDI1NTE5In0.PID-2026-SUNITA-9021"
                bloodGroup="B+"
                allergies="Penicillin"
                conditions="Gravida 2, 14w ANC"
                issuedAt="2026-09-01T00:00:00Z"
                version={1}
                status="ACTIVE"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: WHAT DORI IS NOT (ANTI-PATTERNS) ─── */}
      <section className="landing-section" id="anti-patterns">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-kicker">Honest Architecture</span>
            <h2 className="section-title">What DORI is NOT</h2>
            <p className="section-desc">
              DORI is purposefully designed to avoid the architectural failure modes of bloated urban hospital software.
            </p>
          </div>

          <div className="anti-pattern-grid">
            <div className="anti-card">
              <span className="anti-badge">NOT</span>
              <h4>Not a Centralized ABDM Replacement</h4>
              <p>DORI integrates with ABDM / ABHA protocols as an edge-native continuity layer, not a parallel competing silo.</p>
            </div>
            <div className="anti-card">
              <span className="anti-badge">NOT</span>
              <h4>Not a Cloud-Dependent Desktop EHR</h4>
              <p>DORI works with 0kbps internet connectivity. No spinny wheels or timeout errors on the frontline.</p>
            </div>
            <div className="anti-card">
              <span className="anti-badge">NOT</span>
              <h4>Not a Black-Box AI Diagnostic Tool</h4>
              <p>DORI never makes autonomous medical diagnoses. It only highlights risk factors as explainable clinical decision support.</p>
            </div>
            <div className="anti-card">
              <span className="anti-badge">NOT</span>
              <h4>Not a Surveillance Tracker</h4>
              <p>All telemetry is cryptographically blinded and aggregated before reaching district or state dashboards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: FOOTER ─── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <DoriWordmark size="md" variant="gold" showTagline={true} />
              <p className="footer-tagline">
                Open, resilient, offline-first continuity of care infrastructure engineered for primary rural healthcare in India.
              </p>
            </div>

            <div className="footer-links-group">
              <div className="footer-col">
                <h5>Architecture</h5>
                <ul>
                  <li><a href="/#care-passport">Care Passport</a></li>
                  <li><a href="/#solution">Predictive AI Engine</a></li>
                  <li><a href="/#solution">Offline-First Sync</a></li>
                  <li><a href="/#solution">Federated Learning</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h5>Roles & Portals</h5>
                <ul>
                  <li><Link to="/login">Patient Portal</Link></li>
                  <li><Link to="/login">ASHA / ANM Tablet</Link></li>
                  <li><Link to="/login">Medical Officer OPD</Link></li>
                  <li><Link to="/login">District Officer View</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h5>Compliance & Legal</h5>
                <ul>
                  <li><Link to="/privacy">Privacy Policy (DPDP 2023)</Link></li>
                  <li><Link to="/terms">Terms of Infrastructure</Link></li>
                  <li><a href="mailto:contact@dori.health">contact@dori.health</a></li>
                  <li><a href="tel:1800114477">Helpline: 1800-11-4477</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 DORI Health System. All architectural rights reserved for Indian Rural Healthcare.</p>
            <div className="footer-bottom-links">
              <span>Security & Audit Logged</span>
              <span>•</span>
              <span>Zero-Knowledge Verification</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
