import React, { useState } from 'react';
import { useUsers } from '../features/users/hooks/useUsers';
import { useAuth } from '../features/auth/hooks/useAuth';
import { UserRole } from '../types';
import UserFilters from '../features/users/components/UserFilters';
import UserTable from '../features/users/components/UserTable';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: undefined as UserRole | undefined,
    search: '',
  });

  const { data, isLoading, error } = useUsers(filters);
  console.log({ data });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (isLoading) {
    return (
      <div className='dashboard-page'>
        <div className='loading-spinner'>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='dashboard-page'>
        <div className='error-message'>Failed to load users: {error.message}</div>
      </div>
    );
  }

  return (
    <div className='dashboard-page'>
      <div className='dashboard-header'>
        <h1>User Management Dashboard</h1>
        <p>Welcome back, {user?.firstName}!</p>
      </div>

      <div className='dashboard-content'>
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          currentUserRole={user?.role}
        />

        <UserTable
          users={data?.data || []}
          pagination={data?.meta}
          onPageChange={handlePageChange}
          currentUser={user}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
