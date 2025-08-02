import { type User, UserRole } from '../../../types';
import { useUsers } from '../../users/hooks/useUsers';

interface Props {
  currentUser: User;
}

const HierarchyTree = (props: Props) => {
  const { currentUser } = props;
  const { data: allUsers } = useUsers();

  const renderUserNode = (user: User, level = 0): React.ReactNode => {
    const childUsers = allUsers?.data?.filter((u) => u?.parentId?._id === user._id) || [];

    return (
      <div key={user._id} className={`tree-node level-${level}`}>
        <div className='node-content'>
          <div className='user-avatar'>
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div className='user-details'>
            <div className='user-name'>{user.fullName}</div>
            <div className='user-email'>{user.email}</div>
            <span className={`role-badge ${user.role}`}>{user.role.replace('-', ' ')}</span>
          </div>
        </div>

        {childUsers.length > 0 && (
          <div className='tree-children'>
            {childUsers.map((child) => renderUserNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getTreeData = () => {
    if (!allUsers?.data) return [];

    switch (currentUser.role) {
      case UserRole.ADMIN:
        return [currentUser];

      case UserRole.SUB_ADMIN:
        return [currentUser];

      case UserRole.USER:
        return [currentUser];

      default:
        return [];
    }
  };

  const treeData = getTreeData();

  if (!treeData.length) {
    return (
      <div className='hierarchy-tree'>
        <div className='no-data'>No hierarchy data available</div>
      </div>
    );
  }

  return <div className='hierarchy-tree'>{treeData.map((user) => renderUserNode(user))}</div>;
};

export default HierarchyTree;
