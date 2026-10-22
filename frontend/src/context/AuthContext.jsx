import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { MOCK_USER_PROFILE } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  useEffect(() => {
    // If Supabase is configured, listen to real auth changes
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          localStorage.setItem('wanderwise_auth_token', session.access_token);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          localStorage.setItem('wanderwise_auth_token', session.access_token);
        } else {
          localStorage.removeItem('wanderwise_auth_token');
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Demo Mode initialized: check if demo user is stored
      const savedDemoUser = localStorage.getItem('wanderwise_demo_user');
      if (savedDemoUser) {
        setUser(JSON.parse(savedDemoUser));
      } else {
        // Auto sign-in demo user for immediate exploratory access
        setUser(MOCK_USER_PROFILE);
        localStorage.setItem('wanderwise_demo_user', JSON.stringify(MOCK_USER_PROFILE));
      }
      setIsDemoMode(true);
      setLoading(false);
    }
  }, []);

  const signIn = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // Demo sign in
      const demoUser = {
        ...MOCK_USER_PROFILE,
        email: email || MOCK_USER_PROFILE.email,
        full_name: email.split('@')[0] || "Demo Traveler"
      };
      setUser(demoUser);
      localStorage.setItem('wanderwise_demo_user', JSON.stringify(demoUser));
      return { user: demoUser, session: { access_token: 'demo-token-123' } };
    }
  };

  const signUp = async (email, password, fullName) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Demo sign up
      const demoUser = {
        id: `user-${Date.now()}`,
        email,
        full_name: fullName || "Traveler",
        avatar_url: MOCK_USER_PROFILE.avatar_url,
        home_currency: "USD",
        preferences: MOCK_USER_PROFILE.preferences
      };
      setUser(demoUser);
      localStorage.setItem('wanderwise_demo_user', JSON.stringify(demoUser));
      return { user: demoUser, session: { access_token: 'demo-token-123' } };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
      localStorage.removeItem('wanderwise_auth_token');
    } else {
      localStorage.removeItem('wanderwise_demo_user');
      setUser(null);
    }
  };

  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isDemoMode,
      isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      toggleDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
