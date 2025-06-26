import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
    position: [number, number] | null;
    onChange: (coords: [number, number]) => void;
};

function ClickHandler({ onChange }: { onChange: (coords: [number, number]) => void }) {
    useMapEvents({
        click(e: L.LeafletMouseEvent) {
            onChange([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function MapSelector({ position, onChange }: Props) {
    const defaultCenter = position ?? ([22.7709, -102.5832] as [number, number]);

    return (
        <div className="h-64 w-full rounded overflow-hidden">
            <MapContainer
                center={defaultCenter}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full z-10 rounded-md"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <ClickHandler onChange={onChange} />
                {position && <Marker position={position} />}
            </MapContainer>
        </div>
    );
}
