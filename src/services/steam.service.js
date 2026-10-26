const TIEMPO_MAXIMO = 8000;

async function obtenerJugadores(steamAppId) {
    const url = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${steamAppId}`;
    const respuesta = await fetch(url, { signal: AbortSignal.timeout(TIEMPO_MAXIMO) });

    if (!respuesta.ok) {
        throw new Error(`Steam respondió ${respuesta.status} al pedir los jugadores`);
    }

    const datos = await respuesta.json();
    return datos.response?.player_count ?? null;
}

async function obtenerPrecio(steamAppId) {
    const url = `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=es&filters=price_overview`;
    const respuesta = await fetch(url, { signal: AbortSignal.timeout(TIEMPO_MAXIMO) });

    if (!respuesta.ok) {
        throw new Error(`Steam respondió ${respuesta.status} al pedir el precio`);
    }

    const datos = await respuesta.json();
    const info = datos[steamAppId];
    const precio = info?.success ? info.data?.price_overview : undefined;

    // Juegos gratuitos o sin precio disponible
    if (!precio) {
        return { price: null, discountPercent: 0, currency: "EUR" };
    }

    return {
        price: precio.final / 100,
        discountPercent: precio.discount_percent,
        currency: precio.currency
    };
}

module.exports = { obtenerJugadores, obtenerPrecio };