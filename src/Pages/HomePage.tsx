import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import api from "@/lib/axios";

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

    const Section = ({
        title,
        casas,
        emptyText,
    }: {
        title: string;
        casas: Casa[];
        emptyText: string;
    }) => (
        <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-foreground border-b pb-2">{title}</h2>
            {casas.length === 0 ? (
                <p className="text-muted-foreground">{emptyText}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {casas.map((house) => (
                        <Link
                            to={`/casa/${house._id}`}
                            key={house._id}
                            className="rounded-xl border bg-card shadow hover:shadow-xl transition overflow-hidden"
                        >
                            {house.images?.[0] && (
                                <img
                                    src={house.images[0]}
                                    alt={house.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4 space-y-1">
                                <h3 className="text-xl font-bold text-foreground">{house.title}</h3>
                                <p className="text-sm text-muted-foreground">{house.address}</p>
                                <p className="text-base font-medium text-primary">
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
        <div className="flex flex-col min-h-screen">
            {/* Imagen principal fullscreen justo debajo del header */}
            <div className="relative overflow-hidden">
                <img
                    src="/homepage.webp"
                    alt="Imagen principal"
                    className="min-w-[100vw] w-[100vw] h-auto object-contain"
                />
            </div>

            {/* Sección de bienvenida */}
            <section className="py-16 px-4 max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-semibold mb-4">Bienvenido a ConsHer</h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                    Somos una empresa dedicada a la construcción y venta de viviendas de calidad. Nuestro objetivo es
                    brindar a las familias espacios funcionales, modernos y accesibles. Explora nuestro
                    catálogo de casas disponibles y encuentra tu próximo hogar.
                </p>
            </section>

            {/* Sección de imágenes institucionales */}
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

            {/* Secciones de casas */}
            <main className="px-4 max-w-7xl mx-auto">
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
                            title="🏡 Casas Disponibles"
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

