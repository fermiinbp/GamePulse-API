// Prueba rápida del servicio de Steam, sin base de datos.
// Uso:
//   node scripts/probar-steam.js            -> prueba unos juegos de ejemplo
//   node scripts/probar-steam.js 730 570    -> prueba los steamAppId que pases
const steam = require("../src/services/steam.service");

const ejemplos = [1245620, 730, 570]; // ELDEN RING, Counter-Strike 2 (gratis), Dota 2 (gratis)
const ids = process.argv.slice(2).map(Number);

async function probar(steamAppId) {
    try {
        const jugadores = await steam.obtenerJugadores(steamAppId);
        const precio = await steam.obtenerPrecio(steamAppId);
        console.log(`✔ ${steamAppId}`, { jugadores, ...precio });
    } catch (err) {
        console.log(`✘ ${steamAppId}`, err.message);
    }
}

(async () => {
    for (const id of ids.length ? ids : ejemplos) {
        await probar(id);
    }
})();
