import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, enterDemoMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Glassmorphism card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Wordmark */}
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl tracking-tight">
              <span className="text-text-primary">Court</span>
              <span className="text-accent-primary">IQ</span>
            </h1>
            <p className="text-text-muted text-sm mt-1 font-body">
              Elevate your game
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && (
              <p className="text-danger text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Log In
            </Button>
          </form>

          <div className="mt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                enterDemoMode();
                navigate('/', { replace: true });
              }}
            >
              Try Demo
            </Button>
          </div>

          <p className="text-center text-text-muted text-sm mt-6 font-body">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-accent-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
