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
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        const footerElement = footerRef.current;
        if (footerElement) observer.observe(footerElement);

        return () => {
            if (footerElement) observer.unobserve(footerElement);
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
                className={`mt-2 mb-3 text-sm leading-relaxed text-center transition-all duration-300 ease-out text-gray-900 dark:text-white
            ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
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
        <section className="mb-8">
            {casas.length === 0 ? (
                <p className="text-center text-gray-900 dark:text-white">{emptyText}</p>
            ) : (
                <div className="flex flex-col gap-6 w-full">
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
        <div className="flex flex-col">
            {/* Hero principal */}
            <div className="relative w-full min-h-[50vh] sm:min-h-[90vh] overflow-hidden">
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
            <section className="py-10 px-4 max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-semibold mb-4">Bienvenido a CONSHER</h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto text-justify ">
                    Somos una empresa dedicada a la construcción y venta de viviendas de calidad.
                    Nuestro objetivo es brindar a las familias espacios funcionales, modernos y accesibles.
                    Explora nuestro catálogo de casas disponibles y encuentra tu próximo hogar.
                </p>
            </section>

            {/* Sección sobre imagen con efecto glass/blur */}
            <section className="px-4">
                <div className="relative max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-xl">
                    <div className="relative w-full md:aspect-[16/9]">
                        <img
                            src="/fontext.webp"
                            alt="Fondo ConsHer"
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40" />

                        <div className="p-3 sm:p-4 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 items-stretch md:absolute md:inset-0">
                            <article className="relative rounded-xl shadow-lg overflow-hidden bg-white/10 border border-white/20 flex flex-col">
                                <div className="absolute inset-0 backdrop-blur-xl bg-black/20 z-0" />
                                <div className="relative z-10 p-3 sm:p-4 md:p-6">
                                    <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold flex items-center gap-2 leading-tight">
                                        <span>🏗️</span> Proceso Constructivo
                                    </h3>
                                    <p className="mt-2 text-white/90 text-[13px] sm:text-sm md:text-base leading-relaxed text-justify mx-auto max-w-3xl">
                                        Supervisamos cada etapa del proceso constructivo, desde la cimentación hasta los acabados finales.
                                        Nuestros arquitectos e ingenieros, altamente capacitados, crean estructuras sólidas, resistentes y seguras,
                                        aplicando estrictos controles de calidad para garantizar su durabilidad y estabilidad.
                                    </p>
                                </div>
                                <div className="relative z-10 p-4 hidden md:block">
                                    <img src="/construct.webp" alt="Construcción" className="w-full h-auto object-contain rounded-md" />
                                </div>
                            </article>

                            <article className="backdrop-blur-2xl bg-white/15 border border-white/25 rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl md:order-none order-first">
                                <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                                    Construimos hogares, no solo casas.
                                </h3>
                                <p className="mt-2 text-white/90 text-[13px] sm:text-sm md:text-base leading-relaxed text-justify mx-auto max-w-3xl">
                                    Desarrollamos proyectos desde el origen: concepto, proyecto ejecutivo y distribuciones.
                                    Contamos con personal especializado para cada fase de construcción y venta. Nuestro compromiso
                                    es simple: calidad real y clientes más que satisfechos con su nuevo hogar.
                                </p>
                                <ul className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/90 text-[12px] sm:text-sm">
                                    <li className="flex items-start gap-2"><span>✅</span> Gestión completa del proyecto de principio a fin.</li>
                                    <li className="flex items-start gap-2"><span>👷</span> Equipos profesionales y certificados por especialidad.</li>
                                    <li className="flex items-start gap-2"><span>🧪</span> Control de calidad documentado en cada hito.</li>
                                    <li className="flex items-start gap-2"><span>🤝</span> Entrega personalizada y seguimiento postventa.</li>
                                </ul>
                            </article>

                            <article className="relative rounded-xl shadow-lg overflow-hidden bg-white/10 border border-white/20 flex flex-col">
                                <div className="absolute inset-0 backdrop-blur-xl bg-black/20 z-0" />
                                <div className="relative z-10 p-3 sm:p-4 md:p-6">
                                    <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold flex items-center gap-2 leading-tight">
                                        <span>📐</span> Diseño & Detalle
                                    </h3>
                                    <p className="mt-2 text-white/90 text-[13px] sm:text-sm md:text-base leading-relaxed text-justify mx-auto max-w-3xl">
                                        Las distribuciones se desarrollan con profesionales para aprovechar cada metro útil:
                                        iluminación, ventilación y flujo cotidiano. Cuidamos los detalles para que recibas un
                                        espacio funcional, estético y listo para convertirse en tu hogar.
                                    </p>
                                </div>
                                <div className="relative z-10 p-4 hidden md:block">
                                    <img src="/construct.webp" alt="Diseño" className="w-full h-auto object-contain rounded-md" />
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
            {/*Botones de navegacion */}
            <div className="flex w-full p-1 mt-6 bg-slate-200 dark:bg-slate-800 rounded-full">
                {(["preventa", "disponible", "vendida"] as TabKey[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`flex-1 py-2 font-semibold rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
        ${selectedTab === tab
                                ? "bg-violet-600 text-white shadow" // ACTIVO: Fondo violeta, texto blanco
                                : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-black/10" // INACTIVO: Texto gris, con un leve fondo al pasar el mouse
                            }`}
                    >
                        {tab === "preventa" && "🏗️ Preventa"}
                        {tab === "disponible" && "🏡 Disponibles"}
                        {tab === "vendida" && "✅ Vendidas"}
                    </button>
                ))}
            </div>

            <SectionIntro text={introByTab[selectedTab]} />

            <main className="px-4 max-w-7xl mx-auto">
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

            <footer
                ref={footerRef}
                className={`bg-[#005187] py-10 mt-10 transition-all duration-700 ${visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                    }`}
            >
                <div className="container mx-auto px-4 text-white">
                    {/* Logo y descripción */}
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="md:w-1/3">
                            <span className="text-2xl font-bold tracking-tight block">ConsHer</span>
                            <p className="mt-2 text-sm leading-relaxed text-gray-200">
                                En ConsHer nos especializamos en brindar soluciones de alta calidad
                                para nuestros clientes, garantizando confianza, compromiso y excelencia
                                en cada proyecto que realizamos.
                            </p>
                        </div>

                        {/* Redes sociales */}
                        <div className="md:w-1/3">
                            <h3 className="text-lg font-semibold mb-3">📱 Síguenos en nuestras redes sociales</h3>
                            <div className="flex gap-4">
                                <a href="https://www.instagram.com/consher.94?igsh=cDE2OGZkeTlkMnZy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-300 transition-colors">
                                    <i className="fab fa-instagram text-2xl"></i>
                                </a>
                                <a href="https://www.facebook.com/share/1GdaYws2ha/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-300 transition-colors">
                                    <i className="fab fa-facebook text-2xl"></i>
                                </a>
                                <a href="https://www.tiktok.com/@consher84?_t=ZS-8ynARcMNWnA&_r=1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-300 transition-colors">
                                    <i className="fab fa-tiktok text-2xl"></i>
                                </a>
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="md:w-1/3">
                            <h3 className="text-lg font-semibold mb-3">📩 Contáctanos</h3>
                            <p className="text-sm">Si deseas más información sobre nuestros servicios, estamos para ayudarte.</p>
                            <p className="mt-2">📧 contacto@consher.mx</p>
                            <p>📞 (492) 218 7566</p>
                            <p>📍 México</p>
                        </div>
                    </div>

                    {/* Línea separadora */}
                    <div className="border-t border-gray-400 mt-8 pt-4 text-center text-sm text-gray-300">
                        <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                            <span className="hover:underline cursor-pointer">Política de privacidad</span>
                            <span>|</span>
                            <span className="hover:underline cursor-pointer">Términos del servicio</span>
                        </div>
                        <p className="mt-2">© {new Date().getFullYear()} ConsHer. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
