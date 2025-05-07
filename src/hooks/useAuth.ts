import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

function useAuthToken() {
  const { userId, getToken } = useAuth();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function fetchToken() {
      if (userId) {
        try {
          setIsLoading(true);
          const token = await getToken();
          setAuthToken(token);
        } catch (error) {
          console.error('Error fetching Clerk token:', error);
          setAuthToken('');
        } finally {
          setIsLoading(false);
        }
      } else {
        setAuthToken('');
        setIsLoading(false);
      }
    }
    
    fetchToken();
  }, [userId, getToken]);
  
  return { authToken: authToken || '', isLoading };
}

export default useAuthToken;
