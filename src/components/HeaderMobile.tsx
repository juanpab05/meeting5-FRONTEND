import NavbarMobile from "./NavBarMobile";
import CinemaLogo from "./CinemaLogo";
import Login from "./HeaderButtons";
import { PropsAuth } from "../schemas/auth";
import React from "react";

export const HeaderMobile: React.FC<PropsAuth> = ({auth, setAuth}) => {
  return(
    <header
      className="
        fixed top-0 left-0 w-full bg-black text-white
        shadow-md border-b border-gray-800 z-50
        flex justify-between sm:hidden
      "
      role="banner"
      aria-label="Encabezado móvil de Cinema Space"
    >
      {/** === NAV === */}
      <NavbarMobile isAuth={auth} />

      {/* === LOGO === */}
      <div
        className="
          p-2 flex items-center
          sm:gap-2 sm:justify-between 
        "
      >
        <CinemaLogo size="w-21 h-21" />
        <span
          className={`
            text-lg hidden font-semibold
            sm:ml-2 sm:${auth ? "hidden" : "block"}
            md:block
          `}
        >
          Cinema Space
        </span>
      </div>

      {/** === LOGIN === */}
      <Login auth={auth} setAuth={setAuth} />
    </header>
  );
};

export default HeaderMobile;