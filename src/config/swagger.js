const swaggerJsdoc = require("swagger-jsdoc");

// Campos de un videojuego, reutilizados en varios esquemas
const propiedadesJuego = {
  steamAppId: { type: "integer", example: 1245620 },
  name: { type: "string", example: "ELDEN RING" },
  shortDescription: {
    type: "string",
    example: "RPG de acción en un mundo abierto de fantasía.",
  },
  genres: {
    type: "array",
    items: { type: "string" },
    example: ["RPG", "Action"],
  },
  developers: {
    type: "array",
    items: { type: "string" },
    example: ["FromSoftware"],
  },
  publishers: {
    type: "array",
    items: { type: "string" },
    example: ["Bandai Namco Entertainment"],
  },
  releaseDate: {
    type: "string",
    format: "date-time",
    example: "2022-02-25T00:00:00.000Z",
  },
  headerImage: {
    type: "string",
    example: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
  },
  isFree: { type: "boolean", example: false },
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GamePulse API",
      version: "1.0.0",
      description: "API REST de videojuegos con datos de Steam",
    },
    servers: [{ url: "/", description: "Servidor actual" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        Game: {
          type: "object",
          properties: {
            id: { type: "string", example: "665f1c2e9b1e8a0012a3b4c5" },
            ...propiedadesJuego,
          },
        },
        GameInput: {
          type: "object",
          required: ["steamAppId", "name"],
          properties: propiedadesJuego,
        },
        GameUpdate: {
          type: "object",
          properties: propiedadesJuego,
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "671a0000000000000000000a" },
            username: { type: "string", example: "Hermes" },
            email: {
              type: "string",
              format: "email",
              example: "usuario@email.com",
            },
            role: {
              type: "string",
              enum: ["USER", "ADMIN", "ANALYST"],
              example: "USER",
            },
          },
        },

        UserRegister: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "Hermes" },
            email: {
              type: "string",
              format: "email",
              example: "usuario@email.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "MiPassword123",
            },
          },
        },

        UserLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "usuario@email.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "MiPassword123",
            },
          },
        },

        AuthResponse: {
          type: "object",
          properties: {
            mensaje: { type: "string", example: "Inicio de sesión correcto" },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            usuario: { $ref: "#/components/schemas/User" },
          },
        },
        GameList: {
          type: "object",
          properties: {
            _id: { type: "string", example: "671a00000000000000000010" },
            name: { type: "string", example: "Mis juegos favoritos" },
            games: {
              type: "array",
              items: { type: "string" },
              example: ["671b00000000000000000001", "671b00000000000000000002"],
            },
            owners: {
              type: "array",
              items: { type: "string" },
              example: ["671a0000000000000000000a"],
            },
            isPublic: { type: "boolean", example: true },
          },
        },

        GameListInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Mis juegos favoritos" },
            games: {
              type: "array",
              items: { type: "string" },
              example: ["671b00000000000000000001"],
            },
            isPublic: { type: "boolean", example: true },
          },
        },

        GameListUpdate: {
          type: "object",
          properties: {
            name: { type: "string", example: "Juegos pendientes" },
            games: {
              type: "array",
              items: { type: "string" },
              example: ["671b00000000000000000001"],
            },
            isPublic: { type: "boolean", example: false },
          },
        },

        GameListAddGame: {
          type: "object",
          required: ["gameId"],
          properties: {
            gameId: {
              type: "string",
              example: "671b00000000000000000001",
            },
          },
        },

        GameListUpdateOwners: {
          type: "object",
          required: ["owners"],
          properties: {
            owners: {
              type: "array",
              items: { type: "string" },
              example: ["671a0000000000000000000a", "671a0000000000000000000b"],
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Videojuego no encontrado" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
