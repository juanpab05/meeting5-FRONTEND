import HeaderButtons from "./HeaderButtons";
import { PropsAuth } from "../schemas/auth";
import React from "react";
import { Link, useNavigate } from "react-router";



export const Header: React.FC<PropsAuth> = ({ auth, setAuth }) => {
    const navigate = useNavigate();
    const hover = "hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";
  return (
    <header
      className="
        fixed top-0 left-0 w-full bg-main-blue-meeting5 text-white
        shadow-md z-50
        flex justify-between
      "
      role="banner"
      aria-label="Encabezado de Meeting5"
    >
      {/* Meeting5 logo */}
      <div
        className="p-2 flex items-center sm:gap-2 sm:justify-between">
         <button
              onClick={() => navigate("/")}
              aria-label="Ir a la página de inicio"
              className="cursor-pointer"
            >
        <img className="w-16 h-auto rounded-lg" src="logo.svg" alt="Logo de meeting5"/>
        </button>
        <h1 className="text-lg font-semibold font-sans ml-2">meeting5</h1>
      </div>

      {/* links del header */}
      <nav
      className="
        flex flex-col items-center gap-8
        justify-center flex-1 p-2
        sm:flex-row sm:w-full
      "
      role="navigation"
      aria-label="Links de navegación"
    >

      <a href="#sitemap" aria-label="Ir al mapa del sitio">
        <span className={hover}>Mapa del sitio</span>
      </a>

      <a href="/#about-us" aria-label="Ir a sobre nosotros">
        <span className={hover}>Sobre nosotros</span>
      </a>


      <Link to="/" aria-label="Acceder al manual de usuario">
        <span className={hover}>Manual de usuario</span>
      </Link>
      </nav>

      {/** === LOGIN === */}
      <HeaderButtons auth={auth} setAuth={setAuth} />
    </header>
  );
};

export default Header;