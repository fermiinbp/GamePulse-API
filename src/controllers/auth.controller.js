const authService = require("../services/auth.service");

// POST /api/auth/register
async function registrar(req, res) {
    const { username, email, password } = req.body;

    if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Username, email y contraseña son obligatorios" });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const usuario = await authService.registrar({ username, email, password });
    res.status(201).json(usuario.resumen());
}

// POST /api/auth/login
async function login(req, res) {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    const resultado = await authService.login(email, password);
    if (!resultado) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res.json({ token: resultado.token, usuario: resultado.usuario.resumen() });
}

module.exports = { registrar, login };