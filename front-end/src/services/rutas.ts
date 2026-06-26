const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijc0OGIwNmJkZTc3NjQwMzc5MWNkZWI1YWY2NTY3YzIwIiwiaCI6Im11cm11cjY0In0=";

export const obtenerRuta = async(
    origen: [number, number],
    destino: [number, number]
    
) => {
    console.log("Origen:", origen);
    console.log("Destino:", destino);
    
    const respuesta = await fetch(
        "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson",
        {
            method: "POST",
            headers: {
                Authorization: API_KEY,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                coordinates: [
                    [origen[1], origen[0]],
                    [destino[1], destino[0]]
                ]
            })
        }
    );
    return await respuesta.json();
}