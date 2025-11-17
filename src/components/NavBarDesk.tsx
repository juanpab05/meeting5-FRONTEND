import React from "react";
import { Link } from "react-router";
import { getToken } from "../api/utils";

export const NavBarSM: React.FC<{ isAuth?: boolean }> = ({ isAuth }) => {
  const hover = "hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200";

  return (
    <nav
      className="
        flex flex-col items-center gap-2
        justify-center flex-1 p-2
        sm:flex-row sm:w-full
        md:gap-4
      "
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      <Link to="/" aria-label="Ir a la página de inicio">
        <span className={hover}>Inicio</span>
      </Link>

      <Link to="/catalog" aria-label="Ir al catálogo de películas">
        <span className={hover}>Catálogo</span>
      </Link>

      {isAuth && getToken() && (
        <>
          <Link to="/favorites" aria-label="Ir a la página de favoritos">
            <span className={hover}>Favoritos</span>
          </Link>
          <Link to="/ratings" aria-label="Ir a la página de calificaciones">
            <span className={hover}>Calificaciones</span>
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavBarSM;
