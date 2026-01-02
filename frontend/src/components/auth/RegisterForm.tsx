import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AppDispatch, RootState } from '../../store/store';
import { registerUser, clearError } from '../../store/authSlice';
import { RegisterData } from '../../services/auth';
import '../../styles/dark-theme.css';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    dispatch(clearError());
    const { confirmPassword, ...registerData } = data;
    const result = await dispatch(registerUser(registerData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1 className="login-logo">Grip CRM</h1>
          <h2 className="login-title">Create your account</h2>
          <p className="login-subtitle">
            Get started with Grip CRM
          </p>
        </div>
        
        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Email address</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">Password</label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="form-error">{errors.password.message}</p>
                )}
              </div>

              <div className="form-field">
                <label className="form-label">Confirm Password</label>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  type="password"
                  className="form-input"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>

            <div className="signup-link">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;