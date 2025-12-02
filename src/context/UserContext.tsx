import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile } from "../api/user";
import { UserData } from "../schemas/user";
import { getToken } from "../api/utils";

/**
 * Interface defining the shape of the User Context.
 * @interface UserContextType
 */
interface UserContextType {
  /** The current authenticated user object or guest data. */
  user: UserData | null;
  /** Static object with default values for an unauthenticated user. */
  guestUser: UserData;
  /** Function to manually update the user state. */
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  /** Indicates if the user profile is currently being fetched from the API. */
  loadingUser: boolean;
  /** Async function to force a reload of user data from the API. */
  refreshUser: () => Promise<void>;
}

/**
 * React Context to handle global user state.
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * User Context Provider.
 * * This component handles synchronization of the user profile with the backend
 * and manages session persistence via LocalStorage to prevent data loss
 * when reloading the page.
 * * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child elements that will have access to the context.
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  /**
   * Object representing an unauthenticated user (Guest).
   * Used as a fallback when there is no session or loading fails.
   */
  const guestUser: UserData = {
    _id: "guest",
    firstName: "Guest",
    lastName: "",
    age: 0,
    email: "",
    password: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  /**
   * Main user state.
   * * @strategy Lazy Initialization
   * We pass a function to `useState` instead of a direct value.
   * This allows reading `localStorage` synchronously BEFORE the first render.
   * * @returns {UserData | null} The cached user from storage or the guestUser object.
   */
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const storedUser = localStorage.getItem("user_data");
      return storedUser ? JSON.parse(storedUser) : guestUser;
    } catch (error) {
      console.warn("Error reading user_data from localStorage", error);
      return guestUser;
    }
  });

  /**
   * Loading state.
   * * Determines if we should show an initial loader.
   * - If we already have data in localStorage (`user_data`), start as `false` to show UI immediately.
   * - If there is a token but no local data, start as `true` to wait for the fetch.
   */
  const [loadingUser, setLoadingUser] = useState(() => {
    const hasToken = getToken();
    const hasStoredUser = localStorage.getItem("user_data");
    // Load only if token exists BUT we don't have local data yet.
    return !!hasToken && !hasStoredUser; 
  });

  /**
   * Fetches the current user profile from the API.
   * * Logic:
   * 1. Checks if a token exists.
   * 2. If token exists, calls the API.
   * 3. On success, updates state and saves to LocalStorage (Cache).
   * 4. On failure or missing token, reverts to `guestUser`.
   */
  const fetchUser = async () => {
    // If no token, ensure guest state and clear cache
    if (!getToken()) {
      if (user?._id !== "guest") {
         setUser(guestUser);
         localStorage.removeItem("user_data");
      }
      setLoadingUser(false);
      return;
    }

    try {
      const response = await fetchUserProfile();
      
      if (response && response.data) {
        setUser(response.data);
        // Persistence: Save fresh data for the next reload
        localStorage.setItem("user_data", JSON.stringify(response.data));
      } else {
        // Invalid token or empty response
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Note: You can decide here whether to logout or keep cached data
      // depending on the error type (e.g., network error vs 401).
    } finally {
      setLoadingUser(false);
    }
  };

  /**
   * Handles logout or invalidation of local data.
   */
  const handleLogout = () => {
      setUser(guestUser);
      localStorage.removeItem("user_data");
  };

  /**
   * Side effect to keep LocalStorage synchronized with state changes.
   * Useful if `setUser` is called manually from another component.
   */
  useEffect(() => {
      if (user && user._id !== "guest") {
          localStorage.setItem("user_data", JSON.stringify(user));
      } else if (user && user._id === "guest") {
          localStorage.removeItem("user_data");
      }
  }, [user]);

  /**
   * Mount effect.
   * Attempts to refresh data from the API in the background when the app loads.
   */
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Public helper to manually refresh user data.
   * Useful for updating the UI after editing the profile.
   */
  const refreshUser = async () => {
    setLoadingUser(true);
    try {
      await fetchUser();
    } catch (error: any) {
      if (error.message?.includes("Resource not found")) {
        handleLogout();
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
 * Custom hook to consume the User Context.
 * * @returns {UserContextType} The user context.
 * @throws {Error} If used outside of a UserProvider.
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};