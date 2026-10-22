const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function registrar({ username, email, password }) {
    const hash = await bcrypt.hash(password, 10);
    return User.create({ username, email, password: hash });
}

async function login(email, password) {
    const usuario = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!usuario) return null;

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) return null;

    const token = jwt.sign(
        { id: usuario.id, role: usuario.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { token, usuario };
}

module.exports = { registrar, login };