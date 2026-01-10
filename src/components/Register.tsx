import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import RegistrationLoading from './RegistrationLoading';
import RegistrationClosed from './RegistrationClosed';
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
        const response = await fetch('http://localhost:5000/api/auth/check-admin');
        const data = await response.json();
        setAdminExists(data.hasAdmin);
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

  if (adminExists) {
    return <RegistrationClosed />;
  }

  return (
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
  );
};

export default Register;
