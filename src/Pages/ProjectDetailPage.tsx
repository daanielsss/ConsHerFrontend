import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import api from "@/lib/axios";
import { useState } from "react";
import { FormGasto, FormNomina, FormMaterial } from "@/components/GastoFormComponents";

function formatCurrency(value: number | null | undefined): string {
    if (typeof value !== "number" || isNaN(value)) return "$0.00";
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

interface Gasto {
    descripcion: string;
    monto: number;
    fecha: string;
}

interface Nomina {
    semana: string;
    trabajador: string;
    sueldo: number;
    pago: number;
    observaciones: string;
}

interface Material {
    material: string;
    cantidad: number;
    precio: number;
    unidad: string;
    detalles: string;
}

interface Proyecto {
    nombre: string;
    direccion: string;
    fechaInicio: string;
    estado: string;
    gastos: Gasto[];
    nomina: Nomina[];
    materiales: Material[];
}

export default function ProjectDetailPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<"gastos" | "nomina" | "materiales">("gastos");

    const { data: proyecto, isLoading } = useQuery<Proyecto>(["proyecto", id], async () => {
        const res = await api.get(`/proyectos/${id}`);
        return res.data;
    });

    if (isLoading || !proyecto) return <p className="p-6">Cargando proyecto...</p>;

    const totalGastos = proyecto.gastos.reduce((acc, g) => acc + (g.monto || 0), 0);
    const totalNomina = proyecto.nomina.reduce((acc, n) => acc + (n.pago || 0), 0);
    const totalMateriales = proyecto.materiales.reduce((acc, m) => acc + (m.precio || 0), 0);

    const estadoColors: Record<string, string> = {
        "En proceso": "bg-yellow-100 text-yellow-800 dark:bg-yellow-200/20 dark:text-yellow-300",
        "Finalizado": "bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-300",
        "Pausado": "bg-red-100 text-red-800 dark:bg-red-200/20 dark:text-red-300",
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">{proyecto.nombre}</h2>

            <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-muted rounded-md px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
                    📍 Dirección: <span className="font-semibold text-foreground">{proyecto.direccion}</span>
                </div>
                <div className="bg-muted rounded-md px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
                    📅 Fecha de inicio:{" "}
                    <span className="font-semibold text-foreground">
                        {new Date(proyecto.fechaInicio).toLocaleDateString()}
                    </span>
                </div>
                <div className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm ${estadoColors[proyecto.estado]}`}>
                    🔄 Estado: <span className="font-semibold">{proyecto.estado}</span>
                </div>
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

            {/* TAB: GASTOS */}
            {activeTab === "gastos" && (
                <div className="bg-card shadow p-6 rounded-lg text-card-foreground">
                    <FormGasto projectId={id!} />
                    <h3 className="text-lg font-semibold mt-6 mb-2">Gastos Generales</h3>
                    {proyecto.gastos.length === 0 ? (
                        <p className="text-muted-foreground">No hay gastos registrados.</p>
                    ) : (
                        <>
                            <table className="w-full text-sm table-auto">
                                <thead>
                                    <tr className="bg-muted text-left text-muted-foreground">
                                        <th className="p-2">Descripción</th>
                                        <th className="p-2">Monto</th>
                                        <th className="p-2">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proyecto.gastos.map((g, i) => (
                                        <tr key={i} className="border-b border-border">
                                            <td className="p-2">{g.descripcion}</td>
                                            <td className="p-2 text-green-600 dark:text-green-400 font-medium">
                                                {formatCurrency(g.monto)}
                                            </td>
                                            <td className="p-2">{new Date(g.fecha).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 text-right">
                                <div className="inline-block bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-md text-sm font-semibold text-green-800 dark:text-green-300 shadow-sm">
                                    Total: {formatCurrency(totalGastos)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* TAB: NOMINA */}
            {activeTab === "nomina" && (
                <div className="bg-card shadow p-6 rounded-lg text-card-foreground">
                    <FormNomina projectId={id!} />
                    <h3 className="text-lg font-semibold mt-6 mb-2">Nómina</h3>
                    {proyecto.nomina.length === 0 ? (
                        <p className="text-muted-foreground">No hay registros de nómina.</p>
                    ) : (
                        <>
                            <table className="w-full text-sm table-auto">
                                <thead>
                                    <tr className="bg-muted text-left text-muted-foreground">
                                        <th className="p-2">Semana</th>
                                        <th className="p-2">Trabajador</th>
                                        <th className="p-2">Sueldo</th>
                                        <th className="p-2">Pago</th>
                                        <th className="p-2">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proyecto.nomina.map((n, i) => (
                                        <tr key={i} className="border-b border-border">
                                            <td className="p-2">{n.semana}</td>
                                            <td className="p-2">{n.trabajador}</td>
                                            <td className="p-2">{formatCurrency(n.sueldo)}</td>
                                            <td className="p-2">{formatCurrency(n.pago)}</td>
                                            <td className="p-2">{n.observaciones}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 text-right">
                                <div className="inline-block bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-md text-sm font-semibold text-green-800 dark:text-green-300 shadow-sm">
                                    Total: {formatCurrency(totalNomina)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* TAB: MATERIALES */}
            {activeTab === "materiales" && (
                <div className="bg-card shadow p-6 rounded-lg text-card-foreground">
                    <FormMaterial projectId={id!} />
                    <h3 className="text-lg font-semibold mt-6 mb-2">Materiales</h3>
                    {proyecto.materiales.length === 0 ? (
                        <p className="text-muted-foreground">No hay materiales registrados.</p>
                    ) : (
                        <>
                            <table className="w-full text-sm table-auto">
                                <thead>
                                    <tr className="bg-muted text-left text-muted-foreground">
                                        <th className="p-2">Material</th>
                                        <th className="p-2">Cantidad</th>
                                        <th className="p-2">Precio</th>
                                        <th className="p-2">Unidad</th>
                                        <th className="p-2">Detalles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proyecto.materiales.map((m, i) => (
                                        <tr key={i} className="border-b border-border">
                                            <td className="p-2">{m.material}</td>
                                            <td className="p-2">{m.cantidad}</td>
                                            <td className="p-2">{formatCurrency(m.precio)}</td>
                                            <td className="p-2">{m.unidad}</td>
                                            <td className="p-2">{m.detalles}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 text-right">
                                <div className="inline-block bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-md text-sm font-semibold text-green-800 dark:text-green-300 shadow-sm">
                                    Total: {formatCurrency(totalMateriales)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
