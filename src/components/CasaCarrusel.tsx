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
        // Quitamos overflow-hidden aquí también
        <div
            onClick={() => navigate(`/casa/${casa._id}`)}
            className="relative cursor-pointer overflow-hiddenp-4 w-full max-w-6xl mx-auto mb-16 rounded-2xl group"
        >
            {/* Fondo desenfocado (sin cambios) */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-md scale-110 brightness-75"
                style={{ backgroundImage: `url(${currentImage})` }}
            />

            {/* Contenido flotante (sin cambios) */}
            <div className="relative z-10 backdrop-blur-lg w-full rounded-2xl shadow-2xl p-6 border border-white/10">
                {/* ... (título, ubicación, etc. sin cambios) */}

                {/* 👇 CAMBIOS AQUÍ 👇 */}
                <Swiper
                    // 1. Define un número fijo de slides visibles
                    slidesPerView={3}
                    centeredSlides={true}
                    loop={true}
                    // 2. (Opcional) Añade espacio entre slides
                    spaceBetween={30}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    className="rounded-xl"
                >
                    {casa.imagenes.map((img, idx) => (
                        <SwiperSlide
                            key={idx}
                            // 3. Ya no necesitamos anchos dinámicos aquí
                            className="transition-all duration-300 flex justify-center items-center"
                        >
                            {/* Los estilos de la imagen se encargan de todo el efecto visual */}
                            <img
                                src={img}
                                alt={`Imagen ${idx + 1}`}
                                className={`rounded-xl object-cover shadow-xl transition-all duration-500
                                ${idx === activeIndex
                                        ? 'w-full h-[24rem] scale-100 opacity-100 z-10'
                                        // La imagen inactiva se hace más pequeña con `scale`
                                        : 'w-full h-[20rem] scale-80 opacity-50 z-0'
                                    }`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}