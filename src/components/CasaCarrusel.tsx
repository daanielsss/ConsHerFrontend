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
            className="relative cursor-pointer p-4 max-w-6xl w-full mx-auto mb-16 rounded-2xl overflow-hidden group"
        >
            <h3 className="relative z-10 text-xl font-semibold text-foreground">{casa.nombre}</h3>
            <p className="relative z-10 text-muted-foreground">{casa.ubicacion}</p>
            <p className="relative z-10 text-lg font-bold text-green-600">${casa.precio.toLocaleString()}</p>
            {/* Fondo desenfocado tipo espejo */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center blur-md scale-110 brightness-75"
                style={{ backgroundImage: `url(${currentImage})` }}
            />


            {/* Contenido flotante */}
            <div className="relative z-10 h-[28rem] w-full rounded-2xl shadow-2xl p-6 border border-white/10 overflow-hidden">
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
                        <SwiperSlide
                            key={idx}
                            className={`transition-all duration-300 flex justify-center items-center
                ${idx === activeIndex ? 'w-[60%]' : 'w-[20%]'}`}
                        >
                            <img
                                src={img}
                                alt={`Imagen ${idx + 1}`}
                                className={`rounded-xl object-cover shadow-xl transition-all duration-500
                ${idx === activeIndex
                                        ? 'w-full h-[24rem] scale-100 opacity-100 z-10'
                                        : 'w-full h-[10rem] scale-90 opacity-40 z-0'
                                    }`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>
        </div>
    );
}
