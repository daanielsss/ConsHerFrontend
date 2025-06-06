import { ArrowRightFromLine, CircleUserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../lib/auth";

export default function UserNameMenu() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold text-foreground gap-2">
        <CircleUserRound className="text-primary" />
        {user.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[220px] bg-popover text-popover-foreground border border-border">
        <DropdownMenuItem className="font-semibold text-muted-foreground">
          Sesión iniciada
        </DropdownMenuItem>

        <Separator />

        <DropdownMenuItem asChild>
          <Button
            className="w-full justify-center font-bold bg-destructive text-white hover:bg-destructive-foreground"
            onClick={handleLogout}
          >
            <ArrowRightFromLine className="mr-2" />
            Salir
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
