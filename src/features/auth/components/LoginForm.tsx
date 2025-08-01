import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginFormData } from '../schemas/validation';
import { useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { COOKIE_CONFIG } from '../../../config/api';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();
  const queryClient = useQueryClient();
  const [, setCookie] = useCookies([COOKIE_CONFIG.TOKEN_NAME]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess(data) {
        const accessToken = data.tokens.access.token;
        const expiresInMs = data.tokens.access.expiresIn;
        const expirationDate = new Date(Date.now() + expiresInMs);

        setCookie(COOKIE_CONFIG.TOKEN_NAME, accessToken, {
          ...COOKIE_CONFIG.OPTIONS,
          expires: expirationDate,
        });

        const refreshToken = data.tokens.refresh.token;
        const refreshExpiresInMs = data.tokens.refresh.expiresIn;
        const refreshExpirationDate = new Date(Date.now() + refreshExpiresInMs);

        setCookie(COOKIE_CONFIG.REFRESH_TOKEN_NAME, refreshToken, {
          ...COOKIE_CONFIG.OPTIONS,
          expires: refreshExpirationDate,
        });
        queryClient.setQueryData(['user'], data.user);
        navigate('/dashboard');
      },
    });
  };

  return (
    <div className='login-form-container'>
      <div className='login-form-card'>
        <h2 className='form-title'>Sign In</h2>
        {/* 
        {loginError && (
          <div className='error-message'>
            {loginError.response?.data?.message || 'Login failed. Please try again.'}
          </div>
        )} */}

        <form onSubmit={handleSubmit(onSubmit)} className='login-form'>
          <div className='form-group'>
            <label htmlFor='email' className='form-label'>
              Email Address
            </label>
            <input
              id='email'
              type='email'
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder='Enter your email'
              {...register('email')}
            />
            {errors.email && <span className='field-error'>{errors.email.message}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              id='password'
              type='password'
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder='Enter your password'
              {...register('password')}
            />
            {errors.password && <span className='field-error'>{errors.password.message}</span>}
          </div>

          <button type='submit' disabled={!isValid || isLoggingIn} className='submit-button'>
            {isLoggingIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className='form-footer'>
          <p>
            Don't have an account?{' '}
            <Link to='/signup' className='form-link'>
              Sign up here
            </Link>
          </p>
          <Link to='/forgot-password' className='form-link'>
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
