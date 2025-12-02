import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import React from "react";
import { fetchChangePassword } from "../../api/user";

export function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "La contraseña debe contener al menos una mayúscula.";
    if (!/[0-9]/.test(password)) return "La contraseña debe contener al menos un número.";
    if (!/[^A-Za-z0-9]/.test(password)) return "La contraseña debe contener al menos un símbolo.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const error = validatePassword(newPassword);
    if (error) {
      toast.error(error);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchChangePassword(currentPassword, newPassword);

      if (response.success) {
        toast.success("Contraseña actualizada correctamente");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 8) return { strength: 1, label: "Débil", color: "#EF4444" };
    if (password.length < 12) return { strength: 2, label: "Media", color: "#F59E0B" };
    return { strength: 3, label: "Fuerte", color: "#22C55E" };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      role="region"
      aria-labelledby="change-password-title"
    >
      <div className="flex items-center gap-3 mb-6">
        {/* Icono decorativo */}
        <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
        </div>
        <div>
          <h2 id="change-password-title" className="text-[#1F2937]">
            Cambiar Contraseña
          </h2>
          <p className="text-sm text-[#1F2937]/60">
            Actualiza tu contraseña de acceso
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* CONTRASEÑA ACTUAL */}
        <div className="space-y-2" role="group" aria-labelledby="current-password-label">
          <Label id="current-password-label" htmlFor="current-password">
            Contraseña Actual
          </Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ingresa tu contraseña actual"
              required
              className="pr-10"
            />

            {/* Botón para mostrar/ocultar contraseña */}
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F2937]/40 hover:text-[#1F2937]/60"
              aria-label={showCurrentPassword ? "Ocultar contraseña actual" : "Mostrar contraseña actual"}
            >
              {showCurrentPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* NUEVA CONTRASEÑA */}
        <div className="space-y-2" role="group" aria-labelledby="new-password-label">
          <Label id="new-password-label" htmlFor="new-password">
            Nueva Contraseña
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              required
              aria-describedby="password-strength"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F2937]/40 hover:text-[#1F2937]/60"
              aria-label={showNewPassword ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"}
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {newPassword && (
            <div id="password-strength" role="status" className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className="h-1 flex-1 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        level <= strength.strength ? strength.color : "#E5E7EB",
                    }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-xs font-medium" style={{ color: strength.color }}>
                Fuerza: {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* CONFIRMAR CONTRASEÑA */}
        <div className="space-y-2" role="group" aria-labelledby="confirm-password-label">
          <Label id="confirm-password-label" htmlFor="confirm-password">
            Confirmar Nueva Contraseña
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F2937]/40 hover:text-[#1F2937]/60"
              aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Eye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {confirmPassword && newPassword === confirmPassword && (
            <div role="status" className="flex items-center gap-1 text-[#22C55E] text-sm">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Las contraseñas coinciden</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        >
          {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
        </Button>
      </form>
    </div>
  );
}
