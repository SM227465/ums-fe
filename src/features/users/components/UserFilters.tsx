import React from 'react';
import { UserRole } from '../../../types';

interface UserFiltersProps {
  filters: {
    search: string;
    role?: UserRole;
  };
  onFilterChange: (filters: any) => void;
  currentUserRole?: UserRole;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFilterChange, currentUserRole }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      role: e.target.value ? (e.target.value as UserRole) : undefined,
    });
  };

  return (
    <div className='user-filters'>
      <div className='filter-group'>
        <input
          type='text'
          placeholder='Search users...'
          value={filters.search}
          onChange={handleSearchChange}
          className='search-input'
        />
      </div>

      <div className='filter-group'>
        <select value={filters.role || ''} onChange={handleRoleChange} className='role-filter'>
          <option value=''>All Roles</option>
          {currentUserRole === UserRole.ADMIN && (
            <>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.SUB_ADMIN}>Sub-Admin</option>
            </>
          )}
          <option value={UserRole.USER}>User</option>
        </select>
      </div>
    </div>
  );
};

export default UserFilters;
