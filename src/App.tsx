import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CookiesProvider } from 'react-cookie';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import ChooseParentPage from './pages/ChooseParentPage';
import DashboardPage from './pages/DashboardPage';
import HierarchyTreePage from './pages/HierarchyTreePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { Toaster } from 'react-hot-toast';
import PublicRoute from './components/common/PublicRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className='app'>
            <Routes>
              {/* Public Routes */}
              <Route
                path='/login'
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path='/signup'
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />
              <Route
                path='/choose'
                element={
                  <PublicRoute>
                    <ChooseParentPage />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path='/tree'
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <HierarchyTreePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='*' element={<Navigate to='/dashboard' replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default App;
