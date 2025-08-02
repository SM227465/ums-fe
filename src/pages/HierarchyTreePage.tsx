import { useAuth } from '../features/auth/hooks/useAuth';
import HierarchyTree from '../features/hierarchy/components/HierarchyTree';
import { UserRole } from '../types';

const HierarchyTreePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className='hierarchy-page'>
        <div className='loading-spinner'>Loading...</div>
      </div>
    );
  }

  const getPageTitle = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return 'Organization Hierarchy';
      case UserRole.SUB_ADMIN:
        return 'My Team';
      case UserRole.USER:
        return 'My Profile';
      default:
        return 'Hierarchy';
    }
  };

  const getPageDescription = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return 'View and manage the complete organizational structure';
      case UserRole.SUB_ADMIN:
        return 'View users under your management';
      case UserRole.USER:
        return 'View your position in the organization';
      default:
        return '';
    }
  };

  return (
    <div className='hierarchy-page'>
      <div className='hierarchy-header'>
        <h1>{getPageTitle()}</h1>
        <p>{getPageDescription()}</p>
      </div>

      <div className='hierarchy-content'>
        <HierarchyTree currentUser={user} />
      </div>
    </div>
  );
};

export default HierarchyTreePage;
