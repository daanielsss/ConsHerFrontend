import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";

export default function AdminGastos() {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        nombre: "",
        direccion: "",
        fechaInicio: "",
        presupuestoEstimado: "",
        gananciaEstimada: "",
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: proyectos, isLoading } = useQuery("proyectos", async () => {
        const res = await api.get("/proyectos");
        return res.data;
    });

    const crearProyecto = useMutation(
        async () => {
            await api.post("/proyectos", {
                ...form,
                estado: "En proceso",
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("proyectos");
                setForm({
                    nombre: "",
                    direccion: "",
                    fechaInicio: "",
                    presupuestoEstimado: "",
                    gananciaEstimada: "",
                });
                setShowForm(false);
            },
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Proyectos</h2>
                <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 flex items-center gap-2 transition"
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus size={18} />
                    Nuevo Proyecto
                </button>
            </div>

            {showForm && (
                <div className="bg-card shadow-md rounded-lg p-6 space-y-4 border border-border">
                    <h3 className="font-semibold text-foreground">Crear nuevo proyecto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="nombre"
                            placeholder="Nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded bg-background text-foreground"
                        />
                        <input
                            name="direccion"
                            placeholder="Dirección"
                            value={form.direccion}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded bg-background text-foreground"
                        />
                        <input
                            name="fechaInicio"
                            type="date"
                            value={form.fechaInicio}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded bg-background text-foreground"
                        />
                        <input
                            name="presupuestoEstimado"
                            type="number"
                            placeholder="Presupuesto"
                            value={form.presupuestoEstimado}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded bg-background text-foreground"
                        />
                        <input
                            name="gananciaEstimada"
                            type="number"
                            placeholder="Ganancia Esperada"
                            value={form.gananciaEstimada}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded bg-background text-foreground"
                        />
                    </div>
                    <button
                        onClick={() => crearProyecto.mutate()}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Guardar Proyecto
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    <p className="text-muted-foreground">Cargando proyectos...</p>
                ) : (
                    proyectos?.map((proyecto: any) => (
                        <div
                            key={proyecto._id}
                            className="border p-4 rounded shadow bg-card text-card-foreground space-y-1"
                        >
                            <h4 className="text-lg font-semibold">{proyecto.nombre}</h4>
                            <p className="text-sm">📍 {proyecto.direccion}</p>
                            <p className="text-sm">📅 {new Date(proyecto.fechaInicio).toLocaleDateString()}</p>
                            <p className="text-sm font-medium">Estado: {proyecto.estado}</p>
                            <button
                                onClick={() => navigate(`/admin/gastos/${proyecto._id}`)}
                                className="text-primary hover:underline flex items-center gap-1 mt-2 text-sm"
                            >
                                <FolderOpen size={16} />
                                Ver Detalles
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
