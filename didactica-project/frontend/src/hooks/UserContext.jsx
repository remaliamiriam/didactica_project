import { createContext, useContext, useState, useEffect } from 'react';

// 1. Creăm contextul
const UserContext = createContext();

// 2. Hook pentru a folosi contextul mai ușor
export const useUser = () => useContext(UserContext);

// 3. Provider-ul care va înveli aplicația ta
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // La reîncărcare, încercăm să luăm utilizatorul din localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Eroare la parsarea user-ului din localStorage:', err);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
