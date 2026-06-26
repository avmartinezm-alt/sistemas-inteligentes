import {
    IonContent,
    IonPage,
    IonInput,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon
} from "@ionic/react";

import { Geolocation } from "@capacitor/geolocation";
import { useEffect } from "react";

import { useState } from "react";
import "./Planificacionruta.css";

import Header from "../components/Header";

import Mapa from "../components/Mapa";

import { obtenerRuta } from "../services/rutas";

import { buscarLugar } from "../services/codificar_ruta";

const Planificacionruta: React.FC = () => {

    const [ubicacionActual, setubicacionActual] = useState<any>(null);

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

    const [navegando, setNavegando] = useState(false);

    const probarRuta = async () => {
        try {
            console.log("ORIGEN:", origenSeleccionado);
            console.log("DESTINO:", destinoSeleccionado);

            if (!ubicacionActual || !destinoSeleccionado) {
                alert("Esperando a que se obtenga tu ubicacion actual");
                return;
            }

            console.log("Origen encontrado:", origenSeleccionado);
            console.log("Destino encontrado:", destinoSeleccionado);

            //borrar despues
            console.log(destinoSeleccionado.display_name);
            console.log(origenSeleccionado);

            const origenCoord: [number, number] = [
                Number(ubicacionActual.lat),
                Number(ubicacionActual.lon)
            ];

            const destinoCoord: [number, number] = [
                Number(destinoSeleccionado.lat),
                Number(destinoSeleccionado.lon)
            ];

            console.log("ORIGEN GPS:", origenCoord);
            console.log("DESTINO:", destinoCoord);
            console.log(typeof origenCoord);
            console.log(typeof destinoCoord);

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

    const obtenerbicacionActual = async () => {
        try {
            const posicion = await Geolocation.getCurrentPosition();

            setubicacionActual({
                lat: posicion.coords.latitude,
                lon: posicion.coords.longitude
            });
            console.log("Ubicacion obtenida");
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        obtenerbicacionActual();
    }, []);

    return (
        <IonPage>

            <IonContent fullscreen>
                <Header />

                <div className="ruta-container">
                    <h2 >👋Hola, Selecciona una ruta para comenzar</h2>

                    {!navegando && (
                        <div className="contenedor-busqueda">
                            {/*
                            <IonInput
                                className="input-ruta"
                                value={origen}
                                onIonFocus={() => { setMostrarOrigen(true); }}
                                onIonInput={async (e) => {
                                    const valor = e.detail.value ?? "";
                                    setorigen(valor);
                                    if (origenSeleccionado && valor !== origenSeleccionado.display_name) {
                                        setOrigenSeleccionado(null);
                                    }

                                    if (timeoutBusqueda) {
                                        clearTimeout(timeoutBusqueda);
                                    }

                                    const nuevoTimeout = setTimeout(async () => {
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
                            />*/}

                            <IonCard>
                                <IonCardContent class="ion-text-left">
                                    📍Origen
                                </IonCardContent>
                            </IonCard>
                            {/*
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
                            */}
                            
                            <IonCard>
                                <IonCardContent class="ion-text-left">
                                    <IonInput 
                                        className="input-ruta"
                                        value={destino}
                                        onIonFocus={() => { setMostrarDestino(true); }}
                                        onIonInput={async (e) => {
                                            console.log("LIMPIANDO ORIGEN");
                                            const valor = e.detail.value ?? "";
                                            setdestino(valor);
                                            if (destinoSeleccionado && valor !== destinoSeleccionado.display_name) {
                                                setDestinoSeleccionado(null);
                                            }

                                            if (timeoutBusqueda) {
                                                clearTimeout(timeoutBusqueda);
                                            }

                                            const nuevoTimeout = setTimeout(async () => {
                                                await buscarSugerenciasDestino(valor);
                                            }, 500);

                                            setTimeoutBusqueda(nuevoTimeout);
                                        }}

                                        onIonBlur={() => {
                                            setTimeout(() => {
                                                setsugerenciasDestino([]);
                                            }, 200);
                                        }}

                                        placeholder="🔎¿A donde quieres ir?"
                                    />
                                </IonCardContent>
                            </IonCard>



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
                    )}

                    {!navegando && (
                        <IonButton className="boton-ruta" expand="block" onClick={probarRuta} >
                            Buscar ruta
                        </IonButton>
                    )}

                    <div className={navegando ? "mapa-falso mapa-navegacion" : "mapa-falso"}>
                        <Mapa key={rutareal.length} ruta={rutareal} navegando={navegando} />
                    </div>

                    {navegando && (
                        <div className="panel-navegacion">
                            <h3>🚴 Navegación activa</h3>
                            <p>
                                ↔ Distancia: {(distancia / 1000).toFixed(2)} km
                            </p>

                            <p>
                                ⏱️ Tiempo estimado: {(duracion / 60).toFixed(0)} min
                            </p>

                            <IonButton
                                expand="block"
                                color="danger"
                                onClick={() => {
                                    setNavegando(false);
                                    setrutareal([]);
                                    setdistancia(0);
                                    setduracion(0);
                                }
                                }
                            >
                                Finalizar recorrido
                            </IonButton>

                        </div>

                    )}

                    {distancia > 0 && !navegando && (
                        <IonButton expand="block" color="light" onClick={() => setNavegando(true)}>
                            Iniciar recorrido
                        </IonButton>
                    )}

                </div>

            </IonContent>
        </IonPage >
    );
};

export default Planificacionruta;