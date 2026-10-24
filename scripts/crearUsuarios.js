require("dotenv").config();
const mongoose = require("mongoose");
const Usuario = require("../src/models/Usuario");

const usuarios = [
    { nombre: "admin", email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, rol: "admin" },
    { nombre: "analista", email: process.env.ANALISTA_EMAIL, password: process.env.ANALISTA_PASSWORD, rol: "analista" }
];

async function crearUsuarios() {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const datos of usuarios) {
        if (!datos.email || !datos.password) {
            console.log(`${datos.rol}: faltan las variables en el .env`);
            continue;
        }

        const existe = await Usuario.findOne({ email: datos.email });
        if (existe) {
            console.log(`${datos.rol}: ya existe`);
        } else {
            await Usuario.create(datos);
            console.log(`${datos.rol}: creado`);
        }
    }

    await mongoose.disconnect();
}

crearUsuarios().catch((err) => {
    console.error(err);
    process.exit(1);
});