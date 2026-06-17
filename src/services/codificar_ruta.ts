export const buscarLugar = async (texto: string) => {

    const respuesta = await fetch(
        `http://localhost:3000/buscar?q=${encodeURIComponent(texto)}`
    );

    return await respuesta.json();
};