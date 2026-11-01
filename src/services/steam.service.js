
const TIEMPO_MAXIMO = 8000;

async function pedirJSON(url) {
    const respuesta = await fetch(url, { signal: AbortSignal.timeout(TIEMPO_MAXIMO) });
    if (!respuesta.ok) {
        throw new Error(`${new URL(url).hostname} respondió ${respuesta.status}`);
    }
    return respuesta.json();
}

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

async function precioSteam(steamAppId) {
    const datos = await pedirJSON(
        `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=es&filters=price_overview`
    );
    const info = datos?.[steamAppId];
    if (!info?.success) {
        throw new Error("Steam no devolvió el precio");
    }
    const precio = info.data?.price_overview;

    if (!precio) {
        return { price: 0, discountPercent: 0, currency: "EUR" };
    }

    return {
        price: precio.final / 100,
        discountPercent: precio.discount_percent,
        currency: precio.currency
    };
}


async function datosSteamSpy(steamAppId) {
    const datos = await pedirJSON(`https://steamspy.com/api.php?request=appdetails&appid=${steamAppId}`);
    if (!datos?.appid) {
        throw new Error("SteamSpy no conoce este juego");
    }
    return datos;
}

async function obtenerDatos(steamAppId) {
    let currentPlayers;
    let precio;
    let source = "steam";
    let spy; 

    try {
        currentPlayers = await jugadoresSteam(steamAppId);
    } catch {
        spy ??= await datosSteamSpy(steamAppId);
        currentPlayers = Number(spy.ccu) || 0;
        source = "steamspy";
    }

    try {
        precio = await precioSteam(steamAppId);
    } catch {
        spy ??= await datosSteamSpy(steamAppId);
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
