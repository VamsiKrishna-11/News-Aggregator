import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Controlled Signup Form
 *
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback on successful account creation
 * @param {Function} props.onSwitchToLogin - Callback to switch view to Login
 */
export default function SignupForm({ onSuccess, onSwitchToLogin }) {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
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

    const { username, email, password } = formData;

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (username.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters long.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      if (onSuccess) onSuccess('Account created and logged in successfully!');
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed. Please try a different email.');
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
        <label className="form-label" htmlFor="signup-username">
          Username
        </label>
        <input
          id="signup-username"
          type="text"
          name="username"
          className="form-input"
          placeholder="e.g. alex_rivera"
          value={formData.username}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="signup-email">
          Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          name="email"
          className="form-input"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="signup-password">
          Password (min. 6 characters)
        </label>
        <input
          id="signup-password"
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
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      <div className="form-footer-toggle">
        Already have an account?{' '}
        <button
          type="button"
          className="form-link-btn"
          onClick={onSwitchToLogin}
        >
          Sign in here
        </button>
      </div>
    </form>
  );
}
