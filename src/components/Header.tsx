import { Link, useNavigate } from 'react-router-dom';
import { getUserFromToken } from '@/lib/auth';
import { LogIn, UserCircle, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Al montar, revisar si ya estaba activado el modo oscuro
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
    <header className="w-full bg-background border-b-2 border-primary py-4 px-4 pl-[4.5rem] md:pl-[14rem] transition-all duration-300 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold tracking-tight ">
        ConsHer
      </Link>

      <div className="flex items-center gap-4">
        {/* Botón de modo claro/oscuro */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-accent hover:bg-primary transition-colors text-accent-foreground hover:text-white"
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
            className="text-primary hover:text-primary-foreground flex items-center gap-1 text-sm font-medium"
          >
            <LogIn size={16} />
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  );
}


