import React, { useEffect, useState } from "react";
import Footer from "../components/Footer.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../api/utils.ts";
import Header from "../components/HeaderDesk.tsx";
import { useUser } from "../context/UserContext.tsx";
import { fetchToken } from "../api/login.ts";
import HeaderMobile from "../components/HeaderMobile.tsx";

/**
 * Props for the layout component.
 *
 * @property {React.ReactNode} children - Page content rendered inside the layout.
 */
interface LayoutMeeting5Props {
  children: React.ReactNode;
}

/**
 * Application layout that conditionally renders headers and footer.
 *
 * Responsibilities:
 * - Show/hide desktop and mobile headers depending on the route.
 * - Show/hide footer depending on the route.
 * - Verify authentication periodically and redirect unauthenticated users
 *   away from protected routes.
 *
 * @param {LayoutMeeting5Props} props - Component props.
 * @returns {JSX.Element}
 */
const LayoutMeeting5: React.FC<LayoutMeeting5Props> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean>(true);
  const { user } = useUser();

  /**
   * Routes where header and footer should not be displayed.
   */
  const noLayoutRoutes = [
    "/sign-in",
    "/sign-up",
    "/recover-password",
    "/reset-password",
  ];

  /**
   * Public routes accessible without authentication.
   */
  const publicRoutes = [
    "/reset-password",
    "/sign-in",
    "/sign-up",
    "/",
    "/recover-password",
  ];

  /**
   * Public-only routes (should redirect authenticated users away).
   */
  const publicOnlyRoutes = ["/sign-in", "/sign-up"];

  /**
   * Determine if a pathname matches a public route.
   *
   * @param {string} pathname - The path to evaluate (e.g. "/sign-in").
   * @returns {boolean} True when the pathname matches a defined public route.
   */
  const isPublicRoute = (pathname: string) => {
    return publicRoutes.some((route) => {
      const pattern = new RegExp("^" + route.replace(/:\\w+/g, "[^/]+") + "$");
      return pattern.test(pathname);
    });
  };

  /**
   * Determine whether header/footer should be hidden for the current route.
   *
   * Hides layout for specific routes (login/recover/reset) and for dynamic
   * meeting routes such as `/meeting/:id`.
   *
   * @returns {boolean} True if the layout should be hidden on the current route.
   */
  const shouldHideLayout = () => {
    if (noLayoutRoutes.includes(location.pathname)) return true;

    const meetingPattern = /^\/meeting\/[^/]+$/;
    if (meetingPattern.test(location.pathname)) return true;

    return false;
  };

  useEffect(() => {
    /**
     * Verify token with backend and update `isAuth`.
     *
     * - If there is no token and the route is not public, redirect to `/`.
     * - If the token is invalid, remove it and redirect to `/`.
     */
    const verifyAuth = async () => {
      try {
        const token = getToken();

        if (!token) {
          setIsAuth(false);

          if (!isPublicRoute(location.pathname)) navigate("/");
          return;
        }

        const response = await fetchToken(token);
        if (response) {
          setIsAuth(true);
          if (publicOnlyRoutes.includes(location.pathname)) navigate("/");
        } else {
          localStorage.removeItem("token");
          setIsAuth(false);
          navigate("/");
        }
      } catch (error) {
        console.error("Error verificando token:", error);
        localStorage.removeItem("token");
        setIsAuth(false);
      }
    };

    // Run verification when appropriate.
    if (user?._id !== "guest" || !isPublicRoute(location.pathname)) {
      verifyAuth();
    }

    // Poll to detect token removal (e.g., manual logout in other tab).
    const interval = setInterval(() => {
      const token = getToken();
      if (!token && isAuth) setIsAuth(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [location.pathname, isAuth, user?._id]);

  return (
    <>
      {/* Show header only when layout is not hidden */}
      {!shouldHideLayout() && (
        <>
          <div className="hidden md:block" role="banner" aria-label="Encabezado de escritorio">
            <Header auth={isAuth} setAuth={setIsAuth} />
          </div>
          <div className="block md:hidden" role="banner" aria-label="Encabezado móvil">
            <HeaderMobile auth={isAuth} setAuth={setIsAuth} />
          </div>
        </>
      )}

      {/* Page content */}
      {children}

      {/* Show footer only when layout is not hidden */}
      {!shouldHideLayout() && <Footer aria-label="Pie de página" />}
    </>
  );
};

export default LayoutMeeting5;
