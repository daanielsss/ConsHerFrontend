import { Link, useNavigate } from 'react-router-dom';
import { getUserFromToken } from '@/lib/auth';
import { LogIn, UserCircle, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setDarkMode((prev) => !prev);
  };

  return (
    // 👇 CAMBIO PRINCIPAL AQUÍ 👇
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b-2 border-primary py-4 px-6 flex justify-between items-center">
      {/* 1. Se añadieron 'sticky top-0 z-50' para que se quede pegado arriba.
        2. Se añadió 'bg-background/80 backdrop-blur-md' para un efecto translúcido al hacer scroll.
        3. Se eliminaron 'pl-[4.5rem] md:pl-[14rem]' y 'transition-all'. El Layout se encarga de esto.
        4. Se unificó el padding a 'px-6'.
      */}
      <Link to="/" className="text-2xl font-bold tracking-tight">
        ConsHer
      </Link>

      <div className="flex items-center gap-4">
        {/* Botón de modo claro/oscuro */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-primary/20 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Usuario o login */}
        {user ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <UserCircle className="text-primary" />
            {user.email}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hover:text-primary flex items-center gap-1 text-sm font-medium"
          >
            <LogIn size={16} />
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  );
}