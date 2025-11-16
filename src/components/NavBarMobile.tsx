import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import { getToken } from "../api/utils";
import { ListIcon } from "lucide-react";

export const NavbarMobile: React.FC<{isAuth?: boolean}> = ({isAuth}) => {
  const hover = "hover:text-red-500 transition-500 duration-200"
  const fila = "border-t border-b border-gray-500 flex w-full justify-center items-center h-[15vh]";
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMenu = () => {
    if (!isOpen) {setIsOpen(true)}
    else setIsOpen(false)
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) { 
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div 
      className="flex items-center pl-10"
    >
      {/** MENU */}
      <ListIcon onClick={handleMenu}/>

      <div 
        ref={menuRef}
        className={`
        ${isOpen ? "block" : "hidden "}
        transition duration-500 h-full
        fixed inset-0 bg-black/80 right-[45%]
        flex flex-col items-center pt-4
        `}
      >
        {/*<CinemaLogo/>*/}
        <nav 
        className="
        h-full mt-[5vh] w-full 
        "
        >
          <div className={fila}>
            <Link to="/home" onClick={() => {setIsOpen(false)}}>
            <span 
              className={hover}
            > Inicio</span>        
            </Link>
          </div>

          <div className={fila}>
            <Link to="/catalog" onClick={() => {setIsOpen(false)}}>
            <span 
              className={hover}
            > Catalogo</span>
            </Link>
          </div>

          {isAuth && getToken() && (
            <>
              <div className={fila}>
                  <Link to="/favorites" onClick={() => {setIsOpen(false)}}>
                    <span 
                    className={hover}
                    > Favoritos</span>
                  </Link>
              </div>
              <div className={fila}>
                  <Link to="/ratings" onClick={() => {setIsOpen(false)}}>
                  <span 
                    className={hover}
                  > Calificaciones</span>
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