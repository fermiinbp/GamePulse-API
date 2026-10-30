const path = require("path");
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
                GamePage: {
                    type: "object",
                    properties: {
                        data: { type: "array", items: { $ref: "#/components/schemas/Game" } },
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        total: { type: "integer", example: 8 },
                        totalPages: { type: "integer", example: 1 }
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
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "665f1c2e9b1e8a0012a3b4c6" },
                        username: { type: "string", example: "fermin" },
                        email: { type: "string", example: "fermin@example.com" },
                        role: { type: "string", enum: ["USER", "ADMIN", "ANALYST"], example: "USER" }
                    }
                },
                RegistroInput: {
                    type: "object",
                    required: ["username", "email", "password"],
                    properties: {
                        username: { type: "string", minLength: 3, maxLength: 30, example: "fermin" },
                        email: { type: "string", format: "email", example: "fermin@example.com" },
                        password: { type: "string", minLength: 6, maxLength: 20, example: "secreto123" }
                    }
                },
                LoginInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "fermin@example.com" },
                        password: { type: "string", example: "secreto123" }
                    }
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        usuario: { $ref: "#/components/schemas/User" },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
                    }
                },
                Review: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "665f1c2e9b1e8a0012a3b4c7" },
                        userId: { type: "string", example: "665f1c2e9b1e8a0012a3b4c6" },
                        username: { type: "string", example: "fermin" },
                        gameId: { type: "string", example: "665f1c2e9b1e8a0012a3b4c5" },
                        rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
                        comment: { type: "string", example: "Muy buen juego" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                ReviewInput: {
                    type: "object",
                    required: ["gameId", "rating"],
                    properties: {
                        gameId: { type: "string", example: "665f1c2e9b1e8a0012a3b4c5" },
                        rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
                        comment: { type: "string", maxLength: 500, example: "Muy buen juego" }
                    }
                },
                ReviewUpdate: {
                    type: "object",
                    properties: {
                        rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                        comment: { type: "string", maxLength: 500, example: "Mejor de lo que pensaba" }
                    }
                },
                ReviewStats: {
                    type: "object",
                    properties: {
                        positivas: { type: "integer", example: 12 },
                        negativas: { type: "integer", example: 3 }
                    }
                },
                GameStat: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "665f1c2e9b1e8a0012a3b4c8" },
                        gameId: { type: "string", example: "665f1c2e9b1e8a0012a3b4c5" },
                        recordedAt: { type: "string", format: "date-time" },
                        currentPlayers: { type: "integer", example: 54321 },
                        price: { type: "number", nullable: true, example: 59.99 },
                        discountPercent: { type: "integer", example: 0 },
                        currency: { type: "string", example: "EUR" }
                    }
                },
                Trending: {
                    type: "object",
                    properties: {
                        juego: {
                            type: "object",
                            properties: {
                                id: { type: "string", example: "665f1c2e9b1e8a0012a3b4c5" },
                                name: { type: "string", example: "ELDEN RING" },
                                headerImage: { type: "string" }
                            }
                        },
                        currentPlayers: { type: "integer", example: 54321 },
                        price: { type: "number", nullable: true, example: 59.99 },
                        discountPercent: { type: "integer", example: 0 },
                        currency: { type: "string", example: "EUR" },
                        recordedAt: { type: "string", format: "date-time" }
                    }
                },
                SyncResult: {
                    type: "object",
                    properties: {
                        total: { type: "integer", example: 20 },
                        correctos: { type: "integer", example: 19 },
                        errores: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    steamAppId: { type: "integer", example: 1245620 },
                                    name: { type: "string", example: "ELDEN RING" },
                                    error: { type: "string", example: "Steam respondió 500 al pedir el precio" }
                                }
                            }
                        }
                    }
                },
                Error: {
                    type: "object",
                    properties: { error: { type: "string", example: "Videojuego no encontrado" } }
                }
            },
            responses: {
                NoAutenticado: {
                    description: "Falta el token o no es válido",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
                },
                SinPermisos: {
                    description: "El usuario no tiene el rol necesario",
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
                }
            }
        }
    },
    // Rutas absolutas para que funcione sin importar desde qué carpeta se arranque
    // glob solo entiende "/", así que se cambian las "\" que usa Windows
    apis: [
        path.join(__dirname, "../server.js"),
        path.join(__dirname, "../routes/*.js")
    ].map((ruta) => ruta.replace(/\\/g, "/"))
};

module.exports = swaggerJsdoc(options);