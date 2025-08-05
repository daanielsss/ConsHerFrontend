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
            className="relative cursor-pointer p-4 max-w-6xl mx-auto mb-16 rounded-2xl overflow-hidden group"
        >
            {/* Fondo desenfocado tipo espejo */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-md scale-110 brightness-75"
                style={{ backgroundImage: `url(${currentImage})` }}
            />

            {/* Contenido flotante */}
            <div className="relative z-10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/10">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-foreground">{casa.nombre}</h3>
                    <p className="text-muted-foreground">{casa.ubicacion}</p>
                    <p className="text-lg font-bold text-green-600">${casa.precio.toLocaleString()}</p>
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
                                className={`transition-all duration-400 rounded-xl mx-auto object-cover shadow-lg
                                    ${idx === activeIndex
                                        ? 'w-[80%] h-[76rem] scale-110 opacity-100 z-10' // MÁS grande y enfocada
                                        : 'w-[16%] h-[9rem] scale-75 opacity-40 z-0'      // MÁS pequeña y desvanecida
                                    }`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
