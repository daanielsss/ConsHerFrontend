import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import api from "@/lib/axios";

export default function HouseDetail() {
    const { id } = useParams();

    const { data: house, isLoading } = useQuery(["house", id], async () => {
        const res = await api.get(`/houses/${id}`);
        return res.data;
    });

    if (isLoading || !house) return <p className="p-6 text-muted-foreground">Cargando casa...</p>;

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
            <Link to="/" className=" underline text-sm">&larr; Volver al inicio</Link>

            {/* Encabezado */}
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-foreground">{house.title}</h1>
                <p className="text-muted-foreground text-lg">{house.address}</p>
                <p className="text-2xl font-semibold  mt-2">${Number(house.price).toLocaleString("en-US")}</p>
            </header>

            {/* Galería de imágenes */}
            {house.images?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {house.images.map((img: string, index: number) => (
                        <img
                            key={index}
                            src={img}
                            alt={`img-${index}`}
                            className="rounded-lg shadow border object-cover h-64 w-full"
                        />
                    ))}
                </div>
            )}

            {/* Datos de la propiedad */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 text-foreground">
                <div className="bg-muted p-4 rounded-lg shadow">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="text-lg font-bold capitalize">{house.status}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg shadow">
                    <p className="text-sm text-muted-foreground">Recámaras</p>
                    <p className="text-lg font-bold">{house.bedrooms}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg shadow">
                    <p className="text-sm text-muted-foreground">Baños</p>
                    <p className="text-lg font-bold">{house.bathrooms}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg shadow">
                    <p className="text-sm text-muted-foreground">Área construida</p>
                    <p className="text-lg font-bold">{house.area} m²</p>
                </div>
                <div className="bg-muted p-4 rounded-lg shadow">
                    <p className="text-sm text-muted-foreground">Terreno</p>
                    <p className="text-lg font-bold">{house.landSize} m²</p>
                </div>
            </section>

            {/* Descripción */}
            {house.description && (
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-foreground mb-2">Descripción</h2>
                    <p className="text-muted-foreground leading-relaxed">{house.description}</p>
                </section>
            )}
        </div>
    );
}
