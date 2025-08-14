import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { FormGasto, FormNomina, FormMaterial } from "@/components/GastoFormComponents";

function formatCurrency(value: number | null | undefined): string {
    if (typeof value !== "number" || isNaN(value)) return "$0.00";
    return value.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
    });
}

// Interfaces con _id para identificar cada registro
interface Gasto {
    _id: string;
    descripcion: string;
    monto: number;
    fecha: string;
}

interface Nomina {
    _id: string;
    semana: string;
    trabajador: string;
    sueldo: number;
    pago: number;
    observaciones: string;
}

interface Material {
    _id: string;
    material: string;
    cantidad: number;
    precio: number;
    unidad: string;
    detalles: string;
}

interface Proyecto {
    _id: string;
    nombre: string;
    direccion: string;
    fechaInicio: string;
    estado: string;
    gastos: Gasto[];
    nomina: Nomina[];
    materiales: Material[];
}

export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<"gastos" | "nomina" | "materiales">("gastos");
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: proyecto, isLoading } = useQuery<Proyecto>(["proyecto", id], async () => {
        const res = await api.get(`/proyectos/${id}`);
        return res.data;
    });

    const deleteMutation = useMutation(
        async ({ endpoint, itemId }: { endpoint: string; itemId: string }) => {
            await api.delete(`/proyectos/${id}/${endpoint}/${itemId}`);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["proyecto", id]);
            },
        }
    );

    const deleteProjectMutation = useMutation(
        async () => {
            await api.delete(`/proyectos/${id}`);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("proyectos");
                navigate('/admin/gastos');
            },
        }
    );

    const updateStatusMutation = useMutation(
        async (newStatus: string) => {
            await api.patch(`/proyectos/${id}`, { estado: newStatus });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["proyecto", id]);
            },
        }
    );

    const handleStatusToggle = () => {
        const newStatus = proyecto?.estado === 'En proceso' ? 'Finalizado' : 'En proceso';
        updateStatusMutation.mutate(newStatus);
    };

    const handleDeleteProject = () => {
        const confirmacion = window.confirm(
            "¿Estás seguro de que quieres eliminar este proyecto?\n\nTodos los gastos, nóminas y materiales asociados se perderán para siempre. Esta acción es irreversible."
        );

        if (confirmacion) {
            deleteProjectMutation.mutate();
        }
    };

    if (isLoading || !proyecto) return <p className="p-6">Cargando proyecto...</p>;

    const totalGastos = proyecto.gastos.reduce((acc, g) => acc + (g.monto || 0), 0);
    const totalNomina = proyecto.nomina.reduce((acc, n) => acc + (n.pago || 0), 0);
    const totalMateriales = proyecto.materiales.reduce((acc, m) => acc + ((m.precio || 0) * (m.cantidad || 0)), 0);

    const estadoColors: Record<string, string> = {
        "En proceso": "bg-yellow-100 text-yellow-800 dark:bg-yellow-200/20 dark:text-yellow-300",
        // ✅ CORRECCIÓN: Usar "Finalizado" para coincidir con el backend
        "Finalizado": "bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-300",
        "Pausado": "bg-red-100 text-red-800 dark:bg-red-200/20 dark:text-red-300",
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">{proyecto.nombre}</h2>

            {/* ✅ SECCIÓN SUPERIOR ACTUALIZADA */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <div className="bg-muted rounded-md px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
                    📍 Dirección: <span className="font-semibold text-foreground">{proyecto.direccion}</span>
                </div>
                <div className="bg-muted rounded-md px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
                    📅 Fecha de inicio: <span className="font-semibold text-foreground">{new Date(proyecto.fechaInicio).toLocaleDateString()}</span>
                </div>
                <button
                    onClick={handleStatusToggle}
                    disabled={updateStatusMutation.isLoading}
                    className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition cursor-pointer hover:opacity-80 ${estadoColors[proyecto.estado]}`}
                >
                    🔄 Estado: <span className="font-semibold">{proyecto.estado}</span>
                </button>
                {/* BOTÓN DE ELIMINAR PROYECTO REUBICADO AQUÍ */}
                <button
                    onClick={handleDeleteProject}
                    disabled={deleteProjectMutation.isLoading}
                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 p-2 rounded-md transition"
                    aria-label="Eliminar proyecto"
                >
                    {deleteProjectMutation.isLoading ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-destructive rounded-full animate-spin"></div>
                    ) : (
                        <Trash2 size={20} />
                    )}
                </button>
            </div>

            <div className="flex gap-4 mb-4">
                {(["gastos", "nomina", "materiales"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded transition font-medium ${activeTab === tab
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/70"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Pestaña de Gastos */}
            {activeTab === "gastos" && (
                <div className="bg-card shadow p-6 rounded-lg text-card-foreground">
                    <FormGasto projectId={id!} />
                    <div className="flex justify-between items-center mt-6 mb-2">
                        <h3 className="text-lg font-semibold">Gastos Generales</h3>
                        <div className="inline-block bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-md text-sm font-semibold text-green-800 dark:text-green-300 shadow-sm">
                            Total: {formatCurrency(totalGastos)}
                        </div>
                    </div>
                    {proyecto.gastos.length === 0 ? (
                        <p className="text-muted-foreground">No hay gastos registrados.</p>
                    ) : (
                        <table className="w-full text-sm table-auto">
                            <thead>
                                <tr className="bg-muted text-left text-muted-foreground">
                                    <th className="p-2">Descripción</th>
                                    <th className="p-2">Monto</th>
                                    <th className="p-2">Fecha</th>
                                    <th className="p-2 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proyecto.gastos.map((g) => (
                                    <tr key={g._id} className="border-b border-border">
                                        <td className="p-2">{g.descripcion}</td>
                                        <td className="p-2 font-medium">{formatCurrency(g.monto)}</td>
                                        <td className="p-2">{new Date(g.fecha).toLocaleDateString()}</td>
                                        <td className="p-2 text-right">
                                            <button
                                                onClick={() => deleteMutation.mutate({ endpoint: 'gastos', itemId: g._id })}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition"
                                                aria-label="Borrar gasto"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {/* ✅ ZONA DE PELIGRO ELIMINADA DE AQUÍ */}
                </div>
            )}

            {/* Pestaña de Nómina */}
            {activeTab === "nomina" && (
                <div className="bg-card shadow p-6 rounded-lg text-card-foreground">
                    <FormNomina projectId={id!} />
                    <div className="flex justify-between items-center mt-6 mb-2">
                        <h3 className="text-lg font-semibold">Nómina</h3>
                        <div className="inline-block bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-md text-sm font-semibold text-green-800 dark:text-green-300 shadow-sm">
                            Total: {formatCurrency(totalNomina)}
                        </div>
                    </div>
                    {proyecto.nomina.length === 0 ? (
                        <p className="text-muted-foreground">No hay registros de nómina.</p>
                    ) : (
                        <table className="w-full text-sm table-auto">
                            <thead>
                                <tr className="bg-muted text-left text-muted-foreground">
                                    <th className="p-2">Semana</th>
                                    <th className="p-2">Trabajador</th>
                                    <th className="p-2">Sueldo</th>
                                    <th className="p-2">Pago</th>
                                    <th className="p-2">Observaciones</th>
                                    <th className="p-2 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proyecto.nomina.map((n) => (
                                    <tr key={n._id} className="border-b border-border">
                                        <td className="p-2">{n.semana}</td>
                                        <td className="p-2">{n.trabajador}</td>
                                        <td className="p-2">{formatCurrency(n.sueldo)}</td>
                                        <td className="p-2">{formatCurrency(n.pago)}</td>
                                        <td className="p-2">{n.observaciones}</td>
                                        <td className="p-2 text-right">
                                            <button
                                                onClick={() => deleteMutation.mutate({ endpoint: 'nomina', itemId: n._id })}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition"
                                                aria-label="Borrar nómina"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Pestaña de Materiales */}
            {activeTab === "materiales" && (
                <div className="bg-card shadow p-6 rounded-lg text-card-foreground">
                    <FormMaterial projectId={id!} />
                    <div className="flex justify-between items-center mt-6 mb-2">
                        <h3 className="text-lg font-semibold">Materiales</h3>
                        <div className="inline-block bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-md text-sm font-semibold text-green-800 dark:text-green-300 shadow-sm">
                            Total: {formatCurrency(totalMateriales)}
                        </div>
                    </div>
                    {proyecto.materiales.length === 0 ? (
                        <p className="text-muted-foreground">No hay materiales registrados.</p>
                    ) : (
                        <table className="w-full text-sm table-auto">
                            <thead>
                                <tr className="bg-muted text-left text-muted-foreground">
                                    <th className="p-2">Material</th>
                                    <th className="p-2">Cantidad</th>
                                    <th className="p-2">Precio</th>
                                    <th className="p-2">Unidad</th>
                                    <th className="p-2">Detalles</th>
                                    <th className="p-2 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proyecto.materiales.map((m) => (
                                    <tr key={m._id} className="border-b border-border">
                                        <td className="p-2">{m.material}</td>
                                        <td className="p-2">{m.cantidad}</td>
                                        <td className="p-2">{formatCurrency(m.precio)}</td>
                                        <td className="p-2">{m.unidad}</td>
                                        <td className="p-2">{m.detalles}</td>
                                        <td className="p-2 text-right">
                                            <button
                                                onClick={() => deleteMutation.mutate({ endpoint: 'materiales', itemId: m._id })}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition"
                                                aria-label="Borrar material"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}