import { useState } from "react";
import { Video, Copy, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function QuickMeeting() {
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();

  const generateMeetingLink = async () => {
    const participantsTrimmed = participants.trim();
    const participantsArray = participantsTrimmed
      ? participantsTrimmed.split(",").map((email) => email.trim()).filter(Boolean)
      : [];

    const computedIsPublic = participantsArray.length === 0 ? true : isPublic;
    setIsPublic(computedIsPublic);

    try {
      const now = new Date().toISOString();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: "AUTO_GENERATE",
          description,
          scheduledAt: now,
          participants: participantsArray,
          isPublic: computedIsPublic,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Reunión creada", {
          description: "Redirigiendo a la sala…"
        });
        navigate(`/meeting/${data.data.id}`);
      } else {
        toast.error(data.message || "Error al crear la reunión");
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    }
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Enlace copiado", {
        description: "El enlace se guardó en tu portapapeles."
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card
      className="p-6 bg-white border border-gray-200 shadow-sm"
      role="region"
      aria-labelledby="quick-meeting-title"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#60A5FA]/10 rounded-lg">
          <Video className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
        </div>
        <h2 id="quick-meeting-title" className="text-[#1F2937] font-semibold">
          Nueva Reunión
        </h2>
      </div>

      <div className="space-y-4">
        
        {/* Descripción */}
        <Label htmlFor="description-id" className="text-[#1F2937] block">
          Descripción (opcional)
        </Label>
        <Input
          id="description-id"
          type="text"
          placeholder="Escribe una descripción para la reunión"
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white border-gray-300 text-[#1F2937]"
          aria-describedby="description-help"
        />
        <p id="description-help" className="text-sm text-gray-600">
          Este texto ayuda a identificar la reunión.
        </p>

        {/* Participantes */}
        <Label htmlFor="participants-id" className="text-[#1F2937] block">
          Participantes (opcional)
        </Label>
        <Input
          id="participants-id"
          type="text"
          placeholder="Escribe los emails separados por coma"
          onChange={(e) => setParticipants(e.target.value)}
          className="bg-white border-gray-300 text-[#1F2937]"
          aria-describedby="participants-help"
        />
        <p id="participants-help" className="text-sm text-gray-600">
          Si no ingresas participantes, la reunión será pública.
        </p>

        {/* Botón crear reunión */}
        <Button
          onClick={generateMeetingLink}
          className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white h-12
            focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
          aria-label="Crear una reunión instantánea"
        >
          <Video className="w-5 h-5 mr-2" aria-hidden="true" />
          Crear Reunión Instantánea
        </Button>

        {/* Bloque de enlace generado */}
        {generatedLink && (
          <div
            className="p-4 bg-[#F5F7FA] rounded-lg border border-gray-200"
            role="region"
            aria-labelledby="generated-link-title"
          >
            <Label
              id="generated-link-title"
              className="text-[#1F2937] mb-2 block font-medium"
            >
              Enlace de tu reunión
            </Label>

            <div className="flex gap-2">
              <Input
                value={generatedLink}
                readOnly
                aria-readonly="true"
                className="flex-1 bg-white border-gray-300 text-[#1F2937]"
              />

              <Button
                onClick={copyToClipboard}
                variant="outline"
                aria-label="Copiar enlace de la reunión"
                className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
              >
                {copied ? (
                  <Check className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4" aria-hidden="true" />
                )}
              </Button>
            </div>

            <p className="text-sm text-[#6B7280] mt-2">
              Comparte este enlace con quienes quieras invitar.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
