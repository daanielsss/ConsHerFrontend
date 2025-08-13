// src/components/CasaCarrusel.tsx

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperCore } from 'swiper/types';

import 'swiper/css';

// El tipo de dato para la casa
type Casa = {
    _id: string;
    nombre: string;
    ubicacion: string;
    precio: number;
    imagenes: string[];
};

// El tipo para las props del componente
type CasaCarruselProps = {
    casa: Casa;
};

export default function CasaCarrusel({ casa }: CasaCarruselProps) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const currentImage = casa.imagenes[activeIndex % casa.imagenes.length];

    // Referencias para el Swiper y el scroll del ratón
    const swiperRef = useRef<SwiperCore | null>(null);
    const scrollTimeoutRef = useRef<number | null>(null);

    // Mantenemos la función para manejar el scroll vertical
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
            {/* 1. CSS integrado para el estilo del carrusel */}
            <style>
                {`
            .single-file-carousel .swiper-slide {
                transition: transform 0.4s ease-out, opacity 0.4s ease-out;
                transform: scale(0.7) translateY(10%);
                opacity: 0.5;
            }
            .single-file-carousel .swiper-slide-active {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        `}
            </style>

            {/* 2. Contenedor principal con el fondo borroso */}
            <div
                onClick={() => navigate(`/casa/${casa._id}`)}
                onWheel={handleWheel} // Añadimos de nuevo el manejador del scroll
                className="relative cursor-pointer w-[90vw] max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg"
            >
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500 scale-110 blur-lg brightness-60"
                    style={{ backgroundImage: `url(${currentImage})` }}
                />

                {/* Contenedor para el contenido sobre el fondo */}
                <div className="relative z-10 flex flex-col p-4">

                    {/* 3. Lógica del carrusel (antes en ImageCarousel.tsx) */}
                    <div className="relative w-full overflow-hidden aspect-[16/9] rounded-xl">
                        <Swiper
                            // @ts-expect-error El tipo de la prop 'ref' de Swiper no es directamente compatible con el de useRef.
                            ref={swiperRef} // Conectamos la referencia
                            className="single-file-carousel h-full"
                            modules={[Autoplay, Mousewheel]}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            loop={true}
                            spaceBetween={0}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        >
                            {casa.imagenes.map((img, idx) => (
                                <SwiperSlide key={idx} className="!w-[70%]">
                                    <img
                                        src={img}
                                        alt={`Imagen de la propiedad ${idx + 1}`}
                                        className="w-full h-full object-cover shadow-2xl rounded-xl"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* 4. Lógica de la información (antes en CasaInfo.tsx) */}
                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-b-xl -mt-1">
                        <h3 className="text-xl font-bold text-white truncate">{casa.ubicacion}</h3>
                        <p className="text-lg font-semibold text-green-400 mt-1">
                            ${casa.precio.toLocaleString('es-MX')} MXN
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}