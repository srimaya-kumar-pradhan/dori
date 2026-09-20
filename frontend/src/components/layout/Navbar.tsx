import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { DoriWordmark } from '../ui/DoriWordmark';
import { SyncIndicator } from '../ui/SyncIndicator';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const getRoleDashboardPath = (role?: string) => {
    switch (role) {
      case 'patient':
        return '/patient';
      case 'asha':
      case 'anm':
        return '/asha';
      case 'medical_officer':
        return '/mo';
      case 'district_officer':
        return '/dho';
      case 'referral_facility':
        return '/referral';
      case 'state_admin':
      case 'national_admin':
        return '/state';
      case 'system_admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <header className="dori-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
          <DoriWordmark size="sm" showTagline={false} variant="gold" />
        </Link>

        {/* Desktop Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <Link to="/" className="nav-link">
            Overview
          </Link>
          <a href="/#care-passport" className="nav-link">
            Care Passport
          </a>
          <a href="/#solution" className="nav-link">
            Predictive AI
          </a>
          <a href="/#solution" className="nav-link">
            Offline Sync
          </a>
          <Link to="/privacy" className="nav-link">
            Privacy (DPDP)
          </Link>
          <Link to="/terms" className="nav-link">
            Terms
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <SyncIndicator />

          {isAuthenticated && user ? (
            <div className="user-profile-menu">
              <Link to={getRoleDashboardPath(user.role)}>
                <Badge variant="crimson" dot>
                  {user.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </Link>
              <span className="user-name">{user.full_name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <Button variant="primary" size="sm" icon={<Icon name="lock" size={14} />}>
                  Sign In / Demo Portal
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={24} color="var(--color-cream, #f5f0e6)" />
          </button>
        </div>
      </div>

      {/* Accessible Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <nav className="mobile-nav-links">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Overview
            </Link>
            <a href="/#care-passport" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Care Passport
            </a>
            <a href="/#solution" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Predictive AI Engine
            </a>
            <Link to="/privacy" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Privacy Policy (DPDP)
            </Link>
            <Link to="/terms" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Terms of Service
            </Link>

            <div className="mobile-auth-section">
              {isAuthenticated && user ? (
                <div className="mobile-user-box">
                  <Link
                    to={getRoleDashboardPath(user.role)}
                    className="mobile-dash-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="md" className="w-full">
                      Go to {user.role.replace('_', ' ').toUpperCase()} Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full" icon={<Icon name="lock" size={16} />}>
                    Enter Demo Portal / Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
