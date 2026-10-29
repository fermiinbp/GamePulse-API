const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minLength: [6, "La contraseña debe ser de minimo 6 caracteres"],
    maxLength: [20, "La constraseña debe tener como maximo 20 caracteres"],
    select: false,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "ANALYST"],
    default: "USER",
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

class User {
  async comprobarPassword(passwordEnClaro) {
    return bcrypt.compare(passwordEnClaro, this.password);
  }
}

userSchema.loadClass(User);

userSchema.set("toJson", {
  transform(doc, ret) {
    return {
      id: doc.id,
      nombre: ret.nombre,
      email: ret.email,
      role: ret.role,
    };
  },
});

module.exports = mongoose.model("User", userSchema);
