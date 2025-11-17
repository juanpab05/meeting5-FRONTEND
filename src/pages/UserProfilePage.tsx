import { EditProfile, ChangePassword, DeleteAccount } from "../components/profile";

export function UserProfilePage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 mt-16">
          <h1 className="text-[#1F2937] mb-2">Mi Perfil</h1>
          <p className="text-[#1F2937]/60">Administra tu cuenta y configuración de seguridad</p>
        </div>
        
        <div className="space-y-6">
          {/* Sección de Editar Perfil */}
          <EditProfile />
          
          {/* Sección de Cambiar Contraseña */}
          <ChangePassword />
         
          
          {/* Sección de Eliminar Cuenta */}
          <DeleteAccount />
        </div>

        {/* Footer informativo */}
        <div className="mt-8 p-4 bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-lg">
          <p className="text-sm text-[#1F2937]/70 text-center">
            💡 <strong>Consejo de seguridad:</strong> Usa contraseñas únicas y complejas. 
            Considera usar un administrador de contraseñas para mayor seguridad.
          </p>
        </div>
      </div>
    </div>
  );
}