import { useState } from "react";
import api from "@/lib/axios";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import axios from "axios";
import MapSelector from "@/components/MapSelector";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface CasaForm {
    title: string;
    description: string;
    address: string;
    price: string;
    status: "disponible" | "vendida" | "preventa";
    bedrooms: string;
    bathrooms: string;
    area: string;
    landSize: string;
    images: string[];
}

export default function AdminHouses() {
    const [form, setForm] = useState<CasaForm>({
        title: "",
        description: "",
        address: "",
        price: "",
        status: "disponible",
        bedrooms: "",
        bathrooms: "",
        area: "",
        landSize: "",
        images: [],
    });

    const [position, setPosition] = useState<[number, number] | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDrop = async (acceptedFiles: File[]) => {
        setUploading(true);
        const uploadedUrls: string[] = [];

        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            try {
                const res = await axios.post(CLOUDINARY_URL, formData);
                uploadedUrls.push(res.data.secure_url);
            } catch (error) {
                console.error("Error al subir imagen:", error);
            }
        }

        setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
        setUploading(false);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        multiple: true,
    });

    const handleReorder = (result: DropResult) => {
        if (!result.destination) return;

        const reordered = [...form.images];
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        setForm((prev) => ({ ...prev, images: reordered }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post("/houses", {
                ...form,
                price: Number(form.price),
                bedrooms: Number(form.bedrooms),
                bathrooms: Number(form.bathrooms),
                area: Number(form.area),
                landSize: Number(form.landSize),
                lat: position?.[0] || null,
                lng: position?.[1] || null,
            });

            console.log("Casa guardada:", response.data);
            alert("Casa agregada exitosamente.");
            setForm({
                title: "",
                description: "",
                address: "",
                price: "",
                status: "disponible",
                bedrooms: "",
                bathrooms: "",
                area: "",
                landSize: "",
                images: [],
            });
            setPosition(null);
        } catch (err) {
            console.error("Error al guardar casa:", err);
            alert("Error al guardar casa. Revisa consola.");
        }
    };

    return (
        <div className="bg-card shadow-md rounded-xl p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Agregar Nueva Casa</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: "Título", name: "title" },
                        { label: "Ubicación", name: "address" },
                        { label: "Precio", name: "price", type: "number" },
                        { label: "Recámaras", name: "bedrooms", type: "number" },
                        { label: "Baños", name: "bathrooms", type: "number" },
                        { label: "Área construida (m²)", name: "area", type: "number" },
                        { label: "Terreno (m²)", name: "landSize", type: "number" },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-foreground mb-1">{field.label}</label>
                            <input
                                type={field.type || "text"}
                                name={field.name}
                                value={form[field.name as keyof CasaForm]}
                                onChange={handleChange}
                                className="w-full border border-border bg-background text-foreground rounded-md px-3 py-2"
                                required={["title", "address", "price"].includes(field.name)}
                            />
                        </div>
                    ))}

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Ubicación en el mapa (haz clic para establecer)
                        </label>
                        <MapSelector position={position} onChange={setPosition} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border border-border bg-background text-foreground rounded-md px-3 py-2"
                        >
                            <option value="disponible">Disponible</option>
                            <option value="vendida">Vendida</option>
                            <option value="preventa">Preventa</option>
                        </select>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Imágenes (puedes arrastrar o seleccionar)
                        </label>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${isDragActive ? "bg-muted" : ""
                                }`}
                        >
                            <input {...getInputProps()} />
                            <p className="text-sm text-muted-foreground">
                                {isDragActive
                                    ? "Suelta las imágenes aquí..."
                                    : "Arrastra imágenes aquí o haz clic para seleccionar"}
                            </p>
                        </div>

                        {uploading && (
                            <p className="text-sm text-muted-foreground mt-1">Subiendo imágenes...</p>
                        )}

                        <DragDropContext onDragEnd={handleReorder}>
                            <Droppable droppableId="images" direction="horizontal">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
                                    >
                                        {form.images.map((img, index) => (
                                            <Draggable key={img} draggableId={img} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="relative group"
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`Imagen ${index + 1}`}
                                                            className="h-24 sm:h-32 w-full object-cover rounded-md border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    images: prev.images.filter((_, i) => i !== index),
                                                                }))
                                                            }
                                                            className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition"
                                                            title="Eliminar imagen"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border border-border bg-background text-foreground rounded-md px-3 py-2 h-24 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 font-semibold"
                >
                    Guardar Casa
                </button>
            </form>
        </div>
    );
}
