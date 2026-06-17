import "./Mapa.css";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { Geolocation } from "@capacitor/geolocation";

import { Polyline } from "react-leaflet";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import React, { useEffect, useState } from "react";

import Ajustarmapa from "./Ajustarmapa";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface MapaProps {
    ruta?: [number, number][];
}

const Mapa: React.FC<MapaProps> = ({ ruta }) => {

    const iconoOrigen = L.icon({
        iconUrl: "/src/assets/ciclista_icono 512x512.png",
        iconSize: [40, 40]
    });

    

    const [posicion, setposicion] = useState<[number, number] | null>(null);

    const obtenerubicacion = async () => {
        try {
            const coordenadas = await Geolocation.getCurrentPosition();

            const latitud = coordenadas.coords.latitude;
            const longitud = coordenadas.coords.longitude;

            setposicion([latitud, longitud]);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        obtenerubicacion();
    }, []);

    if (!posicion) {
        return <p>Obteniendo posicion...</p>
    }

    return (
        <MapContainer
            center={posicion}
            zoom={15}
            className="mapa"
        >
            <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={posicion}>
                <Popup>
                    Tu ubicación
                </Popup>
            </Marker>

            {ruta && ruta.length > 0 && (
            <>
                <Ajustarmapa ruta = {ruta}/>

                <Marker position={ruta[0]}>
                    <Popup>Origen</Popup>
                </Marker>

                <Marker position={ruta[ruta.length - 1]}>
                    <Popup>Destino</Popup>
                </Marker>

                <Polyline
                    positions={ruta}
                    pathOptions={{ color: "orange", weight: 4 }}
                />
            </>)}

        </MapContainer>
    );
};

export default Mapa;