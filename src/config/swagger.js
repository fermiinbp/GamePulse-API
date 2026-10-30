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

// Respuesta de error con un único ejemplo
function respuestaError(descripcion, mensaje) {
    return {
        description: descripcion,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: mensaje }
            }
        }
    };
}

// Respuesta de error de validación (400) con la lista de campos que fallan
function respuestaValidacion(descripcion, campo, mensaje) {
    return {
        description: descripcion,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/ValidationError" },
                example: { error: "Los datos no son validos", detalles: [{ campo, mensaje }] }
            }
        }
    };
}

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GamePulse API",
            version: "1.0.0",
            description: [
                "API REST de videojuegos con datos de Steam.",
                "",
                "**Autenticación:** haz login en `POST /api/auth/login`, copia el `token` y pégalo en el botón **Authorize**.",
                "",
                "**Roles:** `USER` (reseñas), `ANALYST` (estadísticas y editar juegos) y `ADMIN` (todo).",
                "",
                "**Errores:** todos devuelven `{ \"error\": \"mensaje\" }`. Los de validación (400) añaden `detalles` con el campo que falla y el motivo."
            ].join("\n")
        },
        tags: [
            { name: "Health", description: "Estado de la API" },
            { name: "Auth", description: "Registro, login y perfil" },
            { name: "Games", description: "Catálogo de videojuegos y sus estadísticas" },
            { name: "Reviews", description: "Reseñas de los usuarios" },
            { name: "Admin", description: "Tareas de administración" }
        ],
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
                    description: "Formato de todos los errores de la API",
                    properties: { error: { type: "string", description: "Mensaje del error" } }
                },
                ValidationError: {
                    type: "object",
                    description: "Error de validación: indica qué campo falla y por qué",
                    properties: {
                        error: { type: "string", example: "Los datos no son validos" },
                        detalles: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    campo: { type: "string", example: "rating" },
                                    mensaje: { type: "string", example: "La nota debe ser un número entero del 1 al 5" }
                                }
                            }
                        }
                    }
                }
            },
            // Respuestas de error reutilizables, cada una con su mensaje real
            responses: {
                IdNoValido: respuestaValidacion("El id de la URL no es un id de MongoDB válido", "id", "El id no es válido"),
                NoAutenticado: {
                    description: "Falta el token o no es válido",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            examples: {
                                faltaToken: { summary: "No se ha enviado token", value: { error: "falta Token" } },
                                tokenNoValido: { summary: "Token caducado o manipulado", value: { error: "Token no valido" } }
                            }
                        }
                    }
                },
                SinPermisos: respuestaError("Tu rol no tiene acceso a esta ruta", "No tienes permisos"),
                CredencialesIncorrectas: respuestaError("El email o la contraseña no coinciden", "Email o contraseñas incorrectas"),
                JuegoNoEncontrado: respuestaError("No existe ningún videojuego con ese id", "Videojuego no encontrado"),
                ReviewNoEncontrada: respuestaError("No existe ninguna reseña con ese id", "Reseña no encontrada"),
                UsuarioNoEncontrado: respuestaError("El usuario del token ya no existe", "Usuario no encontrado"),
                ValorRepetido: respuestaError("Ya existe un registro con ese valor único", "Valor repetido"),
                ErrorServidor: respuestaError("Error inesperado en el servidor", "Error de servidor interno")
            },
            parameters: {
                GameId: {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" },
                    description: "Id del videojuego en MongoDB",
                    example: "665f1c2e9b1e8a0012a3b4c5"
                },
                ReviewId: {
                    in: "path",
                    name: "id",
                    required: true,
                    schema: { type: "string" },
                    description: "Id de la reseña en MongoDB",
                    example: "665f1c2e9b1e8a0012a3b4c7"
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