import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile } from "../api/user";
import { UserData } from "../schemas/user";
import { getToken } from "../api/utils";

interface UserContextType {
  user: UserData | null;
  guestUser: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  loadingUser: boolean;
  refreshUser: () => Promise<void>;
}

/**
 * React context that holds the current authenticated user and helpers.
 *
 * - `user`: the currently loaded user data or the `guestUser` fallback.
 * - `guestUser`: a lightweight guest user object used when no authenticated
 *    user is available.
 * - `setUser`: React state setter for the user.
 * - `loadingUser`: true while the user profile is being fetched.
 * - `refreshUser`: re-fetches the user profile from the server.
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Provider that keeps user profile in sync with the backend.
 *
 * Responsibilities:
 * - Fetch the user profile when the app starts (if a token exists).
 * - Expose `refreshUser` to allow manual refreshes (used after login).
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const guestUser = ({
  _id:"guest",
  firstName: "guest",
  lastName: "",
  age: 0,
  email: "",
  password: "",
  createdAt: new Date(),
  updatedAt: new Date()
  });

  const [user, setUser] = useState<UserData | null>(guestUser);
  const [loadingUser, setLoadingUser] = useState(true);

  /**
   * Fetch the current user's profile from the API and update context state.
   * Falls back to `guestUser` when no token is present or when the profile
   * cannot be retrieved.
   */
  const fetchUser = async () => {
    if (getToken() !== null) {
      try {
        const response = await fetchUserProfile();
        if (response) {
          setUser({ ...response.data });
        } else {
          setUser(guestUser); // 👈 fallback si el perfil no existe
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(guestUser);
      } finally {
        setLoadingUser(false);
      }
    } else {
      setUser(guestUser);
      setLoadingUser(false);
    }
  };


  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * Public helper to refresh the user profile. Sets `loadingUser` while
   * the refresh is in progress and preserves the guest fallback when
   * the resource is not available.
   */
  const refreshUser = async () => {
    setLoadingUser(true);
    try {
      await fetchUser();
    } catch (error: any) {
      if (error.message.includes("Recurso no encontrado")) {
        setUser(guestUser); // 👈 fallback automático
      }
    } finally {
      setLoadingUser(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, guestUser, setUser, loadingUser, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook to consume the `UserContext`.
 * Throws if used outside of `UserProvider`.
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
