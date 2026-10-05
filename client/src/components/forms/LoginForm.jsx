import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Controlled Login Form
 *
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback on successful login
 * @param {Function} props.onSwitchToSignup - Callback to switch view to Signup
 */
export default function LoginForm({ onSuccess, onSwitchToSignup }) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      if (onSuccess) onSuccess('Logged in successfully!');
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errorMessage && (
        <div className="form-error-alert" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="login-email">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          className="form-input"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          name="password"
          className="form-input"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', marginTop: '0.75rem' }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Authenticating...' : 'Sign In'}
      </button>

      <div className="form-footer-toggle">
        Don&apos;t have an account yet?{' '}
        <button
          type="button"
          className="form-link-btn"
          onClick={onSwitchToSignup}
        >
          Create one now
        </button>
      </div>
    </form>
  );
}
