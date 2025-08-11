// src/components/CasaCarrusel.tsx

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Mousewheel } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


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
            className="relative cursor-pointer p-4 w-[90vw] max-w-6xl mx-auto rounded-2xl overflow-hidden group"
        >
            <h3
                className="relative z-10 font-semibold text-white px-3 py-1 rounded-md bg-black/40 backdrop-blur-sm w-fit text-[clamp(1.125rem,4vw,1.75rem)]"
            >
                {casa.ubicacion}
            </h3>

            <p
                className="relative z-10 font-bold text-green-400 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit 
                           text-[clamp(1rem,3.5vw,1.5rem)]"
            >
                ${casa.precio.toLocaleString()}
            </p>

            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-md scale-110 brightness-75 transition-all duration-500"
                style={{ backgroundImage: `url(${currentImage})` }}
            />

            <div className="relative z-10 w-full p-4 sm:p-6 border border-white/10 rounded-2xl shadow-2xl overflow-hidden aspect-[10/4] md:aspect-[10/3.5]">
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={3} // Mantenemos los 3 slides siempre
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
                    mousewheel={{
                        forceToAxis: true,
                    }}
                    modules={[Autoplay, EffectCoverflow, Mousewheel]}
                    className="rounded-xl h-full"
                >
                    {casa.imagenes.map((img, idx) => (
                        <SwiperSlide key={idx}>
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