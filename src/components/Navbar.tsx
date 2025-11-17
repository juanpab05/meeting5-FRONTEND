import React from "react";
import { Link } from "react-router";

export const Navbar: React.FC<{ isAuth: boolean }> = ({ isAuth }) => {
  const linkClass =
    "hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200";

  return (
    <nav
      className="flex gap-4 pr-6 flex-shrink-0"
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      <Link to="/" className={linkClass} aria-label="Ir a la página de inicio">
        Inicio
      </Link>
      <Link to="/catalog" className={linkClass} aria-label="Ir al catálogo de películas">
        Catálogo
      </Link>

      {isAuth && (
        <>
          <Link to="/favorites" className={linkClass} aria-label="Ir a la página de favoritos">
            Favoritos
          </Link>
          <Link to="/ratings" className={linkClass} aria-label="Ir a la página de calificaciones">
            Calificaciones
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
