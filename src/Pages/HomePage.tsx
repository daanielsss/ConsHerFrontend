// src/pages/HomePage.tsx
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import api from "@/lib/axios";
import CasaCarrusel from "@/components/CasaCarrusel";

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

    const preventa = houses?.filter((h) => h.status === "preventa") || [];
    const disponibles = houses?.filter((h) => h.status === "disponible") || [];
    const vendidas = houses?.filter((h) => h.status === "vendida") || [];

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            threshold: 0.1,
        });
        if (footerRef.current) observer.observe(footerRef.current);
        return () => {
            if (footerRef.current) observer.unobserve(footerRef.current);
        };
    }, []);

    // Reutilizamos esta sección para cada tipo de casa
    const CasaSection = ({
        title,
        casas,
        emptyText,
    }: {
        title: string;
        casas: Casa[];
        emptyText: string;
    }) => (
        <section className="mb-20">
            <h2 className="text-3xl font-semibold mb-6 text-foreground border-b pb-2">{title}</h2>

            {casas.length === 0 ? (
                <p className="text-muted-foreground">{emptyText}</p>
            ) : (
                <div className="flex flex-col gap-14">
                    {casas.map((house) => (
                        <CasaCarrusel
                            key={house._id}
                            casa={{
                                _id: house._id,
                                nombre: house.title,
                                ubicacion: house.address,
                                precio: house.price,
                                imagenes: house.images || [],
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero principal */}
            <div className="relative w-full min-h-[80vh] sm:min-h-[90vh] overflow-hidden">
                <picture>
                    <source media="(max-width: 768px)" srcSet="/homec.webp" />
                    <img
                        src="/home.webp"
                        alt="Imagen principal"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </picture>
            </div>

            {/* Sección bienvenida */}
            <section className="py-16 px-4 max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-semibold mb-4">Bienvenido a CONSHER</h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                    Somos una empresa dedicada a la construcción y venta de viviendas de calidad.
                    Nuestro objetivo es brindar a las familias espacios funcionales, modernos y accesibles.
                    Explora nuestro catálogo de casas disponibles y encuentra tu próximo hogar.
                </p>
            </section>

            {/* Sección imágenes institucionales *
                <section className="px-4 max-w-6xl mx-auto my-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-100 aspect-[4/3] rounded-lg flex items-center justify-center text-muted-foreground">
                            Imagen institucional 1
                        </div>
                        <div className="bg-gray-100 aspect-[4/3] rounded-lg flex items-center justify-center text-muted-foreground">
                            Imagen institucional 2
                        </div>
                    </div>
                </section>
                /}

                {/* Secciones con Carrusel */}
            <main className="px-4 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <span className="loading loading-infinity loading-xl text-primary"></span>
                        <p className="text-muted-foreground text-lg font-medium">Cargando catálogo...</p>
                    </div>
                ) : (
                    <>
                        <CasaSection
                            title="🏗️ Casas en Preventa"
                            casas={preventa}
                            emptyText="No hay casas en preventa actualmente."
                        />
                        <CasaSection
                            title="🏡 Casas Disponibles"
                            casas={disponibles}
                            emptyText="No hay casas disponibles actualmente."
                        />
                        <CasaSection
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
                        <span>📧 contacto@consher.mx</span>
                        <span>📞 (55) 1234 5678</span>
                        <span className="hover:underline cursor-pointer">Política de privacidad</span>
                        <span className="hover:underline cursor-pointer">Términos del servicio</span>
                    </div>
                </div>
            </footer>
        </div>

    );
}
