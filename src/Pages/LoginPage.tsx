import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../lib/auth";
import api from "../lib/axios";
import axios from "axios";
import { Loader2 } from "lucide-react"; // Loader moderno

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [checkingSession, setCheckingSession] = useState(true);

    const user = getUserFromToken();

    // Redirige automáticamente si ya hay sesión activa
    useEffect(() => {
        if (user) {
            navigate("/admin");
        } else {
            setCheckingSession(false);
        }
    }, [user, navigate]);

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password: string) => {
        const regex = /^[A-Za-z0-9]{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Correo electrónico inválido");
            return;
        }

        if (!validatePassword(password)) {
            setError(
                "La contraseña debe tener al menos 8 caracteres y solo puede contener letras y números"
            );
            return;
        }

        try {
            const res = await api.post("/login", { email, password });
            localStorage.setItem("token", res.data.token);
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

    // Mostrar loader mientras se verifica el token
    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
            style={{ backgroundImage: `url('/tu-imagen.jpg')` }}
        >
            <div className="bg-white bg-opacity-80 p-10 rounded-2xl shadow-xl max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Iniciar sesión en <span className="text-blue-600">ConsHer</span>
                </h1>
                <p className="text-center text-gray-700 text-sm mb-4">
                    Construcción de viviendas de calidad al alcance de todos.
                </p>

                {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contraseña</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Iniciar sesión
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-full mt-2 text-blue-600 underline text-sm hover:text-blue-800"
                    >
                        ← Volver al inicio
                    </button>
                </form>
            </div>
        </div>
    );
}
