import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { DemoController } from '../demo/DemoController';
import { DoriWordmark } from '../ui/DoriWordmark';
import { StatusBadge } from '../ui/StatusBadge';
import { DemoBadge } from '../ui/DemoBadge';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useOfflineSync } from '../../offline/useOfflineSync';
import { NotificationPanel } from '../ui/NotificationPanel';
import { ProductTour } from '../tour/ProductTour';
import { Sidebar } from './Sidebar';
import { RegisterPatientModal } from '../patient/RegisterPatientModal';
import './AppLayout.css';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOnline, pendingCount } = useOfflineSync();

  // Navigation and Drawer states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(3);

  const handleLogout = () => {
    logout();
    setIsMobileSidebarOpen(false);
    navigate('/');
  };

  const roleName = user?.role
    ? user.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Portal';

  const isClinicianOrFrontline =
    user?.role === 'medical_officer' ||
    user?.role === 'asha' ||
    user?.role === 'anm' ||
    user?.role === 'system_admin';

  return (
    <div className="dori-app-shell">
      {/* Demo Mode Bar */}
      <DemoController />

      {/* Main Top Header */}
      <header className="app-header">
        <div className="header-left">
          {/* Global Hamburger Toggle (Phase 1) */}
          <button
            className="header-hamburger-trigger"
            onClick={() => {
              if (window.innerWidth <= 900) {
                setIsMobileSidebarOpen(!isMobileSidebarOpen);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }
            }}
            aria-label="Toggle navigation menu (☰)"
            title="Toggle navigation menu (☰)"
          >
            <Icon name="menu" size={20} />
          </button>

          <Link to="/" className="app-logo-link" aria-label="DORI Home">
            <DoriWordmark size="sm" showTagline={false} variant="gold" />
          </Link>
        </div>

        <div className="header-right">
          {/* Quick Register Patient Trigger for ASHA / Doctor */}
          {isClinicianOrFrontline && (
            <Button
              variant="outline"
              size="sm"
              icon={<Icon name="patient" size={14} />}
              onClick={() => setIsRegisterModalOpen(true)}
            >
              Register Patient
            </Button>
          )}

          {/* Connection status */}
          <div className="connection-indicator">
            {isOnline ? (
              <StatusBadge status="online" label="Online" size="sm" />
            ) : (
              <StatusBadge
                status="offline"
                label={pendingCount > 0 ? `Offline · ${pendingCount} pending` : 'Offline'}
                size="sm"
              />
            )}
          </div>

          {/* Demo data badge */}
          <DemoBadge />

          {/* Architecture Tour Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTourOpen(true)}
            icon={<Icon name="brain" size={14} />}
          >
            Tour
          </Button>

          {/* Notification Center Trigger */}
          <button
            className="header-icon-btn"
            onClick={() => setIsNotificationOpen(true)}
            aria-label="Open notifications"
          >
            <Icon name="alert" size={16} />
            {unreadNotifs > 0 && <span className="header-notif-dot">{unreadNotifs}</span>}
          </button>

          {/* User profile */}
          <div className="header-user">
            <div className="header-avatar">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="header-user-info">
              <span className="header-user-name">{user?.full_name || 'Health Worker'}</span>
              <span className="header-user-role">{roleName}</span>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={handleLogout} className="header-logout-btn">
            Logout
          </Button>
        </div>
      </header>

      {/* Main Body Shell with Sidebar + Workspace Content */}
      <div className="app-body-wrapper">
        <Sidebar
          isOpen={isMobileSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
        />

        <main className="app-main">
          <div className="app-content">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Live Patient Registration Modal (Phase 2) */}
      <RegisterPatientModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onPatientCreated={(newPat) => {
          // Toast or auto-notification
          console.log('Patient registered:', newPat);
        }}
      />

      {/* Notification Center Drawer (Phase 16) */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNotificationCountChange={setUnreadNotifs}
      />

      {/* Product Architecture Tour Modal */}
      <ProductTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
