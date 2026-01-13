
export const setupAuthListener = (onLogout: () => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'token' && !e.newValue) {
      onLogout();
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

export const broadcastLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};