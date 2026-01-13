import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/hooks/apiClient';
import RegistrationLoading from './RegistrationLoading';
import RegistrationForm from './RegistrationForm';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminExists, setAdminExists] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { register, error, isLoading } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await apiClient.get('/auth/check-admin');
        setAdminExists(response.data.hasAdmin);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setAdminExists(true);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(username, email, password);
  };

  if (checkingStatus) {
    return <RegistrationLoading />;
  }

  return (
    <div>
      {adminExists && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl shadow-xl max-w-md text-center">
            <div className="flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Admin account already exists. Only the first registered user can be admin.</span>
            </div>
          </div>
        </div>
      )}
      <RegistrationForm
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Register;