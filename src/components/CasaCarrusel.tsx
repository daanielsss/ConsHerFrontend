// src/components/CasaCarrusel.tsx

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Mousewheel } from 'swiper/modules'; // <-- CAMBIO: Quitamos EffectCoverflow
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import type { Swiper as SwiperCore } from 'swiper/types';

// Asegúrate de tener el CSS base de Swiper
import 'swiper/css';

type Casa = {
    _id: string;
    nombre: string;
    ubicacion: string;
    precio: number;
    imagenes: string[];
};

export default function CasaCarrusel({ casa }: { casa: Casa }) {
    const navigate = useNavigate();
    // Ya no necesitamos el fondo blur, así que quitamos el activeIndex
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
        <>
            {/* CAMBIO CLAVE: Añadimos CSS para controlar el estilo de los slides activos e inactivos */}
            <style>
                {`
                    .casa-carrusel .swiper-slide {
                        transition: transform 0.4s ease-out, opacity 0.4s ease-out;
                        transform: scale(0.75) translateY(15%);
                        opacity: 0.4;
                    }
                    .casa-carrusel .swiper-slide-active {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                `}
            </style>

            <div
                onClick={() => navigate(`/casa/${casa._id}`)}
                onWheel={handleWheel}
                className="relative cursor-pointer w-[90vw] max-w-6xl mx-auto" // <-- Limpiamos el contenedor principal
            >
                {/* Posicionamos el texto sobre el carrusel */}
                <div className="absolute top-4 left-4 z-20">
                    <h3 className="font-semibold text-white px-3 py-1 rounded-md bg-black/40 backdrop-blur-sm w-fit text-[clamp(1.125rem,4vw,1.75rem)]">
                        {casa.ubicacion}
                    </h3>
                    <p className="font-bold text-green-400 px-3 py-1 mt-2 rounded-md bg-black/30 backdrop-blur-sm w-fit text-[clamp(1rem,3.5vw,1.5rem)]">
                        ${casa.precio.toLocaleString()}
                    </p>
                </div>

                {/* Eliminamos el div de fondo con blur */}
                {/* El contenedor ahora solo envuelve al Swiper con una relación de aspecto panorámica */}
                <div className="relative w-full overflow-hidden aspect-[16/8] rounded-2xl">
                    <Swiper
                        // Le damos una clase al Swiper para apuntar nuestro CSS
                        className="casa-carrusel h-full"
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        // Ya no usamos 'effect'
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        loop={true}
                        spaceBetween={-40} // <-- CAMBIO: Usamos un valor negativo para acercar los previews

                        // Eliminamos por completo la configuración de 'coverflowEffect'

                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        mousewheel={{
                            forceToAxis: true,
                            releaseOnEdges: true,
                        }}
                        modules={[Autoplay, Mousewheel]} // <-- Quitamos EffectCoverflow de los módulos
                    >
                        {casa.imagenes.map((img, idx) => (
                            // El ancho del slide ahora controla qué tan grande se ve el preview
                            <SwiperSlide key={idx} className="!w-[70%] md:!w-[60%]">
                                <img
                                    src={img}
                                    alt={`Imagen ${idx + 1}`}
                                    className="rounded-2xl object-cover shadow-2xl w-full h-full"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    );
}