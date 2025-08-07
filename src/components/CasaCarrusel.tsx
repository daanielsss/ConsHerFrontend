import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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

    // Escala responsiva dinámica
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const baseWidth = 1280; // Ancho ideal (ej. max-w-6xl ≈ 1280px)
            const currentWidth = window.innerWidth;
            const newScale = Math.min(1, currentWidth / baseWidth);
            setScale(newScale);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    return (
        <div
            onClick={() => navigate(`/casa/${casa._id}`)}
            className="relative cursor-pointer p-4 w-full flex justify-center mb-16"
        >
            <div
                ref={containerRef}
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                className="max-w-6xl w-full transition-transform duration-300 ease-in-out"
            >
                <h3 className="relative z-10 text-xl font-semibold text-white px-3 py-1 rounded-md bg-black/40 backdrop-blur-sm w-fit">
                    {casa.nombre}
                </h3>

                <p className="relative z-10 text-white/90 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit">
                    {casa.ubicacion}
                </p>

                <p className="relative z-10 text-lg font-bold text-green-400 px-3 py-1 mt-1 rounded-md bg-black/30 backdrop-blur-sm w-fit ">
                    ${casa.precio.toLocaleString()}
                </p>

                {/* Fondo desenfocado tipo espejo */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center blur-md scale-110 brightness-75"
                    style={{ backgroundImage: `url(${currentImage})` }}
                />

                {/* Contenido flotante responsivo */}
                <div className="relative z-10 w-full p-4 sm:p-6 border border-white/10 rounded-2xl shadow-2xl overflow-hidden
                                h-[22rem] sm:h-[26rem] md:h-[28rem] lg:h-[30rem]">
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
                                            ? 'w-full h-[16rem] sm:h-[20rem] md:h-[24rem] lg:h-[26rem] scale-100 opacity-100 z-10'
                                            : 'w-full h-[6rem] sm:h-[8rem] md:h-[10rem] scale-90 opacity-40 z-0'
                                        }`}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
