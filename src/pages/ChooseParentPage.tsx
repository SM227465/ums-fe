import React from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';

const ChooseParentPage: React.FC = () => {
  return (
    <div className='choose-parent-page'>
      <div className='choose-parent-container'>
        <div className='choose-parent-card'>
          <h1 className='page-title'>Choose Your Role</h1>
          <p className='page-description'>Select your role to proceed with registration</p>

          <div className='role-options'>
            <Link to={`/signup?role=${UserRole.ADMIN}`} className='role-option-card admin'>
              <div className='role-icon'>👑</div>
              <h3>Admin</h3>
              <p>Manage the entire organization, Sub-admins, and Users</p>
              <ul className='role-features'>
                <li>Create and manage Sub-admins</li>
                <li>View complete hierarchy</li>
                <li>Full system access</li>
              </ul>
            </Link>

            <Link to={`/signup?role=${UserRole.SUB_ADMIN}`} className='role-option-card sub-admin'>
              <div className='role-icon'>⚡</div>
              <h3>Sub-Admin</h3>
              <p>Manage Users under an Admin's supervision</p>
              <ul className='role-features'>
                <li>Manage assigned Users</li>
                <li>Report to an Admin</li>
                <li>Limited system access</li>
              </ul>
            </Link>

            <Link to={`/signup?role=${UserRole.USER}`} className='role-option-card user'>
              <div className='role-icon'>👤</div>
              <h3>User</h3>
              <p>Regular user with access to assigned features</p>
              <ul className='role-features'>
                <li>Access assigned features</li>
                <li>Work under a Sub-admin</li>
                <li>Basic system access</li>
              </ul>
            </Link>
          </div>

          <div className='page-footer'>
            <p>
              Already have an account? <Link to='/login'>Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseParentPage;
