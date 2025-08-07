import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
    const [activeIndex, setActiveIndex] = useState(0);
    const currentImage = casa.imagenes[activeIndex % casa.imagenes.length];

    return (
        // Todo esto se queda igual
        <div
            onClick={() => navigate(`/casa/${casa._id}`)}
            className="relative cursor-pointer p-4 w-full max-w-6xl mx-auto mb-16 rounded-2xl overflow-hidden group"
        >
            <h3 className="relative z-10 text-xl font-semibold text-white px-3 py-1 rounded-md bg-black/40 backdrop-blur-sm w-fit">
                {casa.nombre}
            </h3>
            <p className="relative z-10 text-white/90 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit">
                {casa.ubicacion}
            </p>
            <p className="relative z-10 text-lg font-bold text-green-400 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit">
                ${casa.precio.toLocaleString()}
            </p>
            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-md scale-110 brightness-75 transition-all duration-500"
                style={{ backgroundImage: `url(${currentImage})` }}
            />

            <div className="relative z-10 w-full p-4 sm:p-6 border border-white/10 rounded-2xl shadow-2xl overflow-hidden aspect-[10/4] md:aspect-[10/3.5]">

                <Swiper
                    // === ¡ESTE ES EL ÚNICO CAMBIO NECESARIO! ===
                    slidesPerView={'auto'} // <-- De 3 a 'auto'
                    // ===========================================

                    centeredSlides={true}
                    loop={true}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    className="rounded-xl h-full"
                >
                    {casa.imagenes.map((img, idx) => (
                        <SwiperSlide
                            key={idx}
                            // Tus clases de ancho en porcentaje ahora son la única fuente de verdad
                            className={`transition-all duration-300 flex justify-center items-center flex-shrink-0 ${idx === activeIndex ? 'w-[60%]' : 'w-[20%]'
                                }`}
                        >
                            <img
                                src={img}
                                alt={`Imagen ${idx + 1}`}
                                className={`rounded-xl object-cover shadow-xl transition-all duration-500 w-full ${idx === activeIndex
                                    ? 'h-[90%] scale-100 opacity-100 z-10'
                                    : 'h-[40%] scale-90 opacity-40 z-0'
                                    }`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}