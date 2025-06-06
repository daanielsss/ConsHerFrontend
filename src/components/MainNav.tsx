import { Button } from "./ui/button";
import UserNameMenu from "./UserNameMenu";
import { getUserFromToken } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function MainNav() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  return (
    <span className="flex space-x-2 items-center">
      {user ? (
        <UserNameMenu />
      ) : (
        <Button
          variant="ghost"
          className="font-bold text-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </Button>
      )}
    </span>
  );
}
