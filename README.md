# GamePulse API

API REST de videojuegos hecha con **Node.js, Express y MongoDB**. Tiene un catálogo propio de juegos con filtros y paginación, reseñas de usuarios con roles, y **datos en directo de Steam** (jugadores conectados y precio) que se guardan cada hora para tener historial y un ranking de los más jugados.

- **API desplegada:** https://gamepulse-api-1.onrender.com
- **Documentación interactiva (Swagger):** https://gamepulse-api-1.onrender.com/api-docs
- **Front que consume esta API:** puedes encontrar el repositorio del frontend en [Front-GamePulse-API](https://github.com/fermiinbp/Front-GamePulse-API)
- **Front publicado:** https://fermiinbp.github.io/Front-GamePulse-API/

> En el plan gratuito de Render la API se duerme tras 15 minutos sin uso. La primera petición puede tardar entre 30 y 60 segundos.

---

## Funcionalidades

- **Catálogo de videojuegos** con filtros por género, desarrolladora, nombre y precio (gratis o de pago), orden por nombre o fecha y paginación.
- **Datos en directo de Steam:** jugadores conectados ahora, precio y descuento de cada juego.
- **Historial y ranking:** cada sincronización guarda una "foto" en `GameStat`, lo que permite ver la evolución de cada juego y el top de los más jugados.
- **Sincronización automática** con Steam al arrancar y cada hora, y manual para el ADMIN.
- **Respaldo con SteamSpy** si Steam no responde.
- **Reseñas** con nota de 1 a 5 y comentario: una por usuario y juego.
- **Estadísticas de reseñas** (positivas y negativas) para analistas.
- **Listas de juegos (GameList)** públicas o privadas, con varios propietarios.
- **Autenticación con JWT** y **roles** (USER, ANALYST y ADMIN).
- **Validación** de todas las peticiones con express-validator y errores claros.
- **Documentación** de todos los endpoints con Swagger.

## Tecnologías

| Librería | Para qué |
| --- | --- |
| Express 5 | Servidor HTTP y rutas |
| Mongoose | Modelos y consultas a MongoDB Atlas |
| jsonwebtoken | Tokens de sesión (JWT) |
| bcrypt | Cifrado de contraseñas |
| express-validator | Validación de body, params y query |
| cors | Permitir que el front, en otro dominio, use la API |
| swagger-jsdoc + swagger-ui-express | Documentación en `/api-docs` |
| dotenv | Variables de entorno desde `.env` |
| nodemon (desarrollo) | Reinicio automático al guardar |

Las llamadas a Steam usan el `fetch` nativo de Node, sin librerías extra.

## Estructura

```
src/
├── server.js          Punto de entrada: middlewares, rutas y arranque
├── config/            Conexión a MongoDB y configuración de Swagger
├── models/            Game, GameReview, GameStat, User, GameList
├── routes/            URL → cadena de middlewares → controlador
├── controllers/       Leen la petición y eligen el código HTTP
├── services/          Lógica y consultas (steam.service habla con Steam)
├── middlewares/       autenticar, autorizar, validarCampos, manejarErrores, logger
└── validators/        Reglas de express-validator
scripts/
├── seed.js            Carga los datos de prueba
└── probar-steam.js    Prueba la conexión con Steam sin arrancar la API
```

Cada petición sigue el mismo camino: **ruta → middlewares → controlador → servicio → modelo → MongoDB**.

## Endpoints

### Autenticación
| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/auth/registro` | Público |
| POST | `/auth/login` | Público |
| GET | `/auth/perfil` | Con sesión |

### Juegos y datos de Steam
| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/games` | Público. Filtros: `page`, `limit`, `genero`, `desarrollador`, `buscar`, `gratis`, `orden` |
| GET | `/games/genres` | Público |
| GET | `/games/trending` | Público. Ranking por jugadores |
| GET | `/games/:id` | Público. Incluye el último dato de Steam |
| GET | `/games/:id/stats` | Público. Historial de Steam del juego |
| POST | `/games` | ADMIN |
| PATCH | `/games/:id` | ADMIN, ANALYST |
| DELETE | `/games/:id` | ADMIN |

### Reseñas
| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/reviews?game=:id` | Público |
| POST | `/reviews` | USER, ADMIN |
| PUT | `/reviews/:id` | Autor o ADMIN |
| DELETE | `/reviews/:id` | Autor o ADMIN |
| GET | `/reviews/stats` | ANALYST, ADMIN |

### Listas de juegos
| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/gamelist` | Público (listas públicas) |
| GET | `/gamelist/mine` | Con sesión |
| GET | `/gamelist/:id` | Pública, o dueño / ADMIN si es privada |
| POST | `/gamelist` | Con sesión |
| POST | `/gamelist/:id/games` | Dueño o ADMIN |
| PATCH | `/gamelist/:id` | Dueño o ADMIN |
| PATCH | `/gamelist/:id/owners` | Dueño o ADMIN |
| DELETE | `/gamelist/:id` | Dueño o ADMIN |
| DELETE | `/gamelist/:id/games/:gameId` | Dueño o ADMIN |

### Administración y estado
| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/admin/sync` | ADMIN. Sincroniza ahora con Steam |
| GET | `/health` | Público |

Ejemplo de respuesta de `GET /games?page=1&limit=2`:

```json
{
  "data": [
    {
      "id": "671b00000000000000000001",
      "steamAppId": 730,
      "name": "Counter-Strike 2",
      "genres": ["Action", "Free to Play"],
      "isFree": true,
      "ultimaStat": { "currentPlayers": 812345, "price": 0, "discountPercent": 0, "currency": "EUR", "source": "steam" }
    }
  ],
  "page": 1,
  "limit": 2,
  "total": 8,
  "totalPages": 4
}
```

## Conexión con Steam

La API consume dos APIs públicas de Steam, sin clave:

- **Jugadores conectados:** `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=<steamAppId>`
- **Precio en la tienda española:** `https://store.steampowered.com/api/appdetails?appids=<steamAppId>&cc=es&filters=price_overview`

Si Steam falla, se usa **SteamSpy** como respaldo (`https://steamspy.com/api.php?request=appdetails&appid=<steamAppId>`) y la foto se guarda con `source: "steamspy"`.

El catálogo es nuestro y no depende de Steam: si Steam se cae, la API sigue funcionando y muestra la última foto guardada. Las imágenes de los juegos se cargan desde el servidor de imágenes de Steam.

Para comprobar la conexión sin arrancar la API:

```bash
node scripts/probar-steam.js 730 570
```

## Añadir un juego al catálogo

Para añadir un juego hace falta su **`steamAppId`**, el número con el que Steam lo identifica. Se puede consultar en:

- **La tienda de Steam:** es el número que aparece en la URL de la página del juego, por ejemplo `https://store.steampowered.com/app/1245620/ELDEN_RING/` → `1245620`.
- **[SteamDB](https://steamdb.info):** web no oficial que recopila los datos de Steam; al buscar un juego muestra su *AppID*.

Después, con un token de ADMIN:

```http
POST /games
Content-Type: application/json
Authorization: Bearer <token>

{
  "steamAppId": 105600,
  "name": "Terraria",
  "genres": ["Action", "Adventure", "Indie"],
  "headerImage": "https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg"
}
```

Al crearlo, la API pide a Steam sus jugadores y su precio en ese momento, y a partir de ahí se actualizan en cada sincronización. La imagen sigue siempre el patrón `https://cdn.akamai.steamstatic.com/steam/apps/<steamAppId>/header.jpg`.

## Roles

| Acción | USER | ANALYST | ADMIN |
| --- | --- | --- | --- |
| Ver catálogo, datos de Steam y reseñas | ✔ | ✔ | ✔ |
| Escribir reseñas | ✔ | | ✔ |
| Ver estadísticas de reseñas | | ✔ | ✔ |
| Editar juegos | | ✔ | ✔ |
| Crear y borrar juegos | | | ✔ |
| Sincronizar con Steam | | | ✔ |

## Instalación en local

```bash
git clone https://github.com/fermiinbp/GamePulse-API.git
cd GamePulse-API
npm install
```

Crea un archivo `.env` en la raíz:

```env
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net
DB_NAME=gamepulse
JWT_SECRET=una_clave_larga_y_secreta
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://127.0.0.1:5500,http://localhost:5500
SYNC_MINUTOS=60
```

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `MONGODB_URI` | Sí | Conexión a MongoDB Atlas |
| `DB_NAME` | Sí | Nombre de la base de datos |
| `JWT_SECRET` | Sí | Secreto para firmar los tokens |
| `JWT_EXPIRES_IN` | Sí | Caducidad del token (por ejemplo `1h`) |
| `CORS_ORIGIN` | No | Orígenes permitidos separados por comas. Sin definir, se permite cualquiera |
| `SYNC_MINUTOS` | No | Minutos entre sincronizaciones con Steam (60 por defecto, `0` la desactiva) |
| `PORT` | No | Puerto (3000 por defecto) |

Carga los datos de prueba y arranca:

```bash
npm run seed
npm run dev
```

> `npm run seed` **borra** las colecciones de juegos, usuarios y listas antes de cargar los datos de prueba.

La API queda en `http://localhost:3000` y la documentación en `http://localhost:3000/api-docs`.

## Usuarios de prueba

Todos con la contraseña `TestPass123!`:

| Usuario | Email | Rol |
| --- | --- | --- |
| carlos_dev | carlos.dev@example.com | ADMIN |
| lucia_gamer | lucia.gamer@example.com | ANALYST |
| miguel_23 | miguel23@example.com | USER |
| sara_codes | sara.codes@example.com | USER |

## Despliegue

La API está desplegada en **Render** como Web Service (`npm install` y `npm start`), con las variables de entorno configuradas en el panel de Render. En MongoDB Atlas hay que permitir el acceso desde cualquier IP (`0.0.0.0/0`), porque Render no tiene IP fija.
