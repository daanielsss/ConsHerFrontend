import { useState } from "react";
import { Calculator, X, Printer } from "lucide-react"; // 1. Importar el icono Printer

const MATERIAL_DATA = [
    { name: "Ladrillos", unidad: "pieza", baseCantidad: 14500, precio: 0 },
    { name: "Bloques (Colado)", unidad: "pieza", baseCantidad: 1200, precio: 0 },
    { name: "Cemento (bulto 50kg)", unidad: "bulto", baseCantidad: 200, precio: 0 },
    { name: "Varilla 3/4”", unidad: "pieza", baseCantidad: 12, precio: 0 },
    { name: "Varilla 1/2”", unidad: "pieza", baseCantidad: 10, precio: 0 },
    { name: "Varilla 3/8”", unidad: "pieza", baseCantidad: 80, precio: 0 },
    { name: "Armex 3/8”", unidad: "pieza", baseCantidad: 120, precio: 0 },
    { name: "Yeso (bulto 40kg)", unidad: "bulto", baseCantidad: 263, precio: 0 },
    { name: "Colado (m³)", unidad: "m³", baseCantidad: 25, precio: 0 },
    { name: "Grava (m²)", unidad: "m²", baseCantidad: 12, precio: 0 },
    { name: "Arena (m²)", unidad: "m²", baseCantidad: 54, precio: 0 },
    { name: "Pintura Interior", unidad: "cubeta", baseCantidad: 3, precio: 0 },
    { name: "Pintura Exterior", unidad: "cubeta", baseCantidad: 1.25, precio: 0 },
];

