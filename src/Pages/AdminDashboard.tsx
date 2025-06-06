import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: houses, isLoading } = useQuery("houses", async () => {
        const res = await api.get("/houses");
        return res.data;
    });

    const eliminarCasa = useMutation(
        async (id: string) => {
            await api.delete(`/houses/${id}`);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("houses");
            },
        }
    );

    const handleDelete = (id: string) => {
        const confirm = window.confirm("¿Estás seguro de que deseas eliminar esta casa?");
        if (confirm) {
            eliminarCasa.mutate(id);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-foreground">Casas Registradas</h1>
                <button
                    onClick={() => navigate("/admin/houses")}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                >
                    <Plus size={16} /> Nueva Casa
                </button>
            </div>

            {isLoading ? (
                <p className="text-muted-foreground">Cargando casas...</p>
            ) : houses?.length === 0 ? (
                <p className="text-muted-foreground">No hay casas registradas.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {houses.map((house: any) => (
                        <div key={house._id} className="rounded-xl shadow border bg-card overflow-hidden">
                            {house.images?.length > 0 && (
                                <img
                                    src={house.images[0]}
                                    alt={house.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}

                            <div className="p-4 space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">{house.title}</h3>
                                <p className="text-sm text-muted-foreground">{house.address}</p>
                                <p className="text-sm font-medium ">
                                    ${Number(house.price).toLocaleString("en-US")}
                                </p>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => navigate(`/admin/houses/${house._id}/editar`)}
                                        className="text-sm flex items-center gap-1 px-3 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    >
                                        <Pencil size={14} /> Editar
                                    </button>

                                    <button
                                        onClick={() => handleDelete(house._id)}
                                        className="text-sm flex items-center gap-1 px-3 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        <Trash2 size={14} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
