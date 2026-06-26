import "./Mapa.css";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { location, flag, bicycle } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

import { Geolocation } from "@capacitor/geolocation";

import { Polyline, useMap } from "react-leaflet";

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
    navegando?: boolean;
}

const Mapa: React.FC<MapaProps> = ({ ruta, navegando }) => {

    const iconoOrigen = L.icon({
        iconUrl: "/src/assets/ciclista_icono 512x512.png",
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const iconoDestino = L.icon({
        iconUrl: "/src/assets/iconodestino 512x512.png",
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const [posicion, setposicion] = useState<[number, number] | null>(null);

    const obtenerubicacion = async () => {
        try {
            const coordenadas = await Geolocation.getCurrentPosition();

            setposicion([
                coordenadas.coords.latitude,
                coordenadas.coords.longitude
            ]);
        } catch (error) {
            console.log(error);
        }
    };

    const iniciarseguimiento = async () => {
        try {
            await Geolocation.watchPosition(
                {
                    enableHighAccuracy: true
                },
                (posicion) => {
                    if (!posicion) return;

                    setposicion([
                        posicion.coords.latitude,
                        posicion.coords.longitude
                    ]);
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const SeguirMapa = ({ posicion }: { posicion: [number, number] }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(posicion, 25, { animate: true });
        }, [posicion]);

        return null;
    }

    useEffect(() => {
        obtenerubicacion();
        iniciarseguimiento();
    }, []);

    if (!posicion) {
        return <p>Obteniendo posicion...</p>
    }

    return (
        <MapContainer
            center={posicion}
            zoom={1}
            className="mapa"
        > <SeguirMapa posicion={posicion} />
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
                    {!navegando && (<Ajustarmapa ruta={ruta} />)}

                    <Marker position={ruta[0]} icon={iconoOrigen}>
                        <Popup>Origen</Popup>
                    </Marker>

                    <Marker position={ruta[ruta.length - 1]} icon={iconoDestino}>
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