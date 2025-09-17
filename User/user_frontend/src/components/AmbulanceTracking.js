import React from "react";
import { ambulanceAPI } from "../services/api";
import io from "socket.io-client";

// Lazy import Leaflet to avoid SSR issues
const MapContainer = React.lazy(() => import("react-leaflet").then(m => ({ default: m.MapContainer })));
const TileLayer = React.lazy(() => import("react-leaflet").then(m => ({ default: m.TileLayer })));
const Marker = React.lazy(() => import("react-leaflet").then(m => ({ default: m.Marker })));
const Popup = React.lazy(() => import("react-leaflet").then(m => ({ default: m.Popup })));

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function AmbulanceTracking({ bookingId, ambulanceId: initialAmbulanceId }) {
  const [coords, setCoords] = React.useState([20.5937, 78.9629]); // India center as default
  const [ambulanceId, setAmbulanceId] = React.useState(initialAmbulanceId || null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let socket;
    async function init() {
      try {
        // Fetch initial location by booking
        if (!ambulanceId && bookingId) {
          const res = await ambulanceAPI.getLocationByBooking(bookingId);
          setAmbulanceId(res.data.ambulanceId);
          const loc = res.data.currentLocation?.coordinates;
          if (Array.isArray(loc) && loc.length === 2) setCoords([loc[1], loc[0]]);
        }

        const targetAmbulance = ambulanceId;
        if (!targetAmbulance) return;

        socket = io(SOCKET_URL, { transports: ["websocket"], reconnection: true });
        socket.emit("subscribe:ambulance", { ambulanceId: targetAmbulance });
        socket.on("ambulance:location", payload => {
          if (payload.ambulanceId !== targetAmbulance) return;
          const c = payload.coords;
          if (Array.isArray(c) && c.length === 2) setCoords([c[1], c[0]]);
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Tracking init error", e);
      } finally {
        setReady(true);
      }
    }
    init();
    return () => {
      try {
        if (socket && ambulanceId) {
          socket.emit("unsubscribe:ambulance", { ambulanceId });
          socket.disconnect();
        }
      } catch (_) {}
    };
  }, [bookingId, ambulanceId]);

  return (
    <div style={{ height: 400, width: "100%", marginTop: 12 }}>
      <React.Suspense fallback={<div>Loading map…</div>}>
        {ready && (
          <MapContainer center={coords} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <Marker position={coords}>
              <Popup>
                Ambulance {ambulanceId || ""}
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </React.Suspense>
    </div>
  );
}


