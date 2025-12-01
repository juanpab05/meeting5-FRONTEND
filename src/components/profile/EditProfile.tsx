import { useState, useEffect } from "react";
import { UserCircle, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import { fetchUpdateUserProfile } from "../../api/user";

export function EditProfile() {
  const { user, refreshUser } = useUser();

  // ---------- FORM DATA ----------
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "••••••••",
  });

  const [isLoading, setIsLoading] = useState(false);

  // ---------- SINCRONIZAR DATOS DEL USUARIO ----------
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age?.toString() || "",
        email: user.email || "",
        password: "••••••••",
      });
    }
  }, [user]);

  // ---------- HANDLERS ----------
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Nombres y apellidos son obligatorios");
      return false;
    }

    if (!formData.email.includes("@")) {
      toast.error("Ingresa un correo electrónico válido");
      return false;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 13 || age > 120) {
      toast.error("La edad debe estar entre 13 y 120 años");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await fetchUpdateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        email: formData.email,
      });

      toast.success("Perfil actualizado correctamente ✅");

      await refreshUser();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age?.toString() || "",
        email: user.email || "",
        password: "••••••••",
      });
    }
    toast.info("Cambios descartados");
  };

  // ---------- UI ----------
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
          <UserCircle className="w-5 h-5 text-[#2563EB]" />
        </div>
        <div>
          <h2 className="text-[#1F2937]">Información Personal</h2>
          <p className="text-sm text-[#1F2937]/60">Actualiza tus datos de perfil</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* nombres / apellidos */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombres *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="Ingresa tus nombres"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Ingresa tus apellidos"
              required
            />
          </div>
        </div>

        {/* edad / correo */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Edad *</Label>
            <Input
              id="age"
              type="number"
              min="13"
              max="120"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              placeholder="Edad"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>
        </div>

        {/* contraseña (solo visual) */}
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            disabled
            className="bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-[#1F2937]/60">
            Para cambiar tu contraseña, usa la sección "Cambiar Contraseña".
          </p>
        </div>

        {/* botones */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>

          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>

      {/* nota */}
      <div className="mt-6 p-4 bg-[#60A5FA]/5 border border-[#60A5FA]/20 rounded-lg">
        <p className="text-sm text-[#1F2937]/70">
          <strong>Nota:</strong> Los campos marcados con * son obligatorios.
        </p>
      </div>
    </div>
  );
}
