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

type TabKey = "preventa" | "disponible" | "vendida";

export default function HomePage() {
    const footerRef = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState<TabKey>("preventa");

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
                className={`mt-2 mb-4 text-muted-foreground text-sm leading-relaxed text-center transition-all duration-300 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                    }`}
            >
                {text}
                <br />
                <span className="italic text-primary">Selecciona cada tarjeta para ver más fotos o información del hogar.</span>
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

    const introByTab: Record<TabKey, string> = {
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

            {/* Sección bienvenida (se mantiene) */}
            <section className="py-16 px-4 max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-semibold mb-4">Bienvenido a CONSHER</h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                    Somos una empresa dedicada a la construcción y venta de viviendas de calidad.
                    Nuestro objetivo es brindar a las familias espacios funcionales, modernos y accesibles.
                    Explora nuestro catálogo de casas disponibles y encuentra tu próximo hogar.
                </p>
            </section>

            {/* NUEVA sección sobre imagen con efecto glass/blur */}
            <section className="px-4">
                <div className="relative max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-xl">
                    {/* Fondo 16:9 que se recorta lateralmente en móvil */}
                    <div className="relative w-full aspect-[16/9]">
                        <img
                            src="/fontext.webp"
                            alt="Fondo ConsHer"
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                        />
                        {/* Capa oscura sutil para contraste */}
                        <div className="absolute inset-0 bg-black/40" />
                        {/* Contenido en 3 bloques con glassmorphism */}
                        <div className="absolute inset-0 p-4 sm:p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
                            {/* Lateral Izquierdo */}
                            <article className="relative rounded-xl shadow-lg overflow-hidden bg-white/10 border border-white/20">
                                {/* Fondo blur (solo detrás del texto) */}
                                <div className="absolute inset-0 backdrop-blur-xl bg-black/20 z-0" />

                                {/* Imagen nítida (fuera del blur) */}
                                <div className="relative z-0 flex justify-center">
                                    <img
                                        src="/construct.webp"
                                        alt="Construcción"
                                        className="w-full object-cover max-h-40 md:max-h-48"
                                    />
                                </div>

                                {/* Contenido */}
                                <div className="relative z-10 p-4 sm:p-5 md:p-6">
                                    <h3 className="text-white text-xl md:text-2xl font-semibold flex items-center gap-2">
                                        <span>🏗️</span> Proceso Constructivo
                                    </h3>
                                    <p className="mt-2 text-white/90 text-sm md:text-base leading-relaxed">
                                        Supervisamos personalmente cada etapa: desde la cimentación hasta los acabados finales.
                                        Aplicamos controles de calidad continuos y entregamos cada vivienda de forma presencial,
                                        asegurando que todo quede a tu entera satisfacción.
                                    </p>
                                </div>
                            </article>

                            {/* Bloque Central (principal) */}
                            <article className="backdrop-blur-2xl bg-white/15 border border-white/25 rounded-xl p-5 sm:p-7 md:p-8 shadow-2xl md:order-none order-first">
                                <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">
                                    Construimos hogares, no solo casas.
                                </h3>
                                <p className="mt-3 text-white/95 text-base md:text-lg leading-relaxed">
                                    Desarrollamos proyectos desde el origen: concepto, proyecto ejecutivo y
                                    distribuciones. Contamos con personal especializado para cada fase de construcción y
                                    venta. Nuestro compromiso es simple: calidad real y clientes más que satisfechos con su nuevo hogar.
                                </p>
                                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/90 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span>✅</span> Gestión completa del proyecto de principio a fin.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>👷</span> Equipos profesionales y certificados por especialidad.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>🧪</span> Control de calidad documentado en cada hito.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>🤝</span> Entrega personalizada y seguimiento postventa.
                                    </li>
                                </ul>
                            </article>

                            {/* Lateral Derecho */}
                            <article className="relative rounded-xl shadow-lg overflow-hidden bg-white/10 border border-white/20">
                                {/* Fondo blur (solo detrás del texto) */}
                                <div className="absolute inset-0 backdrop-blur-xl bg-black/20 z-0" />

                                {/* Imagen nítida (fuera del blur) */}
                                <div className="relative z-0 flex justify-center">
                                    <img
                                        src="/construct.webp"
                                        alt="Diseño"
                                        className="w-full object-cover max-h-40 md:max-h-48"
                                    />
                                </div>

                                {/* Contenido */}
                                <div className="relative z-10 p-4 sm:p-5 md:p-6">
                                    <h3 className="text-white text-xl md:text-2xl font-semibold flex items-center gap-2">
                                        <span>📐</span> Diseño & Detalle
                                    </h3>
                                    <p className="mt-2 text-white/90 text-sm md:text-base leading-relaxed">
                                        Las distribuciones se desarrollan con profesionales para aprovechar cada metro útil:
                                        iluminación, ventilación y flujo cotidiano. Cuidamos los detalles para que recibas un
                                        espacio funcional, estético y listo para convertirse en tu hogar.
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* Botones de navegación con línea animada */}
            <div className="flex w-full text-center border-b mt-10">
                {(["preventa", "disponible", "vendida"] as TabKey[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`flex-1 py-2 font-medium relative ${selectedTab === tab ? "" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        {tab === "preventa" && "🏗️ Preventa"}
                        {tab === "disponible" && "🏡 Disponibles"}
                        {tab === "vendida" && "✅ Vendidas"}
                        {selectedTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary transition-all duration-300" />
                        )}
                    </button>
                ))}
            </div>

            {/* Descripción con fade-in (espacio mínimo) */}
            <SectionIntro text={introByTab[selectedTab]} />

            {/* Secciones con Carrusel */}
            <main className="px-4 max-w-7xl mx-auto pb-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <span className="loading loading-infinity loading-xl text-primary" />
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
                        {selectedTab === "vendida" && <CasaSection casas={vendidas} emptyText="Aún no se han vendido casas." />}
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
