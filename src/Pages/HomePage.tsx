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
    const [selectedTab, setSelectedTab] = useState<"preventa" | "disponible" | "vendida">("preventa");

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

    const SectionIntro = ({ text }: { text: string }) => {
        const [show, setShow] = useState(false);
        useEffect(() => {
            setShow(false);
            const t = setTimeout(() => setShow(true), 10);
            return () => clearTimeout(t);
        }, [text]);

        return (
            <p
                className={`mt-4 mb-6 text-muted-foreground text-sm leading-relaxed text-center transition-all duration-300 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                    }`}
            >
                {text}
                <br />
                <span className="italic text-primary">
                    Selecciona cada tarjeta para ver más fotos o información del hogar.
                </span>
            </p>
        );
    };

    const CasaSection = ({ casas, emptyText }: { casas: Casa[]; emptyText: string }) => (
        <section className="mb-20">
            {casas.length === 0 ? (
                <p className="text-muted-foreground text-center">{emptyText}</p>
            ) : (
                <div className="flex flex-col gap-14 w-full">
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

    const introByTab: Record<typeof selectedTab, string> = {
        preventa:
            "Hogares en proceso de construcción o en las últimas fases de acabado. Una oportunidad para adquirir tu nuevo hogar a un precio preferencial por ser preventa.",
        disponible:
            "Hogares 100% terminados y listos para entrega inmediata. Espacios modernos y funcionales para disfrutar desde el primer día.",
        vendida:
            "Hogares terminados y entregados a familias satisfechas. Un reflejo de nuestro compromiso con la calidad y la confianza.",
    };

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

            {/* Botones de navegación con línea animada */}
            <div className="flex w-full text-center border-b">
                {["preventa", "disponible", "vendida"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab as typeof selectedTab)}
                        className={`flex-1 py-2 font-medium relative ${selectedTab === tab
                            ? ""
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        {tab === "preventa" && "🏗️ Preventa"}
                        {tab === "disponible" && "🏡 Disponibles"}
                        {tab === "vendida" && "✅ Vendidas"}
                        {selectedTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary transition-all duration-300"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Descripción con fade-in */}
            <SectionIntro text={introByTab[selectedTab]} />

            {/* Secciones con Carrusel */}
            <main className="px-4 max-w-7xl mx-auto pb-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <span className="loading loading-infinity loading-xl text-primary"></span>
                        <p className="text-muted-foreground text-lg font-medium">Cargando catálogo...</p>
                    </div>
                ) : (
                    <>
                        {selectedTab === "preventa" && (
                            <CasaSection casas={preventa} emptyText="No hay casas en preventa actualmente." />
                        )}
                        {selectedTab === "disponible" && (
                            <CasaSection casas={disponibles} emptyText="No hay casas disponibles actualmente." />
                        )}
                        {selectedTab === "vendida" && (
                            <CasaSection casas={vendidas} emptyText="Aún no se han vendido casas." />
                        )}
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
