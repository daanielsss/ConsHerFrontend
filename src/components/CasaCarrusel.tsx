// src/components/CasaCarrusel.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    casa: {
        _id: string;
        nombre: string;
        ubicacion: string;
        precio: number;
        imagenes: string[];
    };
}

export default function CasaCarrusel({ casa }: Props) {
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    const siguiente = () => setIndex((prev) => (prev + 1) % casa.imagenes.length);
    const anterior = () =>
        setIndex((prev) => (prev - 1 + casa.imagenes.length) % casa.imagenes.length);

    return (
        <div className="w-full max-w-[100%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto transition-all duration-300">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden group shadow-md">

                {/* Imagen actual */}
                <img
                    src={casa.imagenes[index]}
                    alt={`Casa ${index + 1}`}
                    className="w-full h-full object-cover object-center transition-all duration-500 cursor-pointer"
                    onClick={() => navigate(`/house/${casa._id}`)}
                />

                {/* Flechas */}
                <button
                    onClick={anterior}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow group-hover:opacity-100 opacity-0 transition-all duration-300"
                >
                    <ChevronLeft className="w-5 h-5 text-black" />
                </button>
                <button
                    onClick={siguiente}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow group-hover:opacity-100 opacity-0 transition-all duration-300"
                >
                    <ChevronRight className="w-5 h-5 text-black" />
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {casa.imagenes.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? "bg-white" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Info de la casa */}
            <div className="mt-4 text-center px-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary">{casa.nombre}</h3>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                    {casa.ubicacion}
                </p>
                <p className="text-foreground text-base sm:text-lg md:text-xl font-bold mt-1">
                    ${casa.precio.toLocaleString()}
                </p>
            </div>
        </div>
    );
}
