import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function MobileNavLinks() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {token && (
        <>
          <Link
            to="/admin"
            className="flex items-center font-bold text-foreground hover:text-accent"
          >
            Panel
          </Link>
          <Button
            onClick={handleLogout}
            className="flex items-center justify-center px-3 font-bold bg-destructive text-white hover:bg-destructive-foreground"
          >
            Salir
          </Button>
        </>
      )}
    </>
  );
}

