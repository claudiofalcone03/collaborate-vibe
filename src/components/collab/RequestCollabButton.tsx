import { useState } from "react";
import { Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RequestCollabDialog } from "./RequestCollabDialog";

interface Props {
  contentId: string;
  contentTitle: string;
  ownerId: string;
  size?: "sm" | "default";
  variant?: "default" | "outline" | "secondary";
}

export const RequestCollabButton = ({ contentId, contentTitle, ownerId, size = "sm", variant = "outline" }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  if (user && user.id === ownerId) return null;

  const handleClick = () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Create an account to collaborate." });
      navigate("/auth");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <Button type="button" size={size} variant={variant} onClick={handleClick} className="gap-1.5">
        <Handshake className="h-3.5 w-3.5" />
        Request Collab
      </Button>
      <RequestCollabDialog open={open} onOpenChange={setOpen} contentId={contentId} contentTitle={contentTitle} />
    </>
  );
};
