import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { PropsAuth } from "../schemas/auth";

export const HeaderButtons: React.FC<PropsAuth> = ({ auth, setAuth }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, guestUser, setUser, loadingUser, refreshUser } = useUser();

  useEffect(() => {
    if (auth && !loadingUser && !user?.name) {
      const interval = setInterval(async () => {
        await refreshUser();
      }, 100);

      return () => clearInterval(interval);
    }
  }, [auth, user, loadingUser, refreshUser]);

  /** Menu */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleMenu = () => setShowMenu(!showMenu);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(guestUser)
    setAuth(false);
    setShowMenu(false);
    navigate("/");
  };

  return (
    <div
      className="flex items-center p-2
        sm:pl-4
        md:pl-22 
        "
    >
      {!auth && (
        <div
          className="
            flex flex-col gap-2
            sm:flex-row sm:gap-4
            "
        >
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="
              button-blue1-meeting5 hover:bg-red-700 
              text-white font-semibold 
              px-4 py-2 rounded-lg transition-colors
              cursor-pointer
              "
          > Iniciar sesión </button>

          <button
            type="button"
            onClick={() => navigate("/sign-up")}
            className="
              button-blue2-meeting5 hover:bg-gray-300 text-black font-semibold 
              px-4 py-2 rounded-lg transition-colors cursor-pointer
              "
          > Registrarse </button>

          <button
            type="button"
            onClick={() => navigate("/create-meet")}
            className="
              button-blue2-meeting5 hover:bg-gray-300 text-black font-semibold 
              px-4 py-2 rounded-lg transition-colors cursor-pointer
              "
          > Meet </button>
        </div>
      )
      }

      {auth && localStorage.getItem("token") && (
        <div
          className="
            flex flex-col gap-2
            sm:flex-row sm:gap-4
            "
        >
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="
              button-green-meeting5 shadow-lg hover:bg-red-700 
              text-white font-semibold 
              px-4 py-2 rounded-lg transition-colors
              cursor-pointer
              "
          > Crear reunión </button>

          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="
              button-blue1-meeting5  shadow-md hover:bg-red-700 
              text-white font-semibold 
              px-4 py-2 rounded-lg transition-colors
              cursor-pointer
              "
          > Ver perfil </button>

          <button
            type="button"
            onClick={() => {
              handleLogout()
            }}
            className="
              button-blue2-meeting5 shadow-lg hover:bg-gray-300 text-black font-semibold 
              px-4 py-2 rounded-lg transition-colors cursor-pointer
              "
          > Cerrar sesión </button>
        </div>
      )
      }
    </div>
  );
};

export default HeaderButtons;