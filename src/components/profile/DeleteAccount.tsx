import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import React from "react";

export function DeleteAccount() {
  const [showDialog, setShowDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "ELIMINAR") {
      toast.error('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    setIsDeleting(true);
    
    // Simulación de eliminación de cuenta
    setTimeout(() => {
      setIsDeleting(false);
      toast.success("Cuenta eliminada exitosamente");
      setShowDialog(false);
      setConfirmText("");
    }, 2000);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EF4444]/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <div>
            <h2 className="text-[#1F2937]">Zona de Peligro</h2>
            <p className="text-sm text-[#1F2937]/60">Eliminar cuenta permanentemente</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-lg p-4">
            <h3 className="text-[#EF4444] mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Advertencia: Esta acción es irreversible
            </h3>
            <ul className="text-sm text-[#1F2937]/70 space-y-1 ml-6 list-disc">
              <li>Se eliminarán todos tus datos personales</li>
              <li>Perderás acceso a todas tus reuniones</li>
              <li>No podrás recuperar tu cuenta después</li>
              <li>Todas tus configuraciones se borrarán</li>
            </ul>
          </div>

          <Button
            variant="destructive"
            onClick={() => setShowDialog(true)}
            className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar mi Cuenta
          </Button>
        </div>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-[#EF4444]">
              <AlertTriangle className="w-5 h-5" />
              ¿Estás completamente seguro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta
              y removerá todos tus datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 my-4">
            <Label htmlFor="confirm-delete">
              Escribe <strong>ELIMINAR</strong> para confirmar:
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="font-mono"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setConfirmText("");
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={confirmText !== "ELIMINAR" || isDeleting}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar mi cuenta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
