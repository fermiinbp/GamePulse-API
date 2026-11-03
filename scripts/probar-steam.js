const steam = require("../src/services/steam.service");

const ejemplos = [1245620, 730, 570];
const ids = process.argv.slice(2).map(Number);

(async () => {
    for (const id of ids.length ? ids : ejemplos) {
        try {
            console.log(`✔ ${id}`, await steam.obtenerDatos(id));
        } catch (err) {
            console.log(`✘ ${id}`, err.message);
        }
    }
})();
