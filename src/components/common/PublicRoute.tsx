import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface Props {
  children: ReactNode;
}

const PublicRoute = (props: Props) => {
  const { children } = props;
  const { isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <div className='loading-screen'>
        <div className='loading-spinner'>Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
