// Datos en vivo de Steam. Si Steam falla, se usa SteamSpy como respaldo.
// Ninguna de las dos APIs necesita clave.
const TIEMPO_MAXIMO = 8000;

async function pedirJSON(url) {
    const respuesta = await fetch(url, { signal: AbortSignal.timeout(TIEMPO_MAXIMO) });
    if (!respuesta.ok) {
        throw new Error(`${new URL(url).hostname} respondió ${respuesta.status}`);
    }
    return respuesta.json();
}

// ---------- Steam (fuente principal) ----------

// Jugadores conectados en este momento
async function jugadoresSteam(steamAppId) {
    const datos = await pedirJSON(
        `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${steamAppId}`
    );
    const jugadores = datos.response?.player_count;
    if (typeof jugadores !== "number") {
        throw new Error("Steam no devolvió jugadores");
    }
    return jugadores;
}

// Precio en la tienda española (Steam lo da en céntimos)
async function precioSteam(steamAppId) {
    const datos = await pedirJSON(
        `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=es&filters=price_overview`
    );
    const info = datos?.[steamAppId];
    if (!info?.success) {
        throw new Error("Steam no devolvió el precio");
    }
    const precio = info.data?.price_overview;

    // Juego gratuito o sin precio a la venta
    if (!precio) {
        return { price: 0, discountPercent: 0, currency: "EUR" };
    }

    return {
        price: precio.final / 100,
        discountPercent: precio.discount_percent,
        currency: precio.currency
    };
}

// ---------- SteamSpy (respaldo) ----------

async function datosSteamSpy(steamAppId) {
    const datos = await pedirJSON(`https://steamspy.com/api.php?request=appdetails&appid=${steamAppId}`);
    if (!datos?.appid) {
        throw new Error("SteamSpy no conoce este juego");
    }
    return datos;
}

// ---------- Lo que usa el resto de la API ----------

// Devuelve { currentPlayers, price, discountPercent, currency, source }
async function obtenerDatos(steamAppId) {
    let currentPlayers;
    let precio;
    let source = "steam";
    let spy; // se pide a SteamSpy como mucho una vez

    try {
        currentPlayers = await jugadoresSteam(steamAppId);
    } catch {
        spy ??= await datosSteamSpy(steamAppId);
        // ccu = pico de jugadores de ayer (SteamSpy no da el dato en directo)
        currentPlayers = Number(spy.ccu) || 0;
        source = "steamspy";
    }

    try {
        precio = await precioSteam(steamAppId);
    } catch {
        spy ??= await datosSteamSpy(steamAppId);
        // SteamSpy da el precio de la tienda de EE. UU., en céntimos de dólar
        precio = {
            price: Number(spy.price || 0) / 100,
            discountPercent: Number(spy.discount || 0),
            currency: "USD"
        };
        source = "steamspy";
    }

    return { currentPlayers, ...precio, source };
}

module.exports = { obtenerDatos };
