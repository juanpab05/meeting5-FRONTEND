import { useState } from "react";
import { Video, Copy, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { toast } from "sonner";

export function QuickMeeting() {
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const generateMeetingLink = () => {
    const randomId = Math.random().toString(36).substring(2, 12);
    const link = `https://meet.example.com/${randomId}`;
    setGeneratedLink(link);
    toast.success("Enlace de reunión generado exitosamente");
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#60A5FA]/10 rounded-lg">
          <Video className="w-5 h-5 text-[#2563EB]" />
        </div>
        <h2 className="text-[#1F2937]">Nueva Reunión</h2>
      </div>
      
      <div className="space-y-4">
        <Button
          onClick={generateMeetingLink}
          className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white h-12"
        >
          <Video className="w-5 h-5 mr-2" />
          Crear Reunión Instantánea
        </Button>

        {generatedLink && (
          <div className="p-4 bg-[#F5F7FA] rounded-lg border border-gray-200">
            <Label className="text-[#1F2937] mb-2 block">Enlace de tu reunión</Label>
            <div className="flex gap-2">
              <Input
                value={generatedLink}
                readOnly
                className="flex-1 bg-white border-gray-300 text-[#1F2937]"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-[#6B7280] mt-2">
              Comparte este enlace con las personas que quieres que se unan
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
