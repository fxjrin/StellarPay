import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { contractService } from '../../services/contract.service';

export const CreateProfile: React.FC = () => {
  const { isConnected, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const checkAvailability = async (value: string) => {
    if (value.length < 3) {
      setAvailable(null);
      return;
    }

    setChecking(true);
    try {
      const isAvailable = await contractService.checkUsername(value);
      setAvailable(isAvailable);
    } catch (err) {
    } finally {
      setChecking(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setError('');
    
    // Debounce check
    if (value.length >= 3) {
      setTimeout(() => {
        if (value === username) {
          checkAvailability(value);
        }
      }, 500);
    } else {
      setAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3 || username.length > 30) {
      setError('Username must be 3-30 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscore');
      return;
    }

    if (available === false) {
      setError('Username is already taken');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creating your profile...');

    try {
      await register(username);
      toast.success('Registration successful!', { id: toastId });
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed', { id: toastId });
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Create Your Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter username (3-30 chars)"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-zA-Z0-9_]+"
          />
          
          {/* Availability indicator */}
          {username.length >= 3 && (
            <div className="mt-2">
              {checking ? (
                <p className="text-xs text-gray-500">Checking availability...</p>
              ) : available === true ? (
                <p className="text-xs text-green-600">✓ Username available</p>
              ) : available === false ? (
                <p className="text-xs text-red-600">✗ Username already taken</p>
              ) : null}
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            Only letters, numbers, and underscore allowed
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || checking || available === false}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};
