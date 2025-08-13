// src/components/CasaCarrusel.tsx

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Mousewheel } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import type { Swiper as SwiperCore } from 'swiper/types';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

type Casa = {
    _id: string;
    nombre: string;
    ubicacion: string;
    precio: number;
    imagenes: string[];
};

export default function CasaCarrusel({ casa }: { casa: Casa }) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const currentImage = casa.imagenes[activeIndex % casa.imagenes.length];
    const swiperRef = useRef<SwiperCore | null>(null);
    const scrollTimeoutRef = useRef<number | null>(null);

    const handleWheel = (e: React.WheelEvent) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (swiperRef.current && !swiperRef.current.destroyed) {
                swiperRef.current.disable();
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = window.setTimeout(() => {
                if (swiperRef.current && !swiperRef.current.destroyed) {
                    swiperRef.current.enable();
                }
            }, 500);
        }
    };

    return (
        <div
            onClick={() => navigate(`/casa/${casa._id}`)}
            onWheel={handleWheel}
            className="relative cursor-pointer p-4 w-[90vw] max-w-6xl mx-auto rounded-2xl overflow-hidden group"
        >
            <h3 className="relative z-10 font-semibold text-white px-3 py-1 rounded-md bg-black/40 backdrop-blur-sm w-fit text-[clamp(1.125rem,4vw,1.75rem)]">
                {casa.ubicacion}
            </h3>

            <p className="relative z-10 font-bold text-green-400 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit text-[clamp(1rem,3.5vw,1.5rem)]">
                ${casa.precio.toLocaleString()}
            </p>

            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-md scale-110 brightness-75 transition-all duration-500"
                style={{ backgroundImage: `url(${currentImage})` }}
            />
            {/* Contenedor más alto para darle más presencia a la imagen central */}
            <div className="relative z-10 w-full p-4 sm:p-6 border border-white/10 rounded-2xl shadow-2xl overflow-hidden aspect-[10/7] md:aspect-[10/5]">
                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    loop={true}
                    spaceBetween={60} // <-- Aumentamos el espacio
                    coverflowEffect={{
                        // Aumentamos los valores para un efecto más extremo
                        rotate: 50,      // <-- Más rotación
                        stretch: 100,    // <-- CLAVE: Mucho más stretch para "encoger" las laterales
                        depth: 400,      // <-- Más profundidad para acentuar la perspectiva
                        modifier: 1,
                        slideShadows: true,
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    mousewheel={{
                        forceToAxis: true,
                        releaseOnEdges: true,
                    }}
                    modules={[Autoplay, EffectCoverflow, Mousewheel]}
                    className="rounded-xl h-full"
                >
                    {casa.imagenes.map((img, idx) => (
                        // Hacemos el slide base más ancho para que el central domine la vista
                        <SwiperSlide key={idx} className="!w-[75%] md:!w-[65%]">
                            <img
                                src={img}
                                alt={`Imagen ${idx + 1}`}
                                className="rounded-xl object-cover shadow-xl w-full h-full"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}