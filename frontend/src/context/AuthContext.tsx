import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../lib/firebase';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

const TOKEN_KEY = 'crm-auth-token';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  fullName: string;
  role: string;
  avatarText: string;
  organizationId: string;
  organizationName?: string;
  organization?: {
    id: string;
    name: string;
    domain: string;
    tier: string;
    region: string;
  };
}

interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarText: string;
  organization: {
    id: string;
    name: string;
    domain: string;
    tier: string;
    region: string;
  };
}

interface AuthResponse {
  token: string;
  user: UserProfile;
}

function mapUser(backendUser: BackendUser): UserProfile {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name,
    fullName: backendUser.name,
    role: backendUser.role,
    avatarText: backendUser.avatarText,
    organizationId: backendUser.organization?.id,
    organizationName: backendUser.organization?.name,
    organization: backendUser.organization,
  };
}

interface AuthContextValue {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
    organizationDomain?: string
  ) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendOtpEmail: (email: string) => Promise<void>;
  verifyOtpLink: (email: string) => Promise<void>;
  sendPhoneOtp: (phone: string, recaptchaContainerId: string) => Promise<void>;
  confirmPhoneOtp: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function parseResponse(response: Response) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body?.error?.message ||
        body?.message ||
        'Authentication request failed.'
    );
  }

  return body;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null);

  const saveSession = (data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setCurrentUser(data.user);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
  };

  useEffect(() => {
    const loadExistingSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          clearSession();
          return;
        }

        const body = await response.json();
        const rawUser = body.user ?? body.data ?? body;
        setCurrentUser(rawUser.organization ? mapUser(rawUser) : rawUser);
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingSession();
  }, []);

  const login = async (
    email: string,
    password: string,
    organizationDomain?: string
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      // 1. Try JWT login first (works for seed / direct DB users)
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, organizationDomain }),
      });

      if (response.ok) {
        const body = await response.json();
        saveSession({ token: body.token, user: mapUser(body.user) });
        return;
      }

      const errBody = await response.json().catch(() => ({}));
      const code = errBody?.error?.code || errBody?.code || '';

      // 2. If JWT says invalid credentials, the account may be Firebase-only —
      //    try Firebase email/password auth and exchange for a backend JWT.
      if (response.status === 401 || code === 'INVALID_CREDENTIALS') {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const idToken = await cred.user.getIdToken();

        const fbResponse = await fetch(`${API_BASE}/auth/firebase-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        const fbBody = await parseResponse(fbResponse);
        saveSession({ token: fbBody.token, user: mapUser(fbBody.user) });
        return;
      }

      // Other backend error
      throw new Error(
        errBody?.error?.message || errBody?.message || 'Authentication request failed.'
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${API_BASE}/auth/firebase-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
        }),
      });

      const body = await parseResponse(response);

      saveSession({
        token: body.token,
        user: mapUser(body.user),
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to sign in with Google.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      // Set display name so the Firebase token carries it to the backend
      await updateProfile(cred.user, { displayName: name });
      const idToken = await cred.user.getIdToken(/* forceRefresh */ true);

      const response = await fetch(`${API_BASE}/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, name, phone }),
      });

      const body = await parseResponse(response);
      saveSession({ token: body.token, user: mapUser(body.user) });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to create account.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const OTP_EMAIL_KEY = 'crm-otp-email';
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };

  const sendOtpEmail = async (email: string) => {
    setError(null);
    setIsLoading(true);

    try {
      await sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings);
      localStorage.setItem(OTP_EMAIL_KEY, email);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to send sign-in link.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpLink = async (emailHint: string) => {
    setError(null);
    setIsLoading(true);

    try {
      if (!isSignInWithEmailLink(firebaseAuth, window.location.href)) {
        throw new Error('This link is not a valid sign-in link.');
      }

      const storedEmail = localStorage.getItem(OTP_EMAIL_KEY) || emailHint;
      const cred = await signInWithEmailLink(
        firebaseAuth,
        storedEmail,
        window.location.href
      );
      localStorage.removeItem(OTP_EMAIL_KEY);
      const idToken = await cred.user.getIdToken();

      const response = await fetch(`${API_BASE}/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const body = await parseResponse(response);
      saveSession({ token: body.token, user: mapUser(body.user) });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to verify sign-in link.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOtp = async (phone: string, recaptchaContainerId: string) => {
    setError(null);
    setIsLoading(true);

    try {
      // Clear any existing recaptcha widget
      const existingVerifier = (window as any)._nexusRecaptcha;
      if (existingVerifier) {
        existingVerifier.clear();
        (window as any)._nexusRecaptcha = null;
      }

      const verifier = new RecaptchaVerifier(firebaseAuth, recaptchaContainerId, {
        size: 'invisible',
      });
      (window as any)._nexusRecaptcha = verifier;

      const result = await signInWithPhoneNumber(firebaseAuth, phone, verifier);
      setPhoneConfirmation(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to send OTP. Check the phone number.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPhoneOtp = async (code: string) => {
    setError(null);
    setIsLoading(true);

    try {
      if (!phoneConfirmation) {
        throw new Error('No OTP session found. Please request a new code.');
      }

      const cred = await phoneConfirmation.confirm(code);
      const idToken = await cred.user.getIdToken();

      const response = await fetch(`${API_BASE}/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const body = await parseResponse(response);
      saveSession({ token: body.token, user: mapUser(body.user) });
      setPhoneConfirmation(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    clearSession();

    try {
      await signOut(firebaseAuth);
    } catch {
      // The backend JWT session is already cleared locally.
    }
  };

  const clearError = () => setError(null);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isLoading,
      error,
      login,
      register,
      loginWithGoogle,
      sendOtpEmail,
      verifyOtpLink,
      sendPhoneOtp,
      confirmPhoneOtp,
      logout,
      clearError,
    }),
    [currentUser, isLoading, error]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}
