import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import React from "react";

// 👇 Importamos la función desde reset-password.ts
import { fetchRecoverPassword } from "../api/reset-password";

export function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast.error("Ingresa un correo electrónico válido");
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchRecoverPassword(email);

      if (data.success) {
        setEmailSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message || "No se pudo enviar el correo de recuperación");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al enviar el correo de recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 w-full max-w-[630px]">

        {/* Encabezado accesible */}
        <h1 className="sr-only">Recuperar contraseña</h1>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg bg-[#60A5FA]/10 flex items-center justify-center"
            aria-hidden="true"
          >
            <Mail className="w-5 h-5 text-[#60A5FA]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-[#1F2937] text-lg font-semibold">
              Recuperar contraseña
            </h2>
            <p className="text-sm text-[#1F2937]/60">
              Recibe un enlace para restablecer tu contraseña
            </p>
          </div>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="recovery-email">Correo electrónico</Label>

              <Input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                aria-describedby="email-helper-text"
              />

              <p id="email-helper-text" className="text-xs text-[#1F2937]/60">
                Te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1D4ED8] hover:bg-[#1943B8] text-white"
              aria-busy={isLoading}
              aria-label={
                isLoading
                  ? "Enviando enlace de recuperación..."
                  : "Enviar enlace de recuperación"
              }
            >
              <Send className="w-4 h-4 mr-2" aria-hidden="true" />
              {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">

            {/* Mensaje accesible de éxito */}
            <div
              className="bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg p-4"
              role="status"
              aria-live="polite"
            >
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm text-[#1F2937] mb-1 font-medium">
                    Correo enviado exitosamente
                  </p>
                  <p className="text-sm text-[#1F2937]/70">
                    Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
                    Revisa tu bandeja de entrada y carpeta de spam.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="w-full"
            >
              Enviar a otro correo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
