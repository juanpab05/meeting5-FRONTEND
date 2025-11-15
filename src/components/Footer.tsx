import { 
  Film, 
  Mail 
} from "lucide-react";
import FooterNavbar from "./FooterNavbar";

/**
 * Elegant footer inspired by streaming platforms like Netflix or Crunchyroll.
 *
 * @component
 * @returns {JSX.Element} The themed footer for Cinema Space.
 */
export const Footer = ({ auth }: { auth: boolean }) => {
  return (
    <footer
      className="w-full bg-gradient-to-t from-black via-gray-900 to-gray-800 text-gray-300 py-10 px-6 shadow-[0_-2px_10px_rgba(0,0,0,0.7)]"
      role="contentinfo"
      aria-label="Pie de página de Cinema Space"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-col md:flex-col justify-between items-center gap-6">
        
        {/* Branding */}
        <div className="flex items-center gap-3">
          <Film className="text-red-500 w-6 h-6" aria-hidden="true" />
          <h2 className="text-xl font-bold text-white">
            <span className="text-red-500">Cinema</span>Space
          </h2>
          <span className="text-sm text-gray-400 ml-2">v1.0.1</span>
        </div>

        <FooterNavbar isAuth={auth} />

        {/* Contact info */}
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-red-400" aria-hidden="true" />
          <p>
            Contacto:{" "}
            <a
              href="mailto:support@cinemaspace.com"
              className="text-white font-medium underline focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Enviar un correo a support@cinemaspace.com"
            >
              support@cinemaspace.com
            </a>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-500"
        aria-label="Derechos reservados"
      >
        © 2025 <span className="text-red-500">CinemaSpace</span>. Todos los
        derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
