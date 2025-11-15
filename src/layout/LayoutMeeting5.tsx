import React, { useEffect, useState } from "react";
import Footer from "../components/Footer.tsx";
import { useLocation, useNavigate } from "react-router";
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
   * Rutas donde el encabezado no debe mostrarse.
   */
  const noHeaderRoutes = ["/", "/sign-in", "/sign-up", "/recover-password", "/about-us"];

  /**
   * Rutas públicas accesibles sin autenticación.
   */
  const publicRoutes = [
    "/home",
    "/reset-password",
    "/about-us",
    "/sign-in",
    "/sign-up",
    "/",
    "/recover-password",
    "/catalog",
    "/view-movie",
    "/view-movie/:id",
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
   * Determina si el encabezado debe ocultarse en la ruta actual.
   */
  const shouldHideHeader = noHeaderRoutes.includes(location.pathname);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = getToken();

        if (!token) {
          setIsAuth(false);

          // Si el usuario no está en una ruta pública, redirigir a "home".
          if (!isPublicRoute(location.pathname)) navigate("/home");
          return;
        }

        const response = await fetchToken(token);
        if (response) {
          setIsAuth(true);

          // Si el usuario está en una ruta pública exclusiva, redirigir a "home".
          if (publicOnlyRoutes.includes(location.pathname)) navigate("/home");
        } else {
          localStorage.removeItem("token");
          setIsAuth(false);
          navigate("/home");
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
      {/* Encabezado condicional */}
      {!shouldHideHeader && (
        <>
          <div className="hidden sm:block" role="banner" aria-label="Encabezado de escritorio">
            <Header auth={isAuth} setAuth={setIsAuth} />
          </div>
          <div className="block sm:hidden" role="banner" aria-label="Encabezado móvil">
            <HeaderMobile auth={isAuth} setAuth={setIsAuth} />
          </div>
        </>
      )}

      {/* Contenido principal */}
      <main
        className="
        w-full max-w-screen min-h-screen
        overflow-x-hidden flex justify-center items-center
        bg-gradient-to-b from-gray-900 via-black to-gray-900 
        text-white pt-16
        "
        role="main"
        aria-label="Contenido principal de la página"
      >
        <div
          className="
          absolute inset-0 bg-[url('/textures/noise.svg')] opacity-10 pointer-events-none
          "
        />
        {children}
      </main>

      {/* Pie de página */}
      <Footer auth={isAuth} aria-label="Pie de página" />
    </>
  );
};

export default LayoutMeeting5;