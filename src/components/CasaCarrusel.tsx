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
        <div
            onClick={() => navigate(`/casa/${casa._id}`)}
            className="relative cursor-pointer p-4 max-w-5xl mx-auto mb-16 rounded-xl overflow-hidden group"
        >
            {/* Fondo desenfocado con efecto cristal */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-sm scale-110 brightness-75"
                style={{ backgroundImage: `url(${currentImage})` }}
            >
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-md" />
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 bg-white/60 dark:bg-black/60 backdrop-blur-md rounded-lg shadow-xl p-6">
                <div className="mb-3">
                    <h3 className="text-xl font-semibold">{casa.nombre}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{casa.ubicacion}</p>
                    <p className="text-lg font-bold text-green-700">${casa.precio.toLocaleString()}</p>
                </div>

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
                    className="rounded-xl"
                >
                    {casa.imagenes.map((img, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                src={img}
                                alt={`Imagen ${idx + 1}`}
                                className={`transition-all duration-300 rounded-lg mx-auto ${idx === activeIndex
                                    ? 'w-[90%] h-64 scale-100 opacity-100 z-10'
                                    : 'w-[70%] h-56 scale-90 opacity-50'
                                    } object-cover shadow-md`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