export default function AdminCalculator() {
    const [metrosConstruccion, setMetrosConstruccion] = useState<string>("");
    const [materiales, setMateriales] = useState(MATERIAL_DATA);
    const [showCalc, setShowCalc] = useState(false);
    const [calcValue, setCalcValue] = useState("");

    const handlePrecioChange = (index: number, value: number) => {
        const copia = [...materiales];
        copia[index].precio = value;
        setMateriales(copia);
    };

    const calcularCantidad = (base: number) => {
        const metros = parseFloat(metrosConstruccion);
        if (isNaN(metros) || metros <= 0) return 0;
        return (metros * base) / 190;
    };

    const totalPorMaterial = (cantidad: number, precio: number) =>
        cantidad * precio;

    const totalGlobal = materiales.reduce((acc, mat) => {
        const cantidad = calcularCantidad(mat.baseCantidad);
        return acc + cantidad * (mat.precio || 0);
    }, 0);

    // 3. Función para generar y descargar la cotización
    const handleImprimirCotizacion = () => {
        // Filtrar solo los materiales que tienen un precio ingresado
        const materialesCotizados = materiales.filter(mat => mat.precio > 0);

        if (materialesCotizados.length === 0) {
            alert("Por favor, ingrese el precio de al menos un material para generar la cotización.");
            return;
        }

        // Formatear los números a dos decimales
        const formatCurrency = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Construir el contenido del archivo de texto
        let contenido = `*** COTIZACIÓN DE MATERIALES ***\n`;
        contenido += `Fecha: ${new Date().toLocaleString()}\n`;
        contenido += `Metros de Construcción: ${metrosConstruccion} m²\n`;
        contenido += `------------------------------------\n\n`;

        materialesCotizados.forEach(mat => {
            const cantidad = calcularCantidad(mat.baseCantidad);
            const total = totalPorMaterial(cantidad, mat.precio);
            contenido += `${mat.name}:\n`;
            contenido += `  - Cantidad: ${cantidad.toFixed(2)} ${mat.unidad}\n`;
            contenido += `  - Precio Unitario: $${formatCurrency(mat.precio)}\n`;
            contenido += `  - Subtotal: $${formatCurrency(total)}\n\n`;
        });

        contenido += `------------------------------------\n`;
        contenido += `TOTAL ESTIMADO: $${formatCurrency(totalGlobal)}\n`;

        // Crear y descargar el archivo
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cotizacion.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    const handleCalcInput = (val: string) => {
        if (val === "C") return setCalcValue("");
        if (val === "=") {
            try {
                const resultado = eval(calcValue);
                setCalcValue(resultado.toString());
            } catch {
                setCalcValue("Error");
            }
        } else {
            setCalcValue((prev) => prev + val);
        }
    };

    const isCotizacionDisabled = totalGlobal === 0 || !metrosConstruccion;

    return (
        <div className="space-y-6 px-4 pt-4 pb-10 max-w-6xl mx-auto">
            <div className="bg-card rounded-xl shadow-md p-4 sm:p-6">

                {/* 2. Encabezado con título y nuevo botón */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                        Calculadora de Materiales
                    </h2>
                    <button
                        onClick={handleImprimirCotizacion}
                        disabled={isCotizacionDisabled}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Printer size={16} />
                        Imprimir Cotización
                    </button>
                </div>

                {/* Campo de metros cuadrados + total estimado */}
                <div className="grid sm:grid-cols-2 gap-4 items-end mb-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Metros cuadrados de construcción
                        </label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={metrosConstruccion}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value;
                                if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                                    setMetrosConstruccion(value);
                                }
                            }}
                            className="w-full border border-border rounded-md bg-background text-foreground px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="text-left sm:text-right text-lg font-bold text-foreground">
                        Total estimado: ${totalGlobal.toLocaleString("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </div>
                </div>

                {/* Materiales */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {materiales.map((mat, idx) => {
                        const cantidad = calcularCantidad(mat.baseCantidad);
                        return (
                            <div
                                key={mat.name}
                                className="border border-border rounded-lg p-3 bg-muted text-muted-foreground text-xs sm:text-sm"
                            >
                                <h4 className="font-semibold text-foreground mb-1">{mat.name}</h4>
                                <p className="mb-1">
                                    Cantidad estimada: <strong>{cantidad.toFixed(2)} {mat.unidad}</strong>
                                </p>
                                <label className="block mb-0.5 text-[0.7rem] sm:text-xs">
                                    Precio por {mat.unidad}:
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-border bg-background text-foreground rounded-md px-2 py-1 mb-2 text-xs sm:text-sm"
                                    onChange={(e) => handlePrecioChange(idx, parseFloat(e.target.value) || 0)}
                                />
                                <p className="text-xs sm:text-sm">
                                    Total: <strong>${totalPorMaterial(cantidad, mat.precio).toLocaleString("en-US", {
                                        style: "decimal",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}</strong>
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Botón flotante para calculadora tradicional */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition"
                    onClick={() => setShowCalc(!showCalc)}
                >
                    {showCalc ? <X /> : <Calculator />}
                </button>
            </div>

            {/* Calculadora tradicional flotante */}
            {showCalc && (
                <div className="fixed bottom-20 right-6 w-64 bg-card border border-border shadow-xl rounded-xl p-4 z-50">
                    <h3 className="font-semibold mb-2 text-foreground">Calculadora</h3>
                    <input
                        className="w-full border border-border rounded mb-3 px-2 py-1 text-right bg-background text-foreground"
                        value={calcValue}
                        readOnly
                    />
                    <div className="grid grid-cols-4 gap-2">
                        {["7", "8", "9", "/",
                            "4", "5", "6", "*",
                            "1", "2", "3", "-",
                            "0", ".", "=", "+"].map((btn) => (
                                <button
                                    key={btn}
                                    onClick={() => handleCalcInput(btn)}
                                    className="bg-accent text-accent-foreground hover:bg-primary hover:text-white rounded px-2 py-2 text-center text-sm font-bold"
                                >
                                    {btn}
                                </button>
                            ))}
                        <button
                            onClick={() => handleCalcInput("C")}
                            className="col-span-4 bg-destructive text-destructive-foreground py-2 rounded font-bold"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}