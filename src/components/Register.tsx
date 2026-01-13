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
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg shadow-lg max-w-md text-center">
            <div className="flex items-center justify-center">
              
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