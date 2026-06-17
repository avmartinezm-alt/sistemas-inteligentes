import {
    IonContent,
    IonPage,
    IonInput,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton
} from "@ionic/react";

import { useState } from "react";
import "./Planificacionruta.css";

import Header from "../components/Header";

import Mapa from "../components/Mapa";

import { obtenerRuta } from "../services/rutas";

import { buscarLugar } from "../services/codificar_ruta";
import { time } from "ionicons/icons";

const Planificacionruta: React.FC = () => {

    const [origen, setorigen] = useState("");
    const [destino, setdestino] = useState("");

    const [rutareal, setrutareal] = useState<[number, number][]>([]);

    const [distancia, setdistancia] = useState(0);
    const [duracion, setduracion] = useState(0);

    const [sugerenciasOrigen, setsugerenciasOrigen] = useState<any[]>([]);
    const [sugerenciasDestino, setsugerenciasDestino] = useState<any[]>([]);

    const [origenSeleccionado, setOrigenSeleccionado] = useState<any>(null);
    const [destinoSeleccionado, setDestinoSeleccionado] = useState<any>(null);

    const [mostrarOrigen, setMostrarOrigen] = useState(false);
    const [mostrarDestino, setMostrarDestino] = useState(false);

    const [timeoutBusqueda, setTimeoutBusqueda] = useState<ReturnType<typeof setTimeout> | null>(null);

    const probarRuta = async () => {
        try {
            console.log("ORIGEN:", origenSeleccionado);
            console.log("DESTINO:", destinoSeleccionado);

            if (!origenSeleccionado || !destinoSeleccionado) {
                alert("Seleccione origen y destino");
                return;
            }

            console.log("Origen encontrado:", origenSeleccionado);
            console.log("Destino encontrado:", destinoSeleccionado);

            //borrar despues
            console.log(destinoSeleccionado.display_name);
            console.log(origenSeleccionado);

            const origenCoord: [number, number] = [
                Number(origenSeleccionado.lat),
                Number(origenSeleccionado.lon)
            ];

            const destinoCoord: [number, number] = [
                Number(destinoSeleccionado.lat),
                Number(destinoSeleccionado.lon)
            ];

            const datosruta = await obtenerRuta(
                origenCoord, destinoCoord

            );

            //borrar despues
            console.log(datosruta.features);

            console.log("ORIGEN:", origenSeleccionado);
            console.log("DESTINO:", destinoSeleccionado);
            console.log("Texto origen:", origen);
            console.log("Texto destino:", destino);

            //borrar despues
            if (
                !datosruta.features ||
                datosruta.features.length === 0
            ) {
                console.log("Respuesta inválida:", datosruta);
                return;
            }

            const coordenadas = datosruta.features[0].geometry.coordinates.map(
                (coord: number[]) => [coord[1], coord[0]]
            ) as [number, number][];

            const resumen = datosruta.features[0].properties.summary;

            setdistancia(resumen.distance);
            setduracion(resumen.duration);
            setrutareal(coordenadas);

        } catch (e) {
            console.error(e);
        }
    };

    const buscarSugerencias = async (texto: string) => {
        if (texto.length < 5) {
            setsugerenciasOrigen([]);
            return;
        }

        const datos = await buscarLugar(texto);
        console.log(datos);
        setsugerenciasOrigen(datos);
    };

    const buscarSugerenciasDestino = async (texto: string) => {
        if (texto.length < 5) {
            setsugerenciasDestino([]);
            return;
        }

        const datos = await buscarLugar(texto);
        setsugerenciasDestino(datos);
    };

    return (
        <IonPage>

            <IonContent fullscreen>
                <Header />

                <div className="ruta-container">
                    <h2>Planificación de Ruta</h2>

                    <div className="contenedor-busqueda">

                        <IonInput
                            className="input-ruta"
                            value={origen}
                            onIonFocus={() => {setMostrarOrigen(true); }}
                            onIonInput={async (e) => {
                                const valor = e.detail.value ?? "";
                                setorigen(valor);
                                if (origenSeleccionado && valor !== origenSeleccionado.display_name){
                                    setOrigenSeleccionado(null);
                                }

                                if(timeoutBusqueda){
                                    clearTimeout(timeoutBusqueda);
                                }

                                const nuevoTimeout = setTimeout(async() => {
                                    await buscarSugerencias(valor);
                                }, 500);

                                setTimeoutBusqueda(nuevoTimeout);
                            }}

                            onIonBlur={() => {
                                setTimeout(() => {
                                    setsugerenciasOrigen([]);
                                }, 200);
                            }}

                            placeholder="Origen"
                        />

                        {mostrarOrigen && sugerenciasOrigen.length > 0 && (
                            <div className="lista-sugerencias">
                                {sugerenciasOrigen.map((lugar, index) => (
                                    <div
                                        key={index}
                                        className="sugerencia"
                                        onMouseDown={() => {
                                            console.log("SELECCIONANDO ORIGEN");
                                            console.log("Origen seleccionado:", lugar);
                                            setorigen(lugar.display_name);
                                            setOrigenSeleccionado(lugar);
                                            setsugerenciasOrigen([]);
                                            setMostrarOrigen(false);
                                        }}
                                    >
                                        • {lugar.display_name}
                                    </div>
                                ))}
                            </div>
                        )}

                        <IonInput
                            className="input-ruta"
                            value={destino}
                            onIonFocus={() => {setMostrarDestino(true); }}
                            onIonInput={async (e) => {
                                console.log("LIMPIANDO ORIGEN");
                                const valor = e.detail.value ?? "";
                                setdestino(valor);
                                if (destinoSeleccionado && valor !== destinoSeleccionado.display_name){
                                    setDestinoSeleccionado(null);
                                }

                                if (timeoutBusqueda){
                                    clearTimeout(timeoutBusqueda);
                                }
                                
                                const nuevoTimeout = setTimeout(async() => {
                                    await buscarSugerenciasDestino(valor);
                                }, 500);

                                setTimeoutBusqueda(nuevoTimeout);
                            }}

                            onIonBlur={() => {
                                setTimeout(() => {
                                    setsugerenciasDestino([]);
                                }, 200);
                            }}

                            placeholder="Destino"
                        />

                        {mostrarDestino && sugerenciasDestino.length > 0 && (
                            <div className="lista-sugerencias">
                                {sugerenciasDestino.map((lugar, index) => (
                                    <div
                                        key={index}
                                        className="sugerencia"
                                        onMouseDown={() => {
                                            console.log("Destino seleccionado:", lugar);
                                            setdestino(lugar.display_name);
                                            setDestinoSeleccionado(lugar);
                                            setsugerenciasDestino([]);
                                            setMostrarDestino(false);
                                        }}
                                    >
                                        • {lugar.display_name}
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                    <IonButton className="boton-ruta" expand="block" onClick={probarRuta} >Buscar ruta</IonButton>

                    <div className="mapa-falso">
                        <Mapa key={rutareal.length} ruta={rutareal} />
                    </div>

                    {distancia > 0 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    Ruta encontrada
                                </IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent>
                                Distancia: {(distancia / 1000).toFixed(2)} km
                                <br />
                                Tiempo estimado: {(duracion / 60).toFixed(0)} min
                                <br />
                            </IonCardContent>
                        </IonCard>
                    )}

                </div>

            </IonContent>
        </IonPage>
    );
};

export default Planificacionruta;