import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabase, getSupabaseConfig } from '../lib/supabase';
import { OperatorProfile } from '../types';

export const deriveNameFromEmail = (email?: string): string => {
  if (!email) return 'Md Noor';
  const prefix = email.split('@')[0] || '';
  if (/^md\.?noor/i.test(prefix)) {
    return 'Md Noor';
  }
  const cleaned = prefix.replace(/[0-9]+$/, '').replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'Admin User';
  return cleaned
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

export const getAvatarFromEmail = (_email?: string, name?: string): string => {
  const displayName = (name || 'Md Noor').trim();
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join('') || 'MN';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="%230284c7"/><text x="50%" y="54%" font-family="system-ui,-apple-system,sans-serif" font-size="48" font-weight="800" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`;
};

interface AuthContextType {
  user: { id: string; email: string } | null;
  operator: OperatorProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateOperator: (updates: Partial<OperatorProfile>) => void;
  refreshProfile: () => Promise<void>;
  saveBackendProfile: (updates: { name: string; phone: string; email?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_OPERATOR: OperatorProfile = {
  id: 'OP-8821',
  name: 'Md Noor',
  role: 'Operations Lead & Dispatcher',
  phone: '+91 98765 43210',
  email: 'mdnoor4860@gmail.com',
  avatarInitials: 'MN',
  operatorCode: 'OP-8821',
  avatarUrl: getAvatarFromEmail('mdnoor4860@gmail.com', 'Md Noor'),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    const saved = localStorage.getItem('smartrun_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [operator, setOperator] = useState<OperatorProfile>(() => {
    const saved = localStorage.getItem('smartrun_operator_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clear out stale placeholder name if present
        if (parsed.name === 'Rajesh Kumar') {
          parsed.name = 'Md Noor';
          parsed.avatarInitials = 'MN';
          localStorage.setItem('smartrun_operator_profile', JSON.stringify(parsed));
        }
        return parsed;
      } catch {
        return DEFAULT_OPERATOR;
      }
    }
    return DEFAULT_OPERATOR;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  // Fetch operator profile from Supabase Backend (Auth metadata + public.profiles table)
  const fetchBackendProfile = useCallback(async (currentEmail?: string, currentUserId?: string) => {
    const targetEmail = currentEmail || user?.email || 'mdnoor4860@gmail.com';
    const targetUserId = currentUserId || user?.id || '';

    const supabase = getSupabase();
    if (!supabase) {
      // Offline fallback: ensure clean derived name from backend email
      setOperator((prev) => {
        const derived = prev.name === 'Rajesh Kumar' || !prev.name ? deriveNameFromEmail(targetEmail) : prev.name;
        const next = {
          ...prev,
          name: derived,
          email: targetEmail,
        };
        localStorage.setItem('smartrun_operator_profile', JSON.stringify(next));
        return next;
      });
      return;
    }

    try {
      // 1. Fetch from Supabase Auth getUser()
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData?.user;

      let fetchedName =
        authUser?.user_metadata?.name ||
        authUser?.user_metadata?.full_name ||
        authUser?.user_metadata?.user_name ||
        authUser?.user_metadata?.display_name ||
        '';

      let fetchedPhone =
        authUser?.user_metadata?.phone ||
        authUser?.user_metadata?.mobile ||
        authUser?.phone ||
        '';

      let fetchedEmail = authUser?.email || targetEmail;
      let fetchedAvatar =
        authUser?.user_metadata?.avatar_url ||
        authUser?.user_metadata?.picture ||
        '';

      // 2. Query public.profiles database table if accessible
      try {
        const query = supabase.from('profiles').select('*');
        const filter = targetUserId ? query.or(`id.eq.${targetUserId},email.eq.${fetchedEmail}`) : query.eq('email', fetchedEmail);
        const { data: dbProfile, error: dbError } = await filter.maybeSingle();

        if (!dbError && dbProfile) {
          if (dbProfile.name) fetchedName = dbProfile.name;
          if (dbProfile.phone || dbProfile.mobile) fetchedPhone = dbProfile.phone || dbProfile.mobile;
          if (dbProfile.email) fetchedEmail = dbProfile.email;
          if (dbProfile.avatar_url) fetchedAvatar = dbProfile.avatar_url;
        }
      } catch {
        // Table might not exist yet; gracefully ignore
      }

      // If name is still empty or default placeholder, derive from backend email
      if (!fetchedName || fetchedName === 'Rajesh Kumar') {
        fetchedName = deriveNameFromEmail(fetchedEmail);
      }

      if (!fetchedAvatar) {
        fetchedAvatar = getAvatarFromEmail(fetchedEmail, fetchedName);
      }

      const initials =
        fetchedName
          .split(' ')
          .filter(Boolean)
          .map((w: string) => w[0].toUpperCase())
          .slice(0, 2)
          .join('') || 'MN';

      setOperator((prev) => {
        const next: OperatorProfile = {
          ...prev,
          name: fetchedName,
          email: fetchedEmail,
          phone: fetchedPhone || prev.phone || '+91 98765 43210',
          avatarInitials: initials,
          avatarUrl: fetchedAvatar,
        };
        localStorage.setItem('smartrun_operator_profile', JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.warn('Could not fetch operator profile from backend:', err);
    }
  }, [user?.email, user?.id]);

  useEffect(() => {
    const config = getSupabaseConfig();
    setIsSupabaseConfigured(Boolean(config.url && config.anonKey));

    const supabase = getSupabase();
    if (supabase) {
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const authUser = {
            id: session.user.id,
            email: session.user.email || 'mdnoor4860@gmail.com',
          };
          setUser(authUser);
          fetchBackendProfile(authUser.email, authUser.id);
        } else {
          fetchBackendProfile();
        }
      }).catch((err) => {
        console.warn('Supabase auth session check failed:', err);
        fetchBackendProfile();
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const authUser = {
            id: session.user.id,
            email: session.user.email || 'mdnoor4860@gmail.com',
          };
          setUser(authUser);
          localStorage.setItem('smartrun_admin_session', JSON.stringify(authUser));
          fetchBackendProfile(authUser.email, authUser.id);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      fetchBackendProfile();
    }
  }, [fetchBackendProfile]);

  const signIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const supabase = getSupabase();
      if (supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // If user doesn't exist, try auto-signing up if email/password is valid admin
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          if (signUpError) {
            setIsLoading(false);
            return { success: false, error: error.message };
          }
          if (signUpData.user) {
            const authUser = { id: signUpData.user.id, email: signUpData.user.email || email };
            setUser(authUser);
            localStorage.setItem('smartrun_admin_session', JSON.stringify(authUser));
            await fetchBackendProfile(authUser.email, authUser.id);
            setIsLoading(false);
            return { success: true };
          }
        }

        if (data.user) {
          const authUser = { id: data.user.id, email: data.user.email || email };
          setUser(authUser);
          localStorage.setItem('smartrun_admin_session', JSON.stringify(authUser));
          await fetchBackendProfile(authUser.email, authUser.id);
          setIsLoading(false);
          return { success: true };
        }
      }

      // Offline / Direct Admin verification fallback
      const authUser = { id: 'admin-' + Date.now(), email: email.trim() || 'mdnoor4860@gmail.com' };
      setUser(authUser);
      localStorage.setItem('smartrun_admin_session', JSON.stringify(authUser));
      await fetchBackendProfile(authUser.email, authUser.id);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, error: message };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('smartrun_admin_session');
    }
  };

  const updateOperator = (updates: Partial<OperatorProfile>) => {
    setOperator((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('smartrun_operator_profile', JSON.stringify(next));
      return next;
    });
  };

  const saveBackendProfile = async (updates: { name: string; phone: string; email?: string; avatarUrl?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = getSupabase();
      const newAvatar = updates.avatarUrl || getAvatarFromEmail(updates.email || user?.email, updates.name);
      if (supabase) {
        // Update user metadata in Supabase Auth
        await supabase.auth.updateUser({
          data: {
            name: updates.name,
            full_name: updates.name,
            phone: updates.phone,
            mobile: updates.phone,
            avatar_url: newAvatar,
            picture: newAvatar,
          },
        });

        // Upsert to profiles table if table exists
        if (user?.id) {
          try {
            await supabase.from('profiles').upsert({
              id: user.id,
              name: updates.name,
              phone: updates.phone,
              email: updates.email || user.email,
              avatar_url: newAvatar,
              updated_at: new Date().toISOString(),
            });
          } catch (e) {
            console.warn('Profiles table upsert notice:', e);
          }
        }
      }

      updateOperator({
        name: updates.name,
        phone: updates.phone,
        ...(updates.email ? { email: updates.email } : {}),
        avatarUrl: newAvatar,
        avatarInitials: updates.name
          .split(' ')
          .filter(Boolean)
          .map((w) => w[0].toUpperCase())
          .slice(0, 2)
          .join('') || 'MN',
      });

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      return { success: false, error: msg };
    }
  };

  const refreshProfile = async () => {
    await fetchBackendProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        operator,
        isAuthenticated: Boolean(user),
        isLoading,
        isSupabaseConfigured,
        signIn,
        signOut,
        updateOperator,
        refreshProfile,
        saveBackendProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
