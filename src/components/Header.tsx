//import NavBarSM from "./NavBarDesk";
//import CinemaLogo from "./CinemaLogo";
//import Login from "./Login";
import type { PropsAuth } from "../schemas/auth";
import React from "react";

export const Header: React.FC<PropsAuth> = ({ auth, setAuth }) => {
  return (
    <header
      className="
        fixed top-0 left-0 w-full bg-black text-white
        shadow-md border-b border-gray-800 z-50
        flex justify-between
      "
      role="banner"
      aria-label="Encabezado de Cinema Space"
    >
      {/* === LOGO === */}
      <div
        className="
          p-2 flex items-center
          sm:gap-2 sm:justify-between 
        "
      >
        <img src="vite.svg" alt="Vite Logo" />
        <span
          className={`
            text-lg hidden font-semibold
            sm:ml-2 sm:${auth ? "hidden" : "block"}
            md:block
          `}
        >
          
        </span>
      </div>

      {/** === LOGIN === */}
      <Login auth={auth} setAuth={setAuth} />
    </header>
  );
};

export default Header;


