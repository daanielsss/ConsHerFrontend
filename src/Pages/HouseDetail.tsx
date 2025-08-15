// src/pages/HouseDetail.tsx

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import api from "@/lib/axios";

// --- NUEVOS IMPORTS ---
// Para el carrusel
import { Swiper, SwiperSlide } from 'swiper/react';
import { type Swiper as SwiperRef } from 'swiper';
import { Navigation, Thumbs, FreeMode, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';

// Para la galería a pantalla completa (Lightbox)
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Para los íconos
import { MapPin, BedDouble, Bath, Ruler, Square, Instagram, Facebook } from 'lucide-react';

// Para el mapa (sin cambios)
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icono personalizado para el mapa (sin cambios)
const houseIcon = L.divIcon({
    html: '🏠',
    iconSize: [30, 30],
    className: "text-[30px]",
});


export default function HouseDetail() {
    const { id } = useParams();
    const { data: house, isLoading } = useQuery(["house", id], async () => {
        const res = await api.get(`/houses/${id}`);
        return res.data;
    });

    // --- ESTADOS PARA EL CARRUSEL Y LIGHTBOX ---
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperRef | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    if (isLoading || !house) return <p className="p-6 text-center text-muted-foreground">Cargando detalles de la propiedad...</p>;

    // Prepara las imágenes para el lightbox
    const slides = house.images?.map((src: string) => ({ src }));

    return (
        <div className="bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <Link to="/" className="text-sm text-primary hover:underline mb-6 inline-block">
                    ← Volver al catálogo
                </Link>

                {/* --- SECCIÓN 1: CARRUSEL DE IMÁGENES --- */}
                <section className="mb-8">
                    <Swiper
                        loop={true}
                        spaceBetween={10}
                        navigation={true}
                        pagination={{ clickable: true }}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        modules={[FreeMode, Navigation, Thumbs, Pagination]}
                        className="rounded-lg shadow-xl h-[500px] mb-4"
                    >
                        {house.images?.map((img: string, index: number) => (
                            <SwiperSlide key={index} onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}>
                                <img src={img} alt={`Vista de la propiedad ${index + 1}`} className="w-full h-full object-cover cursor-pointer" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        loop={true}
                        spaceBetween={10}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="h-[100px] thumbs-carousel"
                    >
                        {house.images?.map((img: string, index: number) => (
                            <SwiperSlide key={index}>
                                <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover rounded-md cursor-pointer" />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Componente Lightbox para ver en pantalla completa */}
                    <Lightbox
                        open={lightboxOpen}
                        close={() => setLightboxOpen(false)}
                        slides={slides}
                        index={lightboxIndex}
                    />
                </section>

                {/* --- SECCIÓN 2: INFORMACIÓN DETALLADA (DISEÑO DE 2 COLUMNAS) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna principal de información */}
                    <main className="lg:col-span-2">
                        <header className="pb-6 border-b border-border">
                            <h1 className="text-4xl font-bold text-foreground">{house.title}</h1>
                            <p className="text-lg text-muted-foreground mt-2">{house.address}</p>
                        </header>

                        <section className="mt-6">
                            <h2 className="text-2xl font-semibold text-foreground mb-4">Acerca de esta propiedad</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{house.description}</p>
                        </section>

                        {/* --- SECCIÓN 3: MAPA MEJORADO --- */}
                        {house.lat && house.lng && (
                            <section className="mt-8">
                                <h2 className="text-2xl font-semibold text-foreground mb-4">Ubicación</h2>
                                <div className="rounded-lg shadow-lg overflow-hidden border border-border">
                                    <MapContainer center={[house.lat, house.lng]} zoom={15} scrollWheelZoom={false} className="w-full h-96 z-10">
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                                        <Marker position={[house.lat, house.lng]} icon={houseIcon}><Popup>{house.title}</Popup></Marker>
                                    </MapContainer>
                                </div>
                                <div className="mt-4">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${house.lat},${house.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        <MapPin size={16} />
                                        Ver ubicación en Google Maps
                                    </a>
                                </div>
                            </section>
                        )}
                    </main>

                    {/* Columna lateral con datos clave (sticky) */}
                    <aside className="lg:sticky top-8 self-start">
                        <div className="bg-card border border-border rounded-lg shadow-lg p-6">
                            {/* --- CÓDIGO NUEVO --- */}
                            {house.status.toLowerCase() === 'vendida' ? (
                                <p className="text-3xl font-bold text-red-600 mb-4">VENDIDA</p>
                            ) : (
                                <p className="text-3xl font-bold text-foreground mb-4">
                                    ${Number(house.price).toLocaleString("es-MX", { currency: "MXN" })} MXN
                                </p>
                            )}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <BedDouble className="text-primary" size={24} />
                                    <div>
                                        <p className="font-bold text-foreground">{house.bedrooms} Recámaras</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Bath className="text-primary" size={24} />
                                    <div>
                                        <p className="font-bold text-foreground">{house.bathrooms} Baños</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Ruler className="text-primary" size={24} />
                                    <div>
                                        <p className="font-bold text-foreground">{house.area} m²</p>
                                        <p className="text-sm text-muted-foreground">Construcción</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Square className="text-primary" size={24} />
                                    <div>
                                        <p className="font-bold text-foreground">{house.landSize} m²</p>
                                        <p className="text-sm text-muted-foreground">Terreno</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border">
                                <p className="text-sm text-center font-bold capitalize text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 py-2 rounded-md">{house.status}</p>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* --- SECCIÓN 4: CONTACTO Y REDES SOCIALES --- */}
                <section className="mt-16 bg-slate-100 dark:bg-slate-800 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-foreground">¿Interesado en esta propiedad?</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                        Esta es una oportunidad única. Si deseas más información o agendar una visita, no dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte a encontrar el hogar de tus sueños.
                    </p>
                    <a href={`https://wa.me/524922187566?text=Hola, me interesa la propiedad: ${encodeURIComponent(house.title)}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-transform hover:scale-105">
                        Contactar Ahora por WhatsApp!
                    </a>

                    <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-600">
                        <p className="font-semibold text-foreground">Síguenos en nuestras redes sociales</p>
                        <div className="flex justify-center items-center gap-6 mt-4">
                            <a href="https://www.instagram.com/consher.94?igsh=cDE2OGZkeTlkMnZy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={28} /></a>
                            <a href="https://www.facebook.com/share/1GdaYws2ha/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={28} /></a>
                            <a href="https://www.tiktok.com/@consher84?_t=ZS-8ynARcMNWnA&_r=1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                {/* Icono de TikTok */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.52.02c1.31-.02 2.61.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.8-1.59-1.84-2.3-4.14-2.1-6.49.19-2.42 1.25-4.66 2.89-6.35 1.71-1.75 4.09-2.65 6.43-2.58.03 1.56.02 3.12.01 4.67-.13 1.43-.68 2.85-1.7 3.86-1.04 1.02-2.36 1.57-3.84 1.73-.04-1.56-.04-3.12.01-4.67.11-1.25.59-2.47 1.35-3.44.81-1.01 1.9-1.8 3.13-2.31z" /></svg>
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}