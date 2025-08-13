// src/components/CasaCarrusel.tsx

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperCore } from 'swiper/types';

import 'swiper/css';

// ... (El resto de tus types)
type Casa = {
    _id: string;
    nombre: string;
    ubicacion: string;
    precio: number;
    imagenes: string[];
};

type CasaCarruselProps = {
    casa: Casa;
};


export default function CasaCarrusel({ casa }: CasaCarruselProps) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const currentImage = casa.imagenes[activeIndex % casa.imagenes.length];

    // Mantenemos la referencia para Swiper, pero ya no para el timeout del scroll
    const swiperRef = useRef<SwiperCore | null>(null);

    // 1. Elimina TODA esta función handleWheel. Ya no es necesaria.
    /*
    const handleWheel = (e: React.WheelEvent) => {
        // ... todo el código de esta función se va
    };
    */

    return (
        <>
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

            <div
                onClick={() => navigate(`/casa/${casa._id}`)}
                // 2. Elimina la prop onWheel de este div.
                // onWheel={handleWheel} 
                className="relative cursor-pointer w-[90vw] max-w-4xl lg:max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-lg"
            >
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500 scale-110 blur-lg brightness-60"
                    style={{ backgroundImage: `url(${currentImage})` }}
                />

                <div className="relative z-10 flex flex-col p-4">
                    <div className="relative w-full overflow-hidden aspect-[21/9] rounded-xl">
                        <Swiper
                            // @ts-expect-error El tipo de la prop 'ref' de Swiper no es directamente compatible con el de useRef.
                            ref={swiperRef}
                            className="single-file-carousel h-full"
                            modules={[Autoplay, Mousewheel]}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            loop={true}
                            spaceBetween={0}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            // Esta configuración es la que se encargará de todo:
                            mousewheel={{
                                forceToAxis: true,   // Obliga al scroll a ser horizontal en el carrusel.
                                releaseOnEdges: true // Libera el scroll a la página si llegas al final/principio del carrusel.
                            }}
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