import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { DecorativeBorder } from '../../components/ui/DecorativeBorder';
import { DoriWordmark } from '../../components/ui/DoriWordmark';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Icon, type IconName } from '../../components/ui/Icon';
import { BackgroundPattern } from '../../components/ui/BackgroundPattern';
import { usePageTitle } from '../../utils/usePageTitle';
import type { UserRole } from '../../types';
import './LoginPage.css';

interface DemoAccount {
  username: string;
  role: UserRole;
  label: string;
  sub: string;
  icon: IconName;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: 'demo_asha',
    role: 'asha',
    label: 'Sunita Devi',
    sub: 'ASHA Worker (Karera Sub-Centre)',
    icon: 'asha',
  },
  {
    username: 'demo_anm',
    role: 'anm',
    label: 'Rekha Sharma',
    sub: 'ANM (Shivpuri PHC)',
    icon: 'asha',
  },
  {
    username: 'demo_mo',
    role: 'medical_officer',
    label: 'Dr. Rajesh Kumar',
    sub: 'Medical Officer (Shivpuri PHC)',
    icon: 'doctor',
  },
  {
    username: 'demo_patient',
    role: 'patient',
    label: 'Lakshmi Bai',
    sub: 'Pregnant Mother (G2P1, 14w ANC)',
    icon: 'patient',
  },
  {
    username: 'demo_referral',
    role: 'referral_facility',
    label: 'Dr. Meena Singh',
    sub: 'Specialist (Shivpuri District Hospital)',
    icon: 'hospital',
  },
  {
    username: 'demo_dho',
    role: 'district_officer',
    label: 'Dr. Priya Verma',
    sub: 'District Health Officer (Shivpuri)',
    icon: 'district',
  },
  {
    username: 'demo_admin',
    role: 'system_admin',
    label: 'System Admin',
    sub: 'Platform Administrator',
    icon: 'admin',
  },
];

export const LoginPage: React.FC = () => {
  usePageTitle('Sign In');
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('demo_asha');
  const [password, setPassword] = useState('dori2024demo');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getDashboardPath = (role: UserRole) => {
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await login(username, password);
      navigate(getDashboardPath(response.user.role));
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Login failed. Please check credentials or select a demo persona below.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoPersona = async (demoUser: string, demoRole: UserRole) => {
    setUsername(demoUser);
    setPassword('dori2024demo');
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await login(demoUser, 'dori2024demo');
      navigate(getDashboardPath(response.user.role));
    } catch {
      // Fallback navigate to role dashboard
      navigate(getDashboardPath(demoRole));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dori-login-page">
      <BackgroundPattern opacity={0.04} pattern="jali" />

      <div className="login-container">
        <DecorativeBorder variant="card" motifSize={40} className="login-card">
          <div className="login-card-inner">
            <div className="login-header">
              <DoriWordmark size="md" variant="teal" showTagline={true} />
              <h2 className="login-title">Sign In to DORI System</h2>
              <p className="login-subtitle">
                Unified continuity portal for patients, frontline workers, and clinical providers.
              </p>
            </div>

            {(errorMessage || authError) && (
              <div className="login-error-banner">
                <Icon name="alert" size={16} />
                <span>{errorMessage || authError}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">
                  Username or Mobile Number
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. asha_priya"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password / PIN
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Authenticate & Enter Portal
              </Button>
            </form>

            <div className="demo-accounts-divider">
              <span>OR 1-CLICK DEMO PERSONA LOGIN [DEMO DATA]</span>
            </div>

            <div className="demo-personas-list">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  className="demo-persona-btn"
                  onClick={() => handleSelectDemoPersona(acc.username, acc.role)}
                >
                  <span className="persona-btn-icon">
                    <Icon name={acc.icon} size={20} />
                  </span>
                  <div className="persona-btn-info">
                    <div className="persona-btn-name">
                      <span>{acc.label}</span>
                      <Badge variant="teal" size="sm">
                        {acc.role.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="persona-btn-desc">{acc.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DecorativeBorder>
      </div>
    </div>
  );
};
