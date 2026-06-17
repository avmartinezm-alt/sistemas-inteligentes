const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.get("/buscar", async (req, res) => {

    try {

        const texto = req.query.q;

        const respuesta = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    format: "json",
                    q: `${texto}, Lima, Perú`,
                    countrycodes: "pe",
                    limit: 5
                },
                headers: {
                    "User-Agent": "RutasCiclistas/1.0"
                }
            }
        );

        res.json(respuesta.data);

    } catch (error) {

        if (error.response) {
            console.log("STATUS:", error.response.status);
            console.log("DATA:", error.response.data);
        } else {
            console.log(error.message);
        }

        res.status(500).json({
            error: error.message
        });
    }

});

app.listen(3000, () => {
    console.log("Server iniciado");
});