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

const Planificacionruta: React.FC = () => {

    const [origen, setorigen] = useState("");
    const [destino, setdestino] = useState("");

    interface Ruta {
        nombre: string;
        seguridad: number;
        tiempo: number;
        distancia: number;
        coordenadas: [number, number][];
    }

    const [rutas, setrutas] = useState<Ruta[]>([
        {
            nombre: "Ruta segura",
            seguridad: 90,
            tiempo: 18,
            distancia: 3.5,
            coordenadas: [
                [-11.94, -77.05],
                [-11.93, -77.04],
                [-11.92, -77.03]
            ]
        },

        {
            nombre: "Ruta B (Más segura)",
            seguridad: 90,
            tiempo: 18,
            distancia: 3.5,
            coordenadas: [
                [-11.94, -77.05],
                [-11.95, -77.04],
                [-11.96, -77.03]
            ]
        },

        {
            nombre: "Ruta equilibrada",
            seguridad: 95,
            tiempo: 25,
            distancia: 4.2,
            coordenadas: [
                [-11.94, -77.05],
                [-11.94, -77.04],
                [-11.93, -77.03]
            ]
        }

    ]);

    const [rutaseleccionada, setrutaseleccionada] = useState<number | null>(null);

    return (
        <IonPage>

            <IonContent fullscreen>
                <Header />

                <div className="ruta-container">

                    <h2>Planificación de Ruta</h2>

                    <IonInput
                        className="input-ruta"
                        value={origen}
                        onIonInput={(e) => setorigen(e.detail.value ?? "")}
                        placeholder="Origen"
                    />

                    <IonInput
                        className="input-ruta"
                        value={destino}
                        onIonInput={(e) => setdestino(e.detail.value ?? "")}
                        placeholder="Destino"
                    />

                    <IonButton className="boton-ruta" expand="block">Buscar ruta</IonButton>

                    <div className="mapa-falso">
                        <Mapa ruta={rutaseleccionada !== null ? rutas[rutaseleccionada].coordenadas: undefined}/>
                    </div>

                    {rutas.map((ruta, index) => (
                        <IonCard className={rutaseleccionada === index ? "ruta-activa":""} key={index} onClick={() => setrutaseleccionada(index)}>
                            <IonCardHeader>
                                <IonCardTitle>
                                    {ruta.nombre}
                                </IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent>
                                Seguridad: {ruta.seguridad}%
                                <br/>
                                Tiempo: {ruta.tiempo} min
                                <br/>
                                Distanci: {ruta.distancia} km
                            </IonCardContent>

                        </IonCard>
                        
                    ))}

                </div>

            </IonContent>
        </IonPage>
    );
};

export default Planificacionruta;