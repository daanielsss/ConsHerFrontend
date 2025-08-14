// src/components/GastoFormComponents.tsx

import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import api from "@/lib/axios";

// Estilo reutilizable para todos los inputs
const inputStyle = "border border-border bg-background text-foreground px-3 py-2 text-sm rounded-md";

// Funciones para manejar el formato de números
const formatNumber = (value: string | number) => {
    if (!value) return "";
    return new Intl.NumberFormat('en-US').format(Number(String(value).replace(/,/g, '')));
};

const unformatNumber = (value: string) => {
    return value.replace(/,/g, '');
};

export function FormGasto({ projectId }: { projectId: string }) {
    const [form, setForm] = useState({ descripcion: "", monto: "", fecha: "" });
    const queryClient = useQueryClient();

    const mutation = useMutation(
        async () => {
            await api.post(`/proyectos/${projectId}/gastos`, { ...form, monto: unformatNumber(form.monto) });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["proyecto", projectId]);
                setForm({ descripcion: "", monto: "", fecha: "" });
            },
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "monto") {
            setForm({ ...form, monto: formatNumber(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2 text-foreground">Agregar Gasto</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <input
                    name="descripcion"
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={handleChange}
                    className={inputStyle}
                />
                <input
                    type="text"
                    name="monto"
                    placeholder="Monto"
                    value={form.monto}
                    onChange={handleChange}
                    className={inputStyle}
                />
                <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    className={inputStyle}
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
        semana: "", trabajador: "", sueldo: "", pago: "", observaciones: "",
    });
    const queryClient = useQueryClient();

    const mutation = useMutation(
        async () => {
            await api.post(`/proyectos/${projectId}/nomina`, {
                ...form,
                sueldo: unformatNumber(form.sueldo),
                pago: unformatNumber(form.pago)
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["proyecto", projectId]);
                setForm({ semana: "", trabajador: "", sueldo: "", pago: "", observaciones: "" });
            },
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "sueldo" || name === "pago") {
            setForm({ ...form, [name]: formatNumber(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2 text-foreground">Agregar Nómina</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
                <input name="semana" placeholder="Semana" value={form.semana} onChange={handleChange} className={inputStyle} />
                <input name="trabajador" placeholder="Trabajador" value={form.trabajador} onChange={handleChange} className={inputStyle} />
                <input type="text" name="sueldo" placeholder="Sueldo" value={form.sueldo} onChange={handleChange} className={inputStyle} />
                <input type="text" name="pago" placeholder="Pago" value={form.pago} onChange={handleChange} className={inputStyle} />
                <input name="observaciones" placeholder="Observaciones" value={form.observaciones} onChange={handleChange} className={inputStyle} />
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
        material: "", cantidad: "", precio: "", unidad: "", detalles: "",
    });
    const queryClient = useQueryClient();

    const mutation = useMutation(
        async () => {
            await api.post(`/proyectos/${projectId}/materiales`, {
                ...form,
                cantidad: unformatNumber(form.cantidad),
                precio: unformatNumber(form.precio)
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["proyecto", projectId]);
                setForm({ material: "", cantidad: "", precio: "", unidad: "", detalles: "" });
            },
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "cantidad" || name === "precio") {
            setForm({ ...form, [name]: formatNumber(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    return (
        <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2 text-foreground">Agregar Material</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
                <input name="material" placeholder="Material" value={form.material} onChange={handleChange} className={inputStyle} />
                <input type="text" name="cantidad" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} className={inputStyle} />
                <input type="text" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} className={inputStyle} />
                <input name="unidad" placeholder="Unidad" value={form.unidad} onChange={handleChange} className={inputStyle} />
                <input name="detalles" placeholder="Detalles" value={form.detalles} onChange={handleChange} className={inputStyle} />
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