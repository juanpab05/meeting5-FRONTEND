import { useState } from "react";
import { Link2, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();

  const handleJoinMeeting = () => {
    if (meetingId.trim()) {
      navigate(`/meeting/${meetingId.trim()}`);
      toast.success("Uniéndose a la reunión…", {
        description: "Estamos conectándote con la sala."
      });
    } else {
      toast.error("Debes ingresar un ID válido.", {
        description: "El campo de texto no puede estar vacío."
      });
    }
  };

  return (
    <Card 
      className="p-6 bg-white border border-gray-200 shadow-sm"
      role="region"
      aria-labelledby="join-meeting-title"
    >
      <div className="flex items-center gap-3 mb-6">
        {/* Ícono decorativo con aria-hidden */}
        <div className="p-2 bg-[#22C55E]/10 rounded-lg">
          <Link2 
            className="w-5 h-5 text-[#22C55E]" 
            aria-hidden="true"
          />
        </div>

        <h2 id="join-meeting-title" className="text-[#1F2937] font-semibold">
          Unirse a Reunión
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label 
            htmlFor="meeting-id" 
            className="text-[#1F2937] mb-2 block font-medium"
          >
            ID o enlace de la reunión
          </Label>

          <Input
            id="meeting-id"
            type="text"
            placeholder="Ingresa el ID o pega el enlace"
            aria-describedby="meeting-id-help"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="bg-white border-gray-300 text-[#1F2937]"
            onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
          />

          <p 
            id="meeting-id-help" 
            className="text-sm text-gray-600 mt-1"
          >
            Puedes ingresar un código o un enlace completo.
          </p>
        </div>

        <Button
          onClick={handleJoinMeeting}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white h-12
          focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:ring-offset-2"
          aria-label="Unirse a la reunión"
        >
          {/* Ícono con label accesible */}
          <Users 
            className="w-5 h-5 mr-2" 
            aria-hidden="true" 
          />
          Unirse Ahora
        </Button>
      </div>
    </Card>
  );
}
