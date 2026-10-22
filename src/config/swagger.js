const swaggerJsdoc = require("swagger-jsdoc");

// Campos de un videojuego, reutilizados en varios esquemas
const propiedadesJuego = {
    steamAppId: { type: "integer", example: 1245620 },
    name: { type: "string", example: "ELDEN RING" },
    shortDescription: { type: "string", example: "RPG de acción en un mundo abierto de fantasía." },
    genres: { type: "array", items: { type: "string" }, example: ["RPG", "Action"] },
    developers: { type: "array", items: { type: "string" }, example: ["FromSoftware"] },
    publishers: { type: "array", items: { type: "string" }, example: ["Bandai Namco Entertainment"] },
    releaseDate: { type: "string", format: "date-time", example: "2022-02-25T00:00:00.000Z" },
    headerImage: { type: "string", example: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg" },
    isFree: { type: "boolean", example: false }
};

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GamePulse API",
            version: "1.0.0",
            description: "API REST de videojuegos con datos de Steam"
        },
        servers: [{ url: "/", description: "Servidor actual" }],
        components: {
            securitySchemes: {
                bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
            },
            schemas: {
                Game: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "665f1c2e9b1e8a0012a3b4c5" },
                        ...propiedadesJuego
                    }
                },
                GameInput: {
                    type: "object",
                    required: ["steamAppId", "name"],
                    properties: propiedadesJuego
                },
                GameUpdate: {
                    type: "object",
                    properties: propiedadesJuego
                },
                Error: {
                    type: "object",
                    properties: { error: { type: "string", example: "Videojuego no encontrado" } }
                }
            }
        }
    },
    apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);