import React from 'react';
import { useNavigate } from 'react-router';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main 
      className="max-w-3xl mx-auto text-white rounded-2xl shadow-lg p-8 my-10 bg-gradient-to-b from-black via-neutral-900 to-black"
      role="main"
      aria-labelledby="page-title"
    >
      {/* Título principal */}
      <header className="mb-6">
        <h1 id="page-title" className="text-4xl font-extrabold text-red-600 mb-2">
          Sobre Cinema Space
        </h1>
        <p className="text-lg text-gray-300">
          Explora, guarda y disfruta tus películas favoritas.
        </p>
      </header>

      {/* Sección descriptiva */}
      <section 
        className="mb-8" 
        aria-labelledby="about-app"
      >
        <h2 id="about-app" className="text-sm font-semibold uppercase tracking-wide text-red-500 mb-2">
          Acerca de la aplicación
        </h2>
        <p className="text-gray-400 leading-relaxed text-justify">
          <strong>Cinema Space</strong> es una plataforma diseñada para los amantes del cine. 
          Descubre películas, crea tus listas personalizadas y sumérgete en el universo del entretenimiento con estilo.
        </p>
      </section>

      {/* Sección de información */}
      <section 
        className="grid md:grid-cols-2 gap-6 mb-8"
        aria-labelledby="app-info"
      >
        {/* Información técnica */}
        <article 
          className="bg-neutral-900 rounded-xl p-5 shadow-inner border border-neutral-800"
          aria-label="Información de la aplicación"
        >
          <h3 id="app-info" className="text-lg font-semibold text-white mb-2">
            Información
          </h3>
          <dl className="text-gray-400">
            <div>
              <dt className="font-semibold text-white">Nombre:</dt>
              <dd className="mb-1">Cinema Space</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Versión:</dt>
              <dd className="mb-1">1.0.1</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Desarrollador:</dt>
              <dd className="mb-1">2D3J</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Contacto:</dt>
              <dd>
                <a
                  href="mailto:support@cinema.com"
                  className="text-red-500 hover:text-red-400 underline"
                  aria-label="Correo de contacto support arroba cinema punto com"
                >
                  support@cinema.com
                </a>
              </dd>
            </div>
          </dl>
        </article>

        {/* Equipo */}
        <article 
          className="bg-neutral-900 rounded-xl p-5 shadow-inner border border-neutral-800"
          aria-label="Equipo de desarrollo"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Equipo</h3>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>David Guerrero</li>
            <li>Juan Pablo</li>
            <li>Jhonier Mendez</li>
            <li>Jose Daniel</li>
            <li>Juan Tobar</li>
          </ul>
        </article>
      </section>

      {/* Botón de retorno */}
      <nav className="text-center" aria-label="Navegación secundaria">
        <button
          onClick={() => navigate("/home")}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-500"
          aria-label="Volver a la página de inicio"
        >
          Volver
        </button>
      </nav>
    </main>
  );
};

export default AboutPage;