import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginFormData } from '../schemas/validation';

const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className='login-form-container'>
      <div className='login-form-card'>
        <h2 className='form-title'>Sign In</h2>
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
