import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [precisaTrocarSenha, setPrecisaTrocarSenha] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
          const criacao = new Date(firebaseUser.metadata.creationTime).getTime();
          const ultimoLogin = new Date(firebaseUser.metadata.lastSignInTime).getTime();
          const diffSegundos = Math.abs(ultimoLogin - criacao) / 1000;
          setPrecisaTrocarSenha(diffSegundos < 30);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
        setPrecisaTrocarSenha(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, precisaTrocarSenha }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);