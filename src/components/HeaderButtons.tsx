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
    if (auth && !loadingUser && !user?.firstName) {
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
            flex flex-row gap-2
            sm:flex-row sm:gap-4
            "
        >
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="
              bg-[#2E91D9] hover:bg-[#2075B1]
              text-white font-semibold 
              px-2 py-1 text-sm rounded-md
              sm:px-4 sm:py-2 sm:text-base sm:rounded-lg
              transition-colors cursor-pointer
              "
            >
            Iniciar sesión
          </button>

          <button
              type="button"
              onClick={() => navigate("/sign-up")}
              className="
                hidden md:block
                bg-[#362ED9] hover:bg-[#1F198A] font-semibold 
                px-2 py-1 text-sm rounded-md
                sm:px-4 sm:py-2 sm:text-base sm:rounded-lg
                transition-colors cursor-pointer
                "
              >
              Registrarse
          </button>


        </div>
      )
      }

      {auth && localStorage.getItem("token") && (
        <div
          className="
            flex flex-row gap-2
            sm:flex-row sm:gap-4
            "
        >
          <button
            type="button"
            onClick={() => navigate("/create-meet")}
            className="
              bg-[#2DCD71] hover:bg-[#26AB60] shadow-lg
              text-white font-semibold 
              px-4 py-2 rounded-lg transition-colors
              cursor-pointer
              "
          > Crear reunión </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="
              hidden md:block
              bg-[#2E91D9] hover:bg-[#2075B1] shadow-md
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
              hidden md:block
              bg-[#362ED9] hover:bg-[#1F198A] font-semibold 
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