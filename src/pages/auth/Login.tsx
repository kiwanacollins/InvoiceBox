import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const Login: React.FC = () => {
  const { login, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password) {
      return;
    }
    
    await login(email, password);
  };

  // Helper text for demo
  const demoCredentials = [
    { role: 'Provider', email: 'provider@example.com' },
    { role: 'Purchaser', email: 'purchaser@example.com' },
  ];

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-gray-500">Sign in to your account to continue</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded text-error text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={loading}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary-700">
              Forgot password?
            </a>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          loading={loading}
        >
          Sign in
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-700">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="text-sm font-medium mb-2">Demo Credentials</h3>
        <div className="space-y-2">
          {demoCredentials.map((cred, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-500">{cred.role}:</span>
              <button
                type="button"
                onClick={() => setEmail(cred.email)}
                className="text-primary hover:underline"
              >
                {cred.email}
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-500 pt-2">
            Any password will work for demo purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;