const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, min: 4 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 6 },
});

const UserModel = model("users", UserSchema);
module.exports = UserModel;
