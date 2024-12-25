export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
  
    try {
      const payload = token.split('.')[1]; 
      const decoded = JSON.parse(atob(payload)); 
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime; 
    } catch (error) {
      return true; 
    }
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem('token');
  };
  
  export const removeToken = (): void => {
    localStorage.removeItem('token');
  };
  
  export const saveToken = (token: string): void => {
    localStorage.setItem('token', token);
  };