import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../lib/auth";
import api from "../lib/axios";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [checkingSession, setCheckingSession] = useState(true);

    const user = getUserFromToken();

    useEffect(() => {
        if (user) {
            navigate("/admin");
        } else {
            setCheckingSession(false);
        }
    }, [user, navigate]);

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password: string) => /^[A-Za-z0-9]{8,}$/.test(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Correo electrónico inválido");
            return;
        }

        if (!validatePassword(password)) {
            setError("La contraseña debe tener al menos 8 caracteres y solo puede contener letras y números");
            return;
        }

        try {
            const res = await api.post("/login", { email, password });
            const token = res.data?.token;

            if (!token) {
                setError("No se recibió el token del servidor.");
                return;
            }

            localStorage.setItem("token", token);
            navigate("/admin");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setError("Correo o contraseña incorrectos");
                } else if (err.response?.status === 500) {
                    setError("Error interno del servidor. Intenta más tarde.");
                } else {
                    setError("Ocurrió un error inesperado. Intenta nuevamente.");
                }
            } else {
                setError("Error inesperado");
            }
        }
    };

    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md border border-border">
                <h1 className="text-2xl font-bold text-center text-foreground mb-2">
                    Iniciar sesión en <span className="text-primary">ConsHer</span>
                </h1>
                <p className="text-center text-muted-foreground text-sm mb-6">
                    Construcción de viviendas de calidad al alcance de todos.
                </p>

                {error && (
                    <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1 text-foreground">Correo electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-foreground">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition"
                    >
                        Iniciar sesión
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-full text-sm text-primary hover:underline mt-2"
                    >
                        ← Volver al inicio
                    </button>
                </form>
            </div>
        </div>
    );
}
