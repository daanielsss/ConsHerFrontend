type Paso = {
    titulo: string;
    descripcion: string;
    imagen: string;
};

const pasos: Paso[] = [
    {
        titulo: "Zapatas",
        descripcion: "Base sólida que distribuye el peso de la estructura.",
        imagen: "/images/zapatas.jpg",
    },
    {
        titulo: "Cimentación",
        descripcion: "Elemento estructural que une la base con la construcción.",
        imagen: "/images/cimentacion.jpg",
    },
    {
        titulo: "Colado",
        descripcion: "Proceso de vaciado de concreto para formar elementos estructurales.",
        imagen: "/images/colado.jpg",
    },
    {
        titulo: "Muros y estructura",
        descripcion: "Levantamiento de paredes y soportes estructurales.",
        imagen: "/images/estructura.jpg",
    },
];

export default function ProcesoConstructivo() {
    return (
        <section className="px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Nuestro Proceso Constructivo</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {pasos.map((paso) => (
                    <div key={paso.titulo} className="rounded-xl overflow-hidden shadow-md bg-card text-card-foreground">
                        <img src={paso.imagen} alt={paso.titulo} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">{paso.titulo}</h3>
                            <p className="text-sm text-muted-foreground">{paso.descripcion}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
