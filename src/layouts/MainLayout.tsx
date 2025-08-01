import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { UserRole } from '../types';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    const items = [{ path: '/dashboard', label: 'Dashboard', icon: '📊' }];

    if (user?.role !== UserRole.USER) {
      items.push({ path: '/tree', label: 'Hierarchy', icon: '🌳' });
    }

    return items;
  };

  return (
    <div className='layout'>
      <aside className='layout-sidebar'>
        <div className='sidebar-header'>
          <h2>User Management</h2>
        </div>

        <nav className='sidebar-nav'>
          {getNavItems().map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className='nav-icon'>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className='sidebar-footer'>
          <div className='user-info'>
            <div className='user-avatar'>
              {user?.firstName[0]}
              {user?.lastName[0]}
            </div>
            <div>
              <div className='user-name'>
                {user?.firstName} {user?.lastName}
              </div>
              <div className='user-role'>{user?.role}</div>
            </div>
          </div>
          <button onClick={logout} className='logout-btn'>
            Logout
          </button>
        </div>
      </aside>

      <main className='layout-main'>{children}</main>
    </div>
  );
};

export default MainLayout;
