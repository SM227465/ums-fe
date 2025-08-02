import { type User, UserRole } from '../../../types';
import { useDeleteUser } from '../hooks/useUsers';

interface Props {
  users: User[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange: (page: number) => void;
  currentUser?: User;
}

const UserTable = (props: Props) => {
  const { onPageChange, users, currentUser, pagination } = props;
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const canModifyUser = (user: User): boolean => {
    if (!currentUser) return false;

    if (currentUser.role === UserRole.ADMIN) {
      return user._id !== currentUser._id;
    }

    if (currentUser.role === UserRole.SUB_ADMIN) {
      return user.parentId?._id === currentUser._id;
    }

    return false;
  };

  const getRoleBadgeClass = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'role-badge admin';
      case UserRole.SUB_ADMIN:
        return 'role-badge sub-admin';
      case UserRole.USER:
        return 'role-badge user';
      default:
        return 'role-badge';
    }
  };

  return (
    <div className='user-table-container'>
      <div className='table-wrapper'>
        <table className='user-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className='user-info'>
                    <div className='user-avatar'>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div>
                      <div className='user-name'>{user.fullName}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={getRoleBadgeClass(user.role)}>
                    {user.role.replace('-', ' ')}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className='action-buttons'>
                    <button className='btn-view'>View</button>
                    {canModifyUser(user) && (
                      <>
                        <button className='btn-edit'>Edit</button>
                        <button
                          className='btn-delete'
                          onClick={() => handleDelete(user._id)}
                          disabled={deleteUserMutation.isPending}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className='pagination'>
          <div className='pagination-info'>
            Showing {users.length} of {pagination.totalUsers} users
          </div>
          <div className='pagination-controls'>
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className='pagination-btn'
            >
              Previous
            </button>
            <span className='pagination-current'>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className='pagination-btn'
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
