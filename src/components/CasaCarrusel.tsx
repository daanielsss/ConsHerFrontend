// src/components/CasaCarrusel.tsx

import { Swiper, SwiperSlide } from 'swiper/react';
// 👇 1. Módulos de Swiper actualizados
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// 👇 2. Estilos base y del efecto importados
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

    return (
        <div
            onClick={() => navigate(`/casa/${casa._id}`)}
            className="relative cursor-pointer p-4 w-full max-w-6xl mx-auto mb-16 rounded-2xl overflow-hidden group"
        >
            {/* --- INICIO DE TEXTO FLUIDO CORREGIDO --- */}
            <h3
                className="relative z-10 font-semibold text-white px-3 py-1 rounded-md bg-black/40 backdrop-blur-sm w-fit
                           text-[clamp(1.125rem,4vw,1.75rem)]" // Rango de texto más amplio
            >
                {casa.nombre}
            </h3>

            <p
                className="relative z-10 text-white/90 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit
                           text-[clamp(0.875rem,3vw,1.125rem)]" // Rango de texto más amplio
            >
                {casa.ubicacion}
            </p>

            <p
                className="relative z-10 font-bold text-green-400 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit 
                           text-[clamp(1rem,3.5vw,1.5rem)]" // Rango de texto más amplio
            >
                ${casa.precio.toLocaleString()}
            </p>
            {/* --- FIN DE TEXTO FLUIDO --- */}

            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-md scale-110 brightness-75 transition-all duration-500"
                style={{ backgroundImage: `url(${currentImage})` }}
            />

            <div className="relative z-10 w-full p-4 sm:p-6 border border-white/10 rounded-2xl shadow-2xl overflow-hidden aspect-[10/4] md:aspect-[10/3.5]">
                {/* --- INICIO DE SWIPER ACTUALIZADO CON COVERFLOW --- */}
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={3} // Muestra 3 slides
                    loop={true}
                    coverflowEffect={{
                        rotate: 30,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: false,
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, EffectCoverflow]} // Módulos actualizados
                    className="rounded-xl h-full"
                >
                    {casa.imagenes.map((img, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                src={img}
                                alt={`Imagen ${idx + 1}`}
                                // Clases simplificadas, el efecto se encarga del resto
                                className="rounded-xl object-cover shadow-xl w-full h-full"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* --- FIN DE SWIPER ACTUALIZADO --- */}
            </div>
        </div>
    );
}