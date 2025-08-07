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
    // Aseguramos que el índice siempre sea válido
    const currentImage = casa.imagenes[activeIndex % casa.imagenes.length];

    return (
        <div
            onClick={() => navigate(`/casa/${casa._id}`)}
            className="relative cursor-pointer p-4 w-full max-w-6xl mx-auto mb-16 rounded-2xl overflow-hidden group"
        >
            {/* --- La información de texto se mantiene igual --- */}
            <h3 className="relative z-10 text-xl font-semibold text-white px-3 py-1 rounded-md bg-black/40 backdrop-blur-sm w-fit">
                {casa.nombre}
            </h3>
            <p className="relative z-10 text-white/90 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit">
                {casa.ubicacion}
            </p>
            <p className="relative z-10 text-lg font-bold text-green-400 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit">
                ${casa.precio.toLocaleString()}
            </p>

            {/* Fondo desenfocado tipo espejo */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-md scale-110 brightness-75 transition-all duration-500"
                style={{ backgroundImage: `url(${currentImage})` }}
            />

            {/* Contenido flotante responsivo: ESTA ES LA ZONA CLAVE */}
            <div className="relative z-10 w-full p-4 sm:p-6 border border-white/10 rounded-2xl shadow-2xl overflow-hidden
                            aspect-[10/4] md:aspect-[10/3.5]"> {/* <-- ¡CAMBIO CLAVE! */}

                <Swiper
                    slidesPerView={3}
                    centeredSlides={true}
                    loop={true}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    className="rounded-xl h-full" // <-- Aseguramos que Swiper ocupe todo el alto
                >
                    {casa.imagenes.map((img, idx) => (
                        <SwiperSlide
                            key={idx}
                            className={`transition-all duration-300 flex justify-center items-center ${
                                /* La lógica de ancho relativo ya era correcta, la mantenemos */
                                idx === activeIndex ? 'w-[60%]' : 'w-[20%]'
                                }`}
                        >
                            <img
                                src={img}
                                alt={`Imagen ${idx + 1}`}
                                className={`rounded-xl object-cover shadow-xl transition-all duration-500 w-full ${
                                    /* <-- ¡CAMBIO CLAVE! Usamos alturas relativas */
                                    idx === activeIndex
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