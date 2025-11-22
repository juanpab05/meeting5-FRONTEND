import React, { useEffect, useState } from "react";
import Footer from "../components/Footer.tsx";
import { useLocation, useNavigate } from "react-router-dom"; // 👈 usa react-router-dom
import { getToken } from "../api/utils.ts";
import Header from "../components/HeaderDesk.tsx";
import { useUser } from "../context/UserContext.tsx";
import { fetchToken } from "../api/login.ts";
import HeaderMobile from "../components/HeaderMobile.tsx";

interface LayoutMeeting5Props {
  children: React.ReactNode;
}

const LayoutMeeting5: React.FC<LayoutMeeting5Props> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean>(true);
  const { user } = useUser();

  /**
   * Rutas donde el encabezado y el footer no deben mostrarse.
   */
  const noLayoutRoutes = [
    "/sign-in",
    "/sign-up",
    "/recover-password",
    "/reset-password",
  ];

  /**
   * Rutas públicas accesibles sin autenticación.
   */
  const publicRoutes = [
    "/reset-password",
    "/sign-in",
    "/sign-up",
    "/",
    "/recover-password"
  ];

  /**
   * Rutas públicas exclusivas para usuarios no autenticados.
   */
  const publicOnlyRoutes = ["/sign-in", "/sign-up"];

  /**
   * Determina si una ruta es pública.
   */
  const isPublicRoute = (pathname: string) => {
    return publicRoutes.some((route) => {
      const pattern = new RegExp("^" + route.replace(/:\w+/g, "[^/]+") + "$");
      return pattern.test(pathname);
    });
  };

  /**
   * Determina si el layout (header/footer) debe ocultarse en la ruta actual.
   */
  const shouldHideLayout = () => {
    // Ocultar si coincide con alguna ruta fija
    if (noLayoutRoutes.includes(location.pathname)) return true;

    // Ocultar si es una reunión (ruta dinámica /meeting/:id)
    const meetingPattern = /^\/meeting\/[^/]+$/;
    if (meetingPattern.test(location.pathname)) return true;

    return false;
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = getToken();

        if (!token) {
          setIsAuth(false);

          // Si el usuario no está en una ruta pública, redirigir a "/".
          if (!isPublicRoute(location.pathname)) navigate("/");
          return;
        }

        const response = await fetchToken(token);
        if (response) {
          setIsAuth(true);

          // Si el usuario está en una ruta pública exclusiva, redirigir a "/".
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

    // Verificar autenticación solo si el usuario no es invitado o la ruta no es pública.
    if (user?._id !== "guest" || !isPublicRoute(location.pathname)) {
      verifyAuth();
    }

    // Intervalo para verificar el estado del token.
    const interval = setInterval(() => {
      const token = getToken();
      if (!token && isAuth) setIsAuth(false);
    }, 5000); // Verificación cada 5 segundos.

    return () => clearInterval(interval);
  }, [location.pathname, isAuth, user?._id]);

  return (
    <>
      {/* Mostrar header solo si no está oculto */}
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

      {/* Contenido de la página */}
      {children}

      {/* Mostrar footer solo si no está oculto */}
      {!shouldHideLayout() && <Footer aria-label="Pie de página" />}
    </>
  );
};

export default LayoutMeeting5;
