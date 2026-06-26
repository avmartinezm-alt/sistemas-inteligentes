export const buscarLugar = async (texto: string) => {

    const respuesta = await fetch(
        `https://sistemas-inteligentes-gules.vercel.app/buscar?q=${encodeURIComponent(texto)}`
    );

    return await respuesta.json();
};