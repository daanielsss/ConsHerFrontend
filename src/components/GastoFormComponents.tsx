import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import api from "@/lib/axios";

export function FormGasto({ projectId }: { projectId: string }) {
    const [form, setForm] = useState({ descripcion: "", monto: "", fecha: "" });
    const queryClient = useQueryClient();

    const mutation = useMutation(
        async () => {
            await api.post(`/proyectos/${projectId}/gastos`, form);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["proyecto", projectId]);
                setForm({ descripcion: "", monto: "", fecha: "" });
            },
        }
    );

    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2 text-foreground">Agregar Gasto</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <input
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    type="number"
                    placeholder="Monto"
                    value={form.monto}
                    onChange={(e) => setForm({ ...form, monto: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
            </div>
            <button
                onClick={() => mutation.mutate()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 rounded-md text-sm"
            >
                Guardar Gasto
            </button>
        </div>
    );
}

export function FormNomina({ projectId }: { projectId: string }) {
    const [form, setForm] = useState({
        semana: "",
        trabajador: "",
        sueldo: "",
        pago: "",
        observaciones: "",
    });
    const queryClient = useQueryClient();

    const mutation = useMutation(
        async () => {
            await api.post(`/proyectos/${projectId}/nomina`, form);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["proyecto", projectId]);
                setForm({ semana: "", trabajador: "", sueldo: "", pago: "", observaciones: "" });
            },
        }
    );

    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2 text-foreground">Agregar Nómina</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
                <input
                    placeholder="Semana"
                    value={form.semana}
                    onChange={(e) => setForm({ ...form, semana: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    placeholder="Trabajador"
                    value={form.trabajador}
                    onChange={(e) => setForm({ ...form, trabajador: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    type="number"
                    placeholder="Sueldo"
                    value={form.sueldo}
                    onChange={(e) => setForm({ ...form, sueldo: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    type="number"
                    placeholder="Pago"
                    value={form.pago}
                    onChange={(e) => setForm({ ...form, pago: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    placeholder="Observaciones"
                    value={form.observaciones}
                    onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
            </div>
            <button
                onClick={() => mutation.mutate()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 rounded-md text-sm"
            >
                Guardar Nómina
            </button>
        </div>
    );
}

export function FormMaterial({ projectId }: { projectId: string }) {
    const [form, setForm] = useState({
        material: "",
        cantidad: "",
        precio: "",
        unidad: "",
        detalles: "",
    });
    const queryClient = useQueryClient();

    const mutation = useMutation(
        async () => {
            await api.post(`/proyectos/${projectId}/materiales`, form);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["proyecto", projectId]);
                setForm({ material: "", cantidad: "", precio: "", unidad: "", detalles: "" });
            },
        }
    );

    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2 text-foreground">Agregar Material</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
                <input
                    placeholder="Material"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    type="number"
                    placeholder="Cantidad"
                    value={form.cantidad}
                    onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    placeholder="Unidad"
                    value={form.unidad}
                    onChange={(e) => setForm({ ...form, unidad: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
                <input
                    placeholder="Detalles"
                    value={form.detalles}
                    onChange={(e) => setForm({ ...form, detalles: e.target.value })}
                    className="border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md"
                />
            </div>
            <button
                onClick={() => mutation.mutate()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 rounded-md text-sm"
            >
                Guardar Material
            </button>
        </div>
    );
}
