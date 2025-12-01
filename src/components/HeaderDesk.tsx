import HeaderButtons from "./HeaderButtons";
import { PropsAuth } from "../schemas/auth";
import React from "react";
import { Link, useNavigate } from "react-router";

/**
 * Desktop header for the application.
 *
 * Displays the logo, navigation links and the auth buttons area. It adapts
 * to desktop sizes and defers auth actions to `HeaderButtons`.
 */
export const Header: React.FC<PropsAuth> = ({ auth, setAuth }) => {
  const navigate = useNavigate();
  const hover =
    "hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition duration-200";

  return (
    <header
      className="
        fixed top-0 left-0 w-full bg-main-blue-meeting5 text-white
        shadow-md z-50 flex justify-between
      "
      role="banner"
      aria-label="Encabezado de Meeting5"
    >
      {/* Meeting5 logo */}
      <div className="p-2 flex items-center sm:gap-2 sm:justify-between">
        <button
          onClick={() => navigate("/")}
          aria-label="Ir a la página de inicio"
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
        >
          <img
            className="w-16 h-auto rounded-lg"
            src="logo.svg"
            alt="Logo de Meeting5"
          />
        </button>

        <h1 className="text-lg font-semibold font-sans ml-2">meeting5</h1>
      </div>

      {/* links del header */}
      <nav
        className="
          flex flex-col items-center gap-8 justify-center flex-1 p-2
          sm:flex-row sm:w-full
        "
        role="navigation"
        aria-label="Links de navegación del encabezado"
      >
        <a
          href="#sitemap"
          aria-label="Ir al mapa del sitio"
          className={hover}
        >
          Mapa del sitio
        </a>

        <a
          href="/#about-us"
          aria-label="Ir a la sección sobre nosotros"
          className={hover}
        >
          Sobre nosotros
        </a>

        <Link
          to="/"
          aria-label="Acceder al manual de usuario"
          className={hover}
        >
          Manual de usuario
        </Link>
      </nav>

      {/** === LOGIN === */}
      <HeaderButtons auth={auth} setAuth={setAuth} />
    </header>
  );
};

export default Header;
