import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function ClickHandler({ onChange }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ value, onChange }) {
  return (
    <MapContainer
      center={value ? [value.lat, value.lng] : [0.3476, 32.5825]}
      zoom={12}
      style={{ height: 200, width: "100%", borderRadius: 10, zIndex: 1 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onChange={onChange} />
      {value && <Marker position={[value.lat, value.lng]} />}
    </MapContainer>
  );
}
