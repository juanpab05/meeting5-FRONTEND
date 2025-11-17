import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import { getToken } from "../api/utils";
import { ListIcon } from "lucide-react";
import { useUser } from "../context/UserContext";

export const NavbarMobile: React.FC<{ isAuth?: boolean }> = ({ isAuth }) => {
  const fila =
    "border-b border-white/20 flex w-full justify-center items-center py-6";
  const hover = "text-white hover:text-gray-100 transition duration-200";
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const { setUser, guestUser } = useUser();

  const handleLogout = () => {
    // Remove auth data and reset user in context
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(guestUser);
    setIsOpen(false);
    // Optionally navigate to home or login
    // window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center">
      {/* Ícono hamburguesa */}
      <ListIcon
        onClick={handleMenu}
        className="text-white w-7 h-7 active:scale-95 transition"
      />

      {/* PANEL LATERAL */}
      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-[70%] 
          bg-[#2DCD71] text-white shadow-xl 
          transform transition-transform duration-300
          flex flex-col pt-10 z-[9999]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <nav className="w-full">
          <div className={fila}>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <span className={hover}>Inicio</span>
            </Link>
          </div>

          <div className={fila}>
            <Link to="/catalog" onClick={() => setIsOpen(false)}>
              <span className={hover}>Catálogo</span>
            </Link>
          </div>

        
      
          {isAuth && getToken() && (
            <>
              <div className={fila}>
                <Link to="/favorites" onClick={() => setIsOpen(false)}>
                  <span className={hover}>Favoritos</span>
                </Link>
              </div>

              <div className={fila}>
                <Link to="/ratings" onClick={() => setIsOpen(false)}>
                  <span className={hover}>Calificaciones</span>
                </Link>
              </div>
              <div className={fila}>
                <Link to="/logout" onClick={() => setIsOpen(false)}>
                <button onClick={handleLogout} className={hover}>
                  Cerrar sesión
                </button>
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default NavbarMobile;
