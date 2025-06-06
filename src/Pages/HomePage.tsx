import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import api from "@/lib/axios";

// ✅ Declaramos la interfaz Casa
interface Casa {
    _id: string;
    title: string;
    address: string;
    price: number;
    status: "preventa" | "disponible" | "vendida";
    images?: string[];
}

export default function HomePage() {
    const footerRef = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    const { data: houses, isLoading } = useQuery<Casa[]>("catalogo-casas", async () => {
        const res = await api.get("/houses");
        return res.data;
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    // ✅ Usamos la interfaz Casa en lugar de any
    const preventa = houses?.filter((h: Casa) => h.status === "preventa") || [];
    const disponibles = houses?.filter((h: Casa) => h.status === "disponible") || [];
    const vendidas = houses?.filter((h: Casa) => h.status === "vendida") || [];

    const Section = ({
        title,
        casas,
        emptyText,
    }: {
        title: string;
        casas: Casa[];
        emptyText: string;
    }) => (
        <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
            {casas.length === 0 ? (
                <p className="text-muted-foreground">{emptyText}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {casas.map((house) => (
                        <Link
                            to={`/casa/${house._id}`}
                            key={house._id}
                            className="rounded-xl border shadow bg-card overflow-hidden hover:shadow-lg transition"
                        >
                            {house.images?.[0] && (
                                <img
                                    src={house.images[0]}
                                    alt={house.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4 space-y-1">
                                <h3 className="text-lg font-semibold text-foreground">{house.title}</h3>
                                <p className="text-sm text-muted-foreground">{house.address}</p>
                                <p className="text-sm font-medium mt-1 text-primary">
                                    ${Number(house.price).toLocaleString("en-US")}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );

    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Hero personalizado con mensaje */}
            <div className="relative">
                <img
                    src="/images/hero.jpg"
                    //
                    className="w-full max-h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center">
                    <h1 className="text-4xl md:text-5xl text-white font-bold mb-2 text-center">
                        Bienvenido a ConsHer
                    </h1>
                    <p className="text-white text-lg text-center px-4">
                        Construcción de viviendas de calidad, al alcance de todos.
                    </p>
                </div>
            </div>

            {/* Secciones de casas */}
            <main className="px-4 py-10 space-y-10 max-w-7xl mx-auto">
                {isLoading ? (
                    <p className="text-muted-foreground text-center">Cargando catálogo...</p>
                ) : (
                    <>
                        <Section
                            title="🏗️ Casas en Preventa"
                            casas={preventa}
                            emptyText="No hay casas en preventa actualmente."
                        />
                        <Section
                            title="🏡 Casas en Venta"
                            casas={disponibles}
                            emptyText="No hay casas disponibles actualmente."
                        />
                        <Section
                            title="✅ Casas Vendidas"
                            casas={vendidas}
                            emptyText="Aún no se han vendido casas."
                        />
                    </>
                )}
            </main>

            {/* Footer */}
            <footer
                ref={footerRef}
                className={`bg-[#005187] py-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
            >
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 text-white">
                    <span className="text-2xl font-bold tracking-tight">ConsHer</span>
                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4 text-sm text-white">
                        <span>Contacto: contacto@consher.mx</span>
                        <span>Tel: (55) 1234 5678</span>
                        <span className="hover:underline cursor-pointer">Política de privacidad</span>
                        <span className="hover:underline cursor-pointer">Términos del servicio</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
