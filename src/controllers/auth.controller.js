const authServices = require("../services/auth.service");

async function registro(req, res) {
    const resultado = await authServices.registrar(req.body);
    res.status(201).json(resultado);
}

async function login(req, res) {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Email y password son obligatorios" });
    }
    const resultado = await authServices.login(email, password);
    if (!resultado) {
        return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }
    res.json(resultado);
}

async function perfil(req, res) {
    const usuario = await authServices.buscarPorId(req.usuario.id);
    if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
}

module.exports = { registro, login, perfil };