import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function calculateAge(dob) {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const isMinor = dob && calculateAge(dob) < 13;

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!dob) {
      newErrors.dob = 'Date of birth is required.';
    }

    if (isMinor && !parentEmail.trim()) {
      newErrors.parentEmail = 'Parent/guardian email is required for users under 13.';
    } else if (isMinor && !validateEmail(parentEmail.trim())) {
      newErrors.parentEmail = 'Please enter a valid parent/guardian email.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const metadata = {
        date_of_birth: dob,
        ...(isMinor && { parent_email: parentEmail.trim(), requires_parental_consent: true }),
      };

      await signUp(email.trim(), password, metadata);
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setGlobalError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Basketball hero image */}
        <div className="relative w-full max-h-48 overflow-hidden rounded-t-2xl">
          <img
            src="https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="People playing basketball outdoors"
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary" />
        </div>

        {/* Glassmorphism card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-b-2xl rounded-t-none p-8 shadow-2xl -mt-4 relative z-10">
          {/* Wordmark */}
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl tracking-tight">
              <span className="text-text-primary">Court</span>
              <span className="text-accent-primary">IQ</span>
            </h1>
            <p className="text-text-muted text-sm mt-1 font-body">
              Create your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Input
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              error={errors.dob}
            />

            {/* COPPA: parental consent for under-13 */}
            {isMinor && (
              <div className="rounded-xl bg-accent-primary/10 border border-accent-primary/20 p-4 space-y-3">
                <p className="text-text-secondary text-xs font-body leading-relaxed">
                  Because you are under 13, a parent or guardian must provide
                  consent. We will send a verification email to the address
                  below.
                </p>
                <Input
                  label="Parent / Guardian Email"
                  type="email"
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  error={errors.parentEmail}
                />
              </div>
            )}

            {globalError && (
              <p className="text-danger text-sm text-center">{globalError}</p>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6 font-body">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent-primary hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
