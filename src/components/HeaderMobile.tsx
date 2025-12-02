import NavbarMobile from "./NavBarMobile";
import Login from "./HeaderButtons";
import { PropsAuth } from "../schemas/auth";
import React from "react";

export const HeaderMobile: React.FC<PropsAuth> = ({ auth, setAuth }) => {
  return (
    <header
      className="
        fixed top-0 left-0 w-full 
        bg-blue-600 text-white 
        shadow-md z-50 
        flex items-center justify-between
        px-4 h-16
      "
      role="banner"
      aria-label="Encabezado móvil del sitio"
    >
      {/* LOGO + NOMBRE */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center">
          <img
            className="w-auto rounded-lg"
            src="logo.svg"
            alt="Logo de Meeting5"
            loading="lazy"
          />
        </div>

        <span className="text-xl font-semibold tracking-wide">
          Meeting5
        </span>
      </div>

      {/* BOTONES */}
      <div className="flex items-center gap-3">
        <Login auth={auth} setAuth={setAuth} />

        {/* Menú hamburguesa accesible */}
        <NavbarMobile isAuth={auth} aria-label="Abrir menú de navegación" />
      </div>
    </header>
  );
};

export default HeaderMobile;
