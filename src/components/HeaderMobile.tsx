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
        sm:hidden
      "
      role="banner"
    >
      {/* === LEFT SIDE: LOGO + TEXT === */}
      <div className="flex items-center gap-2">
        {/* ICONO (pon el tuyo aquí) */}
        <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
          📹
        </div>

        {/* TEXTO DEL LOGO */}
        <span className="text-xl font-semibold tracking-wide">
          meeting5
        </span>
      </div>

      {/* === RIGHT SIDE: BUTTONS === */}
      <div className="flex items-center gap-3">
        {/* Botón iniciar sesión */}
        <Login auth={auth} setAuth={setAuth} />

        {/* Menú hamburguesa */}
        <NavbarMobile isAuth={auth} />
      </div>
    </header>
  );
};

export default HeaderMobile;
