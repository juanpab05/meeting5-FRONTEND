import { EditProfile, ChangePassword, DeleteAccount } from "../components/profile";

export function UserProfilePage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      
      {/* Skip link para accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-2 rounded-md shadow-md"
      >
        Saltar al contenido principal
      </a>

      <main id="main-content" role="main" className="max-w-4xl mx-auto">
        
        <header className="mb-8 mt-16">
          <h1
            className="text-[#1F2937] mb-2 text-3xl font-semibold"
            aria-level={1}
          >
            Mi Perfil
          </h1>
          <p className="text-[#1F2937]/60">
            Administra tu cuenta y configuración de seguridad
          </p>
        </header>
        
        <div className="space-y-6">
          {/* Sección de Editar Perfil */}
          <section aria-labelledby="editar-perfil-title">
            <h2 id="editar-perfil-title" className="sr-only">
              Editar Perfil
            </h2>
            <EditProfile />
          </section>

          {/* Sección de Cambiar Contraseña */}
          <section aria-labelledby="cambiar-password-title">
            <h2 id="cambiar-password-title" className="sr-only">
              Cambiar Contraseña
            </h2>
            <ChangePassword />
          </section>

          {/* Sección de Eliminar Cuenta */}
          <section aria-labelledby="eliminar-cuenta-title">
            <h2 id="eliminar-cuenta-title" className="sr-only">
              Eliminar Cuenta
            </h2>
            <DeleteAccount />
          </section>
        </div>

        {/* Footer informativo */}
        <footer
          className="mt-8 p-4 bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-lg"
          aria-label="Consejo de seguridad"
        >
          <p className="text-sm text-[#1F2937]/70 text-center">
            💡 <strong>Consejo de seguridad:</strong> Usa contraseñas únicas y complejas. 
            Considera usar un administrador de contraseñas para mayor seguridad.
          </p>
        </footer>
      </main>
    </div>
  );
}
