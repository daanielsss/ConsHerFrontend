import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
    position: [number, number] | null;
    onChange: (coords: [number, number]) => void;
    popupLabel?: string; // ✅ nuevo prop opcional
};

// Icono personalizado con una casita (emoji) usando divIcon
const customIcon = L.divIcon({
    html: "🏠",
    className: "text-2xl", // Puedes ajustar el tamaño con Tailwind si usas postcss
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

function ClickHandler({ onChange }: { onChange: (coords: [number, number]) => void }) {
    useMapEvents({
        click(e: L.LeafletMouseEvent) {
            onChange([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function MapSelector({ position, onChange, popupLabel }: Props) {
    const defaultCenter: [number, number] = position ?? [22.7709, -102.5832]; // Zacatecas por defecto

    return (
        <div className="h-64 sm:h-72 md:h-80 w-full rounded overflow-hidden z-10">
            <MapContainer
                center={defaultCenter}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full rounded-md"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <ClickHandler onChange={onChange} />

                {position && (
                    <Marker position={position} icon={customIcon}>
                        {popupLabel && <Popup>{popupLabel}</Popup>}
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
