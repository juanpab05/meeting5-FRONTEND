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
      toast.success("Uniéndose a la reunión...");
    } else {
      toast.error("Por favor ingresa un ID de reunión válido");
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#22C55E]/10 rounded-lg">
          <Link2 className="w-5 h-5 text-[#22C55E]" />
        </div>
        <h2 className="text-[#1F2937]">Unirse a Reunión</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="meeting-id" className="text-[#1F2937] mb-2 block">
            ID o enlace de la reunión
          </Label>
          <Input
            id="meeting-id"
            type="text"
            placeholder="Ingresa el ID o pega el enlace"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="bg-white border-gray-300 text-[#1F2937]"
            onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
          />
        </div>

        <Button
          onClick={handleJoinMeeting}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white h-12
             focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:ring-offset-2"
        >
          <Users className="w-5 h-5 mr-2" />
          Unirse Ahora
        </Button>

      </div>
    </Card>
  );
}
