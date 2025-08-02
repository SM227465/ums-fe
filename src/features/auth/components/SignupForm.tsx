import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { UserRole } from '../../../types';
import { useAvailableParents } from '../../users/hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { signupSchema, type SignupFormData } from '../schemas/validation';

const SignupForm = () => {
  const { signup, isSigningUp } = useAuth();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
      parentId: undefined,
    },
  });

  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl && Object.values(UserRole).includes(roleFromUrl as UserRole)) {
      setValue('role', roleFromUrl as UserRole);
    }
  }, [searchParams, setValue]);

  const selectedRole = watch('role');

  const { data: availableParents, isLoading: isLoadingParents } = useAvailableParents(
    selectedRole,
    !!selectedRole && selectedRole !== UserRole.ADMIN
  );

  useEffect(() => {
    if (selectedRole === UserRole.ADMIN) {
      setValue('parentId', undefined);
    }
  }, [selectedRole, setValue]);

  const onSubmit = (data: SignupFormData) => {
    signup(data);
  };

  const shouldShowParentSelect = selectedRole && selectedRole !== UserRole.ADMIN;

  return (
    <div className='signup-form-container'>
      <div className='signup-form-card'>
        <h2 className='form-title'>Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='signup-form'>
          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='firstName' className='form-label'>
                First Name
              </label>
              <input
                id='firstName'
                type='text'
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder='Enter your first name'
                {...register('firstName')}
              />
              {errors.firstName && <span className='field-error'>{errors.firstName.message}</span>}
            </div>

            <div className='form-group'>
              <label htmlFor='lastName' className='form-label'>
                Last Name
              </label>
              <input
                id='lastName'
                type='text'
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder='Enter your last name'
                {...register('lastName')}
              />
              {errors.lastName && <span className='field-error'>{errors.lastName.message}</span>}
            </div>
          </div>

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

          <div className='form-row'>
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

            <div className='form-group'>
              <label htmlFor='confirmPassword' className='form-label'>
                Confirm Password
              </label>
              <input
                id='confirmPassword'
                type='password'
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder='Confirm your password'
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <span className='field-error'>{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='role' className='form-label'>
              Role
            </label>
            <select
              id='role'
              className={`form-select ${errors.role ? 'error' : ''}`}
              {...register('role')}
              disabled={!!searchParams.get('role')}
            >
              <option value=''>Select a role</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.SUB_ADMIN}>Sub Admin</option>
              <option value={UserRole.USER}>User</option>
            </select>
            {errors.role && <span className='field-error'>{errors.role.message}</span>}
          </div>

          {shouldShowParentSelect && (
            <div className='form-group'>
              <label htmlFor='parentId' className='form-label'>
                {selectedRole === UserRole.SUB_ADMIN ? 'Select Admin' : 'Select Sub-Admin'}
              </label>
              {isLoadingParents ? (
                <div className='loading-spinner'>Loading available options...</div>
              ) : (
                <select
                  id='parentId'
                  className={`form-select ${errors.parentId ? 'error' : ''}`}
                  {...register('parentId')}
                >
                  <option value=''>
                    Choose {selectedRole === UserRole.SUB_ADMIN ? 'an Admin' : 'a Sub-Admin'}
                  </option>
                  {availableParents?.map((parent: any) => (
                    <option key={parent._id} value={parent._id}>
                      {parent.firstName} {parent.lastName} ({parent.email})
                    </option>
                  ))}
                </select>
              )}
              {errors.parentId && <span className='field-error'>{errors.parentId.message}</span>}
            </div>
          )}

          <button type='submit' disabled={!isValid || isSigningUp} className='submit-button'>
            {isSigningUp ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className='form-footer'>
          <p>
            Already have an account?{' '}
            <Link to='/login' className='form-link'>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
