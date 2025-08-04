// src/components/CasaCarrusel.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

type Casa = {
    _id: string;
    nombre: string;
    ubicacion: string;
    precio: number;
    imagenes: string[];
};

export default function CasaCarrusel({ casa }: { casa: Casa }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/casa/${casa._id}`)}
            className="cursor-pointer p-4 max-w-4xl mx-auto mb-10 bg-white rounded-lg shadow-lg transition hover:shadow-2xl"
        >
            <div className="mb-3">
                <h3 className="text-xl font-semibold">{casa.nombre}</h3>
                <p className="text-gray-500">{casa.ubicacion}</p>
                <p className="text-lg font-bold text-green-600">${casa.precio.toLocaleString()}</p>
            </div>

            <Swiper
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                className="rounded-lg overflow-hidden"
            >
                {casa.imagenes.slice(0, 3).map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            src={img}
                            alt={`Imagen ${idx + 1}`}
                            className="w-full h-64 object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
