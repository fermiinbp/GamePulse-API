const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        unique: true,
        trim: true,
        minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres"],
        maxlength: [30, "El nombre de usuario no puede pasar de 30 caracteres"]
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "El email no es válido"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        select: false
    },
    role: {
        type: String,
        enum: { values: ["USER", "ANALYST", "ADMIN"], message: "Rol no válido" },
        default: "USER"
    }
}, { timestamps: true });

class User {

    resumen() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role
        };
    }
}

userSchema.loadClass(User);

module.exports = mongoose.model("User", userSchema);